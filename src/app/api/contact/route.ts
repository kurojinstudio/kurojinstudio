import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzhN_rmuoIDuYkED9ESmGYNt-3T_S71g30lxhmSnIORGrAoStdu5-4y74-IuuIzjlU/exec";

type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  submittedAt: string;
};

async function postToSheets(url: string, payload: ContactSubmission) {
  const body = JSON.stringify(payload);
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual" as RequestRedirect,
  };

  const firstResponse = await fetch(url, request);
  const redirectUrl = firstResponse.headers.get("location");
  const response =
    firstResponse.status >= 300 && firstResponse.status < 400 && redirectUrl
      ? await fetch(redirectUrl, { ...request, redirect: "follow" })
      : firstResponse;

  return response;
}

/**
 * Contact form API route.
 *
 * If GOOGLE_SHEETS_WEBHOOK_URL is configured, submissions are forwarded to
 * the Google Apps Script web app connected to the contact spreadsheet.
 * Without it, the route logs the submission or forwards it to Web3Forms.
 * To wire a real inbox, set CONTACT_WEB3FORMS_KEY in .env.local and
 * submissions are forwarded to Web3Forms (free, no backend needed):
 *   https://web3forms.com  -> create access key -> paste in .env.local
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").slice(0, 200);
    const email = String(body.email ?? "").slice(0, 200);
    const phone = String(body.phone ?? "").slice(0, 50);
    const projectType = String(body.projectType ?? "").slice(0, 100);
    const budget = String(body.budget ?? "").slice(0, 100);
    const message = String(body.message ?? "").slice(0, 5000);

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const sheetsWebhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_SHEETS_WEBHOOK_URL;

    if (sheetsWebhookUrl) {
      try {
        await postToSheets(sheetsWebhookUrl, {
          name,
          email,
          phone,
          projectType,
          budget,
          message,
          submittedAt: new Date().toISOString(),
        });
        return NextResponse.json({ ok: true });
      } catch (error) {
        console.error("[contact-form:sheets]", error);
        return NextResponse.json(
          { ok: false, error: "Google Sheets is temporarily unavailable." },
          { status: 502 }
        );
      }
    }

    const accessKey = process.env.CONTACT_WEB3FORMS_KEY;

    if (accessKey) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New inquiry from ${name} — Kurojin site`,
          from_name: "Kurojin Website",
          name,
          email,
          phone,
          projectType,
          budget,
          message,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        return NextResponse.json(
          { ok: false, error: "Email service rejected the submission." },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Fallback: no key configured — log server-side so nothing is lost.
    console.log("[contact-form]", { name, email, phone, projectType, budget, message });
    return NextResponse.json({ ok: true, queued: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

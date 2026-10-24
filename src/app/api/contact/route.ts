import { NextRequest, NextResponse } from "next/server";

/**
 * Contact form API route.
 *
 * Default: logs the submission and returns success (works offline).
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
    const message = String(body.message ?? "").slice(0, 5000);

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required." },
        { status: 400 }
      );
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
    console.log("[contact-form]", { name, email, phone, message });
    return NextResponse.json({ ok: true, queued: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

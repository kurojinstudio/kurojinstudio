import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Kurojin Studios",
  description:
    "Start a project with Kurojin Studios. Tell us where you're headed — we'll bring the craft.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

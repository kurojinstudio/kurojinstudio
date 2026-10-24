import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Kurojin Studios",
  description:
    "Kurojin Studios is a full-spectrum creative partner — the manifesto, the method, and the people behind the work.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

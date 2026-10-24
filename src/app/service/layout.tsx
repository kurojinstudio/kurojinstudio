import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Kurojin Studios",
  description:
    "The Kurojin capability dossier: brand identity, web design, product design, development, automation and launch support.",
};

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

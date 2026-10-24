import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Kurojin Studios",
  description:
    "Selected projects by Kurojin Studios — brand systems, web experiences, 2D/3D content and motion design.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

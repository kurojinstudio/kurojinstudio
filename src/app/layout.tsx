import type { Metadata } from "next";
import { EB_Garamond, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import CustomCursor from "@/components/CustomCursor";
import RouteTransition from "@/components/RouteTransition";
import ScrollProgress from "@/components/ScrollProgress";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kurojin Studios — Full-Spectrum Creative Partner",
  description:
    "Brand identity, web experiences, 2D/3D content, motion graphics, and social media. Ordinary isn't in our vocabulary.",
  icons: {
    icon: "/images/kuro-icon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${ebGaramond.variable} ${plexMono.variable} antialiased overflow-x-hidden bg-bg text-white`}
      >
        <RouteTransition>
          {children}
          <ScrollProgress />
        </RouteTransition>
        <CustomCursor />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CRTOverlay } from "@/components/ui/CRTOverlay";

export const metadata: Metadata = {
  title: "WDS MSIT — Web Development Society",
  description:
    "Web Development Society at MSIT — a student-driven technology organization building, maintaining, and shipping real digital experiences.",
  keywords: [
    "WDS MSIT",
    "Web Development Society",
    "MSIT",
    "Maharaja Surajmal Institute of Technology",
    "Coding Club",
    "Bug Hunt",
    "MSIT Website",
    "Student Developers",
    "Engineering Community",
  ],
  authors: [{ name: "Web Development Society MSIT" }],
  openGraph: {
    title: "WDS MSIT — Web Development Society",
    description:
      "Web Development Society at MSIT — a student-driven technology organization building, maintaining, and shipping real digital experiences.",
    url: "https://wds-msit.org",
    siteName: "WDS MSIT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WDS MSIT — Web Development Society",
    description:
      "Web Development Society at MSIT — a student-driven technology community building, maintaining, and shipping real digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-wds-bg text-wds-white min-h-screen flex flex-col antialiased selection:bg-wds-yellow selection:text-wds-bg">
        {/* Subtle Scanline Overlay */}
        <CRTOverlay />

        {/* Global Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">{children}</main>

        {/* Global Retro Footer */}
        <Footer />
      </body>
    </html>
  );
}

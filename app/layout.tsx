import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CRTOverlay } from "@/components/ui/CRTOverlay";

export const metadata: Metadata = {
  metadataBase: new URL("https://wds-msit.org"),
  title: "WDS MSIT — Web Development Society",
  description:
    "Web Development Society at MSIT — a student-driven technology organization building, maintaining, and shipping real digital experiences.",
  icons: {
    icon: "/images/wds-logo.png",
    shortcut: "/images/wds-logo.png",
    apple: "/images/wds-logo.png",
  },
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
    images: [
      {
        url: "/images/wds-logo.png",
        width: 800,
        height: 800,
        alt: "WDS MSIT Official Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WDS MSIT — Web Development Society",
    description:
      "Web Development Society at MSIT — a student-driven technology community building, maintaining, and shipping real digital experiences.",
    images: ["/images/wds-logo.png"],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://wds-msit.org/#organization",
        name: "Web Development Society — MSIT",
        alternateName: "WDS MSIT",
        url: "https://wds-msit.org",
        logo: "https://wds-msit.org/images/wds-logo.png",
        sameAs: [
          "https://github.com/JayantOlhyan/WDS-website",
          "https://instagram.com/wds_msit",
          "https://linkedin.com/company/wds-msit",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Janakpuri",
          addressRegion: "New Delhi",
          postalCode: "110058",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://wds-msit.org/#website",
        url: "https://wds-msit.org",
        name: "WDS MSIT — Web Development Society",
        publisher: {
          "@id": "https://wds-msit.org/#organization",
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

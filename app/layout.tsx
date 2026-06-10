import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Campus Advisor — Academic navigation for students",
  description: "From career goal to course sequence — across 34 colleges and universities — through natural conversation with Claude or ChatGPT.",
  icons: {
    icon: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  openGraph: {
    title: "Open Campus Advisor",
    description: "From career goal to course sequence — across 34 colleges and universities — through natural conversation with Claude or ChatGPT.",
    url: "https://opencampusadvisor.org",
    siteName: "Open Campus Advisor",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}

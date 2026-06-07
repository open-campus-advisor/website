import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Campus Advisor — AI advisor for any university",
  description: "Open source AI advisor for any university. Get live course info, faculty research, and academic guidance through Claude or ChatGPT.",
  openGraph: {
    title: "Open Campus Advisor",
    description: "Open source AI advisor for any university — academics, research, and career through natural conversation.",
    url: "https://opencampusadvisor.org",
    siteName: "Open Campus Advisor",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}

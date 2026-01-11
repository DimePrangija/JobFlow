import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobFlow - Job Tracker & Outreach CRM",
  description: "Track your job applications and manage your professional connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">{children}</body>
    </html>
  );
}


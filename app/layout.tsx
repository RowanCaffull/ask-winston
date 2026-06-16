import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Winston",
  description: "Get advice from history's greatest minds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-stone-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

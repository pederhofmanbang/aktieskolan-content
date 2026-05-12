import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aktieskolan",
  description: "Lär dig grunderna i svenska aktier och fonder.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}

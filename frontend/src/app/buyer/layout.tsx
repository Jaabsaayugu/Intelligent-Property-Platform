import type { Metadata } from "next";
import "./globals.css";  // Make sure this exists and is imported

export const metadata: Metadata = {
  title: "AfREALTY DATAHOMES",
  description: "Unlocking Africa’s Property Future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

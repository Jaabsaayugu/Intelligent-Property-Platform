import type { Metadata } from "next";
import "./globals.css";  // Make sure this exists and is imported

export const metadata: Metadata = {
  title: "Intelligent Property Platform",
  description: "Buy, sell and manage properties intelligently",
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
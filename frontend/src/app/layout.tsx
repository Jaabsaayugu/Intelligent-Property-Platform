import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intelligent Property Platform",
  description: "Find, list and manage properties intelligently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-display": "Georgia, Cambria, 'Times New Roman', Times, serif",
          "--font-sans":
            "'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        } as React.CSSProperties
      }
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

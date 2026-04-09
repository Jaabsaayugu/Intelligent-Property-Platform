import type { Metadata } from "next";
import "./globals.css";
import GlobalBrandBadge from "@/components/branding/GlobalBrandBadge";
import SessionBootstrap from "@/components/auth/SessionBootstrap";

export const metadata: Metadata = {
  title: "AfREALTY DATAHOMES",
  description: "Unlocking Africa's Property Future",
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
        <SessionBootstrap />
        <GlobalBrandBadge />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AfREALTY DATAHOMES",
  description: "Unlocking Africa's Property Future",
};

export default function BuyerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

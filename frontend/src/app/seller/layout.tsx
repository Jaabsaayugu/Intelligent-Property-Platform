import { BackButton } from "@/components/ui/back-button"
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Seller - AfREALTY DATAHOMES",
  description: "Manage your property listings",
};

export default function SellerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <BackButton />
      {children}
    </>
  );
}



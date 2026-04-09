import { NextResponse } from "next/server";
import { propertyFacts } from "@/lib/property-facts";

export async function GET() {
  const randomFact =
    propertyFacts[Math.floor(Math.random() * propertyFacts.length)] ?? propertyFacts[0];

  return NextResponse.json({
    fact: randomFact,
    total: propertyFacts.length,
  });
}

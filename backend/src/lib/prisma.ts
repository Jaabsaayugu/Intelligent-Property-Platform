import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

export async function ensureUserNameColumns() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "firstName" TEXT;
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "secondName" TEXT;
  `);
}

export async function ensureContactInquiryTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ContactInquiry" (
      "id" TEXT PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "secondName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function ensurePropertyInteractionTables() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Message"
    ADD COLUMN IF NOT EXISTS "propertyId" TEXT;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Review" (
      "id" TEXT PRIMARY KEY,
      "rating" INTEGER NOT NULL,
      "comment" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "propertyId" TEXT NOT NULL,
      "userId" TEXT NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "TourRequest" (
      "id" TEXT PRIMARY KEY,
      "preferredDate" TIMESTAMP(3) NOT NULL,
      "notes" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "propertyId" TEXT NOT NULL,
      "buyerId" TEXT NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PurchaseRequest" (
      "id" TEXT PRIMARY KEY,
      "offerAmount" DOUBLE PRECISION,
      "message" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "propertyId" TEXT NOT NULL,
      "buyerId" TEXT NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Review_propertyId_userId_key"
    ON "Review" ("propertyId", "userId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Review_propertyId_idx"
    ON "Review" ("propertyId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "TourRequest_propertyId_idx"
    ON "TourRequest" ("propertyId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "PurchaseRequest_propertyId_idx"
    ON "PurchaseRequest" ("propertyId");
  `);
}

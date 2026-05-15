import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getPgConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");

  if (sslMode === "require" && !url.searchParams.has("uselibpqcompat")) {
    url.searchParams.set("uselibpqcompat", "true");
  }

  return url.toString();
}

const adapter = new PrismaPg({
  connectionString: getPgConnectionString(),
});

export const prisma = new PrismaClient({
  adapter,
} as any);

let vectorExtensionAvailable: boolean | null = null;

export async function hasVectorExtensionSupport() {
  if (vectorExtensionAvailable !== null) {
    return vectorExtensionAvailable;
  }

  try {
    const result = await prisma.$queryRaw<Array<{ available: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM pg_available_extensions
        WHERE name = 'vector'
      ) AS available
    `;

    vectorExtensionAvailable = Boolean(result[0]?.available);

    if (vectorExtensionAvailable) {
      await prisma.$executeRawUnsafe(`
        CREATE EXTENSION IF NOT EXISTS vector;
      `);
    }
  } catch (error) {
    console.warn("Failed to determine pgvector availability:", error);
    vectorExtensionAvailable = false;
  }

  return vectorExtensionAvailable;
}

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
    CREATE TABLE IF NOT EXISTS "PropertyView" (
      "id" TEXT PRIMARY KEY,
      "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
      "sessionId" TEXT,
      "ipAddress" TEXT,
      "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "PropertyView_propertyId_viewedAt_idx" ON "PropertyView" ("propertyId", "viewedAt");
  `);

  if (await hasVectorExtensionSupport()) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "PurchaseRequest"
      ADD COLUMN IF NOT EXISTS "embedding" vector(384);
    `);
  } else {
    console.warn('pgvector is not installed; skipping "PurchaseRequest.embedding" setup.');
  }

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

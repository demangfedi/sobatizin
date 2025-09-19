-- CreateTables
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'client',
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "OrderHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedByRole" TEXT NOT NULL,
    CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ContactLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileUpload_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndexes
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
CREATE INDEX "Order_clientId_idx" ON "Order" ("clientId");
CREATE INDEX "Order_status_orderDate_idx" ON "Order" ("status", "orderDate" DESC);
CREATE INDEX "Order_serviceType_idx" ON "Order" ("serviceType");
CREATE INDEX "OrderHistory_orderId_updatedAt_idx" ON "OrderHistory" ("orderId", "updatedAt" DESC);
CREATE INDEX "ContactLead_status_createdAt_idx" ON "ContactLead" ("status", "createdAt" DESC);
CREATE INDEX "FileUpload_orderId_type_idx" ON "FileUpload" ("orderId", "type");

-- Triggers
CREATE TRIGGER update_user_updatedAt
AFTER UPDATE ON "User"
FOR EACH ROW
BEGIN
  UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
END;

CREATE TRIGGER update_order_updatedAt
AFTER UPDATE ON "Order"
FOR EACH ROW
BEGIN
  UPDATE "Order" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
END;

CREATE TRIGGER update_contactLead_updatedAt
AFTER UPDATE ON "ContactLead"
FOR EACH ROW
BEGIN
  UPDATE "ContactLead" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
END;

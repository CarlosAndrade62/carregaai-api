-- DropIndex
DROP INDEX "User_username_key";

-- CreateTable
CREATE TABLE "loading_controls" (
    "id" INTEGER NOT NULL,
    "plate" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "additionalQuantity" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "tenantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loading_controls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loading_controls_tenantId_idx" ON "loading_controls"("tenantId");

-- CreateIndex
CREATE INDEX "loading_controls_plate_idx" ON "loading_controls"("plate");

-- AddForeignKey
ALTER TABLE "loading_controls" ADD CONSTRAINT "loading_controls_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

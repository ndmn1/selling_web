/*
  Warnings:

  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,sizeId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropIndex
DROP INDEX "CartItem_cartId_productId_sizeId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productId";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_sizeId_key" ON "CartItem"("cartId", "sizeId");

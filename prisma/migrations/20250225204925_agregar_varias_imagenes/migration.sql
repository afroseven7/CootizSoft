/*
  Warnings:

  - You are about to drop the column `userId` on the `Negocio` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Negocio" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "userId";

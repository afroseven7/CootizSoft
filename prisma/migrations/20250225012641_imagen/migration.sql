/*
  Warnings:

  - You are about to drop the column `imagenes` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "imagenes",
ADD COLUMN     "imagen" TEXT;

/*
  Warnings:

  - You are about to drop the column `imagen` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "imagen",
ADD COLUMN     "imagenes" TEXT[];

/*
  Warnings:

  - Added the required column `userId` to the `Negocio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Negocio" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "userId" TEXT NOT NULL;

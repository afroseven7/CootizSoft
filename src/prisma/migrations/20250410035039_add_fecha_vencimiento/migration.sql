/*
  Warnings:

  - Added the required column `fechaVencimiento` to the `Cotizacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL;

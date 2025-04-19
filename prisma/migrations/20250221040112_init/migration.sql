-- CreateTable
CREATE TABLE "Negocio" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "identificacion" VARCHAR(100) NOT NULL,
    "direccion" TEXT,
    "ciudad" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Negocio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Negocio_email_key" ON "Negocio"("email");

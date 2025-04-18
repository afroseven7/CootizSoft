-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "email" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_identificacion_key" ON "Cliente"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_idUsuario_idx" ON "Cliente"("idUsuario");

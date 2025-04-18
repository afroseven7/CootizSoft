"use client";

import { useEffect, useState } from "react";
import "../styles/editor.css";

export default function VistaPreviaCotizacion({ plantillaHTML, negocio, cliente, productos = [], duracion }) {
  const [contenidoParseado, setContenidoParseado] = useState("");

  useEffect(() => {
    if (!plantillaHTML || !negocio) return;

    let parsed = plantillaHTML;

    const formatoCOP = (valor) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(valor);

    // 🧮 Calcular totales
    const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.19;
    const totalCotizacion = subtotal + iva;

    // 📅 Fecha actual y vencimiento
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate().toString().padStart(2, "0")}/${(hoy.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${hoy.getFullYear()}`;

    const diasDuracion = duracion?.dias || 15;
    const fechaVencimiento = new Date(hoy);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasDuracion);
    const fechaVencimientoFormateada = `${fechaVencimiento.getDate().toString().padStart(2, "0")}/${(fechaVencimiento.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fechaVencimiento.getFullYear()}`;

    parsed = parsed
      .replace(/\*\{cotizacion\.fecha\}\*/g, fechaFormateada)
      .replace(/\*\{cotizacion\.dias\}\*/g, `${diasDuracion} días`)
      .replace(/\*\{cotizacion\.vencimiento\}\*/g, fechaVencimientoFormateada);

    // 🔁 Negocio
    parsed = parsed
      .replace(/\*\{negocio\.nombre\}\*/g, negocio.nombre)
      .replace(/\*\{negocio\.identificacion\}\*/g, negocio.identificacion)
      .replace(/\*\{negocio\.direccion\}\*/g, negocio.direccion || "")
      .replace(/\*\{negocio\.ciudad\}\*/g, negocio.ciudad)
      .replace(/\*\{negocio\.telefono\}\*/g, negocio.telefono)
      .replace(/\*\{negocio\.email\}\*/g, negocio.email)
      .replace(/\*\{negocio\.logo\}\*/g, negocio.logo ? `<img src="${negocio.logo}" width="120" />` : "")
      .replace(/\*\{negocio\.firma\}\*/g, negocio.nombre || "");

    // 🔁 Cliente
    if (cliente) {
      parsed = parsed
        .replace(/\*\{cliente\.nombre\}\*/g, cliente.nombre)
        .replace(/\*\{cliente\.identificacion\}\*/g, cliente.identificacion)
        .replace(/\*\{cliente\.direccion\}\*/g, cliente.direccion || "")
        .replace(/\*\{cliente\.telefono\}\*/g, cliente.telefono)
        .replace(/\*\{cliente\.email\}\*/g, cliente.email)
        .replace(/\*\{cliente\.ciudad\}\*/g, cliente.ciudad || "");
    }

    // 🔁 Totales
    parsed = parsed
      .replace(/\*\{cotizacion\.subtotal\}\*/g, formatoCOP(subtotal))
      .replace(/\*\{cotizacion\.iva\}\*/g, formatoCOP(iva))
      .replace(/\*\{cotizacion\.total\}\*/g, formatoCOP(totalCotizacion));

    // 🔁 Productos
    const match = parsed.match(
      /<tr>\s*<td[^>]*>\*\{producto\.id\}\*<\/td>[\s\S]*?<td[^>]*>\*\{producto\.total\}\*<\/td>\s*<\/tr>/
    );

    if (match) {
      const filaBase = match[0];

      const filas = productos.map((producto, index) => {
        const total = producto.precio * producto.cantidad;
        return filaBase
          .replace(/\*\{producto\.id\}\*/g, String(index + 1).padStart(3, "0"))
          .replace(/\*\{producto\.nombre\}\*/g, producto.nombre)
          .replace(/\*\{producto\.descripcion\}\*/g, producto.descripcion || "")
          .replace(/\*\{producto\.cantidad\}\*/g, String(producto.cantidad))
          .replace(/\*\{producto\.precio\}\*/g, formatoCOP(producto.precio))
          .replace(/\*\{producto\.total\}\*/g, formatoCOP(total));
      }).join("");

      parsed = parsed.replace(filaBase, filas);
    }

    parsed = parsed.replace(/\*\{productos\.fila\}\*/g, "");

    setContenidoParseado(parsed);
  }, [plantillaHTML, negocio, cliente, productos, duracion]);

  return (
    <div
      className="demo-dfree rounded border p-4 bg-white shadow-md"
      style={{ minHeight: "600px" }}
      dangerouslySetInnerHTML={{ __html: contenidoParseado }}
    />
  );
}

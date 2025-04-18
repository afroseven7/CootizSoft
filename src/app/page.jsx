"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white shadow">
        <h1 className="text-5xl font-extrabold mb-4 text-majorelle_blue">Bienvenido a CootizSoft</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          La plataforma moderna y rápida para crear, gestionar y enviar cotizaciones profesionales. Optimiza tu tiempo, mejora tu imagen.
        </p>

        {!isSignedIn && (
          <div className="mt-8 flex gap-4">
            <Link
              href="/sign-up"
              className="bg-majorelle_blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-medium_slate_blue transition"
            >
              Regístrate Gratis
            </Link>
            <Link
              href="/sign-in"
              className="text-majorelle_blue font-semibold underline"
            >
              Ya tengo una cuenta
            </Link>
          </div>
        )}
      </section>

      {/* FUNCIONALIDADES */}
      <section className="py-16 bg-gray-100 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">¿Qué puedes hacer con CootizSoft?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[
  {
    title: "Gestiona tus productos",
    image: "/imagenes/productos.png",
    desc: "Agrega y organiza todos los servicios y productos de tu negocio en un solo lugar.",
  },
  {
    title: "Crea cotizaciones profesionales",
    image: "/imagenes/cotizaciones.png",
    desc: "Usa plantillas personalizadas con el logo de tu empresa para generar documentos PDF elegantes.",
  },
  {
    title: "Gestiona y actualiza el estado de tus cotizaciones",
    image: "/imagenes/estado.png",
    desc: "Lleva control sobre cuáles cotizaciones están vigentes, vencidas o ya han sido facturadas.",
  },
].map((item) => (
  <div key={item.title} className="bg-white p-6 rounded-xl shadow text-center">
<Image
  src={item.image}
  alt={item.title}
  width={300}
  height={300}
  className="mx-auto mb-4 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105"
/>
    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
    <p className="text-gray-600 text-sm">{item.desc}</p>
  </div>
))}

        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Por qué elegir CootizSoft?</h2>
          <p className="text-gray-600 text-lg">
            Porque tu negocio merece agilidad, organización y presentación profesional. Con CootizSoft:
          </p>
          <ul className="list-disc list-inside text-left max-w-xl mx-auto text-gray-700 space-y-2">
            <li>Automatizas tareas repetitivas</li>
            <li>Impresionas a tus clientes con cotizaciones limpias y ordenadas</li>
            <li>Centralizas toda la información de tus productos y clientes</li>
            <li>Accedes desde cualquier lugar y dispositivo</li>
          </ul>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      {!isSignedIn && (
        <section className="bg-majorelle_blue py-10 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Empieza a cotizar con estilo hoy mismo</h2>
          <Link
            href="/sign-up"
            className="bg-white text-majorelle_blue font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Crear cuenta gratuita
          </Link>
        </section>
      )}
    </main>
  );
}

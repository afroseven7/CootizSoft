"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-raisin_black text-white py-12 px-6 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-medium_slate_blue mb-4">Sobre Nosotros</h1>
          <p className="text-gray-300 text-lg">
            CootizSoft es una plataforma desarrollada con pasión y compromiso para mejorar la creación y gestión de cotizaciones profesionales.
          </p>
        </div>

        {/* Desarrolladores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Cristian Stiven */}
          <div className="bg-jet p-6 rounded-lg shadow-lg text-center space-y-4">
            <Image
              src="/imagenes/cristian_pinzon.png"
              alt="Cristian Stiven Pinzón León"
              width={160}
              height={160}
              className="rounded-full mx-auto object-cover"
            />
            <h2 className="text-xl font-bold text-white">Cristian Stiven Pinzón León</h2>
            <p className="text-gray-400 text-sm">
              Desarrollador Full Stack y estudiante de Tecnología en Desarrollo de Software. Apasionado por la innovación, la construcción de interfaces limpias y soluciones digitales eficientes.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="https://github.com/afroseven7" target="_blank" className="text-blue-400 hover:underline">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/cristian-pinzón-1b378329a" target="_blank" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Cristian David */}
          <div className="bg-jet p-6 rounded-lg shadow-lg text-center space-y-4">
            <Image
              src="/imagenes/cristian_david.png"
              alt="Cristian David Parra Contreras"
              width={160}
              height={160}
              className="rounded-full mx-auto object-cover"
            />
            <h2 className="text-xl font-bold text-white">Cristian David Parra Contreras</h2>
            <p className="text-gray-400 text-sm">
              Desarrollador Full Stack y estudiante de Tecnología en Desarrollo de Software. Entusiasta del backend, las bases de datos y la construcción de plataformas escalables y seguras.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="https://github.com/tu_usuario" target="_blank" className="text-blue-400 hover:underline">
                GitHub
              </a>
              <a href="https://linkedin.com/in/tu_usuario" target="_blank" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Tutor */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-base">
            Este proyecto fue posible gracias al acompañamiento y tutoría del docente <span className="text-white font-semibold">Rubén Darío Rodríguez Useche</span>,
            quien nos guió con compromiso y conocimiento en cada paso del desarrollo.
          </p>
        </div>
      </div>

      {/* Footer académico con logo */}
      <footer className="mt-12 pr-6 flex justify-end items-center gap-3 text-sm text-gray-400">
        <p>Desarrollado por estudiantes de la <span className="text-white font-semibold">Universidad de Cundinamarca</span></p>
        <Image
          src="/imagenes/escudo_udec.png"
          alt="Logo Universidad de Cundinamarca"
          width={40}
          height={40}
          className="object-contain"
        />
      </footer>
    </main>
  );
}

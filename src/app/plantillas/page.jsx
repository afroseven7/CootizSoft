"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import PlantillasGuardadas from "@/components/PlantillasGuardadas";
import { useUser } from "@clerk/nextjs";

export default function PlantillasPage() {
  const { user, isLoaded } = useUser();
  const emailUsuario = user?.primaryEmailAddress?.emailAddress;

  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleSelectPlantilla = (plantilla) => {
    console.log("📌 Cargando plantilla en el editor:", plantilla);
    setPlantillaSeleccionada(plantilla);
  };

  const refreshPlantillas = () => {
    setUpdateTrigger((prev) => !prev);
    setPlantillaSeleccionada(null);
  };

  // 🔐 Esperar a que Clerk cargue y el email esté disponible
  if (!isLoaded || !emailUsuario) {
    return <p className="text-center text-gray-500">Cargando usuario...</p>;
  }



  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 Gestor de Plantillas</h1>
      <p className="text-gray-600 mb-6 text-center">
        Selecciona una plantilla guardada o crea una nueva.
      </p>

      <Editor
        idUsuario={user?.primaryEmailAddress?.emailAddress}
        plantillaSeleccionada={plantillaSeleccionada}
        onSaveSuccess={refreshPlantillas}
      />


      <PlantillasGuardadas
        emailUsuario={emailUsuario}
        onSelectPlantilla={handleSelectPlantilla}
        updateTrigger={updateTrigger}
      />
    </div>
  );
}

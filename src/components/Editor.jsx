"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import "../styles/editor.css";

export default function TinyMCEEditor({ idUsuario, plantillaSeleccionada, onSaveSuccess }) {
  const editorRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [plantillaId, setPlantillaId] = useState(null);

  const plantillaBase = `
    <h1 style="text-align: center;">COTIZACIÓN</h1>
<hr>
<table style="font-size: 16px; width: 100%; height: 161.484px;">
  <tbody>
    <tr>
      <td style="width: 20%; text-align: center;" rowspan="5">*{negocio.logo}*</td>
      <td><strong>Nombre:</strong> *{negocio.nombre}*</td>
    </tr>
    <tr><td><strong>NIT:</strong> *{negocio.identificacion}*</td></tr>
    <tr><td><strong>Dirección:</strong> *{negocio.direccion}*</td></tr>
    <tr><td><strong>Ciudad:</strong> *{negocio.ciudad}*</td></tr>
    <tr><td><strong>Teléfono:</strong> *{negocio.telefono}*</td></tr>
  </tbody>
</table>

<h2>Datos del Cliente</h2>
<table style="width: 100%; border-collapse: collapse;">
  <tbody>
    <tr>
      <td><strong>Nombre:</strong> *{cliente.nombre}*</td>
      <td><strong>Fecha:</strong> *{cotizacion.fecha}*</td>
    </tr>
    <tr>
      <td><strong>NIT:</strong> *{cliente.identificacion}*</td>
      <td><strong>Dirección:</strong> *{cliente.direccion}*</td>
    </tr>
    <tr>
      <td><strong>Ciudad:</strong> *{cliente.ciudad}*</td>
      <td><strong>Teléfono:</strong> *{cliente.telefono}*</td>
    </tr>
  </tbody>
</table>

<h5>En atención a su amable solicitud de cotización nos permitimos ofrecerles los siguientes productos y servicios de nuestra compañía.</h5>

<table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
  <thead style="background: #ddd;">
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">ID</th>
      <th style="border: 1px solid #000; padding: 8px;">Nombre</th>
      <th style="border: 1px solid #000; padding: 8px;">Descripción</th>
      <th style="border: 1px solid #000; padding: 8px;">Cantidad</th>
      <th style="border: 1px solid #000; padding: 8px;">Precio Unitario</th>
      <th style="border: 1px solid #000; padding: 8px;">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.id}*</td>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.nombre}*</td>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.descripcion}*</td>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.cantidad}*</td>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.precio}*</td>
      <td style="border: 1px solid #000; padding: 8px;">*{producto.total}*</td>
    </tr>
    *{productos.fila}*
  </tbody>
</table>


<h2>Totales</h2>
<table style="width: 100%; border-collapse: collapse;">
  <tbody>
    <tr><td><strong>Subtotal:</strong></td><td>*{cotizacion.subtotal}*</td></tr>
    <tr><td><strong>I.V.A.:</strong></td><td>*{cotizacion.iva}*</td></tr>
    <tr><td><strong>Total a Pagar:</strong></td><td>*{cotizacion.total}*</td></tr>
  </tbody>
</table>

  <h2>Condiciones Comerciales</h2>
  <p>
    Esta cotización tiene una validez de *{cotizacion.dias}* y vencerá el día *{cotizacion.vencimiento}*.
  </p>
<p> ¡Ingrese las condiciones de sus cotizaciones!</p>


<h2>Firma</h2>
<table style="border-collapse: collapse; width: 100%; border: 1px solid rgb(0, 0, 0); height: 118.219px;" border="1">
  <tbody>
    <tr>
      <td style="border: 1px solid #000; width: 45%;" contenteditable="true">*{cliente.nombre}*</td>
      <td style="border-style: hidden; width: 10%;">&nbsp;</td>
      <td style="border: 1px solid #000; width: 45%; text-align: right;" contenteditable="true">*{negocio.nombre}*</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; width: 45%;"><br>*****************<br><br></td>
      <td style="border-style: hidden; width: 10%;">&nbsp;</td>
      <td style="border: 1px solid rgb(0, 0, 0); width: 45%; text-align: right;">*{negocio.firma}*</td>
    </tr>
    <tr>
      <td style="border: 1px solid rgb(0, 0, 0); width: 45%;">Firma o sello cliente</td>
      <td style="border-style: hidden; width: 10%;">&nbsp;</td>
      <td style="border: 1px solid rgb(0, 0, 0); width: 45%; text-align: right;">Firma o sello vendedor</td>
    </tr>
  </tbody>
</table>

  `;

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    console.log("🎯 Plantilla recibida en Editor.jsx:", plantillaSeleccionada);

    if (plantillaSeleccionada) {
      setNombrePlantilla(plantillaSeleccionada.nombre);
      setPlantillaId(plantillaSeleccionada.id);
      if (editorRef.current) {
        editorRef.current.setContent(plantillaSeleccionada.contenido);
      }
    } else {
      setNombrePlantilla("");
      setPlantillaId(null);
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    }
  }, [plantillaSeleccionada]);


  useEffect(() => {
    if (plantillaSeleccionada) {
      setNombrePlantilla(plantillaSeleccionada.nombre);
      setPlantillaId(plantillaSeleccionada.id);
      if (editorRef.current) {
        editorRef.current.setContent(plantillaSeleccionada.contenido);
      }
    } else {
      setNombrePlantilla("");
      setPlantillaId(null);
      if (editorRef.current) {
        editorRef.current.setContent(plantillaBase);
      }
    }
  }, [plantillaSeleccionada]);

  const handleSave = async () => {
    if (!editorRef.current || !nombrePlantilla.trim()) {
      alert("Por favor, ingrese un nombre para la plantilla.");
      return;
    }

    const contenido = editorRef.current.getContent();
    const emailUsuario = idUsuario;
    const metodo = plantillaId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/plantillas", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: plantillaId,
          nombre: nombrePlantilla.trim(),
          contenido,
          email: emailUsuario,
        }),
      });

      if (res.ok) {
        alert(plantillaId ? "✅ Plantilla actualizada correctamente." : "✅ Plantilla guardada correctamente.");
        setNombrePlantilla("");
        setPlantillaId(null);
        editorRef.current.setContent(plantillaBase);
        if (onSaveSuccess) onSaveSuccess();
      } else {
        const data = await res.json();
        alert("❌ Error al guardar: " + data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("❌ Ocurrió un error.");
    }
  };

  if (!isClient) return <p>Cargando editor...</p>;

  return (
    <div className="editor-wrapper">
      <div className="dummy-header">CootizSoft - Editor de Cotización</div>
      <div className="my-custom-editor-container">
        <input
          type="text"
          placeholder="Nombre de la plantilla"
          value={nombrePlantilla}
          onChange={(e) => setNombrePlantilla(e.target.value)}
          className="nombre-input"
        />
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;

            // 🔥 Plugin personalizado Merge Tags
            editor.ui.registry.addMenuButton('mergeTags', {
              text: 'Etiquetas',
              fetch: (callback) => {
                callback([
                  // Negocio
                  { type: 'menuitem', text: 'Negocio Nombre', onAction: () => editor.insertContent('*{negocio.nombre}*') },
                  { type: 'menuitem', text: 'Negocio NIT', onAction: () => editor.insertContent('*{negocio.identificacion}*') },
                  { type: 'menuitem', text: 'Negocio Dirección', onAction: () => editor.insertContent('*{negocio.direccion}*') },
                  { type: 'menuitem', text: 'Negocio Ciudad', onAction: () => editor.insertContent('*{negocio.ciudad}*') },
                  { type: 'menuitem', text: 'Negocio Teléfono', onAction: () => editor.insertContent('*{negocio.telefono}*') },
                  { type: 'menuitem', text: 'Negocio Email', onAction: () => editor.insertContent('*{negocio.email}*') },
                  { type: 'menuitem', text: 'Negocio Logo', onAction: () => editor.insertContent('*{negocio.logo}*') },
                  { type: 'menuitem', text: 'Negocio Firma', onAction: () => editor.insertContent('*{negocio.firma}*') },

                  { type: 'separator' },

                  // Cliente
                  { type: 'menuitem', text: 'Cliente Nombre', onAction: () => editor.insertContent('*{cliente.nombre}*') },
                  { type: 'menuitem', text: 'Cliente Identificación', onAction: () => editor.insertContent('*{cliente.identificacion}*') },
                  { type: 'menuitem', text: 'Cliente Teléfono', onAction: () => editor.insertContent('*{cliente.telefono}*') },
                  { type: 'menuitem', text: 'Cliente Dirección', onAction: () => editor.insertContent('*{cliente.direccion}*') },
                  { type: 'menuitem', text: 'Cliente Email', onAction: () => editor.insertContent('*{cliente.email}*') },

                  { type: 'separator' },

                  // Productos individuales
                  { type: 'menuitem', text: 'Producto ID', onAction: () => editor.insertContent('*{producto.id}*') },
                  { type: 'menuitem', text: 'Producto Nombre', onAction: () => editor.insertContent('*{producto.nombre}*') },
                  { type: 'menuitem', text: 'Producto Descripción', onAction: () => editor.insertContent('*{producto.descripcion}*') },
                  { type: 'menuitem', text: 'Producto Cantidad', onAction: () => editor.insertContent('*{producto.cantidad}*') },
                  { type: 'menuitem', text: 'Producto Precio Unitario', onAction: () => editor.insertContent('*{producto.precio}*') },
                  { type: 'menuitem', text: 'Producto Total', onAction: () => editor.insertContent('*{producto.total}*') },

                  { type: 'separator' },

                  // Cotización
                  { type: 'menuitem', text: 'Fecha de Cotización', onAction: () => editor.insertContent('*{cotizacion.fecha}*') },
                  { type: 'menuitem', text: 'Subtotal', onAction: () => editor.insertContent('*{cotizacion.subtotal}*') },
                  { type: 'menuitem', text: 'IVA', onAction: () => editor.insertContent('*{cotizacion.iva}*') },
                  { type: 'menuitem', text: 'Total', onAction: () => editor.insertContent('*{cotizacion.total}*') },

                  { type: 'separator' },

                  // Vigencia de cotización
                  { type: 'menuitem', text: 'Días de Validez', onAction: () => editor.insertContent('*{cotizacion.dias}*') },
                  { type: 'menuitem', text: 'Fecha de Vencimiento', onAction: () => editor.insertContent('*{cotizacion.vencimiento}*') },

                ]);
              }
            });

          }}
          initialValue={plantillaBase}
          init={{
            height: 800,
            width: "100%",
            resize: false,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'media',
              'preview', 'searchreplace', 'table', 'visualblocks', 'wordcount'
            ],
            toolbar:
              'undo redo | bold italic underline forecolor backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist | link image media | preview | mergeTags',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          }}
        />

      </div>

      <button className="save-button" onClick={handleSave}>
        {plantillaId ? "Actualizar Plantilla" : "Guardar Plantilla"}
      </button>
    </div>
  );
}
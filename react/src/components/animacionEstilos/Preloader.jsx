
import React, { useState, useEffect } from 'react';
import '../animacionEstilos/style.css'; // Enlaza el archivo CSS aquí

function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simular una carga de datos
      setTimeout(() => {
        setLoading(false); // Al finalizar la carga, ocultar el preloader
      }, 3000); // Simulación de una carga de 3 segundos
    }, []);

  return (
   
    <div className="min-h-screen flex justify-center items-center">
    {loading ? (
      <div id="preloader" class="fixed top-0 left-0 w-full h-full bg-white opacity-75 z-50 flex justify-center items-center">
<div class="loader-container relative flex flex-col items-center justify-center">
  <img src="https://s1.elespanol.com/2017/07/14/ciencia/medio-ambiente/medio_ambiente_231238002_39634877_1706x1280.jpg" alt="Logo" class="w-16 h-16 absolute top-0 rounded-full transform -translate-y-1/2 mt-16" />
  <div class="loader ease-linear rounded-full border-t-8 border-gray-700 h-32 w-32"></div>
  <h1>cargando contenido</h1>
</div>
</div>
    ) : (
      <div className="text-4xl">¡Contenido cargado!</div>
    )}
  </div>
  )
}

export default Preloader
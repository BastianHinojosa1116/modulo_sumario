import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alertas from '../../animacionEstilos/Alertas';
import { useStateContext } from '../../../contexts/ContextProvider';

function IndexCambioFiscalComponent() {
  const { url } = useStateContext();
  const [sumarios, setSumarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const maxVisiblePages = 6;
  const [totalRecords, setTotalRecords] = useState(0);

  const endpointBuscarSumarios = `${url}/api/sumarios/cambioFiscal`;
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

   const handleRedireccionar = (primeraDiligencia) => {
     navigate(`/sumarios/cambio-fiscal-ad-hoc/${primeraDiligencia.id}`
     );
  };

    useEffect(() => {
          console.log("🕵️ sumarioSeleccionado:", endpointBuscarSumarios);
      }, []);

const getAllSumarios = async () => {
  try {
    const response = await axios.get(`${endpointBuscarSumarios}?page=${currentPage}&search=${searchTerm}`);
    console.log('Respuesta completa:', response);

    const { data } = response;
    console.log('Contenido de data:', data);

    setSumarios(Array.isArray(data.data) ? data.data : []);
    setLastPage(data.last_page || 1);
    setTotalRecords(data.total || 0);
  } catch (error) {
    console.error('Error al obtener sumarios:', show);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response);
    } else {
      console.error('Error sin respuesta del servidor:', error.message);
    }
    setSumarios([]);
    setLastPage(1);
    setTotalRecords(0);
  }
};


  useEffect(() => {
    getAllSumarios();
    const alertMessage = sessionStorage.getItem('alertMessage');
    if (alertMessage) {
      Alertas.success(alertMessage);
      sessionStorage.removeItem('alertMessage');
    }
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="border-gray-300 shadow-md rounded-md overflow-hidden px-5 py-2 pb-6 bg-white">
        <input
          type="text"
          placeholder="Buscar por rol..."
          value={searchTerm}
          onChange={handleSearchChange}
          maxLength={10}
          className="w-full md:w-1/5 border border-gray-300 rounded-md p-1 mb-4 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600"
        />

        {sumarios.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
              <thead className="bg-primary-700 text-white text-sm text-left">
                <tr>
                  <th className="px-4 py-2"># Rol</th>
                  <th className="px-10 py-2">Ingreso</th>
                  <th className="px-10 py-2">Plazo</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Fiscal</th>
                  <th className="px-4 py-2">Involucrados</th>
                  <th className="px-4 py-2">Motivo / Submotivo</th>
                  <th className="px-4 py-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {sumarios.map((sumario) => (
                  <tr key={sumario.id} className="hover:bg-slate-200 transition">
                    <td className="px-4 py-2 font-semibold text-primary-700">{sumario.sumario_numero_rol}</td>
                    <td className="px-4 text-center py-2">{sumario.fecha_ingreso_formulario}</td>
                    <td className="px-4 text-center py-2">{sumario.plazo}</td>
                    <td className="px-4 py-2">{sumario.estado_sumario}</td>
                    <td className="px-4 py-2">
                     {Array.isArray(sumario.user_form_sumarios) &&
                        sumario.user_form_sumarios
                          .filter((u) => u.rol === 'Fiscal')
                          .map((registro) => (
                            <div
                              key={registro.id}
                              className="bg-gray-100 border border-gray-300 rounded-md p-2 mb-2 shadow-sm"
                            >
                              <p className="text-xs text-gray-700">
                                <span className="font-semibold">NOMBRE:</span>{' '}
                                {registro.user?.name}
                              </p>
                              <p className="text-xs text-gray-700">
                                <span className="font-semibold">RUT:</span> {registro.user?.rut}
                              </p>
                              <p className="text-xs text-gray-700">
                                <span className="font-semibold">DOTACIÓN:</span>{' '}
                                {registro.user?.dotacion}
                              </p>
                            </div>
                          ))}
                   
                    </td>
                    <td className="px-4 py-2">
                      <ul className="space-y-1 text-xs">
                        {sumario.involucrados_sumarios?.map((inv) => (
                          <li
                            key={inv.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs mb-1 text-center">                            
                            {inv.involucrado.name} – 
                            <span className="font-semibold">RUT:</span> {inv.involucrado.rut_involucrado}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-y-2">
                        {["Lesión", "Daño", "Enfermedad"].map((motivo, i) => {
                          const motivoExists = sumario.motivo?.split(',').map(m => m.trim()).includes(motivo);
                          if (!motivoExists) return null;

                          const submotivos = sumario.subMotivo?.split(',').map(s => s.trim()).filter(sub => {
                            if (motivo === "Lesión") return ["Actos del servicio", "Trayecto"].includes(sub);
                            if (motivo === "Daño") return ["Vestuario", "Vehículo", "Accesorio", "Armamento", "Otros"].includes(sub);
                            if (motivo === "Enfermedad") return sub === "Enfermedad";
                            return false;
                          }) || [];

                          return (
                            <div key={i}>
                              <p className="font-semibold">{motivo}:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {submotivos.length > 0 ? (
                                  submotivos.map((sm, si) => (
                                    <span key={si} className="bg-slate-500 text-white px-1 py-0.5 text-center rounded-full text-xs">{sm}</span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-xs">Sin información</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleRedireccionar(sumario)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        Realizar Acción
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No se encontraron registros</div>
        )}

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            handlePageChange={handlePageChange}
            maxVisiblePages={maxVisiblePages}
            totalRecords={totalRecords}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default IndexCambioFiscalComponent;
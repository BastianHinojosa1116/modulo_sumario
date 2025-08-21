import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../pagination/Pagination';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alertas from '../../animacionEstilos/Alertas';
import { useStateContext } from '../../../contexts/ContextProvider';
import ModalOrdenSumario  from '../../sumariosComponent/ingresarOrdenSumarioComponent/modalOrdenSumarioComponent';

function IngresarOrdenSumario() {
  const { url } = useStateContext();
  const [sumarios, setSumarios] = useState([]);
  const [sumarioSeleccionado, setSumarioSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModalOS, setopenModalOS] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const maxVisiblePages = 6;
  const [isLoadingWord, setIsLoadingWord] = useState(false);

  const endpoint = `${url}/api/sumarios`;

  const getAllSumarios = async () => {
    try {
      const response = await axios.get(
        `${endpoint}?page=${currentPage}&search=${searchTerm}`
      );
      setSumarios(response.data.data || []);
      setLastPage(response.data.last_page);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Error al obtener los sumarios:', error);
      Alertas.error('Error al obtener los sumarios.');
    }
  };

  const handleAccionTramitaClick = (sumario) => {
    setSumarioSeleccionado(sumario);
    setopenModalOS(true);
  };

  const closeModalAccionTramita = () => {
    setopenModalOS(false);
    setSumarioSeleccionado(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getAllSumarios();

    const alertMessage = sessionStorage.getItem('alertMessage');
    if (alertMessage) {
      Alertas.success(alertMessage);
      sessionStorage.removeItem('alertMessage');
    }
  }, [currentPage, searchTerm]);

 const handleDescargarWord = (rolNumeroSumario) => {
  setIsLoadingWord(true);
  window.open(`${url}/api/sumario/descargarWord/${rolNumeroSumario}`, '_blank');
  setTimeout(() => setIsLoadingWord(false), 3000); // o usar un spinner si querés
};

const cargarPDF_OS = (rolNumeroSumario) => {
  
};


  return (
    <div>
      <div className="border border-gray-300 rounded-md overflow-hidden px-5 py-2 pb-6 bg-white">
        <input
          type="text"
          placeholder="Buscar por rol...."
          value={searchTerm}
          onChange={handleSearchChange}
          maxLength={10}
          className="w-full md:w-1/5 border border-gray-300 rounded-md p-1 mb-4 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600"
        />

        <div className="grid gap-4">
          
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
          <th className="px-4 py-2 text-center">Acción</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
        {sumarios.map((sumario) => (
          <tr key={sumario.id} className="hover:bg-slate-200 transition">
            <td className="px-4 py-2 font-semibold text-primary-700">{sumario.sumario_numero_rol}</td>
            <td className="px-4 text-center py-2">{sumario.fecha_ingreso_formulario}</td>
            <td className="px-4 text-center py-2">{sumario.plazo}</td>
            <td className="px-4 py-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 border border-blue-400 rounded-full text-xs whitespace-nowrap">
                {sumario.estado_sumario}
              </span>
            </td>
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
                        <span className="font-semibold">NOMBRE:</span> {registro.user?.name}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">RUT:</span> {registro.user?.rut}
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">DOTACIÓN:</span> {registro.user?.dotacion}
                      </p>
                    </div>
                  ))}
            </td>
            <td className="px-4 py-2">
              <ul className="flex flex-col gap-1">
                {sumario.involucrados_sumarios?.map((relacion) => {
                  const inv = relacion.involucrado;
                  return (
                    <li
                      key={relacion.id}
                      className="bg-blue-100 text-blue-800 border border-blue-400 rounded-full px-2 py-1 text-xs text-center"
                    >
                      <span className="font-semibold">NOMBRE:</span> {inv?.primer_nombre} {inv?.apellido_paterno} –{' '}
                      <span className="font-semibold">RUT:</span> {inv?.rut_involucrado}
                    </li>
                  );
                })}
              </ul>
            </td>
            <td className="px-4 py-2 text-center">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDescargarWord(sumario.sumario_numero_rol)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  Descargar O.S Word
                </button>
                <button
                  onClick={() => handleAccionTramitaClick(sumario)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  Cargar Orden Sumario
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="text-center py-8 text-gray-500">No se encontraron registros</div>
)}
         
        </div>

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
      <ModalOrdenSumario
        getAllPrimerasDiligencias={getAllSumarios}
        primeraDiligenciaSeleccionada={sumarioSeleccionado}
        openModalTramita={openModalOS}
        closeModalAccionTramita={closeModalAccionTramita}
      />
    </div>
  );
}

export default IngresarOrdenSumario;
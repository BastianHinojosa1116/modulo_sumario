import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../pagination/Pagination'; // Ajusta la ruta según tu estructura de archivos
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alertas from '../../animacionEstilos/Alertas';
import { useStateContext } from '../../../contexts/ContextProvider'; // Importa el contexto
import ModalAccionTramita from '../../primerasDiligenciasComponent/tramitaComponent/ModalAccionTramita'; // Importa el componente ModalAccionTramita

function IndexTramitaComponent() {

  const { url } = useStateContext(); // contexto para traer la url del sitio
  const [primerasDiligencias, setPrimerasDiligencias] = useState([]);//Arreglo con PRIMERAS DILIGENCIAS
  const [primeraDiligenciaSeleccionada, setPrimeraDiligenciaSeleccionada] = useState(null);//abre el modal con la primera diligencia seleccionada
  const [searchTerm, setSearchTerm] = useState('');//buscar

  //paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const maxVisiblePages = 6;
  const [totalRecords, setTotalRecords] = useState(0);

  //endpoint
  const endpointBuscarPrimerasDiligenciasTramita = `${url}/api/primerasDiligencias/tramita`; //endpoint para traer los formularios
  const user = JSON.parse(localStorage.getItem('currentUser')) || {}; //usuario local con su sesion iniciada

  //para abrir el modal de informacion primera diligencia
  const [openModalTramita, setOpenModalTramita] = useState(false);

  // Abrir modal aplicar sancion
  const closeModalAccionTramita = () => {
    setOpenModalTramita(false);
  };
  const handleAccionTramitaClick = (primeraDiligencia) => {
    setPrimeraDiligenciaSeleccionada(primeraDiligencia);
    setOpenModalTramita(true);
  };


  const getAllPrimerasDiligencias = async () => {
    const response = await axios.get(`${endpointBuscarPrimerasDiligenciasTramita}?page=${currentPage}&search=${searchTerm}`);
    setPrimerasDiligencias(response.data.data);
    setLastPage(response.data.last_page);
    setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
  };


  //declarar paginación y el buscador de la tabla para que se actualicen
  useEffect(() => {
    getAllPrimerasDiligencias();
    const alertMessage = sessionStorage.getItem('alertMessage');
    if (alertMessage) {
      Alertas.success(alertMessage);
      sessionStorage.removeItem('alertMessage');
    }
  }, [currentPage, searchTerm]);

  //paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1)
  };
  //fin paginación
console.log(primerasDiligencias,"hola maikol")
  return (
    <div>
      <div className='border border-gray-300 rounded-md overflow-hidden px-5 py-2 pb-6 bg-white'>
        <input
          type='text'
          placeholder='Buscar por rol....'
          value={searchTerm}
          onChange={handleSearchChange}
          maxLength={10}
          className='w-full md:w-1/5 border border-gray-300 rounded-md p-1 mb-4 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600'
        />
        <div className='grid gap-4'>
          {primerasDiligencias.length > 0 ? (
            primerasDiligencias.map((primeraDiligencia) => (
              <div key={primeraDiligencia.id} className="bg-gray-300 rounded-lg shadow-md mb-6 p-4 hover:shadow-lg transition-shadow duration-300 border-2 border-gray-400 ">
                <div className="flex  md:flex-row  items-start md:items-center mb-2">
                  <div className="flex items-center sm:gap-1 mb-2 md:mb-0 gap-2">
                    <span className="bg-primary-700 text-white px-3 py-1 rounded-full text-xs align-middle font-semibold">
                      Rol #{primeraDiligencia.pd_numero_rol}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs">
                      Ingreso: {primeraDiligencia.fecha_ingreso_formulario}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs">
                      Plazo: {primeraDiligencia.plazo}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs">
                      Estado: {primeraDiligencia.estado_primera_diligencia}
                    </span>
                  </div>
                </div>

                <div className="bg-white  rounded-lg shadow-md  m-0">
                  <div className="flex flex-col md:flex-row justify-between ">
                    {/* Fiscal a la izquierda */}
                    <div className="md:w-1/2 bg-gray-100 p-3 rounded-l-lg  border border-gray-300">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Fiscal:</h3>
                      {primeraDiligencia.usuarios.map((usuario) => (
                        <div key={usuario.id} >

                          <p className="text-gray-600 text-xs"><span className="font-semibold">NOMBRE:</span> {usuario.name}</p>
                          <p className="text-gray-600 text-xs"><span className="font-semibold">RUT:</span> {usuario.rut}</p>
                          <p className="text-gray-600 text-xs"><span className="font-semibold">DOTACIÓN:</span> {usuario.dotacion}</p>
                        </div>
                      ))}
                    </div>

                    <div className="md:w-1/2 bg-gray-100 p-3 rounded-r-lg border border-gray-300">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Involucrados:</h3>

                      <ul className=" list-inside text-gray-600">
                        {primeraDiligencia.involucrado_primera_diligencia.map((involucrados) => (
                          <li key={involucrados.id} className='bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs mb-1 text-center'> {involucrados.name} - <span className="font-semibold">RUT:</span> {involucrados.rut_involucrado}</li>
                        ))}
                      </ul>

                    </div>


                  </div>
                </div>

                {primeraDiligencia.motivo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {["Lesión", "Daño", "Enfermedad"].map((motivoBase, index) => {
                      const motivoExists = primeraDiligencia.motivo.split(",")
                        .map(m => m.trim())
                        .includes(motivoBase);

                      const submotivos = motivoExists && primeraDiligencia.subMotivo ?
                        primeraDiligencia.subMotivo.split(",")
                          .map(s => s.trim())
                          .filter(submotivo => {
                            if (motivoBase === "Lesión") return ["Actos del servicio", "Trayecto"].includes(submotivo);
                            if (motivoBase === "Daño") return ["Vestuario", "Vehículo", "Accesorio", "Armamento", "Otros"].includes(submotivo);
                            if (motivoBase === "Enfermedad") return submotivo === "Enfermedad";
                            return false;
                          }) : [];

                      const getStyles = (motivo) => {
                        switch (motivo) {
                          case "Lesión":
                            return {
                              header: "bg-gradient-to-r from-gray-600 to-gray-700",
                              badge: "bg-slate-500 hover:bg-slate-500"
                            };
                          case "Daño":
                            return {
                              header: "bg-gradient-to-r from-gray-600 to-gray-700",
                              badge: "bg-slate-500 hover:bg-slate-500"
                            };
                          case "Enfermedad":
                            return {
                              header: "bg-gradient-to-r from-gray-600 to-gray-700",
                              badge: "bg-slate-500 hover:bg-slate-500"
                            };
                          default:
                            return {
                              header: "bg-gray-600",
                              badge: "bg-gray-400"
                            };
                        }
                      };

                      const styles = getStyles(motivoBase);

                      return (
                        <div key={index} className="bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300">
                          <div className={`${styles.header} text-white px-4 py-1 rounded-t-lg font-medium text-md text-center`}>
                            {motivoBase}
                          </div>
                          <div className="p-2 rounded-b-lg">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {submotivos.length > 0 ? (
                                submotivos.map((submotivo, subIndex) => (
                                  <span
                                    key={subIndex}
                                    className={`${styles.badge} px-3 py-1 rounded-full text-xs font-medium text-white 
                                                                            shadow-sm transition-all duration-200 transform hover:scale-105`}
                                  >
                                    {submotivo}
                                  </span>
                                ))
                              ) : (
                                <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                  Sin información
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccionTramitaClick(primeraDiligencia)}
                      className='bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md focus:outline-none
                                            focus:ring-2 focus:ring-green-500 transition duration-300 flex items-center text-sm'
                    >
                      Realizar Acción
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No se encontraron registros
            </div>
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
      <ModalAccionTramita
        getAllPrimerasDiligencias={getAllPrimerasDiligencias}
        primeraDiligenciaSeleccionada={primeraDiligenciaSeleccionada}
        openModalTramita={openModalTramita}
        closeModalAccionTramita={closeModalAccionTramita}
      />

    </div>
  )
}

export default IndexTramitaComponent
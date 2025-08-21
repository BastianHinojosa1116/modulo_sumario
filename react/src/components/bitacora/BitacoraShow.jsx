import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../pagination/Pagination'; // Ajusta la ruta según tu estructura de archivos
import { useStateContext } from '../../contexts/ContextProvider'; // Importa el contexto

function BitacoraShow() {
  const [bitacoras, setBitacoras] = useState([]);
  const { url } = useStateContext(); // contexto para traer la url del sitio
  const endpoint = `${url}/api/bitacoras`;
  //paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const maxVisiblePages = 6;
  const [totalRecords, setTotalRecords] = useState(0);
  //buscar
  const [searchTerm, setSearchTerm] = useState('');

   //declarar paginación y el buscador de la tabla para que se actualicen
   useEffect(() => {
    getAllBitacoras();
  }, [currentPage, searchTerm]);

  const getAllBitacoras = async () => {
    try {
      const response = await axios.get(`${endpoint}?page=${currentPage}&search=${searchTerm}`);
      console.log(response.data.data);
      setBitacoras(response.data.data); // Set only the data array from the response
      setLastPage(response.data.last_page);
      setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
    } catch (error) {
      console.error('Error fetching bitacoras:', error);
    }
  };

  //paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1)
  };
  //fin paginación

  return (
    <div>
      <div className="ml-3 mr-3 mt-4 shadow-md bg-white p-6 rounded-md border border-gray-300">
        <div className='ml-8'>
          <input
            type="text"
            placeholder="Buscar información...."
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength={10} // Cambia el número 50 según el límite que desees
            className="border border-gray-300 rounded-md p-1 px-2 mr-2 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600 h-9"
          />
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded-md shadow-md mt-4 ml-8 mr-8 mb-4">
          <table className="min-w-full bg-white  shadow-lg rounded-md overflow-hidden">
            <thead className="bg-primary-700 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Descripción</th>
                <th className="py-3 px-6 text-left">Rut del funcionario</th>
                <th className="py-3 px-6 text-left">IP</th>
                <th className="py-3 px-6 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {bitacoras.map((bitacora) => (
                <tr key={bitacora.id} className="border-b transition-colors duration-500 hover:bg-gray-200">
                  <td className="py-3 px-6">{bitacora.description}</td>
                  <td className="py-3 px-6">{bitacora.user_rut}</td>
                  <td className="py-3 px-6">{bitacora.ip}</td>
                  <td className="py-3 px-6">{bitacora.formatted_created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          handlePageChange={handlePageChange}
          maxVisiblePages={maxVisiblePages}
          totalRecords={totalRecords}
        />
      </div>


    </div>
  )
}

export default BitacoraShow

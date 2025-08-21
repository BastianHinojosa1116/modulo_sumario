import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../pagination/Pagination'; // Ajusta la ruta según tu estructura de archivos
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alertas from '../../animacionEstilos/Alertas';
import { useStateContext } from '../../../contexts/ContextProvider'; // Importa el contexto

function IndexAsesorJuridico() {

    //declaracion de variables
    const [faltas, setFaltas] = useState([]);
    const { url } = useStateContext(); // contexto para traer la url del sitio
    const endpoint = `${url}/api/asesorJuridico`;
    const [searchTerm, setSearchTerm] = useState('');  //buscar
    //paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const maxVisiblePages = 6;
    const [totalRecords, setTotalRecords] = useState(0);
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    //declarar paginación y el buscador de la tabla para que se actualicen
    useEffect(() => {
        const alertMessage = sessionStorage.getItem('alertMessage');
        if (alertMessage) {
            Alertas.success(alertMessage);
            sessionStorage.removeItem('alertMessage');
        }
        getAllFaltas();
    }, [currentPage, searchTerm]);

    const getAllFaltas = async () => {
        const response = await axios.get(`${endpoint}?page=${currentPage}&search=${searchTerm}&dotacion=${user.dotacion}&rut=${user.rut}`);
        setFaltas(response.data.data);
        setLastPage(response.data.last_page);
        setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
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
            <div className='border border-gray-300 rounded-md overflow-hidden px-5 py-2 pb-6 bg-white shadow-md'>
                <input
                    type='text'
                    placeholder='Buscar por rol....'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxLength={10} // Cambia el número 50 según el límite que desees
                    className='border border-gray-300 rounded-md p-2 mr-2 ml-8 mt-6 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600'
                />
                <div className='ml-8 mr-8 mt-4 '>
                    <div className='overflow-x-auto shadow-md mb-4'>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <table className="min-w-full bg-white rounded-xl">
                                <thead className="bg-primary-700 text-white">
                                    <tr>
                                        <th className="py-2 px-4">Rol</th>
                                        <th className="py-2 px-4">Causales</th>
                                        <th className="py-2 px-4">Resuelve</th>
                                        <th className="py-2 px-4">Fecha cierre del caso</th>
                                        <th className="py-2 px-4">Estado del caso</th>
                                        <th className="py-2 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {faltas.length > 0 ? (
                                        faltas.map((falta) => (
                                            <tr key={falta.id} className="border-b transition-colors duration-500 hover:bg-gray-200">
                                                <td className="py-2 px-4">{falta.numero_rol}</td>
                                                <td className="py-2 px-4">{falta.causales}</td>
                                                <td className="py-2 px-4">{falta.falta_nombre_direccion_resuelve}</td>
                                                <td className="py-2 px-4">{falta.fecha_cambio_estado_falta}</td>
                                                <td className="py-2 px-4 text-green-600">{falta.estado_proceso}</td>
                                                <td className="py-2 px-4">
                                                    <div className="flex justify-center space-x-2">
                                                        {/* agregar botones  */}
                                                        <Link
                                                            to={`/procesosDisciplinarios/asesorJuridico/verSancionAsesorJuridico/${falta.id}`}
                                                            className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105"
                                                        >
                                                            Ver Falta
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="py-2 px-2 text-center" colSpan="6">Sin registros encontrados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Utiliza el componente Pagination */}
                <div>

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
    )
}

export default IndexAsesorJuridico

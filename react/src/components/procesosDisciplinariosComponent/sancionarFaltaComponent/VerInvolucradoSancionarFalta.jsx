import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ModalAplicarSancion from '../sancionarFaltaComponent/ModalAplicarSancionSancionarFalta'; // Importa el componente Modalaplicarsancion
import ModalNoAplicarSancion from '../sancionarFaltaComponent/ModalNoAplicarSancionSancionarFalta'; // Importa el componente Modalnoaplicarsancion
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí

function VerInvolucradoSancionarFalta() {

    const { id } = useParams()
    const [involucrado, setInvolucrado] = useState([]);
    const [sanciones, setSanciones] = useState([]);
    const [openModalAplicarSancion, setOpenModalAplicarSancion] = useState(false);
    const [openModalNoAplicarSancion, setOpenModalNoAplicarSancion] = useState(false);
    const { url } = useStateContext(); // Cambiado aquí
    const involucradosEndpoint = `${url}/api/resolverFalta/aplicarSancion/VerInvolucrado/`;
    const escalafon = involucrado.escalafon;

    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    console.log("hola121212", user.cargo)

    // Abrir modal aplicar sancion
    const closeModalAplicarSancion = () => {
        setOpenModalAplicarSancion(false);
    };
    const handleAplicarSancionClick = () => {
        setOpenModalAplicarSancion(true);
    };

    // Abrir modal no aplicar sancion
    const handleNoAplicarSancionClick = () => {
        setOpenModalNoAplicarSancion(true);
    };
    const closeModalNoAplicarSancion = () => {
        setOpenModalNoAplicarSancion(false);
    };

    const getInvolugradoById = async () => {
        try {
            const response = await axios.get(`${involucradosEndpoint}${id}`);
            console.log('involucrado:', response.data.involucrado);
            setInvolucrado(response.data.involucrado);
            setSanciones(response.data.involucrado.sanciones);
        } catch (error) {
            console.error('Error al obtener el involucrado:', error);
        }
    };
    //Fin de obtiene la informacion del usuario por el id *********************

    useEffect(() => {

        getInvolugradoById();
        // trae la informacion actualizada con cada acción
    }, []);

    return (
        <div className="mx-auto p-4 md:p-10 rounded-xl bg-white lg:ml-16 lg:mr-16 mb-24 border mt-8 border-gray-300">
            <h1 className="text-2xl md:text-4xl text-gray-700 font-bold text-center mb-6 md:border-b-2 md:border-gray-700 lg:ml-16 lg:mr-16">Información del involucrado</h1>
            <div className='bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                <div className="">
                    <div className="space-y-4 ">
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Nombre:</p>
                            <p className='ml-2 text-right'>{involucrado ? involucrado.name : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Rut:</p>
                            <p className='ml-2 text-right'>{involucrado ? involucrado.rut_involucrado : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Codigo de funcionario:</p>
                            <p className='ml-2 text-right'>{involucrado ? involucrado.codigo_funcionario : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Correo institucional:</p>
                            <p className='ml-2 text-right'>{involucrado ? involucrado.correo_institucional : ""}</p>
                        </div>

                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Alta repartición:</p>
                            <p className='ml-2 text-right'>{involucrado.descripcion_alta_reparticion ? involucrado.descripcion_alta_reparticion : "No registra"}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Repartición:</p>
                            <p className='ml-2 text-right'>{involucrado.descripcion_reparticion ? involucrado.descripcion_reparticion : "No registra"}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Destacamento:</p>
                            <p className='ml-2 text-right'>{involucrado.descripcion_destacamento ? involucrado.descripcion_destacamento : "No registra"}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Unidad:</p>
                            <p className='ml-2 text-right'>{involucrado.descripcion_unidad ? involucrado.descripcion_unidad : "No registra"}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Dotación:</p>
                            <p className='ml-2 text-right'>{involucrado ? involucrado.dotacion : ""}</p>
                        </div>

                    </div>

                </div>
            </div>


            <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                {/* {estadoProceso !== "Cerrado" ? ( */}
                <div className="flex justify-center">
                    <button
                        onClick={() => handleAplicarSancionClick()}
                        className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                    >
                        Aplicar sanción
                    </button>
                    <button
                        onClick={() => handleNoAplicarSancionClick()}
                        className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                    >
                        No aplicar sanción
                    </button>
                </div>
                {/* ) : (
            <p className="text-center text-gray-700">El proceso está cerrado y no se pueden realizar acciones.</p>
          )} */}
            </div>

            {/* Mostrar las sanciones relacionadas */}
            <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Sanciones aplicadas</h4>
                </div>
                <div className="border border-gray-300 p-2 bg-gray-50 rounded-md mb-2 shadow-lg">
                    {sanciones.length > 0 ? (
                        sanciones.map((sancion) => (
                            <div key={sancion.id} className='ml-4 mr-4 mt-4 mb-4'>
                                <div className="p-2 ml-2 mt-2 mr-2 rounded-t-lg text-center border bg-gray-600 border-gray-400">
                                    <p className="font-bold text-md text-white">
                                        {sancion.aplica_sancion}
                                        <span
                                            className={`ml-2 inline-block w-3 h-3 rounded-full ${sancion.aplica_sancion === 'Sanción aplicada' ? 'bg-red-500' : sancion.aplica_sancion === 'Sanción no aplicada' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}
                                        ></span>
                                    </p>
                                </div>
                                <div className="p-5 flex justify-between -lg ml-2 rounded-b-lg mr-2 border bg-gray-100 border-gray-400">
                                    <div className="w-1/2 ml-2">
                                        <p className='p-1'><strong>Fecha de sanción:</strong> {sancion.fecha_sancion}</p>
                                        <p className='p-1'><strong>Tipo de sanción aplicada:</strong> {sancion.sancion}</p>
                                        {sancion.dias_arresto !== "0" ? (<p className='p-1'><strong>Días de arresto:</strong> {sancion.dias_arresto}</p>) : null}
                                        <p className='p-1'><strong>Conformidad de la sanción:</strong> {sancion.conformidad_involucrado}</p>
                                        <div>
                                            {sancion.recurso !== "" || sancion.resolucion_recurso !== "" ? (
                                                <>
                                                    <hr className="my-1 border-gray-300" />
                                                </>
                                            ) : null}
                                            {sancion.recurso !== "" ? (
                                                <p className='p-1'><strong>Recurso:</strong> {sancion.recurso}</p>
                                            ) : null}
                                            {sancion.resolucion_recurso !== "" ? (
                                                <div className='flex justify-start p-1'>
                                                    <div>
                                                        <p><strong>Resolución del recurso:</strong></p>
                                                    </div>
                                                    <div>
                                                        <a
                                                            href={`${url}/uploads/${sancion.numero_rol_falta}/${sancion.resolucion_recurso}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm
                                                        text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                                                        focus:ring-blue-500  ease-in-out transform transition duration-300 hover:scale-105"
                                                        >
                                                            Descargar
                                                            <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-1/2 ">
                                        <div className='flex justify-start p-1'>
                                            <div>
                                                <p><strong>Resolución de sanción:</strong></p>
                                            </div>
                                            <div>
                                                <a
                                                    href={`${url}/uploads/${sancion.numero_rol_falta}/${sancion.resolucion_sancion}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm
                                                text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2
                                                focus:ring-offset-2 focus:ring-blue-500  ease-in-out transform transition duration-300 hover:scale-105"
                                                >
                                                    Descargar
                                                    <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className='flex justify-start p-1'>
                                            <div>
                                                <p><strong>Estado de sanción:</strong></p>
                                            </div>
                                            <div>
                                                <a
                                                    className={
                                                        sancion.estado_sancion === 'Sanción en curso' ? 'inline-flex items-center px-1 py-0 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-800 to-primary-500 hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500  ease-in-out'
                                                            : sancion.estado_sancion === 'Cerrado' ? 'inline-flex items-center px-1 py-0 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-800 to-red-500 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  ease-in-out'
                                                                : 'inline-flex items-center px-1 py-0 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-800 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:yellow-red-500  ease-in-out'}>
                                                    {sancion.estado_sancion}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No hay sanciones aplicadas.</p>
                    )}
                </div>
            </div>
            {/* Espacio para los modal */}
            <ModalAplicarSancion openModalAplicarSancion={openModalAplicarSancion} closeModalAplicarSancion={closeModalAplicarSancion} id={id} escalafon={escalafon} />
            <ModalNoAplicarSancion openModalNoAplicarSancion={openModalNoAplicarSancion} id={id} closeModalNoAplicarSancion={closeModalNoAplicarSancion} />
        </div>
    )
}

export default VerInvolucradoSancionarFalta

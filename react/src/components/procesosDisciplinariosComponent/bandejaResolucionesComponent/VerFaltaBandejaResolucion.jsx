import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import ModalReapertura from '../bandejaResolucionesComponent/ModalReapertura'; // Importa el componente ModalAsesorJuridico
import ModalDejarSinEfecto from '../bandejaResolucionesComponent/ModalDejarSinEfecto'; // Importa el componente ModalAsesorJuridico
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function VerFaltaBandejaResolucion() {

    const { id } = useParams()
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const [involucrado, setInvolucrado] = useState([]);
    const [falta, setFalta] = useState([]);
    const [openModalReapertura, setOpenModalReapertura] = useState(false);
    const [openModalDejarSinEfecto, setOpenModalDejarSinEfecto] = useState(false);
    const [asesorJuridico, setAsesorJuridico] = useState([]);
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/resolverFalta/aplicarSancion/`;

    // Abrir modal reapertura
    const closeModalReapertura = () => {
        setOpenModalReapertura(false);
    };
    const handleAplicarSancionClick = () => {
        setOpenModalReapertura(true);
    };

    // Abrir modal dejarSinEfecto
    const closeModalDejarSinEfecto = () => {
        setOpenModalDejarSinEfecto(false);
    };
    const handleDejarSinEfectoClick = () => {
        setOpenModalDejarSinEfecto(true);
    };

    // Obtiene la informacion del usuario por el id *****************************
    const getFaltaById = async () => {
        try {
            const response = await axios.get(`${endpoint}${id}`);
            //console.log("hola", response.data.involucrados[0])

            setFalta(response.data);
            setInvolucrado(response.data.involucrados);
            setAsesorJuridico(response.data.asesor_juridicos);

            // Aquí puedes manejar la respuesta de la solicitud de falta si es necesario
        } catch (error) {
            console.error('Error al aa la falta:', error);
        }
    }

    useEffect(() => {
        getFaltaById();
        // trae la informacion actualizada con cada acción
    }, []);


    console.log(asesorJuridico.id, "hola po")

    return (
        <div className="mx-auto p-4 md:p-10 rounded-xl bg-white lg:ml-16 lg:mr-16 mb-24 border mt-8 border-gray-300">
            <h1 className="text-2xl md:text-4xl text-gray-700 font-bold text-center mb-6 md:border-b-2 md:border-gray-700 lg:ml-16 lg:mr-16">Resolución {falta ? falta.numero_rol : ""}</h1>


            <form className="">
                <div className='bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="space-y-4 ">
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Número de Rol:</p>
                            <p className='ml-2 text-right'>{falta ? falta.numero_rol : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Dirección que resuelve:</p>
                            <p className='ml-2 text-right'>{falta ? falta.falta_nombre_direccion_resuelve : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Fecha de ingreso:</p>
                            <p className='ml-2 text-right'>{falta ? falta.fecha_ingreso : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">fecha de comision de la falta:</p>
                            <p className='ml-2 text-right'>{falta ? falta.fecha_comision_falta : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Causales:</p>
                            <p className='ml-2 text-right'>{falta ? falta.causales : ""}</p>
                        </div>

                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Descripción del hecho:</p>
                            <p className='ml-2 text-right'>{falta ? falta.descripcion_hecho : ""}</p>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Documento que informa la falta:</p>
                            <a href={`${url}/uploads/${falta.numero_rol}/${falta.documento_informa_falta}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm
                                                text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2
                                                focus:ring-offset-2 focus:ring-blue-500  ease-in-out transform transition duration-300 hover:scale-105">
                                Descargar
                                {/* Emoji de documento con flecha hacia abajo */}
                                <span className="ml-1" role="img" aria-label="Descargar">📄</span>
                            </a>
                        </div>
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Estado del proceso:</p>
                            <p className='ml-2 text-right'>{falta ? falta.estado_proceso : ""}</p>
                        </div>


                        {falta && falta.fecha_reapertura ? (
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Reapertura:</p>
                                <p className='ml-2 text-right text-red-600'>Esta sanción paso por una reapertura el dia {falta.fecha_reapertura} </p>
                            </div>
                        ) : null}

                    </div>
                </div>

                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700  font-bold text-center">Involucrados en la falta</h4>
                    </div>
                    <div className='border border-gray-300 rounded-lg'>
                        <table className="w-full overflow-hidden rounded-lg " >
                            <thead className="bg-gray-600 text-white">
                                <tr>
                                    <th className="py-2 px-4">Nombre</th>
                                    <th className="py-2 px-4">Rut</th>
                                    <th className="py-2 px-4">Cod. Funcionario</th>
                                    <th className="py-2 px-4">Acciones</th>
                                    {/* <th className="py-2 px-4">accion</th> */}
                                </tr>
                            </thead>
                            <tbody className='text-center bg-white'>
                                {involucrado.length > 0 ? (
                                    involucrado.map((involucrados, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-200 transition-colors duration-500">
                                            <td className="py-2 px-4">{involucrados.name}</td>
                                            <td className="py-2 px-4">{involucrados.rut_involucrado}</td>
                                            <td className="py-2 px-4">{involucrados.codigo_funcionario}</td>
                                            <td className="py-2 px-4">  <div className="flex justify-center space-x-2">
                                                {/* agregar botones */}
                                                <Link
                                                    to={`/procesosDisciplinarios/bandejaResoluciones/${falta.id}/involucrado/${involucrados.id}`}
                                                    className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105"
                                                >
                                                    Ver Sanciones
                                                </Link>
                                            </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-2 text-center" colSpan="4">Sin registros encontrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mostrar las sanciones relacionadas */}
                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Sanciones Aplicadas</h4>
                    </div>

                    {asesorJuridico.length > 0 ? (
                        asesorJuridico.map((asesoresJuridicos) => (
                            <div key={asesoresJuridicos.id} className="mb-2 mt-5 rounded-lg  border-gray-300">
                                {/* aqui esta validando la informacion si es un asesor juridico muestra otro tipo de tarjeta */}
                                {asesoresJuridicos.tipo_sancion === "Asesor Juridico" ? (
                                    <div className="w-full mx-auto bg-white shadow-sm rounded-lg border-2 border-gray-300 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="w-full md:w-3/5 flex flex-col lg:flex-row lg:items-start justify-start p-4 border rounded-md border-gray-300 shadow-md mb-4 md:mb-0 overflow-x-auto">
                                                    <div className="flex items-center justify-center mb-4 lg:mb-0 lg:mr-4 flex-shrink-0">
                                                        <img
                                                            src="/src/assets/AsesorJuridico.png"
                                                            alt="Usuario"
                                                            className="max-w-40 h-40 object-cover border-2 rounded-full border-gray-300"
                                                        />
                                                    </div>
                                                    <div className='flex flex-col justify-start mt-4 lg:mt-0'>
                                                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Información del asesor jurídico</h2>
                                                        {asesorJuridico ? (
                                                            <div>
                                                                <p className="text-gray-700 py-1">
                                                                    <span className="font-bold">Nombre:</span> {` ${asesoresJuridicos.primer_nombre} ${asesoresJuridicos.segundo_nombre} ${asesoresJuridicos.apellido_paterno} ${asesoresJuridicos.apellido_materno}`}
                                                                </p>
                                                                <p className="text-gray-700 py-1">
                                                                    <span className="font-bold">Rut:</span> {asesoresJuridicos.rut}
                                                                </p>
                                                                <p className="text-gray-700 py-1">
                                                                    <span className="font-bold">Código de funcionario:</span> {asesoresJuridicos.codigo_funcionario}
                                                                </p>
                                                                <p className="text-gray-700 py-1">
                                                                    <span className="font-bold">Grado:</span> {asesoresJuridicos.grado}
                                                                </p>
                                                                <p className="text-gray-700 py-1">
                                                                    <span className="font-bold">Dotación:</span> {asesoresJuridicos.dotacion}
                                                                </p>
                                                                <div className='flex justify-start py-1'>
                                                                    <div>
                                                                        <p><strong>Doc. Dispone asesor:</strong></p>
                                                                    </div>
                                                                    <div>
                                                                        <a
                                                                            href={`${url}/uploads/${falta.numero_rol}/${asesoresJuridicos.documento_dispone_asesor}`}
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
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500 py-1 font-serif">Debe ingresar un rut para mostrar la información</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-2/5 flex justify-start ml-0 md:ml-8 p-4 border rounded-md border-gray-300 shadow-md">
                                                    <div className="w-full">
                                                        <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">Visualizar informe jurídico</h2>
                                                        <p className='font-serif text-center text-gray-500 mb-4'>Presione el boton descargar para obtener el informe jurídico.</p>
                                                        <div className='border rounded-md border-gray-300 shadow-md p-4'>
                                                            <div className='flex justify-center p-1'>
                                                                <div>
                                                                    <p><strong>Informe Jurídico:</strong></p>
                                                                </div>
                                                                <div>
                                                                    <a
                                                                        href={`${url}/uploads/${falta.numero_rol}/${falta.documento_informe_juridico}`}
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ) : (
                                    <>
                                        <div className="rounded-t-lg text-center text-white bg-gray-600 border border-gray-300">
                                            <div className="p-2">
                                                <div className="flex flex-col md:flex-row justify-center">
                                                    <p className='font-bold text-md text-white text-center'>{asesoresJuridicos.tipo_sancion}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 flex rounded-b-lg border border-gray-300 bg-white">
                                            <div className='flex w-full'> {/* Esto asegura que ambos divs ocupen el 100% del ancho */}
                                                <div className="flex w-1/2 flex-col p-4 border border-gray-300 rounded-md shadow-md">  {/* Izquierda */}

                                                    {asesoresJuridicos.proceso_administrativo ? (
                                                        <>
                                                            <p><strong>Fecha de la sanción:</strong> {asesoresJuridicos.fecha_sancion}</p>
                                                            <p><strong>Proceso Administrativo:</strong> {asesoresJuridicos.proceso_administrativo}</p>
                                                        </>
                                                    ) : <>
                                                        {asesoresJuridicos.tipo_sancion === "Sin efecto Suspensión" ? (
                                                            <p><strong>Fecha sin efecto suspensión:</strong> {asesoresJuridicos.fecha_sancion}</p>
                                                        ) : asesoresJuridicos.tipo_sancion === "Reapertura" ? (
                                                            <p><strong>Fecha de la reapertura:</strong> {asesoresJuridicos.fecha_sancion}</p>
                                                        ) : (
                                                            <p><strong>Fecha de la suspensión:</strong> {asesoresJuridicos.fecha_sancion}</p>
                                                        )}
                                                    </>
                                                    }
                                                </div>
                                                <div className="flex w-1/2 ml-4 items-center justify-center border border-gray-300 rounded-md shadow-md p-4">  {/* Derecha */}
                                                    {asesoresJuridicos.proceso_administrativo ? (
                                                        <>
                                                            <p><strong>Resolución de la sanción:</strong></p>
                                                        </>
                                                    ) : <>
                                                        {asesoresJuridicos.tipo_sancion === "Sin efecto Suspensión" ? (
                                                            <p><strong>Resolución sin efecto:</strong></p>
                                                        ) : asesoresJuridicos.tipo_sancion === "Reapertura" ? (
                                                            <p><strong>Resolución de la reapertura:</strong></p>
                                                        ) : (
                                                            <p><strong>Resolución de la suspensión:</strong></p>
                                                        )}
                                                    </>
                                                    }
                                                    <a
                                                        href={`${url}/uploads/${falta.numero_rol}/${asesoresJuridicos.resolucion_sancion}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                                                    >
                                                        Descargar
                                                        <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No hay sanciones aplicadas.</p>
                    )}

                </div>


                {falta.estado_proceso !== "Suspendido" ? (
                    <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                        <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                            <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                        </div>
                        <p className='font-serif text-center text-gray-500 mb-8'>Al presionar el boton reapertura del caso la falta volvera a tener su estado abierto en la bandeja "resolver faltas disciplinarias" provocando que se pueda volver a aplicar una sanción. </p>
                        <div className="flex justify-center">
                            <button
                                className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                            focus:ring-2 focus:ring-primary-600 transition duration-500'
                                type="button"
                                onClick={handleAplicarSancionClick}
                            > Reapertura del caso
                            </button>
                        </div>

                    </div>
                ) : (
                    <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                        <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                            <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                        </div>
                        <p className='font-serif text-center text-gray-500 mb-8'>Al presionar el boton dejar sin efecto el caso sera derivado a la bandeja resolver faltas disciplinarias. </p>
                        <div className="flex justify-center">
                            <button
                                className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                                    focus:ring-2 focus:ring-primary-600 transition duration-500'
                                type="button"
                                onClick={handleDejarSinEfectoClick}
                            > Sin efecto suspensión
                            </button>
                        </div>

                    </div>
                )}

                <ModalReapertura
                    show={openModalReapertura}
                    closeModalReapertura={closeModalReapertura}
                    id={id}
                />
                <ModalDejarSinEfecto
                    show={openModalDejarSinEfecto}
                    closeModalSinEfecto={closeModalDejarSinEfecto}
                    id={id}
                />
            </form>

        </div>
    )
}

export default VerFaltaBandejaResolucion

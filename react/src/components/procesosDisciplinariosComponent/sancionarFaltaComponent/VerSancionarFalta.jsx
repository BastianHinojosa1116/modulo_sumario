import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ModalSuspensionDelProcedimiento from '../sancionarFaltaComponent/ModalSuspensionDelProcedimientoSancionarFalta'; // Importa el componente Modalsuspenciondel procedimiento
import ModalProcesoAdministrativo from '../sancionarFaltaComponent/ModalProcesoAdministrativoSancionarFalta'; // Importa el componente ModalProcesoAdministrativo
import ModalAsesorJuridico from '../sancionarFaltaComponent/ModalAsesorJuridicoSancionarFalta'; // Importa el componente ModalAsesorJuridico
import ModalAgregarInvolucradoView from '../sancionarFaltaComponent/ModalAgregarInvolucrado'; // Importa el componente ModalAgregarInvolucrado
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Alertas from '../../animacionEstilos/Alertas';

function VerSancionarFalta() {

    const { id } = useParams()
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const [involucrado, setInvolucrado] = useState([]);
    const [falta, setFalta] = useState([]);
    const [openModalProcesoAdministrativo, setOpenModalProcesoAdministrativo] = useState(false);
    const [openModalAsesorJurudico, setOpenModalAsesorJurudico] = useState(false);
    const [openModalSuspensionDelProcedimiento, setOpenModalSuspensionDelProcedimiento] = useState(false);
    const [openModalAgregarInvolucrados, setOpenModalAgregarInvolucrados] = useState(false);
    const numeroRolFalta = falta.numero_rol;
    const estadoProceso = falta.estado_proceso;
    const [asesorJuridico, setAsesorJuridico] = useState([]);
    const [documentoInformeJuridico, setDocumentoInformeJuridico] = useState(null);
    const [fechaInformeJuridico, setFechaInformeJuridico] = useState('');
    const [informeJuridicoAplicado, setInformeJuridicoAplicado] = useState('');
    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/resolverFalta/aplicarSancion/`;
    const endpointInformeJuridico = `${url}/api/resolverFalta/aplicarSancion/cargarInformeJuridico/`;

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleChangeDocumentoInformeJuridico = (e) => {
        setDocumentoInformeJuridico(e.target.files[0]);

    };

    // Abrir proceso administrativo
    const handleProcesoAdministrativoClick = () => {
        setOpenModalProcesoAdministrativo(true);
    };
    const closeModalProcesoAdministrativo = () => {
        setOpenModalProcesoAdministrativo(false);
        getFaltaById();
    };

    // Abrir asesor juridico
    const handleAsesorJurudicoClick = () => {
        setOpenModalAsesorJurudico(true);
    };
    const closeModalAsesorJurudico = () => {
        setOpenModalAsesorJurudico(false);
        getFaltaById();
    };

    // Abrir suspension del procedimiento
    const handleSuspensionDelProcedimientoClick = () => {
        setOpenModalSuspensionDelProcedimiento(true);

    };
    const closeModalSuspensionDelProcedimiento = () => {
        setOpenModalSuspensionDelProcedimiento(false);
        getFaltaById();
    };

    //modal agregar involucrados
    const handleAgregarInvolucradosClick = () => {
        setOpenModalAgregarInvolucrados(true);
    };
    const closeModalAgregarInvolucrados = () => {
        setOpenModalAgregarInvolucrados(false);

    };

    // Fin del accionamiento de cada modal de la vista **************************

    // Obtiene la informacion del usuario por el id *****************************
    const getFaltaById = async () => {
        try {
            const response = await axios.get(`${endpoint}${id}`);
            //console.log("hola", response.data.involucrados[0])
            console.log("hola", response.data.asesor_juridicos)
            setInformeJuridicoAplicado(response.data.documento_informe_juridico);
            setFalta(response.data);
            setInvolucrado(response.data.involucrados);
            setAsesorJuridico(response.data.asesor_juridicos);

            // Aquí puedes manejar la respuesta de la solicitud de falta si es necesario
        } catch (error) {
            console.error('Error al aa la falta:', error);
        }
    }

    const handleInformeJuridico = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('fecha_informe_juridico', fechaInformeJuridico);
        formData.append('documento_informe_juridico', documentoInformeJuridico);

        try {
            const resp = await axios.post(`${endpointInformeJuridico}${id}`, formData, config);

            console.log("gg ", resp.data.message)
            // // Guardar mensaje de alerta en sessionStorage
            sessionStorage.setItem('alertMessage', resp.data.message);
            // Alertas.success(resp.data.message);
            // // Redirigir a otra vista
            navigate('/procesosDisciplinarios/resolverFalta');

        } catch (error) {
            console.error("Error aplicando sanción", error.response.data.error);
            Alertas.error(error.response.data.error);
        }
    }

    useEffect(() => {
        getFaltaById();
        // trae la informacion actualizada con cada acción
        setFechaInformeJuridico(obtenerFechaDeHoy());
    }, []);


    return (
        <div className="mx-auto p-4 md:p-10 rounded-xl bg-white lg:ml-16 lg:mr-16 mb-24 border mt-8 border-gray-300">
            <h1 className="text-2xl md:text-4xl text-gray-700 font-bold text-center mb-6 md:border-b-2 md:border-gray-700 lg:ml-16 lg:mr-16">Información de la falta disciplinaria</h1>

            <form className="">
                <div className='bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="">

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
                                <p className="font-bold">Fecha de comision de la falta:</p>
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
                        </div>
                    </div>


                </div>

                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-3 lg:ml-16 lg:mr-16 border border-gray-300'>
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
                                    <th className="py-2 px-4">Dotación</th>
                                    <th className="py-2 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='text-center bg-white'>
                                {involucrado.length > 0 ? (
                                    involucrado.map((involucrados, index) => (
                                        <tr key={index} className="border-b transition-colors duration-500 hover:bg-gray-200">
                                            <td className="py-2 px-4">{involucrados.name}</td>
                                            <td className="py-2 px-4">{involucrados.rut_involucrado}</td>
                                            <td className="py-2 px-4">{involucrados.codigo_funcionario}</td>
                                            <td className="py-2 px-4">{involucrados.dotacion}</td>
                                            <td className="py-2 px-4">
                                                {involucrados.sancion ? (
                                                    <strong className='text-red-600'>Sanción aplicada</strong>
                                                ) : (

                                                    <div className="flex justify-center space-x-2">
                                                        {/* agregar botones */}
                                                        <Link
                                                            to={`/procesosDisciplinarios/sancionarFalta/verSancionarFalta/${falta.id}/involucrado/${involucrados.id}`}
                                                            className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105"
                                                        >
                                                            Sancionar
                                                        </Link>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-2 text-center" colSpan="5">Sin registros encontrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                    <div className="flex items-center justify-center p-2 mt-2">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAgregarInvolucradosClick();
                            }}
                            className="px-2 py-1 bg-green-700 text-white font-semibold rounded hover:bg-green-500 transform transition duration-300 hover:scale-105"
                        >
                            Agregar Involucrados
                        </a>
                    </div>
                </div>

                {/* Mostrar las sanciones relacionadas */}
                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Sanciones Aplicadas</h4>
                    </div>

                    {asesorJuridico.length > 0 ? (
                        asesorJuridico.map((asesoresJuridicos) => (
                            <div key={asesoresJuridicos.id} className=" mb-2 mt-5 rounded-lg  border-gray-300">
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
                                                                        href={`${url}/uploads/${falta.numero_rol}/${asesoresJuridicos.documento_informe_juridico}`}
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

                                                    {/* controla la informacion que contiene cada tarjeta informativa */}
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


                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                    </div>
                    {estadoProceso !== "Cerrado" ? (
                        <div className="flex justify-center">

                            <button
                                className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                                type="button"
                                onClick={() => handleProcesoAdministrativoClick()}
                            >
                                Proceso administrativo
                            </button>
                            <button
                                className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                                type="button"
                                onClick={() => handleAsesorJurudicoClick()}
                            >
                                Asesor jurídico
                            </button>
                            <button
                                onClick={() => handleSuspensionDelProcedimientoClick()}
                                className='bg-green-700 mr-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                                type="button"
                            >
                                Suspensión del procedimiento
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-gray-700">El proceso está cerrado y no se pueden realizar acciones.</p>
                    )}
                </div>
            </form>

            {/* Espacio para los modal */}
            <ModalSuspensionDelProcedimiento openModalSuspensionDelProcedimiento={openModalSuspensionDelProcedimiento} id={id} closeModalSuspensionDelProcedimiento={closeModalSuspensionDelProcedimiento} />
            <ModalProcesoAdministrativo openModalProcesoAdministrativo={openModalProcesoAdministrativo} id={id} closeModalProcesoAdministrativo={closeModalProcesoAdministrativo} />
            <ModalAsesorJuridico openModalAsesorJurudico={openModalAsesorJurudico} id={id} closeModalAsesorJurudico={closeModalAsesorJurudico} numeroRolFalta={numeroRolFalta} />
            <ModalAgregarInvolucradoView openAgregarInvolucrado={openModalAgregarInvolucrados} id={id} numeroRolFalta={numeroRolFalta}  closeAgregarInvolucrados={closeModalAgregarInvolucrados} getFaltaById={getFaltaById} />

        </div>
    )
}

export default VerSancionarFalta

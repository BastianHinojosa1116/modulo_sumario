import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ModalSuspensionDelProcedimiento from '../sancionarFaltaComponent/ModalSuspensionDelProcedimientoSancionarFalta'; // Importa el componente Modalsuspenciondel procedimiento
import ModalProcesoAdministrativo from '../sancionarFaltaComponent/ModalProcesoAdministrativoSancionarFalta'; // Importa el componente ModalProcesoAdministrativo
import ModalAsesorJuridico from '../sancionarFaltaComponent/ModalAsesorJuridicoSancionarFalta'; // Importa el componente ModalAsesorJuridico
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Alertas from '../../animacionEstilos/Alertas';
import Swal from 'sweetalert2';

function VerFaltaAsesorJuridico() {
    const { id } = useParams()
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const [involucrado, setInvolucrado] = useState([]);
    const [falta, setFalta] = useState([]);
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

        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('fecha_informe_juridico', fechaInformeJuridico);
        formData.append('documento_informe_juridico', documentoInformeJuridico);

        try {
            const response = await axios.post(`${endpointInformeJuridico}${id}`, formData, config);

            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Informe cargado',
                    text: 'Se ha cargado el informe jurídico exitosamente".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/asesorJuridico');
                });
            }

        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errores = error.response.data.errors;
                let mensajesDeError = '';

                Object.keys(errores).forEach(campo => {
                    if (Array.isArray(errores[campo])) {
                        errores[campo].forEach(mensaje => {
                            mensajesDeError += `<li>${mensaje}</li>`; // Usamos <li> para cada mensaje
                        });
                    } else {
                        mensajesDeError += `<li>${errores[campo]}</li>`;
                    }
                });

                // Mostrar los errores en una alerta de SweetAlert con formato HTML
                Swal.fire({
                    title: 'Errores de validación',
                    html: `<ul style="text-align: left;">${mensajesDeError}</ul>`, // Lista ordenada con los errores
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al intentar cargar el informe jurídico. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickCargarInformeJuridico = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar cargará el informe jurídico. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleInformeJuridico(); // Solo ejecuta si se confirma
            }
        });
    };

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
                                                            to={`/procesosDisciplinarios/asesorJuridico/verSancionAsesorJuridico/${falta.id}/involucrado/${involucrados.id}`}
                                                            className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105"
                                                        >
                                                            Ver Información
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
                </div>

                {/* Mostrar las sanciones relacionadas */}
                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Asesor juridico designado</h4>
                    </div>

                    {asesorJuridico && asesorJuridico.length > 0 ? (
                        asesorJuridico.map((asesoresJuridicos) => (
                            <div key={asesoresJuridicos.id} className=" mb-2 mt-5 rounded-lg">
                                {asesoresJuridicos.tipo_sancion === "Asesor Juridico" ? (


                                    <div className="w-full mx-auto border-2 border-gray-300 bg-white shadow-sm rounded-lg overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row">
                                                {/* src="https://c1.klipartz.com/pngpicture/823/765/sticker-png-login-icon-system-administrator-user-user-profile-icon-design-avatar-face-head.png" */}

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
                                                {!asesoresJuridicos.documento_informe_juridico ? (
                                                    <div className="w-full md:w-2/5 flex justify-start ml-0 md:ml-8 p-4 border rounded-md border-gray-300 shadow-md">
                                                        <div className="w-full">
                                                            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">Carga de informe jurídico</h2>
                                                            <p className='font-serif text-center text-gray-500 mb-4'>El asesor jurídico debe cargar el informe jurídico para finalizar la sanción.</p>
                                                            <div className='border rounded-md border-gray-300 shadow-md p-4'>
                                                                <div className="flex items-center w-full">
                                                                    <input
                                                                        type="file"
                                                                        accept="application/pdf"
                                                                        className="w-10/12 border border-gray-300 rounded-lg p-2 mt-4 mb-4"
                                                                        onChange={handleChangeDocumentoInformeJuridico}
                                                                    />
                                                                    <button
                                                                        className='bg-green-700 ml-2 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                                                                        type="button"
                                                                        onClick={handleButtonClickCargarInformeJuridico}

                                                                    >
                                                                        Cargar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
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
                                                                            href={`${url}/uploads/${falta.numero_rol}/${informeJuridicoAplicado}`}
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
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No existen faltas asignadas a asesor jurídico.</p>
                    )}

                </div>
            </form>

            {/* Espacio para los modal */}
            <ToastContainer />
        </div>
    )
}

export default VerFaltaAsesorJuridico

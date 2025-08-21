import React, { useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function FormAplicarSancion({ id, closeModalAplicarSancion, }) {

    const [sanciones, setSanciones] = useState('');
    const [fechaSancion, setFechaSancion] = useState('');
    const [pdfResolucion, setPdfResolucion] = useState(null);
    const [diasArresto, setDiasArresto] = useState('');
    const diasArrestoFinal = diasArresto || 0;
    const navigate = useNavigate();
    const [noConformeButton, setNoConformeButton] = useState(false);
    const [opcionUnoButton, setOpcionUnoButton] = useState(false);
    const [opcionDosButton, setOpcionDosButton] = useState(false);
    const [opcionTresButton, setOpcionTresButton] = useState(false);
    //sancion de cada involucrado
    const [verSancionInvolucrado, setVerSancionInvolucrado] = useState([]);
    const [error, setError] = useState(null);
    const [idSancion, setIdSancion] = useState('');

    const [recursoNoPresenta, setRecursoNoPresenta] = useState('');
    const [recursoPresenta, setRecursoPresenta] = useState('');
    const [resolucionRecurso, setResolucionRecurso] = useState('');
    //endpoints de conexion a la base de datos
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/resolverFalta/aplicarSancion/aplicarSancion/`;
    const endpointConforme = `${url}/api/resolverFalta/aplicarSancion/sancionConforme/`;

    const endpointNoPresentaRecurso = `${url}/api/resolverFalta/aplicarSancion/noPresentaRecurso/`;
    const endpointPresentaRecurso = `${url}/api/resolverFalta/aplicarSancion/presentaRecurso/`;
    const sancionEndpoint = `${url}/api/resolverFalta/aplicarSancion/VerInformacionDeLaSancion/`;

    //Configuracion de botones de accion en Formularios

    //Inicio boton no conforme
    const ActivaConforme = (e) => {
        e.preventDefault();
        setNoConformeButton(true);
        setOpcionTresButton(true);
    };
    const DesactivaConforme = (e) => {
        e.preventDefault();
        setNoConformeButton(false);
        setOpcionUnoButton(false);
        setOpcionDosButton(false);
        setOpcionTresButton(false);
    };

    //Inicio boton uno del formulario
    const ActivaBotonUno = (e) => {
        e.preventDefault();
        setOpcionUnoButton(true);
        setOpcionDosButton(false);
        setOpcionTresButton(false);
    };

    //Inicio boton uno del formulario
    const ActivaBotonDos = (e) => {
        e.preventDefault();
        setOpcionDosButton(true);
        setOpcionUnoButton(false);
        setOpcionTresButton(false);

    };

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleChangePdfResolucion = (e) => {
        setPdfResolucion(e.target.files[0]);
    };

    const handleChangeResolucionRecurso = (e) => {
        setResolucionRecurso(e.target.files[0]);
    };

    const handleChangeRecursoNoPresenta = (event) => {
        setRecursoNoPresenta(event.target.value);
    };

    const handleChangeRecursoPresenta = (event) => {
        setRecursoPresenta(event.target.value);
    };

    const handleAplicarSancion = async (e) => {
        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('id_sancion', idSancion);
        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);

        try {
            const response = await axios.post(`${endpoint}${id}`, formData, config);

            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción notificada',
                    text: 'Se ha notificado la sanción como "Sin ulterior recurso".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/resolverFalta');
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
                    text: 'Hubo un error al intentar notificar la sanción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickSinUlteriorRecurso = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se notificara la sanción como "Sin ulterior recurso" y el estado del caso cambiara a Cerrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancion(); // Solo ejecuta si se confirma
            }
        });
    };

    const handleAplicarSancionConforme = async (e) => {
        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('id_sancion', idSancion);
        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);

        try {
            const response = await axios.post(`${endpointConforme}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción notificada',
                    text: 'Se ha notificado la sanción como "Conforme".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/resolverFalta');
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
                    text: 'Hubo un error al intentar notificar la sanción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickConforme = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se notificara la sanción como "Conforme" y el estado del caso cambiara a Cerrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancionConforme(); // Solo ejecuta si se confirma
            }
        });
    };

    const handleAplicarSancionNoPresentaRecurso = async (e) => {

        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('id_sancion', idSancion);
        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);
        formData.append('recurso', recursoNoPresenta);

        try {
            const response = await axios.post(`${endpointNoPresentaRecurso}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción notificada',
                    text: 'Se ha notificado la sanción como "No presenta escrito".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/resolverFalta');
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
                    text: 'Hubo un error al intentar notificar la sanción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickNoPresentaRecurso = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se notificara la sanción como "No presenta escrito" y el estado cambiara a Cerrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancionNoPresentaRecurso(); // Solo ejecuta si se confirma
            }
        });
    };

    const handleAplicarSancionPresentaRecurso = async (e) => {

        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('id_sancion', idSancion);
        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);
        formData.append('recurso', recursoPresenta);
        formData.append('resolucion_recurso', resolucionRecurso);

        try {
            const response = await axios.post(`${endpointPresentaRecurso}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción notificada',
                    text: 'Se ha notificado la sanción como "Presenta escrito".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/resolverFalta');
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
                    text: 'Hubo un error al intentar notificar la sanción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickPresentaRecurso = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se notificara la sanción como "Presenta escrito" y el estado cambiara a En inpugnación. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancionPresentaRecurso(); // Solo ejecuta si se confirma
            }
        });
    };

    const fetchUltimaSancion = async () => {
        try {
            const response = await axios.get(`${sancionEndpoint}${id}`);
            if (response.data.success) {
                setVerSancionInvolucrado(response.data.ultima_sancion);
                setIdSancion(response.data.ultima_sancion.id);
                setSanciones(response.data.ultima_sancion.sancion);

                console.log(verSancionInvolucrado.sancion, "hola mundo loco");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Error al obtener la sanción');
        }
    };
    //Fin de obtiene la informacion del usuario por el id *********************

    useEffect(() => {
        setFechaSancion(obtenerFechaDeHoy());
        fetchUltimaSancion();
    }, [id]);

    console.log(idSancion, "hola mundo loco");
    return (
        <div>
            <form>
                <div className='ml-6 mr-6 mt-2 mb-4 p-6 bg-white rounded-lg border-2 border-gray-300'>
                    {!noConformeButton ? (
                        <div>
                            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                                <h4 className="text-2xl text-gray-700 font-bold text-center">Notificar Sanción</h4>
                            </div>
                            <p className="font-serif text-center text-gray-500 mb-4">
                                Seleccione una opción para recurrir a un recurso, debe cargar un documento basado en el tipo de recurso seleccionado.
                            </p>
                            <div className="border-2 border-gray-300 rounded-lg ml-6 mr-6">
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 p-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                                            <strong className="text-lg">Sanción:</strong> {verSancionInvolucrado.sancion}
                                        </label>
                                    </div>
                                    {verSancionInvolucrado.dias_arresto >= 1 && (
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                                <strong className="text-lg">Días de Arresto:</strong> {verSancionInvolucrado.dias_arresto}
                                            </label>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="documentoInformaFalta">
                                            <strong className="text-lg">Resolución:</strong>
                                            <a
                                                href={`${url}/uploads/${verSancionInvolucrado.numero_rol_falta}/${verSancionInvolucrado.resolucion_sancion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                                            >
                                                Descargar
                                                <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {!opcionUnoButton ? (
                        null
                    ) : (
                        <div className='ml-6 mr-6 mt-2 mb-4 p-6 bg-white rounded-lg border-2 border-gray-300'>
                            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                                <h4 className="text-2xl text-gray-700 font-bold text-center">No conforme</h4>
                            </div>
                            <p className='font-serif text-center text-gray-500 mb-8'>Seleccione una opción, cabe recordar que la opción seleccionada cerrara el proceso. </p>
                            <div className="border-2 border-gray-300 rounded-lg mb-4">
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 p-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                                            <strong className="text-lg">Sanción:</strong> {verSancionInvolucrado.sancion}
                                        </label>
                                    </div>
                                    {verSancionInvolucrado.dias_arresto >= 1 && (
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                                <strong className="text-lg">Días de Arresto:</strong> {verSancionInvolucrado.dias_arresto}
                                            </label>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2 " htmlFor="documentoInformaFalta">
                                            <strong className="text-lg">Resolución:</strong>
                                            <a
                                                href={`${url}/uploads/${verSancionInvolucrado.numero_rol_falta}/${verSancionInvolucrado.resolucion_sancion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                                            >
                                                Descargar
                                                <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
                                <div className="flex flex-col ml-1 mr-6 mb-6">
                                    <label htmlFor="recurso" className="block text-gray-700 font-bold mb-0">
                                        Escrito:
                                    </label>
                                    <div className="flex items-center">
                                        <select
                                            id="recurso"
                                            name="recurso"
                                            className="mt-2 p-2 py-2 bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 block w-9/12 rounded-md sm:text-sm overflow-hidden"
                                            value={recursoNoPresenta}
                                            onChange={handleChangeRecursoNoPresenta}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="No presenta recurso">No presenta escrito</option>
                                            <option value="Recurso fuera de plazo">Escrito fuera de plazo</option>
                                            {/* Agrega más opciones según sea necesario */}
                                        </select>
                                        <button
                                            className="bg-green-700 ml-4 hover:bg-green-500 text-white text-sm px-4 py-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-500"
                                            type="button"
                                            onClick={handleButtonClickNoPresentaRecurso}
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {!opcionDosButton ? (

                        null
                    ) : (
                        <div className='ml-6 mr-6 mt-2 mb-4 p-6 bg-white rounded-lg border-2 border-gray-300'>
                            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                                <h4 className="text-2xl text-gray-700 font-bold text-center">No conforme</h4>
                            </div>
                            <p className='font-serif text-center text-gray-500 mb-4'>Seleccione una opción para recurrir a un recurso, debe cargar un documento  basado en el recurso seleccionado </p>
                            <div className="border-2 border-gray-300 rounded-lg mb-4">
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 p-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                                            <strong className="text-lg">Sanción:</strong> {verSancionInvolucrado.sancion}
                                        </label>
                                    </div>
                                    {verSancionInvolucrado.dias_arresto >= 1 && (
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                                <strong className="text-lg">Días de Arresto:</strong> {verSancionInvolucrado.dias_arresto}
                                            </label>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2 " htmlFor="documentoInformaFalta">
                                            <strong className="text-lg">Resolución:</strong>
                                            <a
                                                href={`${url}/uploads/${verSancionInvolucrado.numero_rol_falta}/${verSancionInvolucrado.resolucion_sancion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                                            >
                                                Descargar
                                                <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-1 mr-2 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="edad">
                                        Recurre a recurso:
                                    </label>
                                    <select
                                        id="recurso"
                                        name="recurso"
                                        className="mt-2 p-2 py-2 bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md sm:text-sm overflow-hidden"
                                        onChange={handleChangeRecursoPresenta}
                                        value={recursoPresenta}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="Recurso jerárquico">Recurre a recurso jerárquico</option>
                                        <option value="Recurso apelación">Recurre a recurso apelación</option>
                                        <option value="Recurso de reposición">Recurre a recurso de reposición</option>
                                        <option value="Recurso de reposición con jerárquico en subsidio">Recurre a recurso de reposición con jerárquico en subsidio</option>
                                        {/* Agrega más opciones según sea necesario */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="documentoInformaFalta">
                                        Escrito:
                                    </label>
                                    <input
                                        className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                        type="file"
                                        id="documentoInformaFalta"
                                        onChange={handleChangeResolucionRecurso}
                                    />
                                </div>
                                <div className='flex '>
                                    <button
                                        className='bg-green-700 mr-2 mt-8 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                                        type="button"
                                        onClick={handleButtonClickPresentaRecurso}
                                    >
                                        Guardar escrito
                                    </button>
                                </div>
                            </div>


                        </div>
                    )}

                    {!opcionTresButton ? (
                        null
                    ) : (
                        <div className='ml-6 mr-6 mt-2 mb-4 p-7 bg-white rounded-lg border-2 border-gray-300'>

                            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                                <h4 className="text-2xl text-gray-700 font-bold text-center">No conforme</h4>
                            </div>
                            <p className='font-serif text-center text-gray-500 mb-8'>Seleccione una opción de la botonera de acciones, cabe recordar que la opción seleccionada realiza una acción distinta. </p>
                            <div className="border-2 border-gray-300 rounded-lg mb-4">
                                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 p-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                                            <strong className="text-lg">Sanción:</strong> {verSancionInvolucrado.sancion}
                                        </label>
                                    </div>
                                    {verSancionInvolucrado.dias_arresto >= 1 && (
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                                <strong className="text-lg">Días de Arresto:</strong> {verSancionInvolucrado.dias_arresto}
                                            </label>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-bold mb-2 " htmlFor="documentoInformaFalta">
                                            <strong className="text-lg">Resolución:</strong>
                                            <a
                                                href={`${url}/uploads/${verSancionInvolucrado.numero_rol_falta}/${verSancionInvolucrado.resolucion_sancion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                                            >
                                                Descargar
                                                <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='overflow-hidden mt-4 mb-6 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                    </div>
                    <div className="flex justify-center">
                        {!noConformeButton ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleButtonClickSinUlteriorRecurso}
                                    className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                                >
                                    Sin Ulterior Recurso
                                </button>
                                <button
                                    className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                                    type="button"
                                    onClick={handleButtonClickConforme}
                                >
                                    Conforme
                                </button>
                                <button
                                    className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                                    type="button"
                                    onClick={ActivaConforme}
                                >
                                    No conforme
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className='bg-blue-600 mr-2 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-500'
                                    type="button"
                                    onClick={ActivaBotonUno}
                                >
                                    No presenta escrito
                                </button>
                                <button
                                    className='bg-blue-600 mr-2 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-500'
                                    type="button"
                                    onClick={ActivaBotonDos}
                                >
                                    Presenta escrito
                                </button>
                                <button
                                    className='bg-gray-500 ml-2 mr-2 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-500'
                                    type="button"
                                    onClick={DesactivaConforme}
                                >
                                    Volver
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </form>
            <ToastContainer />
        </div>

    )
}

export default FormAplicarSancion

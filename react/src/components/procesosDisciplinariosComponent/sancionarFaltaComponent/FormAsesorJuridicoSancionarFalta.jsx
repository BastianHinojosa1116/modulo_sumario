import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';

function FormAsesorJuridicoSancionarFalta({ closeModalAsesorJurudico, id, numeroRolFalta }) {
    const navigate = useNavigate();
    const [documentoDisponeAsesor, setDocumentoDisponeAsesor] = useState(null);
    const [isVisibleButtonDesignar, setIsVisibleButtonDesignar] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [fechaAsesorJuridico, setFechaAsesorJuridico] = useState('');
    const { url } = useStateContext(); // Cambiado aquí
    const endpointAsignarAsesorJuridico = `${url}/api/procesosDisciplinarios/sancionarFalta/asesorJuridico/`;
    const [buscarRut, setBuscarRut] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const userEndpoint =`${url}/api/procesosDisciplinarios/obtenerAsesorJuridico`;


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

    const handleBuscarRut = async () => {
        try {
            console.log('Buscando persona con RUT:', buscarRut); // Verifica el RUT que estás enviando
            const response = await axios.get(userEndpoint, {
                params: { rut: buscarRut }
            });

            console.log('Respuesta de la API:', response); // Verifica la respuesta de la API

            if (response.status === 200) {
                setUserData(response.data);
                setError(''); // Limpiar cualquier error anterior
            } else {
                setUserData(null);
                setError('Persona no encontrada');
            }
        } catch (err) {
            console.error('Error en la solicitud:', err); // Muestra cualquier error en la solicitud
            setUserData(null);
            setError('Error al obtener la persona');
        }
    };

    const handleChangedocumentoDisponeAsesor = (e) => {
        setDocumentoDisponeAsesor(e.target.files[0]);
        setIsVisibleButtonDesignar(true);
    };

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy}`;
    };



    const handleChangeFechaAsesorJuridico = (e) => {
        setFechaAsesorJuridico(e.target.value);
    };

    // const buscarUsuario = async () => {
    //     try {
    //         const urlUser = `http://autentificaticapi.carabineros.cl/api/auth/user-full/${buscarRut}`;
    //         const token = localStorage.getItem("TOKEN");

    //         if (!token) {
    //             setError("No se encontró un token de autorización en el localStorage.");
    //             return;
    //         }

    //         const setting = {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 Accept: 'application/json',
    //             },
    //         };

    //         const resp = await axios.get(urlUser, setting);
    //         //maikol
    //         console.log(resp.data.success)
    //         if (resp && resp.data.success) {
    //             setUserData(resp.data.success.user);
    //             console.log(resp.data.success.user, "aaaaaaaa")
    //             setError(null); // Limpiar cualquier error anterior
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.data) {
    //             setError(error.response.data.errors.rut);
    //             console.log(error.response.data.errors.rut)
    //             setUserData(null); // Limpiar datos anteriores si hubo un error
    //         }
    //     }
    // };

    const handleAsignarAsesorJuridico = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('nombre', `${userData.primer_nombre} ${userData.segundo_nombre} ${userData.apellido_paterno} ${userData.apellido_materno} `);
        formData.append('rut', buscarRut);
        formData.append('primer_nombre', userData.primer_nombre);
        formData.append('segundo_nombre', userData.segundo_nombre);
        formData.append('apellido_paterno', userData.apellido_paterno);
        formData.append('apellido_materno', userData.apellido_materno);
        formData.append('codigo_funcionario', userData.codigo_funcionario);
        formData.append('correo_institucional', userData.correo_institucional);
        formData.append('grado', userData.grado);
        formData.append('codigo_alta_reparticion', userData.codigo_alta_reparticion);
        formData.append('descripcion_alta_reparticion', userData.descripcion_alta_reparticion);
        formData.append('descripcion_reparticion', userData.descripcion_reparticion);
        formData.append('codigo_reparticion', userData.codigo_reparticion);
        formData.append('descripcion_unidad', userData.descripcion_unidad);
        formData.append('codigo_unidad', userData.codigo_unidad);
        formData.append('descripcion_destacamento', userData.descripcion_destacamento);
        formData.append('codigo_destacamento', userData.codigo_destacamento);
        formData.append('codigo_dotacion', userData.codigo_dotacion);
        formData.append('dotacion', userData.dotacion);
        formData.append('numero_rol_falta', numeroRolFalta);
        formData.append('fecha_asesor_juridico', fechaAsesorJuridico);
        formData.append('documento_dispone_asesor', documentoDisponeAsesor);

        try {
            const resp = await axios.post(`${endpointAsignarAsesorJuridico}${id}`, formData, config);
            console.log("gg ", resp.data.message)
            // // Guardar mensaje de alerta en sessionStorage
            sessionStorage.setItem('alertMessage', resp.data.message);
            //Alertas.success(resp.data.message);
            closeModalAsesorJurudico();
            // // Redirigir a otra vista
            navigate('/procesosDisciplinarios/sancionarFalta');
        } catch (error) {
            console.error("Error aplicando sanción", error.response);
            Alertas.error(error.response);
        }
    }

    useEffect(() => {
        if (error) {
            setIsVisible(true);
            const timeoutId = setTimeout(() => {
                setError(null);
                setIsVisible(false);
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
        setFechaAsesorJuridico(obtenerFechaDeHoy());
    }, [error]);
console.log(userData)
    return (
        <div>
            <div className='ml-6 mr-6 mt-6 mb-4 p-8 bg-white rounded-lg border-2 border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-10">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Asesor jurídico</h4>
                </div>

                <div className="space-y-2 w-full  p-4 px-8 rounded-lg border border-gray-400 shadow-md">
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700  font-bold text-center">Buscar Funcionario</h4>
                    </div>
                    <div className="flex space-x-4"> {/* Utilizamos flex para colocar los elementos en línea */}
                        <input
                            type="text"
                            placeholder="Ingrese un rut"
                            value={buscarRut}
                            onChange={(e) => setBuscarRut(e.target.value)}
                            className='mt-1 px-3 py-1 bg-white border shadow-border-slate-300 border-gray-400 placeholder-slate-700 focus:outline-none focus:border-primary-900 focus:ring-primary-300 block w-full rounded-md sm:text-sm focus:ring-1'
                        />
                        <button onClick={handleBuscarRut} className="bg-green-700 hover:bg-green-500 text-white px-4 py-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500">
                            Buscar
                        </button>
                    </div>
                    <div className={`text-white bg-red-500 p-1 rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <p className='ml-4'>
                            {error}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mr-6 ml-6 mb-2 mt-2 rounded-lg border-2 border-gray-300">
                <div className="w-full mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-0 ml-2 mr-2 border border-gray-400 rounded-lg">
                            <div className="flex justify-start border-b-2 border-gray-200 p-4 shadow-md">
                                <div className="mb-2 sm:mb-0 sm:flex-shrink-0 sm:mr-4">
                                    <img
                                        src="/src/assets/AsesorJuridico.png"
                                        alt="Usuario"
                                        className="max-w-40 h-40 ml-6 mt-4 mr-6 object-cover border-2 rounded-full border-gray-300"
                                    />
                                </div>
                                <div className=' justify-start mt-1 '>
                                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Información del asesor jurídico</h2>
                                    {userData ? (
                                        <div>
                                            <p className="text-gray-700 py-1">
                                                <span className="font-bold">Nombre:</span> {`${userData.primer_nombre} ${userData.segundo_nombre} ${userData.apellido_paterno} ${userData.apellido_materno}`}
                                            </p>
                                            <p className="text-gray-700 py-1">
                                                <span className="font-bold">Rut:</span> {userData.rut}
                                            </p>
                                            <p className="text-gray-700 py-1">
                                                <span className="font-bold">Código de funcionario:</span> {userData.codigo_funcionario}
                                            </p>
                                            <p className="text-gray-700 py-1">
                                                <span className="font-bold">Grado:</span> {userData.grado}
                                            </p>
                                            <p className="text-gray-700 py-1">
                                                <span className="font-bold">Dotación:</span> {userData.dotacion}
                                            </p>
                                            <div className="flex items-center">
                                                <label className="block text-gray-700 font-bold mr-2" htmlFor="documentoInformaFalta">
                                                    Doc. dispone revisión:
                                                </label>
                                                <input
                                                    className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                                    type="file"
                                                    id="documentoDisponeAsesor"
                                                    onChange={handleChangedocumentoDisponeAsesor}
                                                />
                                                <input
                                                    className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                                    type="hidden"
                                                    id="fechaAsesorJuridico"
                                                    onChange={handleChangeFechaAsesorJuridico}
                                                    value={fechaAsesorJuridico}
                                                    min={obtenerFechaDeHoy()} // Bloquea las fechas anteriores a hoy
                                                    max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-red-500 py-1 font-serif">Debe ingresar un rut para mostrar la información</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='overflow-hidden mt-4 mb-8 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                <div className="flex justify-center">

                    <div
                        className={`transition-opacity duration-500 ${isVisibleButtonDesignar ? 'opacity-100' : 'opacity-0'}`}
                        style={{ visibility: isVisibleButtonDesignar ? 'visible' : 'hidden' }}
                    >
                        <button
                            className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-primary-600 transition duration-500'
                            type="button"
                            onClick={(e) => {
                                handleAsignarAsesorJuridico(e);
                            }}
                        >
                            Designar
                        </button>
                    </div>

                    <button
                        className='bg-gray-500 mr-2 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={() => closeModalAsesorJurudico()}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormAsesorJuridicoSancionarFalta

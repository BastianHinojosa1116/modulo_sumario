import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url

function FormAgregarInvolucradoSancionarFalta({ id, closeAgregarInvolucrados, getFaltaById }) {

    const [buscarRut, setBuscarRut] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [involucrado, setInvolucrado] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/procesosDisciplinarios/sancionarFalta/agregarInvolucrado/`;

    const handleAgregarInvolucrado = async (e) => {

        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('nombre', `${userData.apellido_materno} ${userData.apellido_paterno} ${userData.primer_nombre} ${userData.segundo_nombre}`),
            formData.append('codigo_funcionario', userData.codigo_funcionario),
            formData.append('rut', formatRut(userData.rut)),
            formData.append('primer_nombre', userData.apellido_materno),
            formData.append('segundo_nombre', (userData.apellido_paterno) ? userData.apellido_paterno : "."),
            formData.append('apellido_paterno', userData.primer_nombre),
            formData.append('apellido_materno', (userData.segundo_nombre) ? userData.segundo_nombre : "."),
            formData.append('correo_institucional', (userData.correo_institucional) ? userData.correo_institucional : userData.correo_particular),
            formData.append('codigo_alta_reparticion', userData.codigo_alta_reparticion),
            formData.append('descripcion_alta_reparticion', userData.descripcion_alta_reparticion),
            formData.append('descripcion_reparticion', (userData.descripcion_reparticion) ? userData.descripcion_reparticion : ""),
            formData.append('codigo_reparticion', (userData.codigo_reparticion) ? userData.codigo_reparticion : ""),
            formData.append('descripcion_unidad', (userData.descripcion_unidad) ? userData.descripcion_unidad : ""),
            formData.append('codigo_unidad', (userData.codigo_unidad) ? userData.codigo_unidad : ""),
            formData.append('descripcion_destacamento', (userData.descripcion_destacamento) ? userData.descripcion_destacamento : ""),
            formData.append('codigo_destacamento', (userData.codigo_destacamento) ? userData.codigo_destacamento : ""),
            formData.append('codigo_dotacion', userData.codigo_dotacion),
            formData.append('dotacion', userData.dotacion),
            formData.append('escalafon', userData.escalafon),
            formData.append('rut', buscarRut),
            formData.append('grado', userData.grado)

        try {
            const response = await axios.post(`${endpoint}${id}`, formData, config);
            if (response.data && response.data.message) {
                // sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Involucrado agregado',
                    text: 'Se ha agregado un nuevo involucrado a la falta.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // navigate('/procesosDisciplinarios/resolverFalta');
                    getFaltaById();
                    closeAgregarInvolucrados();
                });
            }

        } catch (error) {
            // Verificar si el error proviene del backend y contiene un mensaje específico
            if (error.response && error.response.data) {
                const errorMsg = error.response.data.error; // Asegurarnos de que Laravel devuelve el mensaje en "error"

                // Mostrar el mensaje de error específico en SweetAlert
                Swal.fire({
                    title: 'Error',
                    text: errorMsg || 'Hubo un error al intentar agregar el involucrado. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al intentar agregar el involucrado. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickAgregarInvolucrado = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar será agregado el involucrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAgregarInvolucrado(); // Solo ejecuta si se confirma
            }
        });
    };

    const buscarUsuario = async () => {
        try {
            const urlUser = `http://autentificaticapi.carabineros.cl/api/auth/user-full/${buscarRut}`;
            const token = localStorage.getItem("TOKEN");

            if (!token) {
                setError("No se encontró un token de autorización en el localStorage.");
                return;
            }

            const setting = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            };

            const resp = await axios.get(urlUser, setting);
            //maikol
            console.log(resp.data.success, "maikol  log ")
            if (resp && resp.data.success) {
                setUserData(resp.data.success.user);
                setError(null); // Limpiar cualquier error anterior
            }
        } catch (error) {
            console.log(error, "hola")
            if (error.response && error.response.data) {
                setError(error.response.data.errors.rut);


                console.log(error.response.data.errors.rut)
                setUserData(null); // Limpiar datos anteriores si hubo un error
            }
        }
    }

    const formatRut = (rut) => {
        // Eliminar caracteres no numéricos y dejar solo dígitos y la letra K (si existe)
        let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

        // Verificar si el RUT es válido
        if (!/^[0-9]+[0-9kK]*$/.test(cleanRut)) {
            // RUT inválido, devolver el valor original
            return rut;
        }

        // Eliminar el "0" al principio del RUT
        cleanRut = cleanRut.replace(/^0+/, '');

        return cleanRut;
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
    }, [error]);

    return (
        <div>
            <div className='mt-5 mb-5 lg:ml-16 lg:mr-16 sm:ml-16 sm:mr-16 sm:mt-8 sm:mb-8'>
                {/* Contenido para buscar involucrado */}
                <div className="space-y-6 w-full  bg-gray-100 p-8 px-8 rounded-lg shadow-md border border-gray-300">
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700  font-bold text-center">Buscar involucrado</h4>
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Ingrese un rut"
                            value={buscarRut}
                            onChange={(e) => setBuscarRut(e.target.value)}
                            className='mt-1 px-3 py-2  bg-white border
                                shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                                focus:ring-primary-500 block w-full rounded-md sm:text-sm'
                        />
                        <button
                            onClick={buscarUsuario}
                            disabled={!buscarRut.trim()} // Deshabilitar el botón si buscarRut está vacío o solo contiene espacios en blanco
                            className={`bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                                ${!buscarRut.trim() ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary-600 transition duration-500'}`}
                            type="button"
                        >
                            Buscar
                        </button>
                    </div>
                    <div className={`text-white bg-red-500 p-2 mt-2 rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {error}
                    </div>

                    <div
                            className={`transition-all duration-700 ease-in-out ${userData ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
                                } delay-200`}
                        >
                    {userData && (
                            <div className="mb-4 border-2 border-gray-400 rounded-lg">
                                <div className="flex justify-between border-b-2 border-gray-200 p-2 shadow-md">
                                    <div className="mb-1 sm:mb-0 sm:flex-shrink-0 sm:mr-6 mt-6">
                                        <img
                                            src="/src/assets/UserM.svg"
                                            alt="Usuario"
                                            className="max-w-40 h-40 ml-6 object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="justify-start mt-1 mr-32">
                                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                            Información del involucrado
                                        </h2>
                                        <p className="text-gray-700 py-1">
                                            <span className="font-bold">Rut:</span> {userData.rut}
                                        </p>
                                        <p className="text-gray-700 py-1">
                                            <span className="font-bold">Nombre:</span> {userData.apellido_materno} {userData.apellido_paterno} {userData.primer_nombre} {userData.segundo_nombre}
                                        </p>
                                        <p className="text-gray-700 py-1">
                                            <span className="font-bold">Código de funcionario:</span> {userData.codigo_funcionario}
                                        </p>
                                        <p className="text-gray-700 py-1">
                                            <span className="font-bold">Dotación:</span> {userData.dotacion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    )}
                    </div>
                    <div className="flex items-center justify-center">
                    <div className={`transition-all duration-500 ease-in-out ${userData ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`} >
                        {userData && (
                                <button
                                    type="button"
                                    onClick={handleButtonClickAgregarInvolucrado}
                                    className={`mt-4 flex justify-center mr-4 rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-500 ease-in-out lg:w-44 lg:text-center
                                ${userData ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}
                                >
                                    Agregar involucrado
                                </button>
                        )}
                        </div>
                        <button
                            type="button"
                            onClick={closeAgregarInvolucrados}
                            className="mt-4 flex justify-center  rounded-md bg-gray-500 hover:bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition duration-500 lg:w-44 lg:text-center"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormAgregarInvolucradoSancionarFalta

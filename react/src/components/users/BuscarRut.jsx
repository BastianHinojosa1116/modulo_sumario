import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../../contexts/ContextProvider'; // Cambiado aquí

function BuscarRut({ getUsers, closeModal, notificationCreate }) {

    const [buscarRut, setBuscarRut] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/user`;

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

    const store = async (e) => {
    e.preventDefault();

    // Obtén el token almacenado en localStorage
    const token = localStorage.getItem("TOKEN");

    if (!token) {
        setError("No se encontró un token de autorización en el localStorage.");
        return;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };

    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    try {
        const response = await axios.post(
            endpoint,
            {
                name: userData.apellido_materno + " " + userData.primer_nombre + " " + userData.segundo_nombre,
                rut: formatRut(userData.rut),
                codigo_funcionario: userData.codigo_funcionario,
                grado: userData.grado,
                dotacion: userData.dotacion,
                codigo_dotacion: userData.codigo_dotacion,
                correo_institucional: userData.correo_institucional,
                codigo_alta_reparticion: userData.codigo_alta_reparticion,
                descripcion_alta_reparticion: userData.descripcion_alta_reparticion,
                descripcion_reparticion: userData.descripcion_reparticion,
                codigo_reparticion: userData.codigo_reparticion,
                codigo_unidad: userData.codigo_unidad,
                descripcion_unidad: userData.descripcion_unidad,
                codigo_destacamento: userData.codigo_destacamento,
                descripcion_destacamento: userData.descripcion_destacamento,
                user_name: user.name,
                user_rut: user.rut,
                escalafon: userData.escalafon,
                apellido_materno: userData.apellido_materno,
                apellido_paterno: userData.apellido_paterno || ".",
                primer_nombre: userData.primer_nombre,
                segundo_nombre: userData.segundo_nombre,
            },
            { headers }
        );

        console.log(response.data);
        setAlertMessage('El usuario ha sido creado exitosamente.');
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);

        notificationCreate();
        closeModal();
        getUsers();
    } catch (error) {
        if (error.response) {
            console.error("Error del servidor:", error.response.data);
            setError("Ocurrió un error: " + (error.response.data.message || "Error desconocido"));
        } else {
            console.error("Error inesperado:", error.message);
            setError("Error inesperado: " + error.message);
        }
    }
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
            console.log(resp.data.success)
            if (resp && resp.data.success) {
                setUserData(resp.data.success.user);
                setError(null); // Limpiar cualquier error anterior
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors.rut);


                console.log(error.response.data.errors.rut)
                setUserData(null); // Limpiar datos anteriores si hubo un error
            }
        }
    };

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
        <div className='mt-5 mb-5 ml-5 mr-5'>
            <div className="space-y-6 w-full mx-auto    bg-gray-100 p-8 px-8 rounded-lg shadow-md">
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700  font-bold text-center">Buscar usuario</h4>
                </div>
                <div className="flex space-x-4"> {/* Utilizamos flex para colocar los elementos en línea */}
                    <input
                        type="text"
                        placeholder="Ingrese un rut"
                        value={buscarRut}
                        onChange={(e) => setBuscarRut(e.target.value)}
                        className='mt-1 px-3 py-2 bg-white border shadow-border-slate-300 border-gray-500 placeholder-slate-700 focus:outline-none focus:border-primary-600 focus:ring-primary-600 block w-full rounded-md sm:text-sm focus:ring-1'
                    />
                    <button onClick={buscarUsuario} className="bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500">
                        Buscar
                    </button>
                </div>
                <div className={`text-white bg-red-500 p-2 mt-2 rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {error}
                </div>
            </div>

            {userData && (
                <div className="space-y-6 w-full mx-auto mt-5 bg-gray-100 p-8 px-8 rounded-lg shadow-md">
                    <form onSubmit={store} className="">
                        {showAlert && (
                            <div className="bg-green-200 text-green-800 p-2 mt-2 rounded-md">
                                {alertMessage}
                            </div>
                        )}

                        <div className="border-b-2 border-gray-700 pb-2 mb-4">
                            <h4 className="text-2xl text-gray-700  font-bold text-center">Información del usuario</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Rut:</p>
                                <p>{userData && userData.rut ? formatRut(userData.rut) : ""}</p>
                            </div>
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Nombres:</p>

                                <p>{userData ? ` ${userData.apellido_materno} ${userData.apellido_paterno}` : ""}</p>
                            </div>
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Apellidos:</p>
                                <p>{userData ? `${userData.primer_nombre} ${userData.segundo_nombre}` : ""}</p>
                            </div>
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Código de funcionario:</p>
                                <p>{userData ? userData.codigo_funcionario : ""}</p>
                            </div>
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Grado:</p>
                                <p>{userData ? userData.grado : ""}</p>
                            </div>
                            <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                <p className="font-bold">Dotación:</p>
                                <p>{userData ? userData.dotacion : ""}</p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="mt-2 flex w-full justify-center rounded-md bg-green-700 hover:bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  transition duration-500">
                                Agregar
                            </button>
                        </div>

                    </form>
                </div>
            )}

        </div>
    );
}

export default BuscarRut;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BuscarInvolucrado() {

    const [buscarRut, setBuscarRut] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [personasAgregadas, setPersonasAgregadas] = useState([]);

    const agregarPersona = () => {
        const nuevaPersona = {
            nombre: `${userData.apellido_materno} ${userData.primer_nombre} ${userData.segundo_nombre}`,
            rut: formatRut(userData.rut),
            codigo_funcionario: userData.codigo_funcionario,
            grado: userData.grado,
            dotacion: userData.dotacion,
            // Agrega aquí las demás propiedades que desees incluir
        };
        // Verificar si ya existe una persona con el mismo rut
        const personaExistente = personasAgregadas.find(persona => persona.rut === nuevaPersona.rut);

        if (personaExistente) {
            toast.warning("No puedes ingresar al mismo involucrado", {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar text-white bg-gray-700',
                theme: 'black',
            });
            return;
        }
        // Agregar la nueva persona al arreglo si no existe una persona con el mismo rut
        setPersonasAgregadas([...personasAgregadas, nuevaPersona]);
    };

    console.log("personas agregadas: ", personasAgregadas)

    const eliminarPersona = (index) => {
        const nuevasPersonas = [...personasAgregadas];
        nuevasPersonas.splice(index, 1);
        setPersonasAgregadas(nuevasPersonas);
        console.log(personasAgregadas);
    };

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
                    <form className="">
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

                        <button
                            type="button"
                            onClick={agregarPersona}
                            className="mt-8 flex w-full justify-center rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  transition duration-500"
                        >
                            Agregar Persona
                        </button>


                    </form>
                    <div>
                        <ToastContainer />
                    </div>


                </div>
            )}
            <div className="space-y-6 w-full mx-auto mt-5 bg-gray-100 p-8 px-8 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rut
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Código de Funcionario
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {personasAgregadas.map((persona, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{persona.nombre}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{persona.rut}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{persona.codigo_funcionario}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => eliminarPersona(index)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default BuscarInvolucrado

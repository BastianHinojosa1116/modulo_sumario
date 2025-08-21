import React, { useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function FormNoAplicarSancionSancionarFalta({ closeModalNoAplicarSancion, id }) {

    const [razonNoAplica, setRazonNoAplica] = useState('');
    const [fechaNoAplica, setFechaNoAplica] = useState('');
    const [resolucionNoAplica, setResolucionNoAplica] = useState(null);
    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/procesosDisciplinarios/sancionarFalta/noAplicarSancion/`;
    const [error, setError] = useState(null);

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleChangeResolucionNoAplica = (e) => {
        setResolucionNoAplica(e.target.files[0]);
        console.log(resolucionNoAplica);
    };


    const handleChangeRazonNoAplica = (event) => {
        setRazonNoAplica(event.target.value);
        console.log(razonNoAplica);
    };

    const handleChangeFechaNoAplica = (e) => {
        setFechaNoAplica(e.target.value);
        console.log('Fecha seleccionada:', e.target.value);
    };

    const handleAplicarSancion = async (e) => {

        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('razon_no_aplica', razonNoAplica);
        formData.append('fecha_no_aplica', fechaNoAplica);
        formData.append('resolucion_no_aplica', resolucionNoAplica);

        try {
            const response = await axios.post(`${endpoint}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción no aplicada',
                    text: 'No se le ha aplicado una sanción al involucrado.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
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
                    text: 'Hubo un error al intentar no aplicar una sanción al involucrado. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickAplicarSancion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar no se le aplicara la sanción al involucrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, no sancionar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancion(); // Solo ejecuta si se confirma
            }
        });
    };


    useEffect(() => {
        setFechaNoAplica(obtenerFechaDeHoy());
    }, []);


    return (
        <div>
            <div className='ml-6 mr-6 mt-6 mb-6 p-8 bg-white rounded-lg border-2 border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-10">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">No aplicar Sanción</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                            Razón:
                        </label>
                        <select
                            id="razonNoAplica"
                            name="razonNoAplica"
                            className="mt-1 p-2 px-5 py-2 bg-white border
                            shadow-sm border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                            w-full rounded-md sm:text-sm focus:ring-1"
                            value={razonNoAplica}
                            onChange={handleChangeRazonNoAplica}
                        >
                            <option value="">                                             Seleccione</option>
                            <option value="Acepta explicaciones">                         Acepta explicaciones</option>
                            <option value="Llamado de atención">                          Llamado de atención</option>

                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="resolucionNoAplica">
                            Resolución:
                        </label>
                        <input
                            className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                            type="file"
                            id="resolucionNoAplica"
                            onChange={handleChangeResolucionNoAplica}
                        />
                    </div>
                    <div>

                        <input
                            type="hidden"
                            id="fechaNoAplica"
                            name="fechaNoAplica"
                            onChange={handleChangeFechaNoAplica}
                            value={fechaNoAplica}
                            min={obtenerFechaDeHoy()} // Bloquea las fechas anteriores a hoy
                            max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy

                            className="block w-full px-4 py-1 rounded-md sm:min-w-max bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 transition duration-300 ease-in-out"
                            readOnly />
                    </div>
                </div>


            </div>
            <div className='overflow-hidden mt-4 mb-8 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                <div className="flex justify-center">

                    <button
                        className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={handleButtonClickAplicarSancion}
                    >
                        Enviar
                    </button>

                    <button
                        className='bg-gray-500 mr-2 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={() => closeModalNoAplicarSancion()}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default FormNoAplicarSancionSancionarFalta

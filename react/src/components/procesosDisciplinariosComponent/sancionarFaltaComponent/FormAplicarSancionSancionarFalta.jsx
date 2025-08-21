import React, { useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function FormAplicarSancionSancionarFalta({ id, closeModalAplicarSancion, escalafon }) {

    const [sanciones, setSanciones] = useState('');
    const [fechaSancion, setFechaSancion] = useState('');
    const [pdfResolucion, setPdfResolucion] = useState(null);
    const [diasArresto, setDiasArresto] = useState('');
    const diasArrestoFinal = diasArresto || 0;
    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const endpointAplicarSancion = `${url}/api/procesosDisciplinarios/sancionarFalta/aplicarSancion/`;

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

    const handleDiasArrestoChange = (e) => {
        setDiasArresto(e.target.value);
    };

    const handleSancionesChange = (event) => {
        setSanciones(event.target.value);
        if (event.target.value !== "Arresto") {
            setDiasArresto("0");
        }
    };

    const handleChangeFechaSancion = (e) => {
        setFechaSancion(e.target.value);
    };

    const handleAplicarSancion = async (e) => {

        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);

        try {
            const response = await axios.post(`${endpointAplicarSancion}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción Aplicada',
                    text: 'La sancion se ha aplicado con éxito.',
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
                    text: 'Hubo un error al intentar sancionar al involucrado. Inténtalo de nuevo.',
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
            text: 'Al confirmar sancionara al involucrado. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, sancionar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancion(); // Solo ejecuta si se confirma
            }
        });
    };

    useEffect(() => {
        setFechaSancion(obtenerFechaDeHoy());
    }, []);

    return (
        <div>
            <form>
                <div className='ml-6 mr-6 mt-4 mb-4 p-6 bg-white rounded-lg border-2 border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-8">
                        <h4 className="text-2xl text-gray-700 font-bold text-center">Aplicar Sanción</h4>
                    </div>
                    <div className="container mx-auto p-2 ">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 ml-4 mr-4 mb-6">
                            <div className="flex-1">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                                        Sanción:
                                    </label>
                                    <select
                                        id="sanciones"
                                        name="sanciones"
                                        className="mt-1 p-2 px-5 py-2 bg-white border
                            shadow-sm border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                            w-full rounded-md sm:text-sm focus:ring-1"
                                        value={sanciones}
                                        onChange={handleSancionesChange}
                                    >
                                        <option value="">                   Seleccione</option>
                                        {escalafon === "C.P.R. UNIVERS." ? null:(<option value="Arresto">Arresto</option>) }
                                        <option value="Reprensión">          Reprensión</option>
                                        <option value="Amonestación">       Amonestación</option>
                                        {escalafon === "C.P.R. UNIVERS." ? (<option value="Censura">Censura</option>):null }

                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                            </div>
                            {sanciones === 'Arresto' && (
                                <div className="flex-1">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                        Días de Arresto:
                                    </label>
                                    <select
                                        id="diasArresto"
                                        name="diasArresto"
                                        className="mt-1 p-2 px-5 py-2 bg-white border
                                shadow-sm border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                                w-full rounded-md sm:text-sm focus:ring-1"
                                        value={diasArresto}
                                        onChange={handleDiasArrestoChange}
                                    >
                                        <option value="">Seleccione</option>
                                        {[...Array(30).keys()].map((num) => (
                                            <option key={num + 1} value={num + 1}>
                                                {num + 1} {num + 1 === 1 ? 'día' : 'días'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="documentoInformaFalta">
                                    Resolución:
                                </label>
                                <input
                                    className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                    type="file"
                                    id="documentoInformaFalta"
                                    onChange={handleChangePdfResolucion}
                                />
                            </div>
                            <div>
                                <input
                                    type="hidden"
                                    id="fechaSancion"
                                    name="fechaSancion"
                                    onChange={handleChangeFechaSancion}
                                    value={fechaSancion}
                                    min={obtenerFechaDeHoy()} // Bloquea las fechas anteriores a hoy
                                    max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy

                                    className="block w-full px-4 py-1 rounded-md sm:min-w-max bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 transition duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='overflow-hidden mt-4 mb-6 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                        <div className="border-b-2 border-gray-400 pb-2 mb-4">
                            <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleButtonClickAplicarSancion}
                                className='bg-green-700 mr-2  hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 transition duration-500'
                            >
                                Sancionar
                            </button>
                            <button
                                type="button"
                                onClick={closeModalAplicarSancion}
                                className='bg-gray-500 mr-6  hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-500'
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default FormAplicarSancionSancionarFalta

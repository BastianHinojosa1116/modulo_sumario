import React, { useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormSuspensionDelProcedimiento({ closeModalSuspensionDelProcedimiento, id }) {


    const [fechaSuspensionProcedimiento, setFechaSuspensionProcedimiento] = useState('');
    const [resolucionSuspensionProcedimiento, setResolucionSuspensionProcedimiento] = useState(null);
    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api/resolverFalta/aplicarSancion/suspensionDelProcedimiento/`;

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const convertirFecha = (fecha) => {
        const [yyyy, mm, dd] = fecha.split('-');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleChangeResolucionSuspensionProcedimiento = (e) => {
        setResolucionSuspensionProcedimiento(e.target.files[0]);
        console.log(resolucionSuspensionProcedimiento);
    };

    const handleChangeFechaSuspensionProcedimiento = (e) => {
        setFechaSuspensionProcedimiento(e.target.value);
        console.log('Fecha seleccionada:', e.target.value);
    };

    const handleSuspenderProcedimiento = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const fechaSuspensionProcedimientoFormateada = convertirFecha(fechaSuspensionProcedimiento);

        formData.append('fecha_suspension_procedimiento', fechaSuspensionProcedimientoFormateada);
        formData.append('resolucion_suspension_procedimiento', resolucionSuspensionProcedimiento);

        try {
            const resp = await axios.post(`${endpoint}${id}`, formData, config);

            console.log("gg ", resp.data.message)
            // // Guardar mensaje de alerta en sessionStorage
            sessionStorage.setItem('alertMessage', resp.data.message);
            closeModalSuspensionDelProcedimiento();
            // // Redirigir a otra vista
            navigate('/procesosDisciplinarios/resolverFalta');

        } catch (error) {
            console.error("Error aplicando sanción", error.response.data.error);
            Alertas.error(error.response.data.error);
        }
    }

    useEffect(() => {
        setFechaSuspensionProcedimiento(obtenerFechaDeHoy());
    }, []);


    return (
        <div>
            <div className='ml-6 mr-6 mt-6 mb-6 p-8 bg-white rounded-lg border-2 border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-3 ">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Suspensión del procedimiento</h4>
                </div>
                <p className='font-serif text-center text-gray-500'>Debe adjuntar la resolución de la suspensión del procedimiento disciplinario. </p>

                <div className='flex justify-center items-center p-4'>
                    <label className="block text-gray-700 font-bold mb-2 p-2" htmlFor="resolucionNoAplica">
                        Resolución:
                    </label>
                    <input
                        className="w-6/12 p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                        type="file"
                        id="resolucionNoAplica"
                        onChange={handleChangeResolucionSuspensionProcedimiento}
                    />
                </div>

                <div>

                    <input
                        type="hidden"
                        id="fechaSancion"
                        name="fechaSancion"
                        onChange={handleChangeFechaSuspensionProcedimiento}
                        value={fechaSuspensionProcedimiento}
                        min={obtenerFechaDeHoy()} // Bloquea las fechas anteriores a hoy
                        max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy

                        className="block w-full px-4 py-1 rounded-md sm:min-w-max bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 transition duration-300 ease-in-out"
                    />
                </div>

            </div>
            <div className='overflow-hidden mt-4 mb-8  bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                <div className="flex justify-center mr-10">

                    <button
                        className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={(e) => {
                            handleSuspenderProcedimiento(e);
                        }}
                    >
                        Suspender procedimiento
                    </button>

                    <button
                        className='bg-gray-500 mr-2 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={() => closeModalSuspensionDelProcedimiento()}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default FormSuspensionDelProcedimiento

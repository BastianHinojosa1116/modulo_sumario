import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import Swal from 'sweetalert2';

function ModalDejarSinEfecto({ show, closeModalSinEfecto, id }) {

    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const [fechaReapertura, setFechaReapertura] = useState('');
    const endpoint = `${url}/api/procesosDisciplinarios/bandejaResoluciones/dejarSinEfecto/`;
    const [documentoSinEfecto, setDocumentoSinEfecto] = useState(null);

    const handleChangeDocumentoSinEfecto = (e) => {
        setDocumentoSinEfecto(e.target.files[0]);
        console.log(documentoSinEfecto);
    };


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

    const handleDejarSinEfecto = async (e) => {

        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const fechaReaperturaFormateada = convertirFecha(fechaReapertura);
        formData.append('fecha_reapertura', fechaReaperturaFormateada);
        formData.append('documento_fundamenta_dejar_sin_efecto', documentoSinEfecto);

        try {
            const response = await axios.post(`${endpoint}${id}`, formData, config);

            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Acción realizada con exito',
                    text: 'Se ha dejado sin efecto la suspensión con exito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
                    navigate('/procesosDisciplinarios/bandejaResoluciones');
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
                    text: 'Hubo un error al intentar dejar sin efecto la suspensión. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickSinEfectoSuspension = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se dejara sin efecto la suspensión del caso.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDejarSinEfecto(); // Solo ejecuta si se confirma
            }
        });
    };


    useEffect(() => {
        setFechaReapertura(obtenerFechaDeHoy());
    }, []);

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModalSinEfecto}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl mt-8 mb-8 h-full max-h-max transform overflow-hidden rounded-xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl h-full w-full font-medium leading-6 text-white bg-primary-700 py-2 px-3 flex justify-between items-center"
                                >
                                    <span className='px-6'>Reapertura del caso </span>
                                    <button
                                        className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                                        onClick={closeModalSinEfecto}
                                    >
                                        X
                                    </button>
                                </Dialog.Title>
                                <div>
                                    {/* aqui pon tu codigo */}
                                    <div>
                                        <div className='ml-6 mr-6 mt-6 mb-6 p-8 bg-white rounded-lg border-2 border-gray-300'>
                                            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-3 ">
                                                <h4 className="text-2xl text-gray-700 font-bold text-center">Dejar sin efecto</h4>
                                            </div>
                                            <p className='font-serif text-center text-gray-500'>¿Está seguro que desea dejar sin efecto la suspensión? Al dejar sin efecto, este proceso será enviado a la bandeja de sanción. </p>
                                            <div className='flex justify-center items-center p-4'>
                                                <label className="block text-gray-700 font-bold mb-2 p-2" htmlFor="resolucionNoAplica">
                                                    Resolución:
                                                </label>
                                                <input
                                                    className="w-6/12 p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                                    type="file"
                                                    id="reapertura"
                                                    onChange={handleChangeDocumentoSinEfecto}
                                                />
                                            </div>
                                        </div>

                                        <div className='overflow-hidden mt-4 mb-8 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                                            <div className="border-b-2 border-gray-400 pb-2 mb-4">
                                                <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                                            </div>
                                            <div className="flex justify-center">
                                                <button
                                                    className='bg-green-700 ml-4 hover:bg-green-500 text-white text-sm px-4 py-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-500'
                                                    onClick={handleButtonClickSinEfectoSuspension}
                                                >Dejar sin efecto</button>
                                                <button className='bg-gray-500 ml-4 hover:bg-gray-400 text-white text-sm px-4 py-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-500' onClick={closeModalSinEfecto}>Salir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalDejarSinEfecto

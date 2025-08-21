import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import { useNavigate } from 'react-router-dom';

function ModalInformacionSumario({ mostrarModalInformacion, closeModalAccionFiscal, labelDocumento, tituloModal, id, estadoSumario , accion }) {

    //documento cargado
    const [documentoPPDD, setDocumentoPPDD] = useState(null);
    const navigate = useNavigate();
    const { url } = useStateContext();
    const endpointRealizarAccion = `${url}/api/sumarios/tramita-fiscal`;


     const obtenerSumarioActualizado = async () => {
        try {
            const response = await axios.get(`${url}/api/sumarios/${id}`);
            setPrimeraDiligenciaSeleccionada(response.data);
        } catch (error) {
            console.error("Error al recargar el sumario:", error);
            Alertas.error("No se pudo actualizar el sumario.");
        }
    };

    // Define la función aquí
    const AdjuntarDocumento = (e) => {
        const file = e.target.files[0];
        setDocumentoPPDD(file);
    };

    const handleRealizarAccion = async () => {
        if (!documentoPPDD) {
            Swal.fire({
                title: 'Documento requerido',
                text: 'Debes seleccionar un archivo PDF antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('accion', accion);
        formData.append('documento', documentoPPDD);

        try {
            const response = await axios.post(endpointRealizarAccion, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Éxito',
                    text: 'Se ha tramitado el sumario correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                     obtenerSumarioActualizado();
                    closeModalAccionFiscal();
                    

                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const errores = error.response.data.errors;
                let mensajesDeError = '';

                Object.keys(errores).forEach(campo => {
                    const mensajes = Array.isArray(errores[campo]) ? errores[campo] : [errores[campo]];
                    mensajes.forEach(mensaje => {
                        mensajesDeError += `<li>${mensaje}</li>`;
                    });
                });

                Swal.fire({
                    title: 'Errores de validación',
                    html: `<ul style="text-align: left;">${mensajesDeError}</ul>`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al tramitar el sumario. Inténtalo nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    };

    const handleButtonClickRealizarAccion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar cambiara el estado del sumario. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Realizar Acción',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRealizarAccion(); // Solo ejecuta si se confirma
                
            }
        });
    };

    return (
        <Transition appear show={mostrarModalInformacion} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModalAccionFiscal}>
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

                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-5xl mt-8 mb-8 max-h-[100vh] transform overflow-hidden rounded-xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                            <Dialog.Title className="text-xl font-medium leading-6 text-white bg-primary-700 py-1 px-3 flex justify-between items-center">
                                <span className="px-6 text-md">{tituloModal}</span>
                                <button
                                    className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                                    onClick={closeModalAccionFiscal}
                                    aria-label="Cerrar modal"
                                >
                                    ✕
                                </button>
                            </Dialog.Title>

                            {/* Contenido del modal */}
                            <div className="p-4">

                                <div className="bg-white border-gray-400 p-3 mt-2 rounded-lg shadow-lg px-10">

                                    <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-3 ">
                                        <h4 className="text-2xl text-gray-700 font-bold text-center"> {tituloModal}</h4>
                                    </div>
                                    <p className='font-serif text-center text-gray-500 mb-2'>Debe seleccionar un documento en formato PDF y presionar el boton cargar documento para cambiar el estado del sumario.</p>

                                    {/* Sección del input + botón alineado */}
                                    <div className="w-full max-w-2xl mx-auto flex items-end justify-center gap-4 mb-6">
                                        <div className="flex-1">
                                            <>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {labelDocumento}
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={AdjuntarDocumento}
                                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </>
                                        </div>

                                        <button
                                            className="h-[40px] mb-[2px] bg-primary-600 text-white px-4 rounded-xl shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                            type="button"
                                            onClick={handleButtonClickRealizarAccion}
                                        >
                                            Cargar Documento
                                        </button>
                                    </div>
                                </div>

                                {/* Contenedor para centrar el botón */}
                                <div className="flex justify-center mt-6">
                                    <button
                                        type="button"
                                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1.5 rounded-md focus:outline-none
                                        focus:ring-2 focus:ring-primary-500 transition duration-500"
                                        onClick={closeModalAccionFiscal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModalInformacionSumario
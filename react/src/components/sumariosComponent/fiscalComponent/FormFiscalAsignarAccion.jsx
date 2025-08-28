import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../../../contexts/ContextProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import Alertas from '../../animacionEstilos/Alertas';
import { ArrowDownCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModalInformacionSumario from './ModalInformacionSumario';

function FormFiscalAsignarAccion() {
    const { url } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [mostrarEstados, setMostrarEstados] = useState(true);
    const { id } = useParams();
    const [sumario, setSumario] = useState(null);
    const { sumarioSeleccionado } = location.state || {};
    const [mostrarModalInformacion, setMostrarModalInformacion] = useState(false);
    const [openModalFiscal, setOpenModalFiscal] = useState(false);
    const [accionSeleccionada, setAccionSeleccionada] = useState('');


    const obtenerSumarioActualizado = async () => {
        const response = await axios.get(`${url}/api/sumarios/${id}`);
        setSumario(response.data);
    };

   useEffect(() => {
  if (sumario) {
    setSumarioSeleccionado(sumario);
  }
}, [sumario]);


    console.log("SumarioActualizado",sumario)








    const handleModalAccionFiscalClick = () => {
        setOpenModalFiscal(true);
    };

    console.log("🚀 Componente FormFiscalAsignarAccion se montó");

    useEffect(() => {
        console.log("🕵️ sumarioSeleccionado:", sumarioSeleccionado);
    }, []);

    if (
        !sumarioSeleccionado ||
        !Array.isArray(sumarioSeleccionado.user_form_sumarios) ||
        sumarioSeleccionado.user_form_sumarios.length === 0
    ) {
        return (
            <div className="p-6 text-center text-red-600 font-semibold">
                ❌ No se recibió la información del sumario o la estructura es incorrecta.
            </div>
        );
    }






    const [estadoSumario, setEstadoSumario] = useState('');
    const [documentoPPDD, setDocumentoPPDD] = useState(null);
    const [labelDocumento, setLabelDocumento] = useState('');
    const [estadoDocumentoSelect, setEstadoDocumentoSelect] = useState(false);
    const [tituloModal, setTituloModal] = useState('');
    const AdjuntarDocumento = (archivo) => {
        const formData = new FormData();
        formData.append("documento", archivo);
        formData.append("idSumario", sumarioSeleccionado?.id);
        enviarFormData(formData);
    };


    const handleChangeSelectAccion = (e) => {
        const valor = e.target.value;
        setAccionSeleccionada(e.target.value); //LE DOY EL VALOR DEPENDIENDO DEL VALOR SELECCIONADO

        setEstadoSumario(valor);
        setEstadoDocumentoSelect(true);

        switch (valor) {
            case 'Aceptación de cargo':
                setLabelDocumento('Cargar aceptación de cargo:');
                setTituloModal("Aceptar cargo")
                break;
            case 'Inhabilita':
                setLabelDocumento('Cargar documento inhabilitación:');
                setTituloModal("Inhabilitar Sumario")
                break;
            case 'Prórroga Vista fiscal':
                setLabelDocumento('Cargar solicitud de solicitud prórroga:');
                setTituloModal("Solicitar Prorroga Vista fiscal")
                break;
            case 'Prórroga dispone notificación':
                setLabelDocumento('Cargar solicitud de prórroga:');
                setTituloModal("Solicitar Prorroga notificación")
                break;
            case 'Prórroga corregir':
                setLabelDocumento('Cargar solicitud de prórroga:');
                setTituloModal("Solicitar Prorroga corregir")
                break;
            case 'Vista fiscal':
                setLabelDocumento('Cargar Vista fiscal:');
                setTituloModal("Cargar Vista fiscal")
                break;
            case 'Notificación':
                setLabelDocumento('Cargar notificación:');
                setTituloModal("Notificar Sumario")
                break;
            case 'Vista fiscal corregir':
                setLabelDocumento('Cargar corrección:');
                setTituloModal("Correguir Vista fiscal")
                break;
            case 'Notificación del Dictámen':
                setLabelDocumento('Cargar notificación:');
                setTituloModal("Notificar Dictámen")
                break;
            case 'Prórroga notificación Dictámen':
                setLabelDocumento('Cargar aceptación de prórroga:');
                setTituloModal("Solicitar prórroga para la notificación del Dictámen")
                break;
            case 'Dispone revisión asesor jurídico':
                setLabelDocumento('Cargar aceptación de prórroga:');
                setTituloModal("Solicitar prórroga para la notificación del Dictámen")
            break;
            case 'Dispone corregir vista fiscal':
                setLabelDocumento('Cargar dispone corregir vista fiscal');
                setTituloModal("Dispone Corregir Vista Fiscal")
            break;
            case 'Dictámen':
                setLabelDocumento('Cargar Dictámen:');
                setTituloModal("Cargar Dictámen")
            break;
            default:
                setLabelDocumento('');
        }
        handleModalAccionFiscalClick();
    };

    const handleRealizarAccion = async () => {
        const formData = new FormData();
        formData.append('accion', accionSeleccionada);

        if (documentoPPDD) {
            formData.append('documento', documentoPPDD);
        }

        try {
            const response = await axios.post(
                `${endpointRealizarAccion}${sumarioSeleccionado.id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data?.message) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'La acción fue realizada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    Alertas.success(response.data.message);

                    navigate('/sumarios'); // Redirigís al listado si querés
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const errores = error.response.data.errors;
                let mensajesDeError = '';

                Object.keys(errores).forEach((campo) => {
                    errores[campo].forEach((msg) => {
                        mensajesDeError += `<li>${msg}</li>`;
                    });
                });

                Swal.fire({
                    title: 'Errores de validación',
                    html: `<ul style="text-align: left;">${mensajesDeError}</ul>`,
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un problema al realizar la acción.',
                    icon: 'error'
                });
            }
        }
    };

    const verPDF = async () => {
        try {
            const response = await fetch(`${url}/api/eventos/get-pdf/${sumarioSeleccionado.id}`);
            const blob = await response.blob();
            const urlBlob = URL.createObjectURL(blob);
            window.open(urlBlob, '_blank');
            setTimeout(() => URL.revokeObjectURL(urlBlob), 10000);
        } catch (error) {
            console.error('Error al abrir el PDF:', error);
        }
    };

    //permite visualizar el estado del sumario diligencia en pdf y protege la ruta
    const verEstadoPDF = async (id) => {
        try {
            const response = await fetch(`${url}/api/eventos/get-pdf-estado/${id}`);
            const blob = await response.blob();

            // Crea una URL temporal del blob
            const urlBlob = URL.createObjectURL(blob);

            // Abre una nueva pestaña con el PDF
            window.open(urlBlob, '_blank');

            // Limpieza opcional (después de un tiempo para asegurar que se cargue)
            setTimeout(() => URL.revokeObjectURL(urlBlob), 10000); // 10 segundos
        } catch (error) {
            console.error('Error al abrir el PDF:', error);
        }
    };


    return (
        <div className="p-4 bg-gray-100 border border-gray-400 rounded-lg">
            {mostrarEstados && (

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-4 sm:px-8 pt-0 pb-10"
                >
                    <div className="p-4 bg-gray-100 shadow-md border-gray-400 rounded-lg">
                        <>
                            <div className="flex items-center justify-between mb-4">

                                <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                                    Estado: {sumarioSeleccionado.estado_sumario}
                                </span>
                            </div>


                            <div className="bg-gray-300 rounded-lg shadow-md mb-6 p-4 hover:shadow-lg transition-shadow duration-300 border-2 border-gray-400 ">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                    <div className="flex items-center sm:gap-1 mb-2 md:mb-0">
                                        <span className="bg-primary-700 text-white px-3 py-1 rounded-full text-sm align-middle font-semibold">
                                            Rol #{sumarioSeleccionado.sumario_numero_rol}
                                        </span>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                                            Ingreso: {sumarioSeleccionado.fecha_ingreso_formulario}
                                        </span>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                                            Plazo: {sumarioSeleccionado.plazo}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white  rounded-lg shadow-md  m-0">
                                    <div className="flex flex-col md:flex-row justify-between ">
                                        {/* Fiscal a la izquierda */}
                                        <div className="md:w-1/2 bg-gray-100 p-3 rounded-l-lg border border-gray-300">
                                            <h3 className="font-semibold text-gray-700 mb-2 text-md">Fiscal:</h3>
                                            {sumarioSeleccionado.user_form_sumarios.map((usuario) => (
                                                <div key={usuario.id}>
                                                    <p className="text-gray-600 text-xs">
                                                        <span className="font-semibold">NOMBRE:</span> {usuario.user.name}
                                                    </p>
                                                    <p className="text-gray-600 text-xs">
                                                        <span className="font-semibold">RUT:</span> {usuario.user.rut}
                                                    </p>
                                                    <p className="text-gray-600 text-xs">
                                                        <span className="font-semibold">DOTACIÓN:</span> {usuario.user.dotacion}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="md:w-1/2 bg-gray-100 p-3 rounded-r-lg border border-gray-300">
                                            <h3 className="text-md font-semibold text-gray-700 mb-2">Involucrados:</h3>
                                            <ul className="list-inside text-gray-600">
                                                {sumarioSeleccionado.involucrados_sumarios.map((item) => (
                                                    <li
                                                        key={item.id}
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs mb-1 text-center"
                                                    >
                                                        {item.involucrado.name} – <span className="font-semibold">RUT:</span> {item.involucrado.rut_involucrado}
                                                    </li>
                                                ))}
                                            </ul>

                                        </div>
                                    </div>
                                </div>


                                {/* Selección de acción */}
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-gray-600">Descripción del Hecho:</label>
                                    <p className="bg-white p-2 border text-sm border-gray-400 rounded-md">{sumarioSeleccionado.descripcion_hecho}</p>
                                </div>

                                <div className="mt-4 mb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="w-full">

                                            <div className="mt-6 flex justify-center gap-2 mb-6">

                                                {(
                                                    sumarioSeleccionado.estado_sumario === 'Orden de Sumario Cargada') && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleChangeSelectAccion({ target: { value: 'Aceptación de cargo' } });
                                                                    setMostrarModalInformacion(true); // ← Aquí se abre el modal
                                                                }}


                                                                className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Aceptación de Cargo
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleChangeSelectAccion({ target: { value: 'Inhabilita' } });
                                                                    setMostrarModalInformacion(true);
                                                                }}
                                                                className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Inhabilita
                                                            </button>
                                                            <button
                                                                onClick={() => setMostrarEstados(!mostrarEstados)}
                                                                className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                            >
                                                                {!mostrarEstados ? 'Ocultar diligencias' : 'Mostrar diligencias'}
                                                            </button>
                                                        </>
                                                    )}
                                                {(sumarioSeleccionado.estado_sumario === 'Rechaza inhabilidad' ||
                                                    sumarioSeleccionado.estado_sumario === 'Aceptación de cargo' ||
                                                    sumarioSeleccionado.estado_sumario === 'Acepta prórroga vista fiscal' ||
                                                    sumarioSeleccionado.estado_sumario === 'Rechaza prórroga vista fiscal') && (
                                                        <>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                handleChangeSelectAccion({ target: { value: 'Vista fiscal' } });
                                                                setMostrarModalInformacion(true); 
                                                                }}
                                                                
                                                                className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Vista fiscal
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                handleChangeSelectAccion({ target: { value: 'Prórroga vista fiscal' } });
                                                                setMostrarModalInformacion(true);
                                                                }}

                                                                className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Prórroga
                                                            </button>
                                                        </>
                                                    )}
                                                {(sumarioSeleccionado.estado_sumario === 'Dispone notificación' ||
                                                    sumarioSeleccionado.estado_sumario === 'Acepta prórroga notificación' ||
                                                    sumarioSeleccionado.estado_sumario === 'Rechaza prórroga notificación') && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleChangeSelectAccion({ target: { value: 'Notificación' } })}
                                                                className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Notificación
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleChangeSelectAccion({ target: { value: 'Prórroga dispone notificación' } })}
                                                                className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Prórroga
                                                            </button>
                                                        </>
                                                    )}
                                                {sumarioSeleccionado.estado_sumario === 'Corregir' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleChangeSelectAccion({ target: { value: 'Vista fiscal corregir' } })}
                                                            className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                        >
                                                            Corregir Vista fiscal
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleChangeSelectAccion({ target: { value: 'Prórroga corregir' } })}
                                                            className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                        >
                                                            Prórroga
                                                        </button>
                                                    </>
                                                )}
                                                {(
                                                    sumarioSeleccionado.estado_sumario === 'Dispone notificación Dictámen' ||
                                                    sumarioSeleccionado.estado_sumario === 'Rechaza prórroga notificación Dictámen' ||
                                                    sumarioSeleccionado.estado_sumario === 'Acepta prórroga notificación Dictámen'
                                                ) && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleChangeSelectAccion({ target: { value: 'Notificación del Dictámen' } })}
                                                                className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Notificar Dictámen
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleChangeSelectAccion({ target: { value: 'Prórroga notificación Dictámen' } })}
                                                                className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                            >
                                                                Prórroga
                                                            </button>
                                                        </>
                                                    )
                                                }
                                              
                                                {mostrarModalInformacion && (
                                                    <ModalInformacionSumario
                                                        mostrarModalInformacion={mostrarModalInformacion}
                                                        closeModalAccionFiscal={() => setMostrarModalInformacion(false)}
                                                        tituloModal={tituloModal}
                                                        labelDocumento={labelDocumento}
                                                        estadoSumario={estadoSumario}
                                                        documentoPPDD={documentoPPDD}
                                                        AdjuntarDocumento={AdjuntarDocumento}
                                                        accion={accionSeleccionada}
                                                        id={sumarioSeleccionado.id}
                                                    />
                                                )}



                                            </div>
                                            <>

                                            </>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de acción */}

                            </div>
                            <ToastContainer />
                        </>
                    </div>
                </motion.div>
            )}
            {/* esto es de prueba */}
            {!mostrarEstados && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-4 sm:px-8 py-10"
                >
                    <div className="flex justify-center py-10 bg-blue-200 border border-gray-400 rounded-lg overflow-y-auto max-h-[750px] ">
                        <div className="">
                            <div className="text-center mb-8 bg-blue-100 rounded-lg p-4 border">
                                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 relative inline-block">
                                    <span className="relative z-10">Estado del sumario</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500 rounded-full z-0 opacity-50"></span>
                                </h2>
                            </div>
                            {sumarioSeleccionado.estados_form_sumarios.map((estado, index) => (
                                <div key={estado.id} className="flex items-start space-x-4 relative">
                                    {/* Fecha */}
                                    <div>{estado.estados_sumario.fecha_estado}</div>

                                    {/* Línea y punto */}
                                    <div className="flex flex-col items-center h-20">
                                        <div className="z-10 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow">
                                            <ArrowDownCircleIcon className="w-10 h-10" />
                                        </div>

                                        {index !== sumarioSeleccionado.estados_form_sumarios.length - 1 && (
                                            <div className="w-1 bg-blue-500 h-24 mt-1 z-0"></div>
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="bg-white rounded-lg shadow p-2 mb-4 w-[500px] flex flex-col sm:flex-row sm:items-center justify-between border border-gray-400">
                                        <div className="text-sm text-gray-700">
                                            <p>
                                                <span className="font-semibold text-blue-700">Estado:</span>{' '}
                                                {estado.estados_sumario.descripcion_estado}

                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => verEstadoPDF(estado.estados_sumario.id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
                                            >
                                                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                                                <span>Abrir documento</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Botón de acción */}
                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            onClick={() => setMostrarEstados(!mostrarEstados)}
                            className="bg-gray-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                        >
                            {!mostrarEstados ? 'Ocultar diligencias' : 'Mostrar diligencias'}
                        </button>
                    </div>
                </motion.div>
            )}

        </div>

    );

}

export default FormFiscalAsignarAccion;
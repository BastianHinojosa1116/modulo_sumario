import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Alertas from '../../animacionEstilos/Alertas';
import { ArrowDownCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function AsesorJuridicoTramitar() {


    const navigate = useNavigate();
    const { url } = useStateContext();
    const endpointRealizarAccion = `${url}/api/primerasDiligencias/asesor-juridico-select-cambiar-estado/`;
    const [estadoSumario, setEstadoSumario] = useState('');
    const [mostrarEstados, setMostrarEstados] = useState(true);
    const location = useLocation();
    const { id } = useParams(); // por si necesitas el ID desde la URL
    const { sumarioSeleccionado } = location.state || {};
    console.log('sumarioSeleccionado:', sumarioSeleccionado);
    const [mostrarModalAccionAsesorJuridico, setMostrarModalAccionAsesorJuridico] = useState(false);

    useEffect(() => {
        console.log("🕵️ sumarioSeleccionadoASesorJuridico:", sumarioSeleccionado);
    }, []);

    if (!sumarioSeleccionado) {
        return (
            <div className="text-center text-red-600 mt-10">
                ⚠️ No se ha recibido información del sumario seleccionado.
            </div>
        );
    }



    const handleChangeSelectAccion = (e) => {
        const valor = e.target.value;
        setEstadoSumario(valor);
        setEstadoDocumentoSelect(true);

        switch (valor) {
            case 'Aceptación de cargo':
                setLabelDocumento('Cargar aceptación de cargo:');
                setTituloModal("Aceptar cargo")
                break;
            case 'Inhabilita':
                setLabelDocumento('Cargar documento inhabilitación:');
                setTituloModal("Inhabilitar Primera Diligencia")
                break;
            case 'Prórroga cargo':
                setLabelDocumento('Cargar solicitud de prórroga:');
                setTituloModal("Solicitar Prorroga cargo")
                break;
            case 'Prórroga dispone notificación':
                setLabelDocumento('Cargar solicitud de prórroga:');
                setTituloModal("Solicitar Prorroga notificación")
                break;
            case 'Prórroga corregir':
                setLabelDocumento('Cargar solicitud de prórroga:');
                setTituloModal("Solicitar Prorroga corregir")
                break;
            case 'Oficio informe':
                setLabelDocumento('Cargar oficio informe:');
                setTituloModal("Enviar Oficio Informe")
                break;
            case 'Notificación':
                setLabelDocumento('Cargar notificación:');
                setTituloModal("Notificar Primera diligencia")
                break;
            case 'Oficio informe corregir':
                setLabelDocumento('Cargar corrección:');
                setTituloModal("Correguir oficio informe")
                break;
            case 'Notificación de resolución':
                setLabelDocumento('Cargar notificación:');
                setTituloModal("Notificar la resolución")
                break;
            case 'Prórroga notificación resolución':
                setLabelDocumento('Cargar aceptación de prórroga:');
                setTituloModal("Solicitar prórroga para la notificación de la resolución")
                break;
            default:
                setLabelDocumento('');
        }
        handleModalAccionFiscalClick();
    };

    const handleRealizarAccion = async () => {
        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('estado_primera_diligencia', estadoSumario);

        try {
            const response = await axios.post(`${endpointRealizarAccion}${sumarioSeleccionado.id}`, formData, config);

            if (response.data && response.data.message) {
                // // sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Exito',
                    text: 'El estado de la primera diligencia se ha cambiado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    getAllPrimerasDiligencias();

                    Alertas.success(response.data.message);

                    //navigate('/procesosDisciplinarios/resolverFalta'); navegacion hacia otra vista
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
                    text: 'Hubo un error al intentar realizar una acción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickRealizarAccion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar cambiara el estado de la primera diligencia. ',
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

    //permite visualizar el pdf y protege la ruta
    const verPDF = async () => {
        try {
            const response = await fetch(`${url}/api/eventos/get-pdf/${sumarioSeleccionado.id}`);
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

    //permite visualizar el estado de la primera diligencia en pdf y protege la ruta
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

                <>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="px-4 sm:px-8 pt-0 pb-10"
                    ></motion.div>
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
                                <div className="md:w-1/2 bg-gray-100 p-3 rounded-l-lg  border border-gray-300">
                                    <h3 className="font-semibold text-gray-700 mb-2 text-md">Fiscal:</h3>
                                    {sumarioSeleccionado.user_form_sumarios.map((usuario) => (
                                        <div key={usuario.id} >

                                            <p className="text-gray-600 text-xs"><span className="font-semibold">NOMBRE:</span> {usuario.user.name}</p>
                                            <p className="text-gray-600 text-xs"><span className="font-semibold">RUT:</span> {usuario.user.rut}</p>
                                            <p className="text-gray-600 text-xs"><span className="font-semibold">DOTACIÓN:</span> {usuario.user.dotacion}</p>
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

                        {sumarioSeleccionado.motivo && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {["Lesión", "Daño", "Enfermedad"].map((motivoBase, index) => {
                                    const motivoExists = sumarioSeleccionado.motivo.split(",")
                                        .map(m => m.trim())
                                        .includes(motivoBase);

                                    const submotivos = motivoExists && sumarioSeleccionado.subMotivo ?
                                        sumarioSeleccionado.subMotivo.split(",")
                                            .map(s => s.trim())
                                            .filter(submotivo => {
                                                if (motivoBase === "Lesión") return ["Actos del servicio", "Trayecto"].includes(submotivo);
                                                if (motivoBase === "Daño") return ["Vestuario", "Vehículo", "Accesorio", "Armamento", "Otros"].includes(submotivo);
                                                if (motivoBase === "Enfermedad") return submotivo === "Enfermedad";
                                                return false;
                                            }) : [];

                                    const getStyles = (motivo) => {
                                        switch (motivo) {
                                            case "Lesión":
                                                return {
                                                    header: "bg-gradient-to-r from-gray-600 to-gray-700",
                                                    badge: "bg-slate-500 hover:bg-slate-500"
                                                };
                                            case "Daño":
                                                return {
                                                    header: "bg-gradient-to-r from-gray-600 to-gray-700",
                                                    badge: "bg-slate-500 hover:bg-slate-500"
                                                };
                                            case "Enfermedad":
                                                return {
                                                    header: "bg-gradient-to-r from-gray-600 to-gray-700",
                                                    badge: "bg-slate-500 hover:bg-slate-500"
                                                };
                                            default:
                                                return {
                                                    header: "bg-gray-600",
                                                    badge: "bg-gray-400"
                                                };
                                        }
                                    };

                                    const styles = getStyles(motivoBase);

                                    return (
                                        <div key={index} className="bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300">
                                            <div className={`${styles.header} text-white px-4 py-1 rounded-t-lg font-medium text-md text-center`}>
                                                {motivoBase}
                                            </div>
                                            <div className="p-1 rounded-b-lg">
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {submotivos.length > 0 ? (
                                                        submotivos.map((submotivo, subIndex) => (
                                                            <span
                                                                key={subIndex}
                                                                className={`${styles.badge} px-3 py-1 rounded-full text-xs font-medium text-white 
                                                                                shadow-sm transition-all duration-200 transform hover:scale-105`}
                                                            >
                                                                {submotivo}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                            Sin información
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Selección de acción */}

                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-600">Descripción del Hecho:</label>
                            <p className="bg-white p-2 border text-sm border-gray-400 rounded-md">{sumarioSeleccionado.descripcion_hecho}</p>
                        </div>

                        <div className="mt-4 mb-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="w-full">

                                    <div className="mt-6 flex justify-center gap-2 mb-6">

                                        {(sumarioSeleccionado.estado_sumario === 'Pendiente Aceptación de cargo' ||
                                            sumarioSeleccionado.estado_sumario === 'Orden de Sumario Cargada') && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Aceptación de cargo' } })}
                                                        className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Aceptación de Cargo
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Inhabilita' } })}
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
                                            sumarioSeleccionado.estado_sumario === 'Acepta prórroga cargo' ||
                                            sumarioSeleccionado.estado_sumario === 'Rechaza prórroga cargo') && (
                                                <>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Oficio informe' } })}
                                                        className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Oficio informe
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Prórroga cargo' } })}
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
                                                    onClick={() => handleChangeSelectAccion({ target: { value: 'Oficio informe corregir' } })}
                                                    className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                >
                                                    Corregir oficio informe
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
                                            sumarioSeleccionado.estado_sumario === 'Dispone notificación resolución' ||
                                            sumarioSeleccionado.estado_sumario === 'Rechaza prórroga notificación resolución' ||
                                            sumarioSeleccionado.estado_sumario === 'Acepta prórroga notificación resolución'
                                        ) && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Notificación de resolución' } })}
                                                        className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Notificar resolución
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Prórroga notificación resolución' } })}
                                                        className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Prórroga
                                                    </button>
                                                </>
                                            )
                                        }
                                        {(
                                            sumarioSeleccionado.estado_sumario === 'Dispone revisión asesor jurídico'
                                        ) && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Informe asesor jurídico' } })}
                                                        className="bg-primary-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Informe
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChangeSelectAccion({ target: { value: 'Solicitar prórroga informe asesor jurídico' } })}
                                                        className="bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Solicitar prórroga
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                    <>

                                    </>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            className="bg-primary-600 text-white px-4 py-1 rounded-xl shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                            type="button"
                            onClick={handleButtonClickRealizarAccion}>
                            Asignar Acción
                        </button>
                        {/* <button className="bg-gray-600 text-white px-4 py-1 rounded-xl shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                            onClick={closeModalAccionAsesorJuridico}>
                            cancelar
                        </button> */}
                        {/* boton que permite visualizar pdf */}
                        <button onClick={verPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Ver Documento Inicial
                        </button>

                        <button
                            onClick={() => setMostrarEstados(!mostrarEstados)}
                            className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {!mostrarEstados ? 'Ocultar diligencias' : 'Mostrar diligencias'}
                        </button>
                    </div>
                    <ToastContainer />
                </>
            )}
            {/* esto es de prueba */}
            {!mostrarEstados && (
                <div>
                    <div className="flex justify-center py-10 bg-blue-200 border border-gray-400 rounded-lg overflow-y-auto max-h-[650px] ">
                        <div className="">
                            <div className="text-center mb-8 bg-blue-100 rounded-lg p-4 border">
                                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 relative inline-block">
                                    <span className="relative z-10">Estado del Sumario</span>
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
                            className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {!mostrarEstados ? 'Ocultar diligencias' : 'Mostrar diligencias'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AsesorJuridicoTramitar
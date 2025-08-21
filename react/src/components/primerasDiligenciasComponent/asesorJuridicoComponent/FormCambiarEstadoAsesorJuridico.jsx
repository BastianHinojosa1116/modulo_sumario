import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Alertas from '../../animacionEstilos/Alertas';
import { ArrowDownCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

function FormCambiarEstadoAsesorJuridico({ primeraDiligenciaSeleccionada, closeModalAccionAsesorJuridico, getAllPrimerasDiligencias }) {

    const navigate = useNavigate();
    const { url } = useStateContext();
    const endpointRealizarAccion = `${url}/api/primerasDiligencias/asesor-juridico-select-cambiar-estado/`;
    const [estadoPrimeraDiligencia, setEstadoPrimeraDiligencia] = useState('');
    const [mostrarEstados, setMostrarEstados] = useState(true);

    const handleChangeSelectAccion = (e) => {
        setEstadoPrimeraDiligencia(e.target.value);
    };

    const handleRealizarAccion = async () => {
        const formData = new FormData();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('estado_primera_diligencia', estadoPrimeraDiligencia);

        try {
            const response = await axios.post(`${endpointRealizarAccion}${primeraDiligenciaSeleccionada.id}`, formData, config);

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
                    closeModalAccionAsesorJuridico();
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
            const response = await fetch(`${url}/api/eventos/get-pdf/${primeraDiligenciaSeleccionada.id}`);
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">
                            Información de la primera diligencia
                        </h2>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                            Estado: {primeraDiligenciaSeleccionada.estado_primera_diligencia}
                        </span>
                    </div>

                    <div className="bg-gray-300 rounded-lg shadow-md mb-6 p-4 hover:shadow-lg transition-shadow duration-300 border-2 border-gray-400 ">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div className="flex items-center sm:gap-1 mb-2 md:mb-0">
                                <span className="bg-primary-700 text-white px-3 py-1 rounded-full text-sm align-middle font-semibold">
                                    Rol #{primeraDiligenciaSeleccionada.pd_numero_rol}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                                    Ingreso: {primeraDiligenciaSeleccionada.fecha_ingreso_formulario}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-sm">
                                    Plazo: {primeraDiligenciaSeleccionada.plazo}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white  rounded-lg shadow-md  m-0">
                            <div className="flex flex-col md:flex-row justify-between ">
                                {/* Fiscal a la izquierda */}
                                <div className="md:w-1/2 bg-gray-100 p-3 rounded-l-lg  border border-gray-300">
                                    <h3 className="font-semibold text-gray-700 mb-2 text-md">Fiscal:</h3>
                                    {primeraDiligenciaSeleccionada.usuarios.map((usuario) => (
                                        <div key={usuario.id} >

                                            <p className="text-gray-600 text-xs"><span className="font-semibold">NOMBRE:</span> {usuario.name}</p>
                                            <p className="text-gray-600 text-xs"><span className="font-semibold">RUT:</span> {usuario.rut}</p>
                                            <p className="text-gray-600 text-xs"><span className="font-semibold">DOTACIÓN:</span> {usuario.dotacion}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="md:w-1/2 bg-gray-100 p-3 rounded-r-lg border border-gray-300">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Involucrados:</h3>

                                    <ul className=" list-inside text-gray-600">
                                        {primeraDiligenciaSeleccionada.involucrado_primera_diligencia.map((involucrados) => (
                                            <li key={involucrados.id} className='bg-blue-100 text-blue-800 px-2 py-1 border border-blue-400 rounded-full text-xs mb-1 text-center'> {involucrados.name} - <span className="font-semibold">RUT:</span> {involucrados.rut_involucrado}</li>
                                        ))}
                                    </ul>

                                </div>
                            </div>
                        </div>

                        {primeraDiligenciaSeleccionada.motivo && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {["Lesión", "Daño", "Enfermedad"].map((motivoBase, index) => {
                                    const motivoExists = primeraDiligenciaSeleccionada.motivo.split(",")
                                        .map(m => m.trim())
                                        .includes(motivoBase);

                                    const submotivos = motivoExists && primeraDiligenciaSeleccionada.subMotivo ?
                                        primeraDiligenciaSeleccionada.subMotivo.split(",")
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
                            <p className="bg-white p-2 border text-sm border-gray-400 rounded-md">{primeraDiligenciaSeleccionada.descripcion_hecho}</p>
                        </div>

                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-600">Seleccione una acción:</label>
                            <select
                                className="mt-2 w-full p-1 border border-gray-400 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                defaultValue=""
                                onChange={handleChangeSelectAccion}
                            >
                                <option value="" disabled>Seleccione una opción</option>

                                {/* Si el estado es Aceptación de Cargo */}
                                {primeraDiligenciaSeleccionada?.estado_primera_diligencia === 'Revisión asesor jurídico' && (
                                    <>
                                        <option value="Informe asesor jurídico">Informe asesor jurídico</option>
                                        <option value="Prórroga">Prórroga</option>
                                    </>
                                )}
                            </select>
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
                        <button className="bg-gray-600 text-white px-4 py-1 rounded-xl shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                            onClick={closeModalAccionAsesorJuridico}>
                            cancelar
                        </button>
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
                                    <span className="relative z-10">Estado de la primera diligencia</span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500 rounded-full z-0 opacity-50"></span>
                                </h2>
                            </div>
                            {primeraDiligenciaSeleccionada.estados_primera_diligencia.map((estados, index) => (
                                <div key={estados.id} className="flex items-start space-x-4 relative ">
                                    {/* Fecha */}
                                    <div className="">
                                        {estados.fecha_estado}
                                    </div>

                                    {/* Línea y punto */}
                                    <div className="flex flex-col items-center h-20">
                                        {/* Punto */}
                                        <div className="z-10 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow">
                                            <ArrowDownCircleIcon className="w-10 h-10" />
                                        </div>

                                        {/* Línea */}
                                        {index !== primeraDiligenciaSeleccionada.length - 1 && (
                                            <div className="w-1 bg-blue-500 h-24 mt-1 z-0"></div>
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="bg-white rounded-lg shadow p-2 mb-4 w-[500px] flex flex-col sm:flex-row sm:items-center justify-between border border-gray-400">
                                        <div className="text-sm text-gray-700">
                                            <p><span className="font-semibold text-blue-700">Estado:</span> {estados.descripcion_estado}</p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => verEstadoPDF(estados.id)}
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

export default FormCambiarEstadoAsesorJuridico
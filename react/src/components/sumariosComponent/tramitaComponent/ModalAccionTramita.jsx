import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useStateContext } from '../../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';

function ModalAccionTramita({ mostrarModalInformacion, closeModalAccionFiscal, labelDocumento, tituloModal, id, estadoSumario, accion }) {

    const [documentoSumario, setDocumentoSumario] = useState(null);
    const [rutAsesorJuridico, setRutAsesorJuridico] = useState('');
    const navigate = useNavigate();
    const { url } = useStateContext();
    const endpointRealizarAccion = `${url}/api/sumarios/tramitar-dispone`;
    const [fechaProrroga, setFechaProrroga] = useState('');
    const [asesorJuridicoValidado, setAsesorJuridicoValidado] = useState(false);
    const [datosAsesor, setDatosAsesor] = useState(null);

    const CampoPlazoRevision = ({ fecha, setFecha }) => (
        <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Nuevo Plazo</label>
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => e.preventDefault()}
            />
        </div>
    );



    const accionesConPlazo = [
        'Acepta prórroga vista fiscal',
        'Aceptar prórroga informe asesor jurídico',
    ];




    const obtenerSumarioActualizado = async () => {
        try {
            const response = await axios.get(`${url}/api/sumarios/${id}`);
            // Suponiendo que tienes alguna función para usar esto
            // setPrimeraDiligenciaSeleccionada(response.data);
        } catch (error) {
            console.error("Error al recargar el sumario:", error);
            Swal.fire('Error', 'No se pudo actualizar el sumario.', 'error');
        }
    };

    const AdjuntarDocumento = (e) => {
        const file = e.target.files[0];
        setDocumentoSumario(file);
    };

    const validarRutAsesor = async () => {
        const rut = rutAsesorJuridico.trim();
        console.log('[VALIDAR_RUT] Enviando RUT al backend:', rut); // 👈 Aquí ves el valor

        try {
            const response = await axios.post(`${url}/api/user/validar-rut`, { rut });

            if (response.data.exists) {
                setAsesorJuridicoValidado(true);
                const userData = await axios.get(`${url}/api/user-data/${rut}`);
                setDatosAsesor(userData.data);



            } else {
                setAsesorJuridicoValidado(false);
                Swal.fire({
                    title: 'RUT No encontrado',
                    text: `No dispone de perfil del asesor jurídico en el sistema.`,
                    icon: 'error',
                    timer: 3000, // ⏱️ se cierra en 3 segundos
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al validar el RUT.', 'error');
        }
    };


    const handleRealizarAccion = async () => {
        if (!documentoSumario) {
            Swal.fire('Documento requerido', 'Debes seleccionar un archivo PDF antes de continuar.', 'warning');
            return;
        }

        let rut = '';
        if (accion === 'Dispone revisión asesor jurídico') {
            rut = rutAsesorJuridico.trim();

            if (!rut) {
                Swal.fire('RUT requerido', 'Debes ingresar el RUT del asesor jurídico.', 'warning');
                return;
            }

            if (!/^\d{7,8}[0-9Kk]$/.test(rut)) {
                Swal.fire('RUT inválido', 'El RUT debe tener entre 7 y 8 dígitos más un dígito verificador (número o K).', 'warning');
                return;
            }


        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('accion', accion);
        formData.append('documento', documentoSumario);
           const accionesConPlazo = [
            'Acepta prórroga vista fiscal',
            'Aceptar prórroga informe asesor jurídico',
            'Dispone revisión asesor jurídico'
        ];

        if (accionesConPlazo.includes(accion)) {
            formData.append('plazo', fechaProrroga);
        }
        

        // 👇 Solo si es la acción correspondiente
        if (accion === 'Dispone revisión asesor jurídico') {
            rut = rutAsesorJuridico.trim();

            if (!rut) {
                Swal.fire('RUT requerido', 'Debes ingresar el RUT del asesor jurídico.', 'warning');
                return;
            }

            if (!/^\d{7,8}[0-9Kk]$/.test(rut)) {
                Swal.fire('RUT inválido', 'El RUT debe tener entre 7 y 8 dígitos más un dígito verificador (número o K).', 'warning');
                return;
            }


            if (!fechaProrroga) {
                Swal.fire('Fecha requerida', 'Debes seleccionar un plazo de revisión.', 'warning');
                return;
            }

            formData.append('rut_asesor_juridico', rut);
            
        }


        try {
            const response = await axios.post(endpointRealizarAccion, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire('Éxito', 'Se ha tramitado el sumario correctamente.', 'success').then(() => {
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
                Swal.fire('Error', 'Hubo un problema al tramitar el sumario. Inténtalo nuevamente.', 'error');
            }
        }
    };

    const handleButtonClickRealizarAccion = () => {
        const hoy = new Date().toISOString().split("T")[0];

        // Validación: fecha obligatoria y posterior a hoy
        if (!fechaProrroga || fechaProrroga <= hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'Debes seleccionar un plazo posterior al día de hoy.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar cambiará el estado del sumario.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Realizar Acción',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRealizarAccion();
            }
        });
    };

    const handleChangeRut = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^0-9K]/g, '');
        if (value.length <= 9) {
            setRutAsesorJuridico(value);
        }


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

                            <div className="p-4">
                                <div className="bg-white border-gray-400 p-3 mt-2 rounded-lg shadow-lg px-10">
                                    <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-3">
                                        <h4 className="text-2xl text-gray-700 font-bold text-center">{tituloModal}</h4>
                                    </div>
                                    <p className="font-serif text-center text-gray-500 mb-2">
                                        Debe seleccionar un documento en formato PDF y presionar el botón cargar documento para cambiar el estado del sumario.
                                    </p>


                                    {/* Acción: Disponer informe asesor jurídico */}
                                    {accion === 'Dispone revisión asesor jurídico' && (
                                        <>
                                            {/* Campo RUT + Buscar */}
                                            <div className="w-full max-w-2xl mx-auto mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">RUT del Asesor Jurídico</label>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        value={rutAsesorJuridico}
                                                        onChange={handleChangeRut}
                                                        placeholder="Ej: 12345678K"
                                                        maxLength={9}
                                                        className="w-64 border border-gray-300 rounded-lg shadow-sm p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    />
                                                    <button
                                                        onClick={validarRutAsesor}
                                                        className="bg-primary-600 text-white px-4 rounded-lg shadow hover:bg-primary-700 transition"
                                                    >
                                                        Buscar asesor
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Si el RUT fue validado */}
                                            {asesorJuridicoValidado && (
                                                <>
                                                    {/* Datos del asesor */}
                                                    {datosAsesor && (
                                                        <div className="w-full max-w-2xl mx-auto bg-gray-200 border border-gray-300 rounded-lg p-4 shadow-md mb-6">
                                                            <h4 className="text-lg font-bold text-gray-700 mb-2 text-center">Datos del Asesor Jurídico</h4>
                                                            <p><strong>Nombre:</strong> {`${datosAsesor.primer_nombre} ${datosAsesor.segundo_nombre ?? ''} ${datosAsesor.apellido_paterno} ${datosAsesor.apellido_materno}`}</p>
                                                            <p><strong>RUT:</strong> {datosAsesor.rut}</p>
                                                            <p><strong>Código de Funcionario:</strong> {datosAsesor.codigo_funcionario}</p>
                                                            <p><strong>Grado:</strong> {datosAsesor.grado}</p>
                                                            <p><strong>Dotación:</strong> {datosAsesor.dotacion}</p>
                                                        </div>
                                                    )}

                                                    {/* Documento + Plazo + Botón */}
                                                    <div className="w-full max-w-2xl mx-auto flex items-end justify-center gap-4 mt-6 mb-6">
                                                        {/* Documento */}
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">{labelDocumento}</label>
                                                            <input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={AdjuntarDocumento}
                                                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                            />
                                                        </div>

                                                        {/* Plazo */}
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Plazo de revisión</label>
                                                            <input
                                                                type="date"
                                                                value={fechaProrroga}
                                                                onChange={(e) => setFechaProrroga(e.target.value)}
                                                                min={new Date().toISOString().split("T")[0]}
                                                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                                onKeyDown={(e) => e.preventDefault()}
                                                            />
                                                        </div>

                                                        {/* Botón */}
                                                        {documentoSumario && (
                                                            <button
                                                                className="h-[40px] bg-primary-600 text-white px-6 rounded-xl shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                                type="button"
                                                                onClick={handleButtonClickRealizarAccion}
                                                            >
                                                                Disponer al Asesor Jurídico
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* Todas las demás acciones */}
                                    {accion && accion !== 'Dispone revisión asesor jurídico' && (
                                        <>
                                            {/* Documento */}
                                            <div className="w-full max-w-2xl mx-auto mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{labelDocumento}</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={AdjuntarDocumento}
                                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>

                                            {/* Botón */}
                                            {accionesConPlazo.includes(accion) && documentoSumario ? (
                                                <div className="w-full max-w-2xl mx-auto flex items-end gap-4 mt-6 mb-6">
                                                    <CampoPlazoRevision fecha={fechaProrroga} setFecha={setFechaProrroga} />
                                                    <button
                                                        className="h-[40px] bg-primary-600 text-white px-6 rounded-xl shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                        type="button"
                                                        onClick={handleButtonClickRealizarAccion}
                                                    >
                                                        Cargar Documento
                                                    </button>
                                                </div>
                                            ) : (
                                                documentoSumario && (
                                                    <div className="w-full max-w-2xl mx-auto flex items-end gap-4 mt-6 mb-6">
                                                        <CampoPlazoRevision fecha={fechaProrroga} setFecha={setFechaProrroga} />
                                                        <button
                                                            className="h-[40px] bg-primary-600 text-white px-6 rounded-xl shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
                                                            type="button"
                                                            onClick={handleButtonClickRealizarAccion}
                                                        >
                                                            Cargar Documento
                                                        </button>
                                                    </div>
                                                )
                                            )}



                                        </>
                                    )}






                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="button"
                                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-500"
                                        onClick={closeModalAccionFiscal}
                                    >
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

export default ModalAccionTramita;

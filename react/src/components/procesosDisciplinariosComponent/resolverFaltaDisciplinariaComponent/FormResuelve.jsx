import React, { useState, useEffect } from 'react';
import axios from 'axios';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Select from "react-select";
import '../../../components/animacionEstilos/select.css';

function FormResuelve({ id, closeModalResuelve }) {

    //sancion de cada involucrado
    const [verSancionInvolucrado, setVerSancionInvolucrado] = useState([]);
    const [error, setError] = useState(null);
    const [idSancion, setIdSancion] = useState('');
    const [sanciones, setSanciones] = useState('');
    const [fechaSancion, setFechaSancion] = useState('');
    const [pdfResolucion, setPdfResolucion] = useState(null);
    const [diasArresto, setDiasArresto] = useState('');
    const diasArrestoFinal = diasArresto || 0;
    const navigate = useNavigate();

    // Estados para los selects
    const [altaReparticion, setAltaReparticion] = useState([]);
    const [selectedOptionAltaReparticion, setSelectedOptionAltaReparticion] = useState(null);

    const [reparticion, setReparticion] = useState([]);
    const [selectedOptionReparticion, setSelectedOptionReparticion] = useState(null);

    const [unidad, setUnidad] = useState([]);
    const [selectedOptionUnidad, setSelectedOptionUnidad] = useState(null);

    const [destacamento, setDestacamento] = useState([]);
    const [selectedOptionDestacamento, setSelectedOptionDestacamento] = useState(null);

    const [direccionResuelve, setDireccionResuelve] = useState(null);

    //Recursos
    const [recursoPresenta, setRecursoPresenta] = useState('');
    const [resolucionRecurso, setResolucionRecurso] = useState('');

    //endpoint
    const { url } = useStateContext(); // Cambiado aquí
    const sancionEndpoint = `${url}/api/resolverFalta/aplicarSancion/VerInformacionDeLaSancion/`;
    const endpointResuelve = `${url}/api/resolverFalta/aplicarSancion/resuelve/`;
    //endpoint de reparticiones
    const altaReparticionEndpoint = `${url}/api/altaReparticion`;
    const reparticionEndpoint = `${url}/api/reparticion`;
    const unidadEndpoint = `${url}/api/unidad`;
    const destacamentoEndpoint = `${url}/api/destacamento`;

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy}`;
    };

     // Función para cargar el select de Alta Repartición
     const getAltaReparticion = async () => {
        try {
            const response = await axios.get(altaReparticionEndpoint);
            const options = Array.isArray(response.data)
                ? response.data.map(item => ({
                    value: item.id,
                    label: item.nombre
                }))
                : [];
            setAltaReparticion(options);
        } catch (error) {
            console.error('Error fetching data alta reparticion:', error);
        }
    };

    // Función para cargar el select de Repartición
    const getReparticion = async () => {
        if (!selectedOptionAltaReparticion?.value) return;

        try {
            const response = await axios.get(`${reparticionEndpoint}?altaReparticionId=${selectedOptionAltaReparticion.value}`);
            const options = Array.isArray(response.data)
                ? response.data.map(item => ({
                    value: item.id,
                    label: item.nombre
                }))
                : [];
            setReparticion(options);
        } catch (error) {
            console.error('Error fetching data reparticion:', error);
        }
    };

    // Función para cargar el select de Unidad
    const getUnidad = async () => {
        if (!selectedOptionReparticion?.value) return;

        try {
            const response = await axios.get(`${unidadEndpoint}?reparticionId=${selectedOptionReparticion.value}`);
            const options = Array.isArray(response.data)
                ? response.data.map(item => ({
                    value: item.id,
                    label: item.nombre
                }))
                : [];
            setUnidad(options);
        } catch (error) {
            console.error('Error fetching data unidad:', error);
        }
    };

    // Función para cargar el select de Destacamento
    const getDestacamento = async () => {
        if (!selectedOptionUnidad?.value) return;

        try {
            const response = await axios.get(`${destacamentoEndpoint}?unidadId=${selectedOptionUnidad.value}`);
            const options = Array.isArray(response.data)
                ? response.data.map(item => ({
                    value: item.id,
                    label: item.nombre
                }))
                : [];
            setDestacamento(options);
        } catch (error) {
            console.error('Error fetching data destacamento:', error);
        }
    };

    // useEffect para cargar los selects dependientes
    useEffect(() => {
        getAltaReparticion();
    }, []);

    useEffect(() => {
        getReparticion();
        setSelectedOptionReparticion(null); // Resetear el valor seleccionado
        setUnidad([]); // Vaciar selects dependientes
        setDestacamento([]);
        setSelectedOptionUnidad(null);
        setSelectedOptionDestacamento(null);
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
        if (selectedOptionDestacamento) {
            setDireccionResuelve(selectedOptionDestacamento);
        }
    }, [selectedOptionAltaReparticion]);

    console.log(selectedOptionAltaReparticion?.value, "alta reparticion value")
    console.log(selectedOptionAltaReparticion?.label, "alta reparticion label")

    console.log(selectedOptionReparticion?.value, "reparticion value")
    console.log(selectedOptionReparticion?.label, "reparticion value")
    console.log(direccionResuelve)
    console.log(direccionResuelve)

    useEffect(() => {
        getUnidad();
        setSelectedOptionUnidad(""); // Resetear el valor seleccionado
        setDestacamento([]);
        setSelectedOptionDestacamento("");
        setDireccionResuelve("");
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
        if (selectedOptionDestacamento) {
            setDireccionResuelve(selectedOptionDestacamento);
        }
    }, [selectedOptionReparticion]);

    useEffect(() => {
        getDestacamento();
        setSelectedOptionDestacamento(""); // Resetear el valor seleccionado
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
        if (selectedOptionDestacamento) {
            setDireccionResuelve(selectedOptionDestacamento);
        }
    }, [selectedOptionUnidad]);

    useEffect(() => {
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
        if (selectedOptionDestacamento) {
            setDireccionResuelve(selectedOptionDestacamento);
        }
    }, [selectedOptionDestacamento]);

    console.log(selectedOptionAltaReparticion)

    const handleAplicarSancionResuelve = async (e) => {

        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('id_sancion', idSancion);
        formData.append('sanciones', sanciones);
        formData.append('fecha_sancion', fechaSancion);
        formData.append('resolucion_sancion', pdfResolucion);
        formData.append('dias_arresto', diasArrestoFinal);
        formData.append('recurso', recursoPresenta);
        formData.append('resolucion_recurso', resolucionRecurso);

        formData.append('falta_id_alta_reparticion', selectedOptionAltaReparticion?.value || '');
        formData.append('falta_nombre_alta_reparticion', selectedOptionAltaReparticion?.label || '');

        formData.append('falta_id_reparticion', selectedOptionReparticion?.value || '');
        formData.append('falta_nombre_reparticion', selectedOptionReparticion?.label || '');

        formData.append('falta_id_unidad', selectedOptionUnidad?.value || '');
        formData.append('falta_nombre_unidad', selectedOptionUnidad?.label || '');

        // Destacamento nuevo
        formData.append('falta_id_destacamento', selectedOptionDestacamento?.value || '');
        formData.append('falta_nombre_destacamento', selectedOptionDestacamento?.label || '');

        formData.append('falta_nombre_direccion_resuelve', direccionResuelve?.label || '');
        formData.append('falta_id_direccion_resuelve', direccionResuelve?.value || '');

        try {
            const response = await axios.post(`${endpointResuelve}${id}`, formData, config);
            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Sanción designada',
                    text: 'Se ha designado la sanción exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Redirigir a otra vista
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
                    text: 'Hubo un error al intentar designar la sanción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }

    const handleButtonClickResuelve = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar se designara la sanción a la alta repartición, repartición o unidad que seleccionó.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAplicarSancionResuelve(); // Solo ejecuta si se confirma
            }
        });
    };

    const fetchUltimaSancion = async () => {
        try {
            const response = await axios.get(`${sancionEndpoint}${id}`);
            if (response.data.success) {
                setVerSancionInvolucrado(response.data.ultima_sancion);
                setIdSancion(response.data.ultima_sancion.id);
                setSanciones(response.data.ultima_sancion.sancion);

                console.log(verSancionInvolucrado.sancion, "hola mundo loco");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Error al obtener la sanción');
        }
    };

    useEffect(() => {
        fetchUltimaSancion();
        setFechaSancion(obtenerFechaDeHoy());
    }, [id]);

    return (
        <div className='ml-6 mr-6 mt-2 mb-4 p-7 bg-white rounded-lg border-2 border-gray-300'>

            <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-2">
                <h4 className="text-2xl text-gray-700 font-bold text-center">No conforme (Resuelve)</h4>
            </div>
            <p className='font-serif text-center text-gray-500 mb-8'>Debe designar la Unidad, Repartición o Alta repartición que resolvera esta sanción. </p>
            <div className="border-2 border-gray-300 rounded-lg mb-4">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 p-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sancion">
                            <strong className="text-lg">Sanción:</strong> {verSancionInvolucrado.sancion}
                        </label>
                    </div>
                    {verSancionInvolucrado.dias_arresto >= 1 && (
                        <div className="flex-1">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="diasArresto">
                                <strong className="text-lg">Días de Arresto:</strong> {verSancionInvolucrado.dias_arresto}
                            </label>
                        </div>
                    )}
                    <div className="flex-1">
                        <label className="block text-gray-700 font-bold mb-2 " htmlFor="documentoInformaFalta">
                            <strong className="text-lg">Resolución:</strong>
                            <a
                                href={`${url}/uploads/${verSancionInvolucrado.numero_rol_falta}/${verSancionInvolucrado.resolucion_sancion}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-1 py-1 ml-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transform transition duration-300 hover:scale-105"
                            >
                                Descargar
                                <span className="ml-1" role="img" aria-label="Descargar">📁</span>
                            </a>
                        </label>
                    </div>
                </div>
            </div>

 {/* Select de Alta Repartición */}
 <div className="container mx-auto">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
                    <div className="flex-1">
                        <Select
                            options={altaReparticion}
                            placeholder="Alta Repartición"
                            value={selectedOptionAltaReparticion || null}
                            onChange={setSelectedOptionAltaReparticion}
                            isClearable
                            noOptionsMessage={() => "No se encontró la Alta Repartición buscada"}
                            className="w-full"
                            classNamePrefix="custom-select"
                        />
                    </div>
                    {/* Select de repartición */}
                    {selectedOptionAltaReparticion && selectedOptionAltaReparticion.label && (
                        <div className="flex-1">
                            <Select
                                options={reparticion}
                                placeholder="Repartición"
                                value={selectedOptionReparticion || null}
                                onChange={setSelectedOptionReparticion}
                                isClearable
                                noOptionsMessage={() => "No se encontró la Repartición buscada"}
                                className="w-full"
                                classNamePrefix="custom-select"
                            />
                        </div>
                    )}
                    {/* Select de Unidad */}
                    {selectedOptionReparticion && selectedOptionReparticion.label && (
                        <div className="flex-1">
                            <Select
                                options={unidad}
                                placeholder="Unidad"
                                value={selectedOptionUnidad || null}
                                onChange={setSelectedOptionUnidad}
                                isClearable
                                noOptionsMessage={() => "No se encontró la Unidad buscada"}
                                className="w-full"
                                classNamePrefix="custom-select"
                            />
                        </div>
                    )}
                    {/* Select de Destacamento */}
                    {selectedOptionUnidad && selectedOptionUnidad.label && (
                        <div className="flex-1">
                            <Select
                                options={destacamento}
                                placeholder="Dotación"
                                value={selectedOptionDestacamento || null}
                                onChange={setSelectedOptionDestacamento}
                                isClearable
                                noOptionsMessage={() => "No se encontró el Destacamento buscado"}
                                className="w-full"
                                classNamePrefix="custom-select"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className='overflow-hidden mt-4 mb-2 bg-white rounded-lg shadow-md p-6 ml-0 mr-0 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                <div className="flex justify-center">
                    <div>
                        <button
                            className="bg-green-700 ml-4 hover:bg-green-500 text-white text-sm px-4 py-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-500"
                            type="button"
                            onClick={handleButtonClickResuelve}
                        >
                            Designar
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>

    )
}

export default FormResuelve

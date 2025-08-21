import React, { useEffect, useState } from 'react';
import Select from "react-select";
import axios from 'axios';
import { useStateContext } from '../../contexts/ContextProvider'; // Importa el contexto
import '../../components/animacionEstilos/select.css';
import Swal from 'sweetalert2';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormAsignarDotación({ id, CloseModalDotacion }) {

    // URL para peticiones al API
    const { url } = useStateContext(); // Contexto para traer la URL del sitio
    const altaReparticionEndpoint = `${url}/api/altaReparticion`;
    const reparticionEndpoint = `${url}/api/reparticion`;
    const unidadEndpoint = `${url}/api/unidad`;
    const destacamentoEndpoint = `${url}/api/destacamento`;
    const endpointAsignarDotacion = `${url}/api/user/asignarDotacion/`;

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

    //Usuario iniciado en la sesión actual
    const [currentUser, setCurrentUser] = React.useState(JSON.parse(localStorage.getItem('currentUser')) || {});
  
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
    }, [selectedOptionAltaReparticion]);


    useEffect(() => {
        getUnidad();
        setSelectedOptionUnidad(null); // Resetear el valor seleccionado
        setDestacamento([]);
        setSelectedOptionDestacamento(null);
        setDireccionResuelve(null);
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
    }, [selectedOptionReparticion]);

    useEffect(() => {
        getDestacamento();
        setSelectedOptionDestacamento(null); // Resetear el valor seleccionado
        if (selectedOptionAltaReparticion) {
            setDireccionResuelve(selectedOptionAltaReparticion);
        }
        if (selectedOptionReparticion) {
            setDireccionResuelve(selectedOptionReparticion);
        }
        if (selectedOptionUnidad) {
            setDireccionResuelve(selectedOptionUnidad);
        }
    }, [selectedOptionUnidad]);

    const handleAsignarDotacion = async (e) => {
        const formData = new FormData();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('codigo_alta_reparticion', selectedOptionAltaReparticion?.value || '');
        formData.append('descripcion_alta_reparticion', selectedOptionAltaReparticion?.label || '');

        formData.append('codigo_reparticion', selectedOptionReparticion?.value || 'No registra');
        formData.append('descripcion_reparticion', selectedOptionReparticion?.label || 'No registra');

        formData.append('codigo_unidad', selectedOptionUnidad?.value || 'No registra');
        formData.append('descripcion_unidad', selectedOptionUnidad?.label || 'No registra');

        // Destacamento nuevo
        formData.append('codigo_destacamento', selectedOptionDestacamento?.value || 'No registra');
        formData.append('descripcion_destacamento', selectedOptionDestacamento?.label || 'No registra');

        formData.append('dotacion', direccionResuelve?.label || '');
        formData.append('codigo_dotacion', direccionResuelve?.value || '');

        try {
            const response = await axios.post(`${endpointAsignarDotacion}${id}`, formData, config);
            if (response.data && response.data.message) {

                Swal.fire({
                    title: 'Dotacion asignada',
                    text: 'Se ha asignado la dotación exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // Actualizar solo las dotaciones el if es para validar si es el mismo usuario el que se cambia la dotacion lo actualiza
                    if (currentUser.id === id) {
                        setCurrentUser((prevUser) => {
                            const updatedUser = {
                                ...prevUser,
                                descripcion_alta_reparticion: selectedOptionAltaReparticion?.label || '',
                                codigo_alta_reparticion: selectedOptionAltaReparticion?.value || '',

                                descripcion_reparticion: selectedOptionReparticion?.label || '',
                                codigo_reparticion: selectedOptionReparticion?.value || '',

                                descripcion_unidad: selectedOptionUnidad?.label || '',
                                codigo_unidad: selectedOptionUnidad?.value || '',

                                descripcion_destacamento: selectedOptionDestacamento?.label || '',
                                codigo_destacamento: selectedOptionDestacamento?.value || '',

                                // Mantén las demás propiedades
                                dotacion: direccionResuelve?.label,  // Solo actualiza "dotacion"
                                codigo_dotacion: direccionResuelve?.value,
                            };

                            // Actualizar también el valor en localStorage
                            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                            return updatedUser;

                        });
                    }
                    CloseModalDotacion();
                    //toastify alerta de usuario eliminado
                    toast.success(response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        className: 'foo-bar text-white bg-gray-700',
                        theme: 'black',
                        transition: Zoom
                    })
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
                    text: 'Hubo un error al intentar designar la dotación. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    };

    const handleButtonClickAsignarDotacion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Al confirmar le designara una nueva dotación al funcionario que seleccionó.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAsignarDotacion(); // Solo ejecuta si se confirma
            }
        });
    };

    return (
        <div>
            <div className='ml-6 mr-6 mt-6 mb-6 p-8 bg-white rounded-lg border-2 border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 ml-6 mr-6 mb-3 ">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Asignar dotación al funcionario</h4>
                </div>
                <p className='font-serif text-center text-gray-500 mb-8'>Esta sección corresponde a la asigación de la dotación al funcionario. <br /> Seleccione una dotación y presione el boton asignar para finalizar </p>
                <div className="w-full max-w-4xl mx-auto">
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
                </div>
            </div>
            <div className='overflow-hidden mt-2 mb-8 bg-white rounded-lg shadow-md p-6 ml-6 mr-6 border border-gray-300'>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                    <h4 className="text-2xl text-gray-700 font-bold text-center">Acciones</h4>
                </div>
                <div className="flex justify-center">

                    <button
                        className='bg-green-700 mr-2 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-primary-600 transition duration-500'
                        type="button"
                        onClick={handleButtonClickAsignarDotacion}
                    >
                        Asignar
                    </button>

                    <button
                        className='bg-gray-500 mr-2 hover:bg-gray-400 text-white text-sm px-4 py-2 rounded-md focus:outline-none
                focus:ring-2 focus:ring-gray-600 transition duration-500'
                        type="button"
                        onClick={CloseModalDotacion}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormAsignarDotación

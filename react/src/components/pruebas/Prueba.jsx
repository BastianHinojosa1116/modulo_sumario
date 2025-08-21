import React, { useEffect, useState } from 'react';
import Select from "react-select";
import axios from 'axios';
import { useStateContext } from '../../contexts/ContextProvider'; // Importa el contexto
import '../../components/animacionEstilos/select.css';

function Prueba() {
    // URL para peticiones al API
    const { url } = useStateContext(); // Contexto para traer la URL del sitio
    const altaReparticionEndpoint = `${url}/api/altaReparticion`;
    const reparticionEndpoint = `${url}/api/reparticion`;
    const unidadEndpoint = `${url}/api/unidad`;
    const destacamentoEndpoint = `${url}/api/destacamento`;

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

    console.log(direccionResuelve, "aaa")
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

    return (
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
    );
}

export default Prueba;

import React, { useEffect, useState } from 'react';
import Select from "react-select";
import axios from 'axios';
import Pagination from '../../pagination/PaginationConsulta'; // Ajusta la ruta según tu estructura de archivos
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alertas from '../../animacionEstilos/Alertas';
import { useStateContext } from '../../../contexts/ContextProvider'; // Importa el contexto

function IndexConsulta() {

    // Declaración de variables de estado para cada campo
    const [rol, setRol] = useState('');
    const [nombreInvolucrado, setNombreInvolucrado] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [codigoFuncionario, setCodigoFuncionario] = useState('');
    const [grado, setGrado] = useState('');
    const [escalafon, setEscalafon] = useState('');
    const [tipoSancion, setTipoSancion] = useState('');
    const [causal, setCausal] = useState('');
    const [rut, setRut] = useState('');
    const [data, setData] = useState('');

    //lugar seleccionado en el formulario para resolver el caso
    const [direccionResuelve, setDireccionResuelve] = useState('');
    const [direccionResuelveId, setDireccionResuelveId] = useState('');
    //paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const maxVisiblePages = 6;
    const [totalRecords, setTotalRecords] = useState(0);
    //otras variables definidas
    const { url } = useStateContext(); // contexto para traer la url del sitio
    const [faltas, setFaltas] = useState([]);//Arreglo con faltas
    const endpointListarFaltas = `${url}/api/procesosDisciplinarios/consulta`;
    const endpointBuscarRegistros = `${url}/api/procesosDisciplinarios/buscarRegistros`;
    //endpoint de reparticiones
    const altaReparticionEndpoint = `${url}/api/altaReparticion`;
    const reparticionEndpoint = `${url}/api/reparticion`;
    const unidadEndpoint = `${url}/api/unidad`;
    const destacamentoEndpoint = `${url}/api/destacamento`;
    const [isVisibleTable, setIsVisibleTable] = useState(false);

    // Estados para los selects
    const [altaReparticion, setAltaReparticion] = useState([]);
    const [selectedOptionAltaReparticion, setSelectedOptionAltaReparticion] = useState(null);

    const [reparticion, setReparticion] = useState([]);
    const [selectedOptionReparticion, setSelectedOptionReparticion] = useState(null);

    const [unidad, setUnidad] = useState([]);
    const [selectedOptionUnidad, setSelectedOptionUnidad] = useState(null);

    const [destacamento, setDestacamento] = useState([]);
    const [selectedOptionDestacamento, setSelectedOptionDestacamento] = useState(null);

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
    }, [selectedOptionAltaReparticion]);

    useEffect(() => {
        getUnidad();
        setSelectedOptionUnidad(null); // Resetear el valor seleccionado
        setDestacamento([]);
        setSelectedOptionDestacamento(null);
    }, [selectedOptionReparticion]);

    useEffect(() => {
        getDestacamento();
        setSelectedOptionDestacamento(null); // Resetear el valor seleccionado
    }, [selectedOptionUnidad]);

    const convertirFecha = (fecha) => {
        const [yyyy, mm, dd] = fecha.split('-');
        return `${dd}-${mm}-${yyyy}`;
    };
    const fechaInicio = startDate ? convertirFecha(startDate) : "";
    const fechaFin = endDate ? convertirFecha(endDate) : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const selectedNombreAltaReparticion = selectedOptionAltaReparticion?.label || '';
            const selectedReparticion = selectedOptionReparticion?.label || '';
            const selectedUnidad = selectedOptionUnidad?.label || '';
            const selectedDestacamento = selectedOptionDestacamento?.label || '';

            const response = await axios.get(endpointBuscarRegistros, {
                params: {
                    rol,
                    nombreInvolucrado,
                    fechaInicio,
                    fechaFin,
                    codigoFuncionario,
                    grado,
                    escalafon,
                    tipoSancion,
                    causal,
                    rut,
                    direccionResuelve,
                    selectedNombreAltaReparticion,
                    selectedReparticion,
                    selectedUnidad,
                    selectedDestacamento,
                }
            });
            console.log(response.data.data, "holaaa!!!!!!")
            setFaltas(response.data.data);
            setLastPage(response.data.last_page);
            setTotalRecords(response.data.total);
            setIsVisibleTable(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al realizar la consulta');
        }
    };

    // const getAllFaltas = async () => {
    //     const response = await axios.get(`${endpointListarFaltas}?page=${currentPage}`);
    //     setFaltas(response.data.data);
    //     setLastPage(response.data.last_page);
    //     setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
    // };


    const handlePageChange = (page) => {
        // Crea el objeto de parámetros de búsqueda
        const selectedNombreAltaReparticion = selectedOptionAltaReparticion?.label || '';
        const selectedReparticion = selectedOptionReparticion?.label || '';
        const selectedUnidad = selectedOptionUnidad?.label || '';
        const selectedDestacamento = selectedOptionDestacamento?.label || '';

        const params = {
            rol,
            nombreInvolucrado,
            fechaInicio,
            fechaFin,
            codigoFuncionario,
            grado,
            escalafon,
            tipoSancion,
            causal,
            rut,
            direccionResuelve,
            selectedNombreAltaReparticion,
            selectedReparticion,
            selectedUnidad,
            selectedDestacamento,
            page // Agrega la página actual
        };

        // Realiza la solicitud a tu endpoint
        axios.get(endpointBuscarRegistros, { params })
            .then(response => {
                // Aquí maneja la respuesta
                setFaltas(response.data.data); // Asumiendo que los registros están en 'data'
                setLastPage(response.data.last_page); // Asumiendo que el total de páginas está en 'last_page'
                setCurrentPage(page); // Actualiza la página actual

            })
            .catch(error => {
                // Maneja errores
                console.error("Error al obtener registros:", error);
            });
    };

    const handleChangeCausales = (event) => {
        setCausal(event.target.value);
    };

    useEffect(() => {

        const alertMessage = sessionStorage.getItem('alertMessage');
        if (alertMessage) {
            Alertas.success(alertMessage);
            sessionStorage.removeItem('alertMessage');
        }
    }, [currentPage]);

    return (
        <div className='mb-24'>
            <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg border-2 border-gray-300 ">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Formulario de Consulta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="rol">
                                Número de Rol
                            </label>
                            <input
                                id="rol"
                                type="text"
                                placeholder="Ingrese el número de rol"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="nombreInvolucrado">
                                Nombre del Involucrado
                            </label>
                            <input
                                id="nombreInvolucrado"
                                type="text"
                                placeholder="Ingrese los nombres"
                                value={nombreInvolucrado}
                                onChange={(e) => setNombreInvolucrado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="startDate">
                                Fecha Inicio
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="endDate">
                                Fecha Fin
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="codigoFuncionario">
                                Código de Funcionario
                            </label>
                            <input
                                id="codigoFuncionario"
                                type="text"
                                placeholder="Ingrese el código"
                                value={codigoFuncionario}
                                onChange={(e) => setCodigoFuncionario(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="grado">
                                Grado
                            </label>
                            <input
                                id="grado"
                                type="text"
                                placeholder="Ingrese el grado"
                                value={grado}
                                onChange={(e) => setGrado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="escalafon">
                                Escalafón
                            </label>
                            <input
                                id="escalafon"
                                type="text"
                                placeholder="Ingrese el escalafón"
                                value={escalafon}
                                onChange={(e) => setEscalafon(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="tipoSancion">
                                Tipo de Sanción
                            </label>
                            <input
                                id="tipoSancion"
                                type="text"
                                placeholder="Ingrese el tipo de sanción"
                                value={tipoSancion}
                                onChange={(e) => setTipoSancion(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="causal" className="block text-gray-700 text-sm font-medium mb-1">
                                Causales:
                            </label>
                            <select
                                id="causal"
                                name="causal"
                                className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                                value={causal}
                                onChange={handleChangeCausales}
                            >
                                <option value="">Seleccione</option>
                                <option value="No cumplir con interés deberes profesionales">                         No cumplir con interés deberes profesionales</option>
                                <option value="Inasistencia a servicio o falta de puntualidad">                       Inasistencia a servicio o falta de puntualidad</option>
                                <option value="No cumplir orden o hacerlo con tardanza">                              No cumplir orden o hacerlo con tardanza</option>
                                <option value="Faltar lista de solteros">                                             Faltar lista de solteros</option>
                                <option value="Abandono del servicio o no cumplir comisión">                          Abandono del servicio o no cumplir comisión</option>
                                <option value="Negligencia o descuido que derive en falta cooperación al servicio">   Negligencia o descuido que derive en falta cooperación al servicio</option>
                                <option value="Conducta impropia de la vida privada">                                 Conducta impropia de la vida privada</option>
                                <option value="Destrucción o pérdida de especie fiscal">                              Destrucción o pérdida de especie fiscal</option>
                                <option value="Omisión o atraso dar cuenta de hechos">                                Omisión o atraso dar cuenta de hechos</option>
                                <option value="Falta de respeto a jerarquía superior">                                Falta de respeto a jerarquía superior</option>
                                <option value="Destruir o sustraer correspondencia oficial">                          Destruir o sustraer correspondencia oficial</option>
                                <option value="Descuidar su aseo o vestir de forma incorrecta">                       Descuidar su aseo o vestir de forma incorrecta</option>
                                <option value="Aprovechar situación funcionaria en beneficio personal">               Aprovechar situación funcionaria en beneficio personal </option>
                                <option value="Omisión de registrar hechos de importancia">                           Omisión de registrar hechos de importancia</option>
                                <option value="Abandonar guarnición sin autorización">                                Abandonar guarnición sin autorización</option>
                                <option value="Trato indebido a subalterno o compañero">                              Trato indebido a subalterno o compañero</option>
                                {/* Add more options as needed */}

                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="rut">
                                Número de RUT
                            </label>
                            <input
                                id="rut"
                                type="text"
                                placeholder="Ingrese el número de RUT"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>
                    {/* Select de Alta Repartición */}
            <div className="">
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

                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Consultar
                        </button>
                    </div>
                </form>
            </div>
            {/* Sección oculta inicialmente con transición */}
            <div
                className={`transition-all duration-500 ease-in-out  ${isVisibleTable ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}
            >


                <div className='border-2 border-gray-300 rounded-md shadow-md overflow-hidden px-5 py-2 pb-6 bg-white mt-8'>
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Registros encontrados</h2>
                    <div className='ml-8 mr-8 mt-4 '>
                        <div className='overflow-x-auto shadow-md mb-4'>
                            <div className="border border-gray-300 rounded-md overflow-hidden">
                                <table className="min-w-full bg-white rounded-xl">
                                    <thead className="bg-primary-700 text-white">
                                        <tr>
                                            <th className="py-2 px-4">Rol</th>
                                            <th className="py-2 px-4">Causales</th>
                                            <th className="py-2 px-4">Resuelve</th>
                                            <th className="py-2 px-4">Fecha de ingreso</th>
                                            <th className="py-2 px-4">Estado del caso</th>
                                            <th className="py-2 px-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {faltas.length > 0 ? (
                                            faltas.map((falta) => (
                                                <tr key={falta.id} className="border-b transition-colors duration-500 hover:bg-gray-200">
                                                    <td className="py-2 px-4">{falta.numero_rol}</td>
                                                    <td className="py-2 px-4">{falta.causales}</td>
                                                    <td className="py-2 px-4">{falta.falta_nombre_direccion_resuelve}</td>
                                                    <td className="py-2 px-4">{falta.fecha_ingreso}</td>
                                                    <td className="py-2 px-4 text-green-600">{falta.estado_proceso}</td>
                                                    <td className="py-2 px-4">
                                                        <div className="flex justify-center space-x-2">
                                                            {/* agregar botones  */}
                                                            <Link

                                                                to={`/procesosDisciplinarios/consulta/verFalta/${falta.id}`}
                                                                className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105" >
                                                                Ver Falta
                                                            </Link>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="py-2 px-2 text-center" colSpan="6">Sin registros encontrados</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Utiliza el componente Pagination */}
                    <div>

                        <Pagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            handlePageChange={handlePageChange}
                            maxVisiblePages={maxVisiblePages}
                            totalRecords={totalRecords}
                        />
                    </div>
                    <div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IndexConsulta;

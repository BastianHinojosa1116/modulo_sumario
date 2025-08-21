import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí para usar la url
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function IndexDisponePrimerasDiligencias() {

    //endpoint para utilizar en los botones
    const navigate = useNavigate();
    const { url } = useStateContext(); // Cambiado aquí
    const obtenerFiscal = `${url}/api/primerasDiligencias/obtenerFiscal`;
    const endpointDisponerPrimeraDiligencia = `${url}/api/disponerPrimeraDiligencia`;

    //select de motivos dinamico
    const [motivo, setMotivo] = useState([]);
    const [subMotivo, setSubMotivo] = useState([]);
    // const [funcionario, setFuncionario] = useState(''); // Nuevo estado para funcionario
    const [documentoPPDD, setDocumentoPPDD] = useState(null); // Nuevo estado para el documento PP.DD
    const fechaIngreso = new Date().toISOString().split("T")[0]; //fecha de ingreso
    const [fechaDisponePPDD, setFechaDisponePPDD] = useState(''); // Nuevo estado para la fecha dispone PP.DD
    const [plazo, setPlazo] = useState(''); // Nuevo estado para el plazo
    const [descripcionHecho, setDescripcionHecho] = useState(""); // Información del textarea de descripción del hecho
    const funcionarioIngresa = JSON.parse(localStorage.getItem('currentUser') || '{}');


    //fiscal seccion
    const [fiscal, setFiscal] = useState(''); // Nuevo estado para el fiscal
    const [buscarRutFiscal, setBuscarRutFiscal] = useState('');
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    //involucrados seccion
    const [involucrado, setInvolucrado] = useState([]);
    const [involucradosIngresados, setInvolucradosIngresados] = useState('');
    const [personasAgregadas, setPersonasAgregadas] = useState([]);
    const [userData, setUserData] = useState(null);
    const [buscarRut, setBuscarRut] = useState('');

    const maxCaracteres = 500; // Máximo de caracteres permitidos
    //Setea la información de la cantidad de caracteres del textarea
    const handleChangeTextArea = (e) => {
        if (e.target.value.length <= maxCaracteres) {
            setDescripcionHecho(e.target.value);
        }
    };

    // Maneja la selección de motivos
    const handleMotivoChange = (mot) => {
        setMotivo((prevMotivos) => {
            let newMotivos;
            if (prevMotivos.includes(mot)) {
                newMotivos = prevMotivos.filter((item) => item !== mot); // Deseleccionar motivo

                // Remover submotivos asociados al motivo deseleccionado
                setSubMotivo((prevSub) =>
                    prevSub.filter((sub) => !subMotivos[mot]?.includes(sub))
                );
            } else {
                newMotivos = [...prevMotivos, mot]; // Seleccionar motivo
            }

            return newMotivos;
        });

        // Asegurar que la actualización de subMotivo ocurre dentro de su propio setState
        setSubMotivo((prevSubMotivos) => {
            if (mot === "Enfermedad" && !prevSubMotivos.includes("Enfermedad")) {
                return [...prevSubMotivos, "Enfermedad"];
            }
            return prevSubMotivos;
        });
    };

    // Maneja la selección de sub-motivos
    const handleSubMotivoChange = (sub) => {
        setSubMotivo((prev) =>
            prev.includes(sub) ? prev.filter((item) => item !== sub) : [...prev, sub]
        );
    };

    const subMotivos = {
        Lesión: ['Actos del servicio', 'Trayecto'],
        Daño: ['Vestuario', 'Vehículo', 'Accesorio', 'Armamento', 'Otros'],
        Enfermedad: ['Enfermedad'],
    };

    console.log(subMotivo, "elegi este")

    // Maneja el cambio del archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setDocumentoPPDD(file);
    };

    //busca el fiscal en la base de datos del sistema
    const handleBuscarFiscal = async () => {
        try {
            const response = await axios.get(obtenerFiscal, {
                params: { rut: buscarRutFiscal }
            });

            if (response.status === 200) {
                setFiscal(response.data);
                // setError(''); // Limpiar cualquier error anterior
            } else {
                setFiscal(null);
                toast.error("Error, no se logro realizar la busqueda", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar text-white bg-gray-700',
                    theme: 'black',
                });
            }
        } catch (err) {
            setFiscal(null);
            toast.error("Error, no se encontro al usuario ingresado", {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar text-white bg-gray-700',
                theme: 'black',
            });
        }
    };

    //boton eliminar fiscal
    const btnEliminarFiscal = () => {
        setFiscal("");
    };

    //busca el involucrado en el autentificatic
    const buscarInvolucrado = async () => {
        try {
            const urlUser = `http://autentificaticapi.carabineros.cl/api/auth/user-full/${buscarRut}`;
            const token = localStorage.getItem("TOKEN");

            if (!token) {
                setError("No se encontró un token de autorización en el localStorage.");
                return;
            }

            const setting = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            };

            const resp = await axios.get(urlUser, setting);
            if (resp && resp.data.success) {
                setUserData(resp.data.success.user);
                setError(null); // Limpiar cualquier error anterior
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors.rut);
                setUserData(null); // Limpiar datos anteriores si hubo un error
            }
        }
    };

    //agrega los involucrados al arreglo
    const agregarInvolucrado = () => {
        const nuevoInvolucrado = {
            nombre: `${userData.apellido_materno} ${userData.apellido_paterno} ${userData.primer_nombre} ${userData.segundo_nombre}`,
            rut: formatRut(userData.rut),
            primer_nombre: userData.apellido_materno,
            segundo_nombre: userData.apellido_paterno,
            apellido_paterno: userData.primer_nombre,
            apellido_materno: userData.segundo_nombre,
            correo_institucional: (userData.correo_institucional) ? userData.correo_institucional : userData.correo_particular,
            codigo_alta_reparticion: userData.codigo_alta_reparticion,
            descripcion_alta_reparticion: userData.descripcion_alta_reparticion,
            descripcion_reparticion: userData.descripcion_reparticion,
            codigo_reparticion: userData.codigo_reparticion,
            descripcion_unidad: userData.descripcion_unidad,
            codigo_unidad: userData.codigo_unidad,
            descripcion_destacamento: userData.descripcion_destacamento,
            codigo_destacamento: userData.codigo_destacamento,
            codigo_dotacion: userData.codigo_dotacion,
            dotacion: userData.dotacion,
            escalafon: userData.escalafon,
            // rut: buscarRut,
            codigo_funcionario: userData.codigo_funcionario,
            grado: userData.grado,

        };
        // Verificar si ya existe una involucrado con el mismo rut
        const involucradoExistente = involucrado.find(involucrado => involucrado.rut === nuevoInvolucrado.rut);

        if (involucradoExistente) {
            toast.warning("No puedes ingresar al mismo involucrado", {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar text-white bg-gray-700',
                theme: 'black',
            });
            return;
        }

        // Agregar la nueva involucrado al arreglo si no existe una involucrado con el mismo rut
        setInvolucrado([...involucrado, nuevoInvolucrado]);

        setUserData(null);
    };



    const eliminarInvolucrado = (index, event) => {
        event.preventDefault(); // Evita el refresco de la página
        const nuevoInvolucrado = [...involucrado];
        nuevoInvolucrado.splice(index, 1);
        setInvolucrado(nuevoInvolucrado);
    };


    const formatRut = (rut) => {
        // Eliminar caracteres no numéricos y dejar solo dígitos y la letra K (si existe)
        let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

        // Verificar si el RUT es válido
        if (!/^[0-9]+[0-9kK]*$/.test(cleanRut)) {
            // RUT inválido, devolver el valor original
            return rut;
        }

        // Eliminar el "0" al principio del RUT
        cleanRut = cleanRut.replace(/^0+/, '');

        return cleanRut;
    }

    //inicio del metodo agregar formulario ppd
    const convertirFecha = (fecha) => {
        const [yyyy, mm, dd] = fecha.split('-');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleSubmitFormularioPPDD = async () => {

        const fechaIngresoFormateada = convertirFecha(fechaIngreso);
        const fechaDisponePPDDFormateada = convertirFecha(fechaDisponePPDD);
        const plazoFormateada = convertirFecha(plazo);

        const formData = new FormData();
        //datos del formulario
        formData.append('fecha_ingreso_formulario', fechaIngresoFormateada);
        formData.append('funcionario_ingresa', funcionarioIngresa.id);
        formData.append('fecha_dispone_ppdd', fechaDisponePPDDFormateada);
        formData.append('documento_ppdd', documentoPPDD);
        formData.append('plazo', plazoFormateada);
        formData.append('fiscal_asignado', fiscal.id);
        formData.append('motivo', motivo);
        formData.append('subMotivo', subMotivo);
        formData.append('descripcion_hecho', descripcionHecho);
        //reparticion del usuario que esta creando la falta

        const involucradosJson = JSON.stringify(involucrado);
        formData.append('involucrados', involucradosJson);

        try {
            const response = await axios.post(endpointDisponerPrimeraDiligencia, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.message) {
                sessionStorage.setItem('alertMessage', response.data.message);
                Swal.fire({
                    title: 'Creada',
                    text: 'La falta disciplinaria ha sido creada con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/dispone-primeras-diligencias/fiscal');
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
                    text: 'Hubo un error al crear la falta disciplinaria. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    };

    const handleButtonClick = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas crear esta falta disciplinaria?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmitFormularioPPDD(); // Solo ejecuta si se confirma
            }
        });
    };
    //fin del metodo agregar formulario ppd

    useEffect(() => {
        if (error) {
            setIsVisible(true);
            const timeoutId = setTimeout(() => {
                setError(null);
                setIsVisible(false);
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }

    }, [error]);

    return (
        <div className='pl-2 pr-2 mb-16'>
            <div className="max-w-full  mt-4 p-6 bg-white shadow-lg border border-gray-300 rounded-lg">
                <h2 className="text-2xl  font-bold mb-6 text-center text-gray-700">Formulario PP.DD</h2>
                <div className="space-y-4">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Funcionario que ingresa */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Funcionario que ingresa:</label>
                            <input
                                type="text"
                                value={funcionarioIngresa.name}
                                placeholder="Nombre del funcionario"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                readOnly
                            />
                        </div>

                        {/* Fecha dispone PP.DD */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Fecha dispone PP.DD:</label>
                            <input
                                type="date"
                                value={fechaDisponePPDD}
                                onChange={(e) => setFechaDisponePPDD(e.target.value)}
                                max={new Date().toISOString().split("T")[0]} // Restringe fechas futuras
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onKeyDown={(e) => e.preventDefault()} // Evita que el usuario escriba con el teclado
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Cargar documento PP.DD */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Documento que Dispone:</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange} // Llama a la función de cambio
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Plazo calendario */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">plazo:</label>
                            <input
                                type="date"
                                value={plazo}
                                min={new Date().toISOString().split("T")[0]} // Restringe fechas futuras // Restringe a fechas desde hoy en adelante
                                onChange={(e) => setPlazo(e.target.value)} // Actualiza el estado al seleccionar una fecha
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onKeyDown={(e) => e.preventDefault()} // Evita que el usuario escriba con el teclado
                            />
                        </div>
                    </div>

                    {/* Fiscal */}
                    <div className="flex items-center gap-4">
                        {/* Campo Fiscal */}
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2">Fiscal:</label>
                            <input
                                value={buscarRutFiscal}
                                onChange={(e) => setBuscarRutFiscal(e.target.value)}
                                type="text"
                                placeholder="Ingrese el rut del fiscal"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Botón Crear */}
                        <button
                            type="submit"
                            className={`bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none mt-7
                                ${!buscarRutFiscal.trim() ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-green-500 transition duration-500'}`}
                            onClick={handleBuscarFiscal}
                        >
                            Asignar
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-700 ease-in-out ${fiscal ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
                            } delay-200`}
                    >
                        {fiscal && (
                            <div className="block border border-gray-300 p-5  rounded-md">
                                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                                    <h4 className="text-2xl text-gray-700  font-bold text-center">Fiscal asignado</h4>
                                </div>
                                <div
                                    className="border border-gray-400 rounded-lg p-4 mb-4 bg-slate-200 shadow-md"
                                >
                                    <p className="text-lg font-semibold">Nombre: {(fiscal.primer_nombre) ? (fiscal.primer_nombre) : ""} {(fiscal.segundo_nombre) ? (fiscal.segundo_nombre) : ""} {(fiscal.apellido_paterno) ? (fiscal.apellido_paterno) : ""} {(fiscal.apellido_materno) ? (fiscal.apellido_materno) : ""}</p>
                                    <p className="text-sm text-gray-600">Rut: {fiscal.rut}</p>
                                    <p className="text-sm text-gray-600">Codigo de funcionario: {fiscal.codigo_funcionario}</p>
                                    <p className="text-sm text-gray-600">Grado: {fiscal.grado}</p>
                                    <p className="text-sm text-gray-600">Dotación: {fiscal.dotacion}</p>
                                    {/* <p className="text-sm text-gray-600">RUT: {userData.rut}</p> */}
                                    <div className="mt-2">

                                        <button
                                            onClick={btnEliminarFiscal} // Llama a la función para limpiar el estado
                                            className=" px-4 py-2 text-white bg-red-600 rounded hover:bg-red-400 transition-all duration-500">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {/* Motivo de la PP.DD */}
                        <label className="block text-gray-700 font-medium mb-2">Motivo de la PP.DD:</label>
                        <div className="flex flex-wrap gap-4">
                            {Object.keys(subMotivos).map((mot) => (
                                <label key={mot} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={mot}
                                        checked={motivo.includes(mot)}
                                        onChange={() => handleMotivoChange(mot)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{mot}</span>
                                </label>
                            ))}
                        </div>

                        {/* Sub-motivos según los motivos seleccionados */}
                        {motivo.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-gray-700 font-medium mb-2">Sub-motivos:</label>
                                {motivo.map((m) => (
                                    <div key={m} className="mb-2 bg-primary-100 p-4 rounded-md border border-primary-600">
                                        <h3 className="text-gray-800 font-semibold">{m}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1">
                                            {m === 'Enfermedad' ? (
                                                <label className="flex items-center space-x-2">

                                                    <span className="text-gray-500">Enfermedad</span>
                                                </label>
                                            ) : (
                                                subMotivos[m].map((sub) => (
                                                    <label key={sub} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            value={sub}
                                                            checked={subMotivo.includes(sub)}
                                                            onChange={() => handleSubMotivoChange(sub)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-gray-700">{sub}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Descripción del hecho */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Descripción del hecho:</label>
                        <textarea
                            rows="4"
                            placeholder="Descripción detallada"
                            value={descripcionHecho}
                            onChange={handleChangeTextArea}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        ></textarea>
                        <div className="text-right text-gray-500 text-sm">
                            {descripcionHecho.length}/{maxCaracteres} caracteres
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Campo involucrados */}
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2">Involucrados:</label>
                            <input
                                type="text"
                                placeholder="Rut del involucrado"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={buscarRut}
                                onChange={(e) => setBuscarRut(e.target.value)}
                            />
                        </div>

                        {/* Botón Crear */}
                        <button
                            disabled={!buscarRut.trim()} // Deshabilitar el botón si buscarRut está vacío o solo contiene espacios en blanco
                            className={`bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none mt-7
                            ${!buscarRut.trim() ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-green-500 transition duration-500'}`}
                            type="button"
                            onClick={buscarInvolucrado}
                        >
                            Buscar
                        </button>
                    </div>
                    <div
                        className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 h-0'
                            }`}
                    >
                        <p className={`text-white bg-red-500   ${isVisible ? ' p-2 rounded-md' : ' rounded-md'
                            }`}>
                            {error}
                        </p>
                    </div>
                    <div className={`transition-all duration-700 ease-in-out ${userData ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'} delay-200`} >
                        {userData && (
                            <div className="space-y-6 w-full max-w-full mx-auto mt-5 p-4 md:p-8 rounded-lg shadow-sm overflow-x-hidden border-2 border-gray-300">
                                <div className="border-b-2 border-gray-700 pb-2 mb-4">
                                    <h4 className="text-xl md:text-2xl text-gray-700 font-bold text-center">
                                        Información del usuario
                                    </h4>
                                </div>
                                {/* Contenedor con grid */}
                                <div
                                    className="border border-gray-400 rounded-lg p-4 mb-4 bg-slate-200 shadow-md"
                                >
                                    <p className="text-lg font-semibold">Nombre: {(userData.apellido_materno) ? (userData.apellido_materno) : ""} {(userData.apellido_paterno) ? (userData.apellido_paterno) : ""} {(userData.primer_nombre) ? (userData.primer_nombre) : ""} {(userData.segundo_nombre) ? (userData.segundo_nombre) : ""}</p>
                                    <p className="text-sm text-gray-600">Rut: {userData.rut}</p>
                                    <p className="text-sm text-gray-600">Codigo de funcionario: {userData.codigo_funcionario}</p>
                                    <p className="text-sm text-gray-600">Grado: {userData.grado}</p>
                                    <p className="text-sm text-gray-600">Dotación: {userData.dotacion}</p>
                                </div>

                                <div className="flex justify-center mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            agregarInvolucrado();
                                        }}
                                        className="rounded-md w-40 bg-blue-500 hover:bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-500"
                                    >
                                        Agregar Persona
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`transition-all duration-700 ease-in-out ${involucrado && involucrado.length ? 'opacity-100 ' : 'opacity-0 max-h-0 overflow-hidden'} delay-200`}>
                        {involucrado && involucrado.length > 0 && (
                            <div>
                                {/* Tabla para escritorio */}
                                <div className="hidden lg:block border p-5 rounded-md border-gray-300">
                                    <div className="overflow-x-auto ">
                                        <div className="border-b-2 border-gray-400 pb-2 mb-4">
                                            <h4 className="text-2xl text-gray-700  font-bold text-center">Involucrados seleccionados</h4>
                                        </div>
                                        <div className='overflow-hidden rounded-lg border border-gray-400'>
                                            <table className="min-w-full table-auto   text-sm text-gray-800 rounded-xl ">
                                                <thead className="bg-gray-600 text-white ">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Nombre</th>
                                                        <th className="px-4 py-2 text-left">RUT</th>
                                                        <th className="px-4 py-2 text-left">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {involucrado.map((involucrados, index) => (
                                                        <tr
                                                            key={index}
                                                            className="even:bg-gray-100 hover:bg-gray-200 transition-colors"
                                                        >
                                                            <td className="px-4 py-2">{involucrados.nombre}</td>
                                                            <td className="px-4 py-2">{involucrados.rut}</td>
                                                            <td className="px-4 py-2">
                                                                <button onClick={(e) => eliminarInvolucrado(index, e)} className="ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjetas para móvil */}
                                <div className="block lg:hidden border border-gray-300 rounded-md p-5">
                                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                                        <h4 className="text-2xl text-gray-700  font-bold text-center">Involucrados seleccionados</h4>
                                    </div>
                                    {involucrado.map((involucrados, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-400 rounded-lg p-4 mb-4 bg-slate-200 shadow-md"
                                        >
                                            <p className="text-lg font-semibold">Nombre: {involucrados.nombre}</p>
                                            <p className="text-sm text-gray-600">RUT: {involucrados.rut}</p>
                                            <div className="mt-2">

                                                <button onClick={(e) => eliminarInvolucrado(index, e)} className=" px-4 py-2 text-white bg-red-600 rounded hover:bg-red-400 transition-all duration-500">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Botón Crear */}
                        <div className="text-center p-8">
                            <button
                                type="submit"
                                className="bg-blue-500  text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={handleButtonClick}
                            >
                                Crear
                            </button>
                        </div>
                    </div>


                </div>
            </div>
            {/*
            alerta de toastify es necesaria para que se vea la alerta*/}
            <div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default IndexDisponePrimerasDiligencias

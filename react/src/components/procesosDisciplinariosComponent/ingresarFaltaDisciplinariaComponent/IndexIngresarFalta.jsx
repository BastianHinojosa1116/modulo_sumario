
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// En el archivo donde deseas llamar las alertas desde otra clase
import Alertas from '../../animacionEstilos/Alertas';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider'; // Cambiado aquí
import Swal from 'sweetalert2';

function IndexIngresarFalta() {

    const [fechaIngreso, setFechaIngreso] = useState('');
    const [fechaComisionFalta, setFechaComisionFalta] = useState('');
    const [documentoInformaFalta, setDocumentoInformaFalta] = useState(null);
    const [causales, setCausales] = useState('');
    const [descripcionHecho, setDescripcionHecho] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState({});
     const { url } = useStateContext(); // Cambiado aquí
    const endpointCrearFalta = `${url}/api/ingresarFalta`;

    const handleChangeFechaIngreso = (e) => {
        setFechaIngreso(e.target.value);
    };

    const handleChangeFechaComisionFalta = (e) => {
        setFechaComisionFalta(e.target.value);
    };

    const handleChangeDocumentoInformaFalta = (e) => {
        setDocumentoInformaFalta(e.target.files[0]);
    };

    const handleChangeCausales = (event) => {
        setCausales(event.target.value);
    };

    const obtenerFechaDeHoy = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const convertirFecha = (fecha) => {
        const [yyyy, mm, dd] = fecha.split('-');
        return `${dd}-${mm}-${yyyy}`;
    };

    const handleSubmitIngresarFalta = async () => {
        const fechaComisionFaltaFormateada = convertirFecha(fechaComisionFalta);
        const fechaIngresoFormateada = convertirFecha(fechaIngreso);

        const formData = new FormData();
        //datos del formulario
        formData.append('fecha_ingreso', fechaIngresoFormateada);
        formData.append('fecha_comision_falta', fechaComisionFaltaFormateada);
        formData.append('documento_informa_falta', documentoInformaFalta);
        formData.append('causales', causales);
        formData.append('descripcion_hecho', descripcionHecho);

        //reparticion del usuario que esta creando la falta
        formData.append('descripcion_alta_reparticion', user.descripcion_alta_reparticion);
        formData.append('codigo_alta_reparticion', user.codigo_alta_reparticion);
        formData.append('descripcion_reparticion', user.descripcion_reparticion);
        formData.append('codigo_reparticion', user.codigo_reparticion);
        formData.append('descripcion_unidad', user.descripcion_unidad);
        formData.append('codigo_unidad', user.codigo_unidad);
        formData.append('dotacion', user.dotacion);
        formData.append('codigo_dotacion', user.codigo_dotacion);
        formData.append('descripcion_destacamento', (user.descripcion_destacamento) ? user.descripcion_destacamento : "");
        formData.append('codigo_destacamento', (user.codigo_destacamento) ? user.codigo_destacamento : "");

        const involucradosJson = JSON.stringify(involucrado);
        formData.append('involucrados', involucradosJson);

        try {
            const response = await axios.post(endpointCrearFalta, formData, {
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
                    navigate('/procesosDisciplinarios/sancionarFalta');
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
                handleSubmitIngresarFalta(); // Solo ejecuta si se confirma
            }
        });
    };

    //***************************************************************************************************************************************************** */
    const [buscarRut, setBuscarRut] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [involucrado, setInvolucrado] = useState([]);

console.log(user, "holaaaaperrorrrrr")

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
        console.log(involucrado);
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

    const buscarUsuario = async () => {
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
            //maikol
            console.log(resp.data.success , "maikol  log ")
            if (resp && resp.data.success) {
                setUserData(resp.data.success.user);
                setError(null); // Limpiar cualquier error anterior
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors.rut);


                console.log(error.response.data.errors.rut)
                setUserData(null); // Limpiar datos anteriores si hubo un error
            }
        }
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        setUser(storedUser);
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
        setFechaIngreso(obtenerFechaDeHoy());
    }, [error]);

    //*********************************************************************************************************************************************** */

    return (
        <div className="mx-auto p-4 md:p-10 rounded-xl bg-white lg:ml-16 lg:mr-16 mb-24 border border-gray-300">
            <h1 className="text-2xl md:text-4xl text-gray-700 font-bold text-center mb-6 md:border-b-2 md:border-gray-700 lg:ml-16 lg:mr-16">Ingresar Falta Disciplinaria</h1>
            <form>
                <div className='bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="space-y-6 md:space-y-0 md:flex md:justify-center  md:pb-2 md:mb-4 p-4 ">
                        <div className="">
                            <input
                                type="hidden"
                                id="fechaIngreso"
                                name="fechaIngreso"
                                value={fechaIngreso}
                                onChange={handleChangeFechaIngreso}
                                min={obtenerFechaDeHoy()} // Bloquea las fechas anteriores a hoy
                                max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy
                                className="block w-full px-4 py-1 rounded-md sm:min-w-max bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 transition duration-300 ease-in-out"
                            />
                        </div>
                        <div className="md:w-1/2 mr-2">
                            <label htmlFor="fechaFalta" className="block text-gray-700 font-bold mb-2 ">Comisión de la falta:</label>
                            <input
                                type="date"
                                id="fechaFalta"
                                name="fechaFalta"
                                max={obtenerFechaDeHoy()} // Bloquea las fechas posteriores a hoy
                                value={fechaComisionFalta}
                                onChange={handleChangeFechaComisionFalta}
                                className="block w-full px-4 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500 transition duration-300 ease-in-out"
                            />
                        </div>
                        <div className="md:w-1/2 mr-2">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="documentoInformaFalta">
                                Doc. Informa falta:
                            </label>
                            <input
                                className="w-full p-1 py-1 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                                type="file"
                                id="documentoInformaFalta"
                                onChange={handleChangeDocumentoInformaFalta}
                            />
                        </div>
                        <div className="md:w-1/2 ">
                            <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                                Causales:
                            </label>
                            <select
                                id="cargo"
                                name="cargo"
                                className="mt-2 p-2 py-2 bg-white border
                                shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                                focus:ring-primary-500 block w-full rounded-md sm:text-sm overflow-hidden"
                                value={causales}
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
                    </div>

                    <div className="p-4 ">
                        <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">
                            Descripción del hecho:
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows={6}
                            className="block w-full px-4 py-2 rounded-md bg-white border shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-primary-500"
                            value={descripcionHecho}
                            onChange={(e) => setDescripcionHecho(e.target.value)}
                        />
                    </div>
                </div>

                <div className='mt-5 mb-5 lg:ml-16 lg:mr-16'>
                    {/* Contenido para buscar involucrado */}
                    <div className="space-y-6 w-full  bg-gray-100 p-8 px-8 rounded-lg shadow-md border border-gray-300">
                        <div className="border-b-2 border-gray-400 pb-2 mb-4">
                            <h4 className="text-2xl text-gray-700  font-bold text-center">Buscar involucrado</h4>
                        </div>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Ingrese un rut"
                                value={buscarRut}
                                onChange={(e) => setBuscarRut(e.target.value)}
                                className='mt-1 px-3 py-2  bg-white border
                                shadow border-gray-300 placeholder-slate-400 focus:outline-none focus:border-primary-500
                                focus:ring-primary-500 block w-full rounded-md sm:text-sm'
                            />
                            <button
                                onClick={buscarUsuario}
                                disabled={!buscarRut.trim()} // Deshabilitar el botón si buscarRut está vacío o solo contiene espacios en blanco
                                className={`bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none
                                ${!buscarRut.trim() ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary-600 transition duration-500'}`}
                                type="button"
                            >
                                Buscar
                            </button>
                        </div>
                        <div className={`text-white bg-red-500 p-2 mt-2 rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {error}
                        </div>

                        {userData && (
                            <div className="">
                                {showAlert && (
                                    <div className="bg-green-200 text-green-800 p-2 mt-2 rounded-md">
                                        {alertMessage}
                                    </div>
                                )}
                                <div className="space-y-4 ">
                                    <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                        <p className="font-bold">Rut:</p>
                                        <p>{userData && userData.rut ? formatRut(userData.rut) : ""}</p>
                                    </div>
                                    <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                        <p className="font-bold">Nombre completo:</p>
                                        <p>{userData ? ` ${userData.apellido_materno} ${userData.apellido_paterno} ${userData.primer_nombre} ${userData.segundo_nombre}` : ""}</p>
                                    </div>
                                    <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                                        <p className="font-bold">Código de funcionario:</p>
                                        <p>{userData ? userData.codigo_funcionario : ""}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        agregarInvolucrado();
                                    }}
                                    className="mt-8 flex justify-center lg:mx-auto rounded-md bg-blue-500 hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition duration-500 lg:w-44 lg:text-center"
                                >
                                    Agregar involucrado
                                </button>

                            </div>
                        )}
                    </div>
                </div>
                <div className='overflow-hidden mt-8 mb-8 bg-gray-100 rounded-lg shadow-md p-6 lg:ml-16 lg:mr-16 border border-gray-300'>
                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700  font-bold text-center">Involucrados seleccionados</h4>
                    </div>
                    <div className='border border-gray-300 rounded-lg'>
                        <table className="w-full overflow-hidden rounded-lg " >
                            <thead className="bg-gray-600 text-white">
                                <tr>
                                    <th className="py-2 px-4">Nombre</th>
                                    <th className="py-2 px-4">Rut</th>
                                    <th className="py-2 px-4">Acción</th>
                                </tr>
                            </thead>
                            <tbody className='text-center bg-white'>
                                {involucrado.length > 0 ? (
                                    involucrado.map((involucrados, index) => (
                                        <tr key={index} className="border-b transition-colors duration-500 hover:bg-gray-200">
                                            <td className="py-2 px-4">{involucrados.nombre}</td>
                                            <td className="py-2 px-4">{involucrados.rut}</td>
                                            <td className="py-2 px-4">
                                                <button onClick={(e) => eliminarInvolucrado(index, e)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-2 text-center" colSpan="3">Sin registros encontrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-4 lg:ml-16 lg:mr-16">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="mt-4 lg:mt-8 flex justify-center lg:mx-auto w-full lg:w-64 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-400 focus:outline-none focus:bg-primary-600 transition duration-300 ease-in-out"
                    >
                        Ingresar Falta Disciplinaria
                    </button>
                </div>


            </form>
            {/*
      alerta de toastify es necesaria para que se vea la alerta*/}
            <div>
                <ToastContainer />
            </div>
        </div>
    )
}

export default IndexIngresarFalta

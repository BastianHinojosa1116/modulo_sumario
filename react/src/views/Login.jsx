import { Link } from 'react-router-dom';
import LoginImg from '../../src/assets/fondo2.jpg';
import { useState, useEffect } from 'react';
import axiosClient from '../axios';
import { useStateContext } from '../contexts/ContextProvider';

export default function Login() {
    const { setCurrentUser, setUserToken } = useStateContext();
    const [rut, setRut] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setError(null);

        axiosClient.post("/login", {
            rut,
            password,
        })
            .then(({ data }) => {
                setCurrentUser(data.user);
                setUserToken(data.token);
                // Refrescar la vista
                window.location.reload();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], []);
                    setError(finalErrors.join('<br>'));
                } else if (error.response && error.response.data && error.response.data.error && error.response.data.error.rut) {
                    setError(error.response.data.error.rut[0]);
                    console.log(error.response.data.error.rut[0])
                } else {

                    console.error(error);

                    setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
                }
            });

    };

    const backgroundStyle = {
        backgroundImage: `url(${LoginImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const formStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    };

    useEffect(() => {
        if (error) {
            setIsVisible(true);
            const timeoutId = setTimeout(() => {
                setError(null);
                setIsVisible(false);
            }, 5000); // Desvanecer la alerta después de 3 segundos

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [error]);

    return (
        <>
            <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-400" style={backgroundStyle}>

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={onSubmit} className="space-y-6 max-w-[500px] w-full mx-auto mb-10 bg-gray-300 p-8 px-8 rounded-lg" action="#" method="POST" style={formStyle}>
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <img
                                className="mx-auto h-28 w-auto"
                                src="../src/assets/logo2.png"
                                alt="Your Company"
                            />
                            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Autentificatic
                            </h2>

                            <div className={`text-white bg-red-500 p-2 text-center mt-2 rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                                {error}
                            </div>


                        </div>
                        <div>
                            <label htmlFor="rut" className="block text-sm font-medium leading-6 text-gray-900">
                                Rut:
                            </label>
                            <div className="mt-2">
                                <input
                                    id="rut"
                                    name="rut"
                                    type="text"
                                    autoComplete="rut"
                                    required
                                    value={rut}
                                    onChange={ev => setRut(ev.target.value)}
                                    className="mt-1 px-3 py-2 bg-white border
                                    shadow- border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
                                        focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña:
                                </label>
                                <div className="text-sm">
                                    <a href="http://autentificatic.carabineros.cl/password/reset" className="font-semibold text-green-700 hover:text-green-600">
                                        Recuperar contraseña
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={ev => setPassword(ev.target.value)}
                                    className="mt-1 px-3 py-2 bg-white border
                                    shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
                                        focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Iniciar sesion
                            </button>
                        </div>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            <Link to="/signup" className="font-semibold leading-6 text-green-700 hover:text-green-600">
                                Registrar en autentificatic
                            </Link>
                        </p>
                    </form>

                </div>
            </div>
        </>
    );
}

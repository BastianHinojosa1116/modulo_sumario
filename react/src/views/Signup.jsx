import { Link } from 'react-router-dom';
import LoginImg from '../../src/assets/fondo2.jpg'
import { useState } from 'react';
import axiosClient from '../axios.js'
import { useStateContext } from '../contexts/ContextProvider';


export default function Signup() {
    const {setCurrentUser, setUserToken}= useStateContext();
    const [fullName, setFullName] = useState('');
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState({ __html: "" });

    const onSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: '' })

        axiosClient.post("/signup", {
            name: fullName,
            rut,
            password,
            password_confirmation: passwordConfirmation,
        })
            .then(({ data }) => {
                setCurrentUser(data.user)
                setUserToken(data.token)
            })
            .catch((error) => {
                if (error.response) {
                    const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
                    console.log(finalErrors)
                    setError({ __html: finalErrors.join('<br>') })
                }
                console.error(error)
            });
    };

    const backgroundStyle = {
        backgroundImage: `url(${LoginImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const formStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 0.8 is the opacity (adjust as needed)
    };

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

                            {error.__html && (<div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>
                            </div>)}

                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Nombre:
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={fullName}
                                    onChange={ev => setFullName(ev.target.value)}
                                    required
                                    className="mt-1 px-3 py-2 bg-white border
                                    shadow- border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
                                    focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1"/>
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirmar Contraseña:
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password-confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={ev => setPasswordConfirmation(ev.target.value)}
                                    className="mt-1 px-3 py-2 bg-white border
                                    shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
                                    focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Registrar
                            </button>
                        </div>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            <Link to="/login" className="font-semibold leading-6 text-green-700 hover:text-green-600">
                                Inicia sesión con tu cuenta
                            </Link>
                        </p>
                    </form>

                </div>
            </div>
        </>
    )
}
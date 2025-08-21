import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider'; // Cambiado aquí
import axiosClient from '../axios';

function Navbar({ toggleSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // Hook para redirección
    const [storedUser, setStoredUser] = useState(null); // Estado para almacenar el usuario
    const { currentUser, setCurrentUser, setUserToken } = useStateContext();

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Cuando se hace clic fuera del menú desplegable, este evento lo cierra
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    const logout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout').then(() => {
            setCurrentUser({});
            setUserToken(null);
        });
    };

    // Configurar evento para cerrar el menú desplegable al hacer clic fuera
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setStoredUser(user); // Actualizar el estado con el usuario del localStorage
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-green-900 text-white flex items-center justify-between">
            {/* Botón para abrir/cerrar el Sidebar */}
            <button
                onClick={toggleSidebar}
                className="mr-4 flex flex-col ml-3 items-center justify-center w-8 h-8 bg-green-900 rounded hover:bg-green-700 transition-all duration-300"
            >
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
            </button>

            {/* Logo de la aplicación */}
            <img
                src="../src/assets/logo2.png"
                alt="Logo de la aplicación"
                className="h-16 ease-in-out transform transition duration-300 hover:scale-105"
            />

            {/* Menú desplegable */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="px-4 py-2 mr-2 bg-green-900 rounded hover:bg-green-700 transition-all duration-300"
                >
                    {currentUser.primer_nombre + " " + currentUser.apellido_paterno}
                </button>

                <div
                    className={`absolute right-4 mt-1 border-primary-500 border-2 bg-gray-800 text-black rounded-lg shadow-lg w-48 transition-all duration-500 ease-in-out transform ${
                        isDropdownOpen
                            ? 'opacity-100 scale-100 pointer-events-auto z-50'
                            : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                    <ul className="py-2">
                        <li>
                            <a
                                className="block px-4 py-2 text-white hover:bg-gray-200 hover:text-black transition-all duration-500 hover:ml-2 hover:mr-2 hover:rounded-lg"
                            >
                                {currentUser.rut}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/logout"
                                onClick={(ev) => logout(ev)}
                                className="block px-4 py-2 text-white hover:bg-gray-200 hover:text-black transition-all duration-500 hover:ml-2 hover:mr-2 hover:rounded-lg"
                            >
                                Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

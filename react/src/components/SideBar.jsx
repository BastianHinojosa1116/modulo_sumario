import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navigation = [
    { id: 1, nombre: 'Inicio', to: '/' },
    { id: 2, nombre: 'Usuarios', to: '/users' },
    { id: 3, nombre: 'Bitacora', to: '/bitacora' }, // ocultar cuando el cargo del usuario sea 'admin'
    {
        id: 6,
        nombre: 'Sanción Directa',
        to: '/procesosDisciplinarios',
        submenu: [
            { id: 21, nombre: 'Ingresar Falta', to: '/procesosDisciplinarios/ingresarFalta' },
            { id: 22, nombre: 'Sanción', to: '/procesosDisciplinarios/sancionarFalta' },
            { id: 23, nombre: 'Resolver', to: '/procesosDisciplinarios/resolverFalta' },
            { id: 24, nombre: 'Asesor Jurídico', to: '/procesosDisciplinarios/asesorJuridico' }, // Mostrar solo este si el cargo es 'Asesor Jurídico'
            { id: 25, nombre: 'Bandeja Resoluciones', to: '/procesosDisciplinarios/bandejaResoluciones' },
            { id: 26, nombre: 'Consulta', to: '/procesosDisciplinarios/consulta' }, // Mostrar para Asesor Jurídico también
        ],

    },
    {
        id: 4,
        nombre: 'Sumarios',
        to: '/Sumarios',
        submenu: [
            { id: 40, nombre: 'Ingresar Falta', to: '/sumarios/ingresarFalta' },
            { id: 41, nombre: 'Ingresar O.S.', to: '/sumarios/ingresarOS' },
            { id: 42, nombre: 'Sanción', to: '/sumarios/sancionarFalta' },
            { id: 44, nombre: 'Resolver', to: '/sumarios/resolverFalta' },
            { id: 45, nombre: 'Asesor Jurídico', to: '/sumarios/IndexAsesorJuridico' }, // Mostrar solo este si el cargo es 'Asesor Jurídico'
            { id: 46, nombre: 'Bandeja Resoluciones', to: '/sumarios/bandejaResoluciones' },
            { id: 47, nombre: 'Consulta', to: '/sumarios/consulta' }, // Mostrar para Asesor Jurídico también
            { id: 48, nombre: 'Tramita', to: '/sumarios/IndexTramita' }, // Mostrar para Asesor Jurídico también
            { id: 49, nombre: 'Fiscal', to: '/sumarios/IndexFiscal' },
            { id: 50, nombre: 'Cambio Fiscal', to: '/sumarios/cambioFiscal' }
        ],
    },





    //SUBMENU
    {
        id: 5,
        nombre: 'Primeras Diligencias',
        to: '/primerasDiligencias',
        submenu: [
            { id: 30, nombre: 'Disponer Primeras Diligencias', to: '/disponePrimerasDiligencias' },
            { id: 31, nombre: 'Fiscal Ad-Hoc', to: '/dispone-primeras-diligencias/fiscal' },
            { id: 32, nombre: 'Tramita', to: '/dispone-primeras-diligencias/tramita' },
            { id: 33, nombre: 'Asesor Jurídico', to: '/dispone-primeras-diligencias/asesor-juridico' },
            // { id: 34, nombre: 'Disponer Primera aa', to: '/disponePrimerasDiligencias/aa' },
        ],
    },
];

function SideBar({ isOpen }) {

    const [user, setUser] = useState({}); // Estado para almacenar el usuario
    const [openMenuId, setOpenMenuId] = useState(null);
    const [openMenus, setOpenMenus] = useState([]);
    const toggleSubMenu = (id) => {
        setOpenMenus((prev) =>
            prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
        );
    };

    const isSubMenuOpen = (id) => openMenus.includes(id);
    const location = useLocation();

    const isLinkActive = (path) => {
        return location.pathname === path;
    };

    // Obtener el usuario actual desde localStorage cuando el componente se monte
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        setUser(storedUser);
    }, []);
    // Este efecto solo se ejecuta al montar el componente


    // Filtrar el menú de navegación:
    const filteredNavigation = () => {
        if (user.cargo === 'Potestad Disciplinaria') {
            // Mostrar "Dashboard" y los submenús con ids: 21, 22, 23, 25
            return navigation.map(item => {
                if (item.id === 4) {
                    return {
                        ...item,
                        submenu: item.submenu.filter(
                            subItem => [21, 22, 23, 25].includes(subItem.id)
                        ),
                    };
                }
                return item.id === 1 ? item : null; // Incluir "Dashboard"
            }).filter(Boolean); // Elimina elementos nulos
        }
        else if (user.cargo === 'Asesor Jurídico') {
            // Mostrar "Dashboard", "Asesor Jurídico" y "Consulta"
            return navigation.map(item => {
                if (item.id === 4) {
                    return {
                        ...item,
                        submenu: item.submenu.filter(
                            subItem => [40, 45, 48, 49].includes(subItem.id)
                        ),
                    };
                }
                // Incluir "Dashboard"
                return item.id === 1 ? item : null;
            }).filter(Boolean); // Elimina elementos nulos
        }
        else if (user.cargo === 'Colaborador') {
            // Mostrar "Dashboard" y los submenús con ids: 21, 22, 23, 25
            return navigation.map(item => {
                if (item.id === 4) {
                    return {
                        ...item,
                        submenu: item.submenu.filter(
                            subItem => [21, 22, 23, 25].includes(subItem.id)
                        ),
                    };
                }
                return item.id === 1 ? item : null; // Incluir "Dashboard"
            }).filter(Boolean); // Elimina elementos nulos
        }
        else if (user.cargo === 'Consulta') {
            // Mostrar "Dashboard" y los submenús con ids: 21, 22, 23, 25
            return navigation.map(item => {
                if (item.id === 4) {
                    return {
                        ...item,
                        submenu: item.submenu.filter(
                            subItem => [26].includes(subItem.id)
                        ),
                    };
                }
                return item.id === 1 ? item : null; // Incluir "Dashboard"
            }).filter(Boolean); // Elimina elementos nulos
        }
        else {
            return navigation; // Mostrar todo el menú para otros cargos
        }
    };

    return (
        <div className={`bg-gray-800 transition-all duration-500 ${isOpen ? 'w-52' : 'w-0 overflow-hidden'} h-screen overflow-y-auto`}>
            <div className="p-4">
                <h2 className="text-xl text-white font-semibold mb-4">Registros Disciplinarios 3.0</h2>
            </div>
            <nav>
                <ul className={`${isOpen ? 'block' : 'hidden'} md:block p-2`}>
                    {filteredNavigation().map((item) => (
                        <li className="mb-1" key={item.id}>
                            {item.submenu ? (
                                <div className="border-t-2 border-t-gray-700">
                                    <div
                                        className="text-white hover:bg-gray-700 hover:text-yellow-400 block p-4 hover:transition-all hover:duration-500 text-base font-medium rounded-md cursor-pointer border-t-0 border-t-gray-700"
                                        onClick={() => toggleSubMenu(item.id)}
                                    >
                                        <span className="w-10 mr-2  text-md">{isSubMenuOpen(item.id) ? '▲' : '▼'} {''}{item.nombre}</span>

                                    </div>
                                    <ul
                                        className={`transition-all duration-500 overflow-hidden ${isSubMenuOpen(item.id) ? 'max-h-96' : 'max-h-0'
                                            }`}
                                        style={{ maxHeight: isSubMenuOpen(item.id) ? '900px' : '0' }}
                                    >
                                        {item.submenu.map((subItem) => (
                                            <li className="p-1 ml-4" key={subItem.id}>
                                                <NavLink
                                                    to={subItem.to}
                                                    className={({ isActive }) =>
                                                        `block py-2 px-4 rounded mb-1 text-white hover:text-yellow-400 ${isActive
                                                            ? 'bg-gray-700 text-yellow-400 text-md transition-all duration-500'
                                                            : 'hover:bg-gray-500 transition-all duration-500 text-sm'
                                                        }`
                                                    }
                                                >
                                                    {subItem.nombre}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="border-t-2 border-t-gray-700">
                                    <NavLink
                                        as="a"
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `block py-2 px-4 rounded mb-1 text-white hover:text-yellow-400 ${isActive
                                                ? 'bg-gray-700 text-white'
                                                : 'hover:bg-gray-500 transition-all duration-500'
                                            }`
                                        }
                                    >
                                        {item.nombre}
                                    </NavLink>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default SideBar;

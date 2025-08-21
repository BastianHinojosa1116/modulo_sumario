import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCreateUser from '../users/ModalCreateUser';
import ModalShowUser from '../users/ModalShowUser'; // Importa el componente ModalShowUser
import ModalRolUser from '../users/ModalRolUser'; // Importa el componente ModalShowUser
import ModalAsignarDotacion from '../users/ModalAsignarDotacion'; // Importa el componente modal dotacion
import ModalConfirmDelete from '../users/ModalDeleteUser';
import Pagination from '../pagination/Pagination'; // Ajusta la ruta según tu estructura de archivos
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from '../../contexts/ContextProvider'; // Cambiado aquí

function UsersShow() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalRolOpen, setIsModalRolOpen] = useState(false);
    const [asignarDotacionModalOpen, setAsignarDotacionModalOpen] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserRut, setSelectedUserRut] = useState('');
    const [selectedUserGrado, setSelectedUserGrado] = useState('');
    const [selectedUserCodigoFuncionario, setSelectedUserCodigoFuncionario] = useState('');
    const [selectedUserCorreoInstitucional, setSelectedUserCorreoInstitucional] = useState('');
    const [selectedUserAltaReparticion, setSelectedUserAltaReparticion] = useState('');
    const [selectedUserReparticion, setSelectedUserReparticion] = useState('');
    const [selectedUserUnidad, setSelectedUserUnidad] = useState('');
    const [selectedUserDestacamento, setSelectedUserDestacamento] = useState('');
    const [selectedUserDotacion, setSelectedUserDotacion] = useState('');
    const [selectedUserCargo, setSelectedUserCargo] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const myId = 1;
    //paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const maxVisiblePages = 6;
    //buscar un registro
    const [searchTerm, setSearchTerm] = useState('');
    const { url } = useStateContext(); // Cambiado aquí
    const endpoint = `${url}/api`;
    const endpointEdit = `${url}/api/user/`;

    const OpenModalDotacion = (userId) => {
        setSelectedUserId(userId);
        setAsignarDotacionModalOpen(true);
    };

    const CloseModalDotacion = () => {
        setAsignarDotacionModalOpen(false);
        // Llama a la función getAllUsers si es necesario
        getAllUsers();
    };

    //accionador de buscar registro
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1)
    };

    //obtiene los usuarios y las paginas con registros
    useEffect(() => {
        getAllUsers();
    }, [currentPage, searchTerm]);

    const getAllUsers = async () => {
        try {
            const response = await axios.get(`${endpoint}/users?page=${currentPage}&search=${searchTerm}`);
            setUsers(response.data.data);
            setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
        } catch (error) {
            console.error('Error fetching users:', error);

            // Mostrar un mensaje de error al usuario, por ejemplo:
            // setErrorMessage('Error fetching users. Please try again.');
        }
    };

    //paginación
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    //fin paginación

    //obtiene los datos del usuario y abre el modal de Show modal
    const handleEditClick = (userId, userName, userRut, userGrado, userCodigoFuncionario, userCorreoInstitucional, userDotacion,
        userAltaReparticion, userReparticion, userUnidad, userDestacamento) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setSelectedUserRut(userRut);
        setSelectedUserGrado(userGrado);
        setSelectedUserCodigoFuncionario(userCodigoFuncionario);
        setSelectedUserCorreoInstitucional(userCorreoInstitucional);
        setSelectedUserDotacion(userDotacion);
        setSelectedUserAltaReparticion(userAltaReparticion);
        setSelectedUserReparticion(userReparticion);
        setSelectedUserUnidad(userUnidad);
        setSelectedUserDestacamento(userDestacamento);

        //para probar que la informacion cargue correctamente descomentar
        // console.log("********************************************");

        setIsModalOpen(true);
    };


    const handleRolClick = (userId, userName, userRut, userGrado, userCodigoFuncionario, userCargo) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setSelectedUserRut(userRut);
        setSelectedUserGrado(userGrado);
        setSelectedUserCodigoFuncionario(userCodigoFuncionario);
        setSelectedUserCargo(userCargo);

        setIsModalRolOpen(true);
    };

    const closeModalShowUser = () => {
        setIsModalOpen(false);
        getAllUsers();
    };

    const closeModalRol = () => {
        setIsModalRolOpen(false);
        getAllUsers();
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    // Modifica el usuario en ese caso asigna un rol
    const updateUser = async (id) => {
        try {

            // Verificar si hay un ID válido
            if (!id) {
                console.error('ID no válido');
                // Puedes mostrar un mensaje de error al usuario si lo deseas
                return;
            }

            const response = await axios({
                method: 'put',
                url: `${endpointEdit}${id}`,
                data: {
                    user_name: currentUser.name,
                    user_rut: currentUser.rut,

                    cargo: selectedUserCargo,
                    name: selectedUserName,
                    codigo_funcionario: selectedUserCodigoFuncionario
                },
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí puedes incluir otros encabezados necesarios
                }
            });

            // Verifica el mensaje del servidor
            if (response.data.error) {
                setMessage({ type: 'error', content: response.data.error });
                console.log(response.data.error);
                // Toastify alerta de usuario eliminado
                toast.error(response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar',
                    theme: 'colored',
                    transition: Zoom
                });
                getAllUsers();

            } else {
                setMessage({ type: 'success', content: response.data.message });
                // Actualiza la lista de usuarios o realiza otras acciones necesarias
                getAllUsers();

                // Toastify alerta de usuario eliminado
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar text-white bg-gray-700',
                    theme: 'black',
                    transition: Zoom
                });
            }
        } catch (error) {
            // Manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
            console.error('Error al actualizar el usuario:', error);
        }
    };


    const deleteUser = async (id) => {
        // Verificar si hay un ID válido
        if (!id) {
            console.error('ID no válido');
            // Puedes mostrar un mensaje de error al usuario si lo deseas
            return;
        }
        try {
            const response = await axios({
                method: 'delete',
                url: `${endpoint}/user/${id}`,
                data: {
                    user_name: currentUser.name,
                    user_rut: currentUser.rut,
                    user_id: currentUser.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí puedes incluir otros encabezados necesarios
                }
            });

            // Verifica el mensaje del servidor
            if (response.data.error) {
                //toastify alerta de usuario eliminado
                toast.warning("No puede eliminar su propio usuario", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar text-white bg-gray-700',
                    theme: 'black',
                    transition: Zoom
                })
                getAllUsers();
            } else {
                console.log('respuesta del servidor: ', response.data.message);
                setMessage({ type: 'success', content: response.data.message });
                // Actualiza la lista de usuarios o realiza otras acciones necesarias
                getAllUsers();

                //toastify alerta de usuario eliminado
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'foo-bar text-white bg-gray-700',
                    theme: 'black',
                    transition: Zoom
                })
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openDeleteModal = (userId) => {
        setSelectedDeleteUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedDeleteUserId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirmation = async () => {
        if (selectedDeleteUserId) {
            await deleteUser(selectedDeleteUserId);
            closeDeleteModal();
        }
    };


    const notificationCreate = () => {
        setModalIsOpen(false);
        toast.success("Registro agregado exitosamente", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar text-white bg-gray-700',
            theme: 'black',
            transition: Zoom
        })
    };

    return (
        <div>
            <ModalShowUser
                isOpen={isModalOpen}
                setIsModalOpen={closeModalShowUser}
                selectedUserId={selectedUserId}
                selectedUserName={selectedUserName}
                selectedUserRut={selectedUserRut}

                selectedUserGrado={selectedUserGrado}
                selectedUserCodigoFuncionario={selectedUserCodigoFuncionario}
                selectedUserCorreoInstitucional={selectedUserCorreoInstitucional}
                selectedUserDotacion={selectedUserDotacion}
                selectedUserAltaReparticion={selectedUserAltaReparticion}
                selectedUserReparticion={selectedUserReparticion}
                selectedUserUnidad={selectedUserUnidad}
                selectedUserDestacamento={selectedUserDestacamento}
            />

            <ModalRolUser
                isModalRolOpen={isModalRolOpen}
                closeModalRol={closeModalRol}
                selectedUserId={selectedUserId}
                selectedUserName={selectedUserName}
                selectedUserRut={selectedUserRut}
                selectedUserGrado={selectedUserGrado}
                selectedUserCodigoFuncionario={selectedUserCodigoFuncionario}
                updateUser={updateUser}
                selectedUserCargo={selectedUserCargo}
                setSelectedUserCargo={setSelectedUserCargo}
            />

            <ModalConfirmDelete
                isOpen={isDeleteModalOpen}
                onCancel={closeDeleteModal}
                onConfirm={handleDeleteConfirmation}
            />

            <ModalAsignarDotacion
            selectedUserId={selectedUserId}
                OpenModalDotacion={asignarDotacionModalOpen}
                CloseModalDotacion={CloseModalDotacion}
            />

            <ToastContainer />

            <div className="ml-3 mr-3 mt-4 shadow-md bg-white p-6 rounded-md border border-gray-300">
                <div className="flex ml-8 items-center">
                    <input
                        type="text"
                        placeholder="Buscar usuario...."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        maxLength={10} // Cambia el número 50 según el límite que desees
                        className="border border-gray-300 rounded-md p-1 px-2 mr-2 shadow-md focus:outline-none focus:border-primary-600 focus:ring-primary-600 h-9"
                    />
                    <div className="ml-auto">
                        <ModalCreateUser getUsers={getAllUsers} notificationCreate={notificationCreate} />
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-md mt-4 ml-8 mr-8 mb-4 shadow-md">
                    <table className="min-w-full  rounded-md overflow-hidden ">
                        <thead className="bg-primary-700 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm">Nombre</th>
                                <th className="py-3 px-4 text-left text-sm">Rut</th>
                                <th className="py-3 px- text-left text-sm" >Código de funcionario</th>
                                <th className="py-3 px-4 text-left text-sm">Grado</th>
                                <th className="py-3 px-4 text-left text-sm" >Dotación</th>
                                <th className="py-3 px-4 text-left text-sm" >Perfil</th>
                                <th className="py-2 px-4 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-200 transition-colors duration-500">
                                    <td className="py-1 px-4 text-left text-xs">{user.name}</td>
                                    <td className="py-1 px-4 text-left text-xs">{user.rut}</td>
                                    <td className="py-1 px-4 text-left text-xs">{user.codigo_funcionario}</td>
                                    <td className="py-1 px-4 text-left text-xs">{user.grado}</td>
                                    <td className="py-1 px-4 text-left text-xs">{user.dotacion}</td>
                                    {user.cargo ? (
                                        <td className="py-1 pr-7 text-center text-xs">
                                            {user.cargo}
                                        </td>
                                    ) : (<td className="py-1 pr-7 text-center text-xs">

                                        Sin Asignar
                                    </td>)}
                                    <td className="py-1 px-4 text-center text-sm">
                                        <div className="flex justify-center space-x-2 mr-4 ml-2 ">

                                            {/* Información */}
                                            <button
                                                onClick={() => handleEditClick(user.id, user.name, user.rut, user.grado, user.codigo_funcionario,
                                                    user.correo_institucional, user.dotacion, user.descripcion_alta_reparticion,
                                                    user.descripcion_reparticion, user.descripcion_unidad,
                                                    user.descripcion_destacamento)}
                                                className="flex-shrink-0  h-auto bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 rounded-lg text-center transform transition duration-300 hover:scale-105"
                                            >
                                                Información
                                            </button>

                                            {/* Asignar Rol */}
                                            <button
                                                onClick={() => handleRolClick(user.id, user.name, user.rut, user.grado, user.codigo_funcionario, user.cargo)}
                                                className="flex-shrink-0 h-auto bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 rounded-lg text-center transform transition duration-300 hover:scale-105"
                                            >
                                                Asignar perfil
                                            </button>

                                            {/* Asignar dotacion */}
                                            <button
                                            onClick={() => OpenModalDotacion(user.id)}

                                                className="flex-shrink-0 h-auto bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 rounded-lg text-center transform transition duration-300 hover:scale-105"
                                            >
                                                Asignar Dotación
                                            </button>

                                            {/* Eliminar */}
                                            <button
                                                onClick={() => openDeleteModal(user.id)}
                                                className=" h-auto flex-shrink-0 bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-center transform transition duration-300 hover:scale-105"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                {/* Utiliza el componente Pagination */}
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    handlePageChange={handlePageChange}
                    maxVisiblePages={maxVisiblePages}
                    totalRecords={totalRecords}
                />
            </div>

        </div>
    );
}

export default UsersShow;

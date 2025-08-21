import { React, useState } from 'react';

function RolUserForm({ selectedUserId, selectedUserName, closeModalRol, selectedUserRut, selectedUserGrado,
    selectedUserCodigoFuncionario, updateUser, selectedUserCargo, setSelectedUserCargo }) {

    const handleRoleChange = (event) => {
        setSelectedUserCargo(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        closeModalRol()
        await updateUser(selectedUserId);
    };

    return (
        <div className="mt-5 mr-5 ml-5">
            <form onSubmit={handleSubmit} className="">
                <div className="space-y-6 w-full mx-auto mb-2 bg-gray-50 p-8 px-8 border-2 border-gray-300 rounded-lg shadow-md">
                    <div className="border-b-2 border-gray-700 pb-2 mb-4">
                        <h4 className="text-2xl text-gray-700  font-bold text-center">Información del usuario</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Nombre:</p>
                            <p>{selectedUserName}</p>
                        </div>

                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Rut:</p>
                            <p>{selectedUserRut}</p>
                        </div>

                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Grado:</p>
                            <p>{selectedUserGrado}</p>
                        </div>

                        <div className="border border-gray-700 p-2 px-5 rounded-md flex justify-between">
                            <p className="font-bold">Codigo de funcionario:</p>
                            <p>{selectedUserCodigoFuncionario}</p>
                        </div>
                    </div>

                    <div>

                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mt-8">
                            Seleccione el perfil que desea asignarle al usuario {selectedUserName}:
                        </label>

                        <select
                            id="cargo"
                            name="cargo"
                            className="mt-1 p-2 px-5 py-2 bg-white border
                            shadow- border-gray-700 placeholder-slate-400 focus:outline-none focus:border-primary-500
                            focus:ring-gray-800 block w-full rounded-md sm:text-sm focus:ring-1"
                            value={selectedUserCargo}
                            onChange={handleRoleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Potestad Disciplinaria">Potestad Disciplinaria</option>
                            <option value="Colaborador">Colaborador</option>
                            <option value="Asesor Jurídico">Asesor Jurídico</option>
                            <option value="Consulta">Consulta</option>
                            {/* <option value="Usuario">Usuario</option> */}
                            {/* Add more options as needed */}

                        </select>

                    </div>

                </div>
                <div className="mt-2 mb-5 flex justify-center">
                    <div>
                        <button
                            type="submit"
                            className="mt-2 rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-green-700 hover:bg-green-500 transition duration-500">
                            Agregar
                        </button>
                    </div>
                    <button
                        type="button"
                        className="mt-2 ml-2 rounded-md py-1.5 text-sm font-semibold leading-6 px-4 text-white shadow-sm hover:bg-gray-400 bg-gray-500 transition duration-500"
                        onClick={closeModalRol}
                    >
                        Cerrar
                    </button>
                </div>
            </form>
        </div>

    )
}

export default RolUserForm

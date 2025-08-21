import React from 'react';

function ShowUserInfo({ userId, name, rut, grado, codigoFuncionario, correoInstitucional, dotacion, altaReparticion, reparticion, unidad, destacamento, setIsModalOpen }) {
    return (
        <div className="mr-5 ml-5 mb-5 mt-5">
            <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="p-6 border border-gray-400">
                    <div className="mb-4 border border-gray-400 rounded-lg">
                        <div className="flex justify-between border-b-2 border-gray-200 p-4 shadow-md">
                            <div className="mb-2 sm:mb-0 sm:flex-shrink-0 sm:mr-4">
                                <img
                                    src="/src/assets/UserM.svg"
                                    alt="Usuario"
                                    className="max-w-40 h-40 ml-6 object-cover rounded-full"
                                />
                            </div>
                            <div className=' justify-start mt-1 mr-32'>
                                <h2 className="text-3xl font-semibold text-gray-700 mb-6">Información del usuario</h2>
                                <p className="text-gray-700 py-1"><span className="font-bold">Rut:</span> {rut}</p>
                                <p className="text-gray-700 py-1"><span className="font-bold">Código de funcionario:</span> {codigoFuncionario}</p>
                                <p className="text-gray-700 py-1"><span className="font-bold">Correo institucional:</span> {correoInstitucional}</p>
                            </div>
                        </div>
                    </div>
                    <div className='border border-gray-400 rounded-lg shadow-md'>
                        <div className="mb-4 ml-4 mt-6 mr-4">
                            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Información del lugar de trabajo</h2>
                            <p className="text-gray-700 py-1"><span className="font-bold">Alta Repartición:</span> {altaReparticion}</p>
                            <p className="text-gray-700 py-1"><span className="font-bold">Repartición:</span> {reparticion}</p>
                            <p className="text-gray-700 py-1"><span className="font-bold">Unidad:</span> {unidad}</p>
                            <p className="text-gray-700 py-1"><span className="font-bold">Destacamento:</span> {destacamento}</p>
                        </div>
                        <div className="mb-4 ml-6">
                            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Dotación:</h2>
                            <p className="text-gray-700">{dotacion}</p>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={setIsModalOpen}
                            className="mt-2 px-5 ml-1 rounded-md py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 bg-gray-500 transition duration-500"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowUserInfo;

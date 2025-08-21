import React from 'react';
import PageComponent from '../components/PageComponent';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const currentDate = new Date().toLocaleDateString();

    const { rut, name, codigo_funcionario, dotacion, grado } = user;

    const formatName = (str) => {
        return str
        .toLowerCase() // Convertir todo a minúsculas
        .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase()); // Capitalizar la primera letra de cada palabra
    };

    return (
        <>
            <PageComponent title="Inicio">
                <div className='bg-white rounded-lg border-2 border-gray-300 shadow-md p-4 sm:p-6 md:p-8'>
                    <div className='mx-auto max-w-4xl rounded-lg border-2 p-4 sm:p-8'>
                        <div className="mx-auto bg-primary-600 text-white rounded-xl shadow-md overflow-hidden mb-4 p-4 lg:max-w-4xl transform transition duration-500 hover:scale-105 border-gray-200">
                            <h2 className="text-2xl sm:text-3xl font-bold text-center">Bienvenido al Sistema Registros Disciplinarios</h2>
                        </div>
                        <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden transform transition duration-500 hover:scale-105 border-2 border-gray-200">
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-shrink-0">
                                    <img className="h-40 w-full object-cover md:h-full md:w-48 p-4 md:p-5" src="/src/assets/UserM.svg" alt="User Avatar" />
                                </div>
                                <div className="p-4 md:p-8">
                                    <div className="uppercase tracking-wide text-md text-indigo-500 font-bold">Bienvenido {formatName(name)}</div>
                                    <p className="mt-1 text-gray-500">
                                        <strong>RUT:</strong> {rut} <br />
                                        <strong>Código de Funcionario:</strong> {codigo_funcionario} <br />
                                        <strong>Grado:</strong> {grado} <br />
                                        <strong>Dotación:</strong> {dotacion}
                                    </p>
                                    <p className="mt-2 text-gray-500">
                                        <strong>Fecha Actual:</strong> {currentDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageComponent>
        </>
    );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Simulación de base de datos
const registros = [
    { rut: '19116251k', nombre: 'Michael Hernandez', dotacion: 'Sección Ingenieria', cargo: 'Fiscal' },
    { rut: '98765432-1', nombre: 'María González', dotacion: 'Operativa', cargo: 'Fiscal' },
    { rut: '11111111-1', nombre: 'Luis Muñoz', dotacion: 'Técnica', cargo: 'Fiscal' },
];

function ModalCambiarFiscal({ openModalTramita, closeModalAccionTramita }) {
    const [buscarRut, setBuscarRut] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const buscarPorRut = () => {
        const registro = registros.find((r) => r.rut === buscarRut.trim());
        if (registro) {
            setResultado(registro);
            setError('');
            setIsVisible(false);
        } else {
            setResultado(null);
            setError('No se encontró el fiscal con ese RUT.');
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 5000); // desaparece a los 5 segundos
        }
    };

    return (
        <Transition appear show={openModalTramita} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModalAccionTramita}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-slate-100 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title className="text-xl font-medium leading-6 text-white bg-primary-700 py-1 px-3 flex justify-between items-center">
                                <span className="px-6 text-md">Cambiar fiscal</span>
                                <button
                                    className="p-1 text-white hover:text-gray-300 focus:outline-none"
                                    onClick={closeModalAccionTramita}
                                    aria-label="Cerrar modal"
                                >
                                    ✕
                                </button>
                            </Dialog.Title>

                            <div className="mt-5 mb-5 lg:ml-16 lg:mr-16">
                                <div className="space-y-6 bg-gray-100 p-8 rounded-lg shadow-md border border-gray-300 ml-2 mr-2">
                                    <div className="border-b-2 border-gray-400 pb-2 mb-4">
                                        <h4 className="text-2xl text-gray-700 font-bold text-center">Buscar fiscal</h4>
                                    </div>

                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            placeholder="Ingrese un RUT"
                                            value={buscarRut}
                                            onChange={(e) => setBuscarRut(e.target.value)}
                                            className="px-3 py-2 bg-white border shadow border-gray-300 placeholder-slate-400 
                                            focus:outline-none focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md sm:text-sm"
                                        />
                                        <button
                                            onClick={buscarPorRut}
                                            disabled={!buscarRut.trim()}
                                            className={`bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none 
                                            ${!buscarRut.trim() ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary-600 transition duration-500'}`}
                                        >
                                            Buscar
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isVisible && error && (
                                            <motion.div
                                                key="error-message"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                                className="text-white bg-red-500 p-2 mt-2 rounded-md shadow text-center"
                                            >
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {resultado && (
                                            <motion.div
                                                key="resultado"
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 40 }}
                                                transition={{ duration: 0.2 }}
                                                className="mb-4 border-2 border-gray-400 rounded-lg"
                                            >
                                                <div className="flex flex-col sm:flex-row items-center sm:items-start border-b-2 border-gray-200 p-4 shadow-md">
                                                    <div className="sm:mr-6">
                                                        <img
                                                            src="/src/assets/UserM.svg"
                                                            alt="Usuario"
                                                            className="w-44 h-44 object-cover rounded-full"
                                                        />
                                                    </div>
                                                    <div className="sm:text-left justify-start">
                                                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                                            Información del fiscal
                                                        </h2>
                                                        <p className="text-gray-700 py-1">
                                                            <span className="font-bold">Nombre:</span> {resultado.nombre}
                                                        </p>
                                                        <p className="text-gray-700 py-1">
                                                            <span className="font-bold">Rut:</span> {resultado.rut}
                                                        </p>
                                                        <p className="text-gray-700 py-1">
                                                            <span className="font-bold">Cargo:</span> {resultado.cargo}
                                                        </p>
                                                        <p className="text-gray-700 py-1">
                                                            <span className="font-bold">Dotación:</span> {resultado.dotacion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex items-center justify-center gap-4 mt-4">
                                        {resultado && (
                                            <button
                                                className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary-700 transition"
                                            >
                                                Cambiar fiscal
                                            </button>
                                        )}
                                        <button
                                            onClick={closeModalAccionTramita}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModalCambiarFiscal

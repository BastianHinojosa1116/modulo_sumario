import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';

const ModalDeleteUser = ({ isOpen, onCancel, onConfirm }) => {
    return (

        <div>


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onCancel}>
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg mt-8 mb-8 h-full max-h-max transform overflow-hidden rounded-2xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl h-full w-full font-medium leading-6 text-white  bg-red-600 py-2 px-3 flex justify-between items-center"
                                    >
                                        <span className='px-6'>Eliminar usuario</span>

                                        <button
                                            className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                                            onClick={onCancel}
                                        >
                                            X
                                        </button>
                                    </Dialog.Title>


                                    <p className="p-5 text-lg text-center">¿Estás seguro de que deseas eliminar este usuario?</p>
                                    <div className="flex justify-center space-x-2 p-2 mb-4">
                                    <button
                                            onClick={onConfirm}
                                            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-center transition duration-500"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={onCancel}
                                            className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-xl text-center transition duration-500"
                                        >
                                            Cancelar
                                        </button>

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>


    );
};

export default ModalDeleteUser
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React } from 'react';
import FormInfoUsuarios from './FormInfoUsuarios'; // Ajusta la ruta según tu estructura de carpetas

function ModalInfoUsuarios({openModalInformacionUsuario, closeModalInformacionUsuario, usuario }) {
    console.log(usuario)
    return (
        <div>
            <Transition appear show={openModalInformacionUsuario} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModalInformacionUsuario}>
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
                                <Dialog.Panel className="w-full max-w-4xl mt-4 h-full max-h-max transform overflow-hidden rounded-2xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl w-full font-medium leading-6 text-white bg-gray-700 py-2 px-3 flex items-center justify-between"
                                    >
                                        <div className="flex flex-col items-center w-full">
                                            <h1 className="text-2xl font-semibold">{usuario.name}</h1>
                                            <p className="text-md font-light">{usuario.grado}</p>
                                        </div>

                                        <button
                                            className="pb-8 text-white hover:text-gray-300 focus:outline-none"
                                            onClick={closeModalInformacionUsuario}
                                        >
                                            X
                                        </button>
                                    </Dialog.Title>
                                    <FormInfoUsuarios usuario={usuario} closeModalInformacionUsuario={closeModalInformacionUsuario}/>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default ModalInfoUsuarios

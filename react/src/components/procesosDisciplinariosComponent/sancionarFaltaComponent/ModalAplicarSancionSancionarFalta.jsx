import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';
import FormAplicarSancion from '../sancionarFaltaComponent/FormAplicarSancionSancionarFalta'; // Importa el componente ModalShowUser

function ModalAplicarSancionSancionarFalta({ openModalAplicarSancion,
    closeModalAplicarSancion, id, numeroRolFalta, escalafon}) {

    return (
        <Transition appear show={openModalAplicarSancion} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModalAplicarSancion}>
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
                    <div className="flex min-h-full items-center justify-center p-1 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl mt-8 mb-8 h-full max-h-max transform overflow-hidden rounded-xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl h-full w-full font-medium leading-6 text-white  bg-primary-700 py-2 px-3 flex justify-between items-center"
                                >
                                    <span className='px-6'>Aplicar sanción</span>

                                    <button
                                        className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                                        onClick={closeModalAplicarSancion}
                                    >
                                        X
                                    </button>
                                </Dialog.Title>

                                {/* aqui va el contenido del modal */}
                                <div>
                                    <FormAplicarSancion id={id} escalafon={escalafon} closeModalAplicarSancion={closeModalAplicarSancion} numeroRolFalta={numeroRolFalta} />
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalAplicarSancionSancionarFalta

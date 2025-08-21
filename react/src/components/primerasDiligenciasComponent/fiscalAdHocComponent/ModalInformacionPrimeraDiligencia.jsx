import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';
import FormFiscalAsignarAccion from '../fiscalAdHocComponent/FormFiscalAsignarAccion'; // Importa el componente ModalShowUser

function ModalInformacionPrimeraDiligencia({ openModalAccionPrimeraDiligencia, closeModalAccionPrimeraDiligencia, primeraDiligenciaSeleccionada, getAllPrimerasDiligencias}) {
    return (
        <Transition appear show={openModalAccionPrimeraDiligencia} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModalAccionPrimeraDiligencia}>
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
                        <Dialog.Panel className="w-full max-w-5xl mt-8 mb-8 max-h-[100vh] transform overflow-hidden rounded-xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                            <Dialog.Title className="text-xl font-medium leading-6 text-white bg-primary-700 py-1 px-3 flex justify-between items-center">
                                <span className="px-6 text-md">Primera diligencia - fiscal ad-hoc</span>
                                <button
                                    className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                                    onClick={closeModalAccionPrimeraDiligencia}
                                    aria-label="Cerrar modal"
                                >
                                    ✕
                                </button>
                            </Dialog.Title>

                            {/* Contenido del modal */}
                            <div className="p-4">
                                <FormFiscalAsignarAccion primeraDiligenciaSeleccionada={primeraDiligenciaSeleccionada} closeModalAccionPrimeraDiligencia={closeModalAccionPrimeraDiligencia} getAllPrimerasDiligencias={getAllPrimerasDiligencias} />
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModalInformacionPrimeraDiligencia

// En ModalShowUser.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React } from 'react';
import ShowUserInfo from './ShowUserInfo'; // Ajusta la ruta según tu estructura de carpetas

function ModalShowUser({ isOpen, setIsModalOpen, selectedUserId, selectedUserName, selectedUserRut, selectedUserGrado,
    selectedUserCodigoFuncionario, selectedUserCorreoInstitucional, selectedUserDotacion, selectedUserAltaReparticion,
    selectedUserReparticion, selectedUserUnidad, selectedUserDestacamento }) {

    return (
        <div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
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
                                            <h1 className="text-2xl font-semibold">{selectedUserName}</h1>
                                            <p className="text-md font-light">{selectedUserGrado}</p>
                                        </div>

                                        <button
                                            className="pb-8 text-white hover:text-gray-300 focus:outline-none"
                                            onClick={setIsModalOpen}
                                        >
                                            X
                                        </button>
                                    </Dialog.Title>

                                    <ShowUserInfo
                                        userId={selectedUserId}
                                        name={selectedUserName}
                                        rut={selectedUserRut}
                                        grado={selectedUserGrado}
                                        codigoFuncionario={selectedUserCodigoFuncionario}
                                        correoInstitucional={selectedUserCorreoInstitucional}
                                        dotacion={selectedUserDotacion}
                                        altaReparticion={selectedUserAltaReparticion}
                                        reparticion={selectedUserReparticion}
                                        unidad={selectedUserUnidad}
                                        destacamento={selectedUserDestacamento}
                                        setIsModalOpen={setIsModalOpen}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>





        </div>
    );
}

export default ModalShowUser;

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { createContext, useContext } from 'react';
import { useStateContext } from '../../../contexts/ContextProvider'; // 
function ModalOrdenSumario({
    openModalTramita,
    closeModalAccionTramita,
    primeraDiligenciaSeleccionada
}) {
    const [archivo, setArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);

    const { url } = useStateContext();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!archivo || !primeraDiligenciaSeleccionada?.id) return;

        const formData = new FormData();
        formData.append('id', primeraDiligenciaSeleccionada.id);
        formData.append('documento_sumario', archivo);

        setSubiendo(true);

        try {
            const response = await fetch(`${url}/api/sumario/ingresarOrdenSumario`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }

            });
            

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                closeModalAccionTramita();
                setArchivo(null);
                window.location.reload();
            } else {
                alert(result.message || 'Error al subir el archivo');
            }
        } catch (err) {
            console.error('Error al subir archivo:', err);
            alert('Hubo un problema de red');
        } finally {
            setSubiendo(false);
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
                        <Dialog.Panel className="w-full max-w-xl mt-8 mb-8 transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                            <Dialog.Title className="text-lg font-medium bg-blue-700 text-white px-4 py-2 flex justify-between items-center">
                                <span>
                                    Cargar Orden De Sumario al:{' '}
                                    {primeraDiligenciaSeleccionada?.sumario_numero_rol
                                        ? `Sumario Nº ${primeraDiligenciaSeleccionada.sumario_numero_rol}`
                                        : 'Primera diligencia - fiscal ad-hoc'}
                                </span>
                                <button
                                    onClick={closeModalAccionTramita}
                                    className="text-white hover:text-gray-300 text-lg"
                                >
                                    ✕
                                </button>
                            </Dialog.Title>

                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Seleccionar archivo:
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setArchivo(e.target.files[0])}
                                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 mb-4"
                                        accept=".pdf"
                                        required
                                    />

                                    <button
                                        type="submit"
                                        disabled={subiendo}
                                        className={`${subiendo ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                            } text-white px-4 py-2 rounded-md text-sm transition`}
                                    >
                                        {subiendo ? 'Subiendo...' : 'Subir archivo'}
                                    </button>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ModalOrdenSumario;
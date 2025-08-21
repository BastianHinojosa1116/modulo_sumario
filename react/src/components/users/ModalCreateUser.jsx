import BuscarRut from './BuscarRut';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, React, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

function ModalCreateUser({ getUsers, notificationCreate }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="mr-8  bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-3 rounded transform transition duration-300 hover:scale-105">
          Agregar Usuario
        </button>
      </div>
      <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center  text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl mt-8 mb-8 h-full max-h-max transform overflow-hidden rounded-2xl bg-slate-200 text-left align-middle shadow-xl transition-all overflow-y-auto">
                  <Dialog.Title
                    as="h3"
                    className="text-xl h-full w-full font-medium leading-6 text-white  bg-primary-700 py-2 px-3 flex justify-between items-center"
                  >
                    <span className='px-6'>Agregar usuario</span>

                    <button
                      className="p-1 text-white hover:text-gray-300 focus:outline-none ml-auto"
                      onClick={closeModal}
                    >
                      X
                    </button>
                  </Dialog.Title>

                  <BuscarRut getUsers={getUsers} notificationCreate={notificationCreate} closeModal={closeModal} />

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ModalCreateUser
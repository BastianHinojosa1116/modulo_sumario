import React from 'react'

const SessionExpirationModal = ({ onClose, onExtendSession }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="mb-4">Tu sesión se cerrará en 5 minutos. ¿Deseas extenderla por 1 hora?</p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => onExtendSession(2)}
            >
              Sí, extender
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              No, cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SessionExpirationModal;
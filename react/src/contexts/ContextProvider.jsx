import { createContext, useContext, useState, useEffect } from "react";
import SessionExpirationModal from '../contexts/SessionExpirationModal';

const stateContext = createContext({
    currentUser: {},
    userToken: null,
    setCurrentUser: () => { },
    setUserToken: () => { },
    url: '' // Agrega url como una propiedad en el contexto
});

//cambiar al de mi back
export const ContextProvider = ({ children }) => {
    // Cargar datos del usuario desde el almacenamiento local al inicio
    const initialUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const [currentUser, setCurrentUser] = useState(initialUser);
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
    const [showModal, setShowModal] = useState(false);
    const url = 'http://127.0.0.1:8000'; // Define la URL aquí

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem('TOKEN', token);
            // Establece una marca de tiempo para la expiración del token (1 minuto)
            const expirationTime = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 horas en ms
            localStorage.setItem('TOKEN_EXPIRATION', expirationTime);

            // Muestra el modal 30 segundos antes de que expire el token
            setTimeout(() => {
                setShowModal(true);
            }, expirationTime - new Date().getTime() - 5 * 60 * 1000); // 5 minutos antes en ms
        } else {
            localStorage.removeItem('TOKEN');
            localStorage.removeItem('TOKEN_EXPIRATION');
            localStorage.removeItem('currentUser'); // Elimina los datos del usuario al cerrar sesión.
            // Cierra el modal si estaba abierto
            setShowModal(false);
        }
        _setUserToken(token);
    };

    const setAndPersistUser = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const extendSession = () => {
        // Extiende la sesión por 1 hora adicional
        const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000; // 1 hora en ms
        localStorage.setItem('TOKEN_EXPIRATION', expirationTime);
        // Cierra el modal
        setShowModal(false);
    };

    // Verifica si el token ha expirado
    const checkTokenExpiration = () => {
        const expirationTime = localStorage.getItem('TOKEN_EXPIRATION');
        if (expirationTime) {
            const currentTime = new Date().getTime();
            if (currentTime > parseInt(expirationTime, 10)) {
                // Token ha expirado, elimina los datos del usuario
                setUserToken(null);
                setCurrentUser({});
                // Actualiza la vista
                window.location.reload();
            }
        }
    };

    // Comprueba la expiración del token al cargar el contexto y establece una verificación periódica
    useEffect(() => {
        const intervalId = setInterval(() => {
            checkTokenExpiration();
        }, 60000); // Verifica cada minuto, puedes ajustar el intervalo según tus necesidades

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <>
            {showModal && (
                <SessionExpirationModal
                    onClose={() => setShowModal(false)}
                    onExtendSession={extendSession}
                />
            )}
            <stateContext.Provider
                value={{
                    currentUser,
                    setCurrentUser: setAndPersistUser,
                    userToken,
                    setUserToken,
                    url // Incluye la URL en el valor proporcionado por el contexto
                }}
            >
                {children}
            </stateContext.Provider>
        </>
    );
};

export const useStateContext = () => useContext(stateContext);

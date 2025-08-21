// En el archivo donde tienes la clase Alertas
import { toast } from 'react-toastify';

export default class Alertas {
    static success(mensaje) {
        toast.success(mensaje, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar text-white bg-gray-700',
            theme: 'black',
            autoClose: 7000,
        });
    }

    static error(mensaje) {
        toast.error(mensaje, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar text-white bg-gray-700',
            theme: 'black',
            autoClose: 10000,
        });
    }

    static info(mensaje) {
        toast.info(mensaje, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar text-white bg-gray-700',
            theme: 'black',
        });
    }

    static warning(mensaje) {
        toast.warning(mensaje, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar text-white bg-gray-700',
            theme: 'black',
        });
    }

    // Puedes agregar más métodos para otros tipos de alertas como warning, etc.
}

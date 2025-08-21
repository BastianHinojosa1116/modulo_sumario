import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Pagination from '../pagination/Pagination';

const endpoint = 'http://secproyectos02.carabineros.cl/api/documento';
const endpoint2 = 'http://secproyectos02.carabineros.cl/api/documentos';

function DocumentsShow() {

  const [orderNumber, setOrderNumber] = useState('');
  const [document1, setDocument1] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //filtro de busqueda
  const [searchTerm, setSearchTerm] = useState('');

   //filtro de busqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

   //filtro de busqueda
  const filteredDocuments = documents.filter((document) => {
    const searchFields = [
      document.order_number.toString(),
      document.description.toString(),
      document.document_1.toString(),
    ];
    return searchFields.some((field) => field.includes(searchTerm.toLowerCase()));
  });

  const getAllDocuments = async () => {
    try {
      const response = await axios.get(`${endpoint2}?page=${currentPage}`);
      console.log("estoy aqui")
      console.log(response)
      setDocuments(response.data.documento.data);  // Aquí se corrige
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    console.log("hola", documents)
    getAllDocuments()
  }, [currentPage])
  //fin show documents

  const handleDocument1Change = (e) => {
    setDocument1(e.target.files[0]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('orderNumber', orderNumber);
    formData.append('document1', document1);
    formData.append('description', description);

    try {
      // Realizar la solicitud HTTP
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Verificar si la solicitud fue exitosa
      if (response.data && response.data.message) {
        // Éxito: reiniciar estado y mostrar mensaje de éxito
        setOrderNumber('');
        setDocument1(null);
        setDescription('');
        setError(null);
        alert(response.data.message);
        getAllDocuments() // Puedes cambiar esto por tu propia lógica de notificación
      }
    } catch (error) {
      // Error en la solicitud: mostrar mensaje de error específico para Order Number
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.orderNumber) {
        if (error.response.data.errors.orderNumber[0] == "The order number field is required.") {
          setError("El número de orden es requerido");
        }
        else if (error.response.data.errors.orderNumber[0] == "The order number has already been taken.") {
          setError("Este número de orden de trabajo ya existe");
        }
        else {
          setError("Otro error");
        }
      }
      // Error en la solicitud: mostrar mensaje de error específico para cargar documento
      else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.document1) {
        if (error.response.data.errors.document1[0] == "The document1 must be a file of type: pdf.") {
          setError('El documento cargado debe ser un pdf');
        }
        else {
          setError('No hay un documento cargado');
        }
      }
      // Error en la solicitud: mostrar mensaje de error específico para descripción
      else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.description) {
        setError('El campo descripción es obligatorio');
      }
      else {
        setError('Error al intentar guardar el formulario');
      }
    }
  };


  return (
    <div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Crear Nuevo Documento</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderNumber">
              Order Number:
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md"
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document1">
              Adjuntar PDF:
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md"
              type="file"
              id="document1"
              onChange={handleDocument1Change}
            />
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            type="submit"
          >
            Guardar Documento
          </button>
        </form>
      </div>
      <div>
        <div className='ml-8 mr-8 mt-8 mb-14 shadow-2xl'>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearch}
              className='p-2 border border-gray-300 rounded'
            />
          </div>
          <div className='overflow-x-auto'>
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="py-2 px-4">Orden de trabajo</th>
                  <th className="py-2 px-4">Descripción</th>
                  <th className="py-2 px-4">Documento 1</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="border-b hover:bg-green-100">
                    <td className="py-2 px-4">{document.order_number}</td>
                    {/* Otras columnas según las propiedades de tus documentos */}
                    <td className="py-2 px-4">{document.description}</td>
                    <td className="py-2 px-4">{document.document_1}</td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/documents/info/${document.id}`}
                          className="w-24 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 ml-3 mr-2 flex items-center justify-between">
          <p className=''>Total Registros: {totalRecords}</p>
          <Pagination currentPage={currentPage} totalPages={Math.ceil(totalRecords / 10)} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}

export default DocumentsShow

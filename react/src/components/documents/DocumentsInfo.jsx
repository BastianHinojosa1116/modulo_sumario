import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'

const endpoint = 'http://secproyectos02.carabineros.cl/api/documento/'

function DocumentsInfo() {

  const [orderNumber, setOrderNumber] = useState('');
  const [document1, setDocument1] = useState(null);
  const [description, setDescription] = useState('');
  const { id } = useParams()
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDocumentById = async () => {
      const response = await axios.get(`${endpoint}${id}`)
      console.log(response.data)
      setOrderNumber(response.data.order_number)
      setDescription(response.data.description)
      setDocument1(response.data.document_1)
    }
    getDocumentById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Crear Nuevo Documento</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form >
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
    </div>
  )
}

export default DocumentsInfo
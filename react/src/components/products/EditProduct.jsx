import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const endpoint = 'http://secproyectos02.carabineros.cl/api/product/'

const EditProduct = () => {

  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const navigate = useNavigate()
  const { id } = useParams()
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  const update = async (e) => {
    e.preventDefault()
    await axios.put(`${endpoint}${id}`, { description: description, price: price, stock: stock, user_name: user.name ,user_rut: user.rut })
    navigate('/products')
  }
  useEffect(() => {
    const getProductById = async () => {
      const response = await axios.get(`${endpoint}${id}`)
      setDescription(response.data.description)
      setPrice(response.data.price)
      setStock(response.data.stock)
    }
    getProductById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>

      <form onSubmit={update} className="mt-8 space-y-6 max-w-[500px] w-full mx-auto mb-10 bg-gray-100 p-8 px-8 rounded-lg">

        <h4 className='mt-4 mb-12 text-center text-2xl leading-9 tracking-tight text-gray-900 border-b-2 border-gray-300'>Editar producto</h4>
        <div>
          <label htmlFor="" className="ml-1 block text-sm font-medium leading-6 text-gray-900">Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 px-3 py-2 bg-white border
            shadow- border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
            focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1'
          />
        </div>
        <div>
          <label htmlFor="" className="ml-1 block text-sm font-medium leading-6 text-gray-900">Precio:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='mt-1 px-3 py-2 bg-white border
            shadow- border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
            focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1'
          />
        </div>
        <div>
          <label htmlFor="" className="ml-1 block text-sm font-medium leading-6 text-gray-900">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className='mt-1 px-3 py-2 bg-white border
            shadow- border-slate-300 placeholder-slate-400 focus:outline-none focus:border-green-600
           focus:ring-green-600 block w-full rounded-md sm:text-sm focus:ring-1'
          />
        </div>
        <div>
          <button type="submit" className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600">
            Editar
          </button>
        </div>
      </form>

    </div>
  )
}

export default EditProduct
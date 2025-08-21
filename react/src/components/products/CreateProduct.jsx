import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const endpoint = 'http://secproyectos02.carabineros.cl/api/product'

const CreateProduct = () => {

    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [stock, setStock] = useState(0)
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    const store = async (e) => {
        e.preventDefault()
        await axios.post(endpoint, {description: description, price: price, stock: stock,user_name: user.name ,user_rut: user.rut })
        navigate('/products')
    }

    return (
        <div>

            <form onSubmit={store} className="mt-8 space-y-6 max-w-[500px] w-full mx-auto mb-10 bg-gray-100 p-8 px-8 rounded-lg">

                <h4 className='mt-4 mb-12 text-center text-2xl leading-9 tracking-tight text-gray-900 border-b-2 border-gray-300'>Crear producto</h4>
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
                        Agregar
                    </button>
                </div>
            </form>

        </div>
    )
}

export default CreateProduct
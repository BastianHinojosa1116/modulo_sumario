// ShowProduct.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../pagination/Pagination'; // Ajusta la ruta según tu estructura de archivos

const endpoint = 'http://secproyectos02.carabineros.cl/api';

const ShowProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    //paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const maxVisiblePages = 6;
    const [totalRecords, setTotalRecords] = useState(0);

    //declarar paginación y el buscador de la tabla para que se actualicen
    useEffect(() => {
        getAllProducts();
    }, [currentPage, searchTerm]);

    const getAllProducts = async () => {
        const response = await axios.get(`${endpoint}/products?page=${currentPage}&search=${searchTerm}`);
        setProducts(response.data.data);
        setLastPage(response.data.last_page);
        setTotalRecords(response.data.total); // Obtén el total de la respuesta del paginador
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${endpoint}/product/${id}`);
        getAllProducts();
    };

    //paginación
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1)
    };
    //fin paginación

    return (
        <div>
            <input
                type='text'
                placeholder='Buscar por descripción...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='border rounded-md p-2 mr-2 ml-8 mt-6 shadow-lg focus:outline-none focus:border-primary-600 focus:ring-primary-600'
            />
            <div className='ml-8 mr-8 mt-4 '>
                <div className='overflow-x-auto'>
                    <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md overflow-hidden">
                        <thead className="bg-primary-700 text-white">
                            <tr>
                                <th className="py-2 px-4">Descripción</th>
                                <th className="py-2 px-4">Precio</th>
                                <th className="py-2 px-4">Stock</th>
                                <th className="py-2 px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-primary-200">
                                    <td className="py-2 px-4">{product.description}</td>
                                    <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                                    <td className="py-2 px-4">{product.stock}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                to={`/products/edit/${product.id}`}
                                                className="w-22 h-8 bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105" >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="w-22 h-8 bg-red-700 hover:bg-red-600 text-white py-1 px-4 rounded-xl text-center transform transition duration-300 hover:scale-105">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Utiliza el componente Pagination */}
            <div>

                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    handlePageChange={handlePageChange}
                    maxVisiblePages={maxVisiblePages}
                    totalRecords={totalRecords}
                />
            </div>
        </div>
    );
}

export default ShowProduct;
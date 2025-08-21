import React from 'react'
import PageComponent from "../components/PageComponent";
import ShowProduct from "../components/products/ShowProduct";
import { Link } from 'react-router-dom'
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function Products() {
    return (
        <>
            <PageComponent title="Productos" buttons={(
                <Link to="/products/create" className=' content-end flex w-28 justify-center rounded-md bg-primary-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 transform transition duration-300 hover:scale-105'>
                    <PlusCircleIcon className="h-6 w-6 mr-1"/>Agregar
                </Link>
            )} >

                <div className="w-full">
                    <div className="grid grid-cols-1 gap-5 ">
                        <ShowProduct></ShowProduct>
                    </div>
                </div>
            </PageComponent>
        </>
    )
}

export default Products
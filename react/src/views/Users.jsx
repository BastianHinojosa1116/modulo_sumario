import React from 'react'
import { Link } from 'react-router-dom'
import PageComponent from "../components/PageComponent";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import UsersShow from '../components/users/UsersShow';

function Users() {
    return (
        <>
            <PageComponent title="Usuarios" 
            // buttons={(
            //     <Link to="/users/create" className=' content-end flex w-28 justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 transform transition duration-300 hover:scale-105'>
            //         <PlusCircleIcon className="h-6 w-6 mr-1" />Agregar
            //     </Link>
            // )} 
            >

                <div className="w-full">
                    <div className="grid grid-cols-1 gap-5 ">
                        <UsersShow />
                    </div>
                </div>
            </PageComponent>
        </>
    )
}

export default Users
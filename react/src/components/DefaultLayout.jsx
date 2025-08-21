import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import NavBar from './NavBar'
import SideBar from './SideBar';

export default function DefaultLayout() {

    const { userToken } = useStateContext();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (!userToken) {
        return <Navigate to={'Login'} />
    }

    return (
        <div>
           <div className="flex h-screen overflow-y-auto">
                <SideBar isOpen={isSidebarOpen} />
                <div className="flex-1 flex flex-col">
                    <NavBar toggleSidebar={toggleSidebar} />
                    <div className="flex-1 overflow-y-auto">
                    {/* <div className="flex-1 overflow-y-auto"> */}

                        <Outlet />
                    </div>
                </div>
            </div>

        </div>


    )
}

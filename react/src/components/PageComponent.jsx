import React from "react";

export default function PageComponent({ title, buttons = '', children }) {
    return (
        <>
        <header className="bg-white  shadow-md">
            <div className="flex justify-between items-center mx-auto  py-5 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title} </h1>
                {buttons}
            </div>
        </header>
        <main>
            {/* Usar cuando se quiera cambiar el tamaño del contenido */}
            {/* <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"> */}
             {/* color de fondo de pantalla general */}
            <div className="mx-auto py-6 sm:px-6 bg-gray-200 lg:px-8">
                {children}
            </div>
        </main>
    </>
    )
}
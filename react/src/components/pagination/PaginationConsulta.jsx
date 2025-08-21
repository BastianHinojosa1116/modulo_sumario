import React from 'react'

const PaginationConsulta = ({ currentPage, lastPage, handlePageChange, maxVisiblePages, totalRecords }) => {
    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, lastPage);

    return (
        <div className='flex justify-between mt-2'>

            <p className='text-left mt-2 ml-8'>Total de Registros: {totalRecords}</p>
            <div className='flex justify-center mr-8'>
                {/* Agrega las flechas de retroceso y avance */}
                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 bg-white text-black hover:bg-primary-500 hover:text-white transition duration-500 border border-gray-400"
                    >
                        {'<'}
                    </button>
                )}

                {/* Botones de página */}
                {Array.from({ length: Math.min(endPage - startPage + 1, lastPage) }, (_, index) => startPage + index)
                    .filter((page) => maxVisiblePages < lastPage ? page < lastPage : true)  // Incluye la última página solo cuando hay más de 6 páginas
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 hover:bg-primary-500 hover:text-white transition duration-500 ${currentPage === page ? 'bg-primary-700 text-white ' : 'bg-white border border-gray-400'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                {/* Muestra "..." si hay más de 6 páginas y la última página no está seleccionada */}
                {lastPage > maxVisiblePages && currentPage !== lastPage && (
                    <div className='mt-4 ml-1 mr-1'>
                        <p >......</p>
                    </div>
                )}

                {/* Muestra la última página */}
                {lastPage > maxVisiblePages && (
                    <button
                        onClick={() => handlePageChange(lastPage)}
                        className={`px-4 hover:bg-primary-500 hover:text-white transition duration-500 ${currentPage === lastPage ? 'bg-primary-700 text-white' : 'bg-white border border-gray-400'
                            }`}
                    >
                        {lastPage}
                    </button>
                )}

                {/* Flecha de avance */}
                {currentPage < lastPage && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 bg-white border border-gray-400 text-black hover:bg-primary-500 hover:text-white transition duration-500"
                    >
                        {'>'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaginationConsulta;

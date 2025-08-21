import React from 'react'
import PageComponent from "../components/PageComponent";
import BitacoraShow from '../components/bitacora/BitacoraShow';

function Bitacora() {
  return (
    <>
    <PageComponent title="Bitacora">

        <div className="w-full">
            <div className="grid grid-cols-1 gap-5 ">
                <BitacoraShow/>
            </div>
        </div>
    </PageComponent>
</>
  )
}

export default Bitacora


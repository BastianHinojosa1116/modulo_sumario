import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";

import Prueba from "./components/pruebas/Prueba";

//Login y registro de usuarios
import Login from "./views/Login";
import Signup from "./views/Signup";

//componentes si esta iniciada o no la sesion
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";

import Bitacora from "./views/Bitacora";

//usuarios
import Users from "./views/Users";
import UsersShow from "./components/users/UsersShow";
import BuscarRut from "./components/users/BuscarRut";
import EditUser from "./components/users/EditUser";

// import CreateUser from "./components/users/CreateUser";
//productos
// import Products from "./views/Products";
// import ShowProduct from "./components/products/ShowProduct";
// import CreateProduct from "./components/products/CreateProduct";
// import EditProduct from "./components/products/EditProduct";

//documents
// import Documents from "./views/documents";
// import DocumentsInfo from "./components/documents/DocumentsInfo";

//procesos disciplinarios
import IngresarFalta from "./views/procesosDisciplinarios/ingresarFaltaDisciplinaria/IngresarFalta";
import BuscarInvolucrado from "./components/procesosDisciplinariosComponent/ingresarFaltaDisciplinariaComponent/BuscarInvolucrado";


import ResolverFalta from "./views/procesosDisciplinarios/resolverFalta/ResolverFalta";
import BandejaResoluciones from "./views/procesosDisciplinarios/bandejaResoluciones/BandejaResoluciones";

//bandeja de consulta
import Consulta from "./views/procesosDisciplinarios/Consulta/Consulta";
import VerFaltaConsulta from "./components/procesosDisciplinariosComponent/consultaComponent/VerFaltaConsulta";
import VerInvolucradoConsulta from "./components/procesosDisciplinariosComponent/consultaComponent/VerInvolucradoConsulta";

//AplicarSancionInvolucrado y sancion
import AplicarSancion from "./components/procesosDisciplinariosComponent/resolverFaltaDisciplinariaComponent/AplicarSancion";
import AplicarSancionInvolucrado from "./components/procesosDisciplinariosComponent/resolverFaltaDisciplinariaComponent/AplicarSancionInvolucrado";

//bandeja de resoluciones
import BandejaResolucionesVerFalta from "./components/procesosDisciplinariosComponent/bandejaResolucionesComponent/VerFaltaBandejaResolucion";
import VerInvolucrados from "./components/procesosDisciplinariosComponent/bandejaResolucionesComponent/VerInvolucrados";

//sancionar falta bandeja
import SancionarFalta from "./views/procesosDisciplinarios/sancionarFalta/SancionarFalta";
import VerSancionarFalta from "./components/procesosDisciplinariosComponent/sancionarFaltaComponent/VerSancionarFalta";
import VerInvolucradoSancionarFalta from "./components/procesosDisciplinariosComponent/sancionarFaltaComponent/VerInvolucradoSancionarFalta";
//prueba para agregar involucrados
import AgregarInvolucrado from "./components/procesosDisciplinariosComponent/sancionarFaltaComponent/FormAgregarInvolucradoSancionarFalta";

//asesor juridico
import AsesorJuridico from "./views/procesosDisciplinarios/asesorJuridico/AsesorJuridico";
import VerSancionAsesorJuridico from "./components/procesosDisciplinariosComponent/asesorJuridicoComponent/VerFaltaAsesorJuridico";
import VerInvolucradoAsesorJuridico from "./components/procesosDisciplinariosComponent/asesorJuridicoComponent/VerInvolucradoAsesorJuridico";


//****************************************************************PRIMERAS DILIGENCIAS******************************************************************************************* */
//DISPONE PRIMERAS DILIGENCIAS
import PrimerasDiligencias from "./views/primerasDiligencias/disponePrimerasDiligencias/disponePrimerasDiligencias";

//Fiscal adhoc primera diligencia
import FiscalAdHoc from "./views/primerasDiligencias/fiscalAdHoc/inicioFiscalAdHoc";

//Tramita primera diligencia
import Tramita from "./views/primerasDiligencias/tramita/tramita";

//Tramita primera diligencia
import AsesorJuridicoPrimeraDiligencia from "./views/primerasDiligencias/asesorJuridico/asesorJuridico";

import ProtectedRoute from "./components/permisosUsuario/ProtectedRoute"; // Importa el componente

//BANNER SUMARIOS
import DisponerSumario from './components/sumariosComponent/ingresarSumarioComponent/ingresarSumario'; // o donde esté tu componente
import IndexDisponerOrdenSumario from './components/sumariosComponent/ingresarOrdenSumarioComponent/ingresarOrdenSumario';
import IndexAsesorJuridicoComponent from "./components/sumariosComponent/asesorJuridicoComponent/IndexAsesorJuridicoSumarioComponent";
import IndexTramitaComponent from "./components/sumariosComponent/tramitaComponent/IndexTramitaComponent";
import IndexFiscalComponent from "./components/sumariosComponent/fiscalComponent/IndexFiscalComponent";
import FormFiscalAsignarAccion from "./components/sumariosComponent/fiscalComponent/FormFiscalAsignarAccion";
import FormCambiarEstadoAsesorJuridico from "./components/sumariosComponent/asesorJuridicoComponent/FormCambiarEstadoAsesorJuridico";
import CambioFiscal from "./views/sumarios/cambioFiscal/cambioFiscal";
import VerInformacionTramitaCambioFiscal from "./components/sumariosComponent/cambioFiscalComponent/VerInformacionSumarioCambioFiscal";

import FormDisponeAsignarAccion from "./components/sumariosComponent/tramitaComponent/FormDisponeAsignarAccion";



const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            //vistas por eliminar posiblemente
            {
                path: '/disponePrimerasDiligencias',
                element: <PrimerasDiligencias />
            },

            //vistas por eliminar posiblemente
            {
                path: '/dispone-primeras-diligencias/fiscal',
                element: <FiscalAdHoc />
            },

            //vistas por eliminar posiblemente
            {
                path: '/dispone-primeras-diligencias/tramita',
                element: <Tramita />
            },
            //vistas por eliminar posiblemente
            {
                path: '/dispone-primeras-diligencias/asesor-juridico',
                element: <AsesorJuridicoPrimeraDiligencia />
            },


            {
                path: '/procesosDisciplinarios/sancionarFalta/verSancionarFalta/agregarInvolucrado',
                element: <AgregarInvolucrado />
            },

            {
                path: '/users/show',
                element: <UsersShow />
            },

            {
                path: '/users/create',
                element: <BuscarRut />
            },

            {
                path: '/users/edit/:id',
                element: <EditUser />
            },

            {
                path: '/sumarios/ingresarFalta',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Asesor Jurídico"}>
                        <DisponerSumario />
                    </ProtectedRoute>
                )
            },
            {
                path: '/sumarios/IndexAsesorJuridico',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Asesor Jurídico"}>
                        <IndexAsesorJuridicoComponent />
                    </ProtectedRoute>
                )
            },
            {
                path: 'sumarios/asesorJuridicoTramitar/:id', // 👈 opcional si pasas el ID desde la lista
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Asesor Jurídico"}>
                        <FormCambiarEstadoAsesorJuridico />
                    </ProtectedRoute>
                )
            },
            {
                path: '/sumarios/IndexTramita',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Tramita"}>
                        <IndexTramitaComponent />
                    </ProtectedRoute>
                )

            },



            {
                path: '/sumarios/IndexFiscal',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Fiscal"}>
                        <IndexFiscalComponent />
                    </ProtectedRoute>

                )
            },
            {
                path: 'sumarios/fiscalTramitar/:id', // 👈 opcional si pasas el ID desde la lista
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Fiscal"}>
                        <FormFiscalAsignarAccion />
                    </ProtectedRoute>


                )
            }

            ,
            {
                path: '/sumarios/ingresarOS',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Asesor Jurídico"}>
                        <IndexDisponerOrdenSumario />
                    </ProtectedRoute>
                )
            },



            //vistas utilizadas hasta el momento
            {
                path: '/users',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador"}>
                        <Users />
                    </ProtectedRoute>
                )
            },
            {
                path: '/dashboard',
                element: <Navigate to="/" />
            },
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/bitacora',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador"}>
                        <Bitacora />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/ingresarFalta',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <IngresarFalta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/ingresarFalta/BuscarInvolucrado',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador"}>
                        <BuscarInvolucrado />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/resolverFalta',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <ResolverFalta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/resolverFalta/aplicarSancion/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <AplicarSancion />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/resolverFalta/aplicarSancion/:id/involucrado/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <AplicarSancionInvolucrado />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/bandejaResoluciones',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <BandejaResoluciones />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/bandejaResoluciones/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <BandejaResolucionesVerFalta />
                    </ProtectedRoute>
                )
            },
            {

            },


            {
                path: '/procesosDisciplinarios/bandejaResoluciones/:id/involucrado/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <VerInvolucrados />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/sancionarFalta',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <SancionarFalta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/sancionarFalta/verSancionarFalta/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <VerSancionarFalta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/sancionarFalta/verSancionarFalta/:id/involucrado/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Potestad Disciplinaria" || user?.cargo === "Colaborador"}>
                        <VerInvolucradoSancionarFalta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/asesorJuridico',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Asesor Jurídico"}>
                        <AsesorJuridico />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/asesorJuridico/verSancionAsesorJuridico/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Asesor Jurídico"}>
                        <VerSancionAsesorJuridico />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/asesorJuridico/verSancionAsesorJuridico/:id/involucrado/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Asesor Jurídico"}>
                        <VerInvolucradoAsesorJuridico />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/consulta',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Consulta"}>
                        <Consulta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/sumarios/cambioFiscal',
                element: <CambioFiscal />
            },
            {
                path: '/sumarios/cambioFiscalTramitar/:id',
                element: <VerInformacionTramitaCambioFiscal />
            },
            {
                path: '/procesosDisciplinarios/consulta/verFalta/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Consulta"}>
                        <VerFaltaConsulta />
                    </ProtectedRoute>
                )
            },
            {
                path: '/procesosDisciplinarios/consulta/verFalta/:id/involucrado/:id',
                element: (
                    <ProtectedRoute isAllowed={user?.cargo === "Administrador" || user?.cargo === "Consulta"}>
                        <VerInvolucradoConsulta />
                    </ProtectedRoute>
                )
            },

        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    }



])

export default router;

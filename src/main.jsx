import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import FormUsuario from './FormUsuario.jsx';
import FormLogin from './FormLogin.jsx';
import FormCarretera from './FormCarretera.jsx';
import ListaUsuarios from './ListUsuario.jsx';
import ListaMunicipios from './ListMunicipio.jsx';
import FormMunicipio from './FormMunicipio.jsx';
import ListaCarreteras from './List.Carretera.jsx';
import FormPunto from './FormPunto.jsx';
import ListaPuntos from './ListPunto.jsx';
import FotoIncidente from './FormIncidenteAdmin.jsx';
import ImgIncidente from './FormInicidente.jsx';
import ListaIncidentes from './ListIncidente.jsx';
import CambiarContrasena from './CambiarPassword.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/municipios",
    element: <ListaMunicipios />
  },
  {
    path: "/municipio/create",
    element: <FormMunicipio />
  },
  {
    path: "/municipio/:id",
    element: <FormMunicipio />
  },
  {
    path: "/carreteras",
    element: <ListaCarreteras />
  },
  {
    path: "/carretera/create",
    element: <FormCarretera />
  },
  {
    path: "/carretera/:id",
    element: <FormCarretera />
  },
  {
    path: "/puntos",
    element: <ListaPuntos />
  },
  {
    path: "/punto/create",
    element: <FormPunto />
  },
  {
    path: "/punto/:id",
    element: <FormPunto />
  },
  {
    path: "/usuarios",
    element: <ListaUsuarios/>
  },
  {
    path: "/usuario/create",
    element: <FormUsuario/>
  },
  {
    path: "/usuario/:id",
    element: <FormUsuario/>
  },
  {
    path: "/login",
    element: <FormLogin/>
  },
  {
    path: "/foto/:id",
    element: <FotoIncidente/>
  },
  {
    path: "/foto",
    element: <ImgIncidente/>
  }
  ,
  {
    path: "/incidentes",
    element: <ListaIncidentes/>
  },
  {
    path: "/cambiar-contrasena/:id",
    element: <CambiarContrasena/>
  }

]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
//Puedo crear,mostrar usuarios
//Puedo iniciar sesion
//Puedo crear,mostrar,eliminar un municipio
//Puedo ver en el mapa los municipios
//Puede crear,mostrar,eliminar carreteras
//Puede crear,mostrar,eliminar puntos
//solo permite ver el crud si iniciaste sesion
//solo permite ver lista usuarios si sos admin
//agregar puntos a carretera
//me muestra abajo un listado de carreteras
//me muestra la carretera al hacerle clic
//te muestra la ruta por los puntos
//me deja buscar municipios
//Editar de municios
//me deja reportar incidentes
//editar carreteras
//lista de carreteras por estado y tipo bloqueo
//editar usuarios
//cambiar contrasenas
//incidentes arreglado
//cambiar la vista de forma que te permita de entrada ver las rutas 
//resaltadas por distintos colores segun su estado 
// y cuando le des clic resaltarlas
//*****no tengo******/
// no deja editar rutas
// no deja ver quien hizo los cambios
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import LoginPage from './Pages/LoginPage';
// import Dashboard from './Pages/Dashboard';
import { AuthProvider } from './Pages/Auth';
import UserAreaLayout from './Pages/UserAreaLayout';
import Dashboard from './Pages/Dashboard';
import Apps from './components/Tables/Tables';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<LoginPage />} />
      <Route path='' element={<UserAreaLayout/>}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
        {/* <Route path='/Apps' element={Apps} /> */}
    </Route>
  )
)



// const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: LoginPage
//   },
//   {
//     path: '/Apps',
//     Component: Apps
//   },
//   // {
//   //   path: "/context",
//   //   Component: 
//   // },
// ]);

createRoot(document.getElementById('root')).render(

    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
)

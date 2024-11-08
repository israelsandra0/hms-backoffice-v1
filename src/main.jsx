import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import LoginPage from './Pages/LoginPage';
import { AuthProvider } from './Pages/Auth';
import UserAreaLayout from './Pages/UserAreaLayout';
import Dashboard from './Pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HotelsPage from './Pages/Hotels/Index';
import Add from './Pages/Hotels/Add';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<LoginPage />} />
      <Route path='' element={<UserAreaLayout/>}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hotels' element={<HotelsPage />} />
        <Route path='/hotels/add' element={<Add />} />
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

const queryClient = new  QueryClient()

createRoot(document.getElementById('root')).render(

    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          < RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
)

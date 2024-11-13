import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import LoginPage from './Pages/LoginPage';
import { AuthProvider } from './Pages/Auth';
import UserAreaLayout from './Pages/UserAreaLayout';
import Dashboard from './Pages/Sidebar/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HotelsPage from './Pages/Hotels/Index';
import Add from './Pages/Hotels/Add';
import Clickus from './click';
import Account from './Pages/Sidebar/Account';
import Reports from './Pages/Sidebar/Reports';
import Communication from './Pages/Sidebar/Communication';
import Support from './Pages/Sidebar/Support';
import Settings from './Pages/Sidebar/Settings';
import Users from './Pages/Sidebar/Users';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<LoginPage />} />
      <Route path='' element={<UserAreaLayout/>}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hotels' element={<HotelsPage />} />
        <Route path='/hotels/add' element={<Add />} />
        <Route path='/users' element={<Users />} />
        <Route path='/accounts' element={<Account />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/communication' element={<Communication />} />
        <Route path='/support' element={<Support />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
      <Route path='/click' element={<Clickus />} />
    </Route>
  )
)



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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import LoginPage from './Pages/LoginPage';
import { AuthProvider } from './Pages/Auth';
import UserAreaLayout from './Pages/UserAreaLayout';
import Dashboard from './Pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HotelsPage from './Pages/hotels/Index';
import Add from './pages/hotels/Add';
import Account from './Pages/Account';
import Reports from './Pages/Reports';
import Communication from './Pages/Communication';
import Support from './Pages/Support';
import Settings from './Pages/Settings';
import Users from './Pages/Users';
import HotelsOverview from './pages/hotels/viewHotels/Overview';
import HotelPageUsers from './pages/hotels/viewHotels/Users';
import Locations from './pages/hotels/viewHotels/Locations';
import Rooms from './pages/hotels/viewHotels/RoomType';
import SubscriptionHistory from './pages/hotels/viewHotels/Subscription';
import PageSettings from './pages/hotels/viewHotels/Settings';
import ViewAreaHeader from './pages/hotels/viewHotels/ViewAreaHeader';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<LoginPage />} />
      <Route path='' element={<UserAreaLayout/>}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hotels' element={<HotelsPage />} />
        <Route path='/hotels/view/:id' element={<ViewAreaHeader />} />
        <Route path='/hotels/view/overview' element={<HotelsOverview />} />
        <Route path='/hotels/view/users' element={<HotelPageUsers />} />
        <Route path='/hotels/view/locations' element={<Locations />} />
        <Route path='/hotels/view/rooms' element={<Rooms />} />
        <Route path='/hotels/view/suscription_history' element={<SubscriptionHistory />} />
        <Route path='/hotels/view/settings' element={<PageSettings />} />
        <Route path='/hotels/add' element={<Add />} />
        <Route path='/users' element={<Users />} />
        <Route path='/accounts' element={<Account />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/communication' element={<Communication />} />
        <Route path='/support' element={<Support />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
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

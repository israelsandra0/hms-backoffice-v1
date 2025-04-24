import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/loginPage/LoginPage";
import { AuthProvider } from "./Pages/Auth";
import UserAreaLayout from "./Pages/UserAreaLayout";
import Dashboard from "./Pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HotelsPage from "./Pages/hotels/Index";
import Add from "./pages/hotels/Add";
import Account from "./Pages/Account";
import Reports from "./Pages/Reports";
import Communication from "./Pages/Communication";
import Support from "./Pages/Support";
import Users from "./pages/settings/users/Users";
import HotelsOverview from "./pages/hotels/viewHotels/Overview";
import HotelPageUsers from "./pages/hotels/viewHotels/viewHotelUsers/Users";
import Locations from "./pages/hotels/viewHotels/viewHotelLocations/Locations";
import SubscriptionHistory from "./pages/hotels/viewHotels/viewHotelSubscription/Subscription";
import PageSettings from "./pages/hotels/viewHotels/Settings";
import ViewHotelsPage from "./pages/hotels/viewHotels/ViewHotelsPage";
import Subscription from "./pages/settings/subscriptionPage/Subscription";
import AddSubscriptionPage from "./pages/hotels/viewHotels/viewHotelSubscription/AddSubscription";
import { ThemeProvider } from "./components/theme-provider";
import Rooms from "./pages/hotels/viewHotels/viewHotelRooms/Rooms";
import AccessControl from "./pages/settings/rolesAndPermission/AccessControl";
import AddRole from "./pages/settings/rolesAndPermission/AddRole";
import EditRole from "./pages/settings/rolesAndPermission/EditRole";
import SubscriptionPlan from "./pages/settings/subscriptionPage/SubscriptionPlan";
import ForgottenPassPage from "./pages/loginPage/forgottenPassword/ForgottenPassPage";
import VerificationPage from "./pages/loginPage/forgottenPassword/OTPVerificationPage";
import ResetPassPage from "./pages/loginPage/resetPassword/ResetPassPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgotten_password" element={<ForgottenPassPage />} />
      <Route path="/forgotten_password/verification" element={<VerificationPage />} />
      <Route path="/reset_password" element={<ResetPassPage />} />
      <Route path="" element={<UserAreaLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/view/:id" element={<ViewHotelsPage />} />
        <Route path="/hotels/view/overview" element={<HotelsOverview />} />
        <Route path="/hotels/view/users" element={<HotelPageUsers />} />
        <Route path="/hotels/view/locations" element={<Locations />} />
        <Route path="/hotels/view/rooms" element={<Rooms />} />
        <Route path="/hotels/view/suscription_history" element={<SubscriptionHistory />} />
        <Route path="/hotels/view/suscription/add" element={<AddSubscriptionPage />} />
        <Route path="/hotels/view/settings" element={<PageSettings />} />
        <Route path="/hotels/add" element={<Add />} />
        <Route path="/accounts" element={<Account />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/support" element={<Support />} />
        <Route path="/setting/access_control" element={<AccessControl />} />
        <Route path="/setting/access_control/create" element={<AddRole />} />
        <Route path="/setting/access_control/edit" element={<EditRole />} />
        <Route path="/setting/users" element={<Users />} />
        <Route path="/setting/subscriptions" element={<Subscription />} />
        <Route
          path="/setting/subscriptions/subscription_plan"
          element={<SubscriptionPlan />}
        />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

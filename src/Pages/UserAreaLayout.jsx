import { NavLink, Outlet, } from "react-router-dom"
import { LayoutDashboard, Users } from "lucide-react"
import { RequireAuth } from "./Auth";
import AccountIcon from "@/components/icons/account";
import HotelIcon from "@/components/icons/hotel";
import ReportIcon from "@/components/icons/Report";
import CommunicationIcon from "@/components/icons/communication";
import SupportIcon from "@/components/icons/Support";
import SettingsIcon from "@/components/icons/Setting";
import { Toaster } from "@/components/ui/toaster";



export default function UserAreaLayout() {

    return (
        <RequireAuth>
             <Toaster />
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

                {/* containing the sidebar */}
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">

                        {/* containing the side bar */}
                        <div className="flex-1  sidebar">
                            <nav className="grid items-start px-2 mt-6 text-sm font-medium lg:px-4">
                                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </NavLink>
                                <NavLink to="/hotels" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <HotelIcon />
                                    Hotels Management
                                </NavLink>
                                <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <Users className="h-4 w-4" />
                                    Users
                                </NavLink>
                                <NavLink to="/accounts" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <AccountIcon size='w-4' />
                                    Accounts
                                </NavLink>
                                <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <ReportIcon />
                                    Reports & Analytics
                                </NavLink>
                                <NavLink to="/communication" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <CommunicationIcon />
                                    Communication
                                </NavLink>
                                <NavLink to="/support" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <SupportIcon />
                                    Support & help
                                </NavLink>
                                <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                <   SettingsIcon />
                                    Settings
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Outlet />
                </div>
            </div>
            
        </RequireAuth>
    )
}

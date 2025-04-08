import { NavLink, Outlet, } from "react-router-dom"
import { Bell, ChevronDown, ChevronRight, ChevronUp, LayoutDashboard, MoreVertical, Subscript, Users } from "lucide-react"
import { RequireAuth } from "./Auth";
import AccountIcon from "@/components/icons/account";
import HotelIcon from "@/components/icons/hotel";
import ReportIcon from "@/components/icons/Report";
import CommunicationIcon from "@/components/icons/communication";
import SupportIcon from "@/components/icons/Support";
import SettingsIcon from "@/components/icons/Setting";
import { Toaster } from "@/components/ui/toaster";
import ConfirmModal from "@/components/ConfirmModal";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePermission } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";



export default function UserAreaLayout() {

    
    // Check if the collapsible state is saved in localStorage, defaulting to false
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem("collapsibleState");
        return savedState ? JSON.parse(savedState) : false;
    });

    // Update localStorage whenever the state changes
    useEffect(() => {
        localStorage.setItem("collapsibleState", JSON.stringify(isOpen));
    }, [isOpen]);

    const {hasPermission} = usePermission()
    



    return (
        <RequireAuth>
            <Toaster />
            <div className="grid min-h-screen dark:bg-black dark:text-white w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

                {/* containing the sidebar */}
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">

                        {/* containing the side bar */}
                        <div className="flex-1  sidebar">
                            <nav className="grid items-start px-2 mt-6 text-sm font-medium lg:px-4">
                                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <LayoutDashboard className="text-gray-500 w-4" />
                                    Dashboard
                                </NavLink>
                                {hasPermission(PERMISSIONS.HOTEL_VIEW.name) && (
                                    <NavLink to="/hotels" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                        <HotelIcon />
                                        Hotel Management
                                    </NavLink>
                                )}
                                <NavLink to="/accounts" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <AccountIcon size='w-4' />
                                    Account
                                </NavLink>
                                <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <ReportIcon />
                                    Report & Analytics
                                </NavLink>
                                <NavLink to="/communication" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <CommunicationIcon />
                                    Communication
                                </NavLink>
                                <NavLink to="/support" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                    <SupportIcon />
                                    Support & help
                                </NavLink>
                                <Collapsible
                                    open={isOpen}
                                    onOpenChange={setIsOpen}
                                >
                                    <CollapsibleTrigger asChild className="mt-1">
                                        <div className="flex items-center ml-3 mt-2 justify-between">
                                            <h4 className="text-sm flex gap-3 font-semibold cursor-pointer">
                                                <SettingsIcon />
                                                Setting
                                            </h4>
                                            {isOpen ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 ml-9 mt-2">
                                        <NavLink to="/setting/users" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            {/* <Users className="text-gray-500 w-4" /> */}
                                            User
                                        </NavLink>
                                        <NavLink to="/setting/access_control" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            Access Control
                                        </NavLink>
                                        <NavLink to="/setting/subscriptions" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            {/* <Bell className="text-gray-500 w-4" /> */}
                                            Subscription
                                        </NavLink>
                                    </CollapsibleContent>
                                </Collapsible>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Outlet />
                </div>
            </div>
            <ConfirmModal />
        </RequireAuth>
    )
}

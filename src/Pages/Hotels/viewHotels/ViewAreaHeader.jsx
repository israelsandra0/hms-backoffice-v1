import { ArrowDown, ChevronDown, ChevronRight, CircleUser, LayoutDashboard, Menu, Users } from "lucide-react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { AUTH_DATA_KEY, BACKEND_URL, USER_DATA_KEY } from "@/constants";
import { getDataObject, post } from "@/functions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import HotelIcon from "@/components/icons/Hotel";
import AccountIcon from "@/components/icons/Account";
import ReportIcon from "@/components/icons/Report";
import CommunicationIcon from "@/components/icons/Communication";
import SupportIcon from "@/components/icons/Support";
import SettingsIcon from "@/components/icons/Setting";

export default function ViewAreaHeader({pages}) {
    // const [openSidebar, setOpenSidebar] = useState(false);
    // const [username, setUsername] = useState('');


    // useEffect(() => {
    //     // Get user data from localStorage
    //     const userData = getDataObject(USER_DATA_KEY);
    //     if (userData) {
    //         setUsername(userData.firstName || 'U'); 
    //     }
    // }, []);


    // const handleToggle = () => {
    //     setOpenSidebar(!openSidebar);
    // };

    const handleClose = () => {
        // setOpenSidebar(false);
    };

    // async function logOut() {
    //     try {
    //         const res = await post('/auth/logout');

    //         if (!res.ok) return alert("Logout failed! Try again.");

    //         window.localStorage.clear();
    //         console.log("All data cleared from localStorage.");
    //         window.location.href = "/";
    //     } catch (error) {
    //         alert("Logout failed! Try again.");
    //         console.log("logout error:", error);
    //     }
    // }

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] mb-6 lg:px-6">
            {/* <Sheet open={openSidebar}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                        onClick={handleToggle}
                    >
                        <Menu className="h-5 w-5 text-black" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col sidebar">
                    <nav className="flex items-start px-2 mt-6 text-sm font-medium lg:px-4">
                        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/hotels" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <HotelIcon />
                            Hotels Management
                        </NavLink>
                        <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <Users className="h-4 w-4" />
                            Users
                        </NavLink>
                        <NavLink to="/accounts" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <AccountIcon size='w-4' />
                            Accounts
                        </NavLink>
                        <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <ReportIcon />
                            Reports & Analytics
                        </NavLink>
                        <NavLink to="/communication" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <CommunicationIcon />
                            Communication
                        </NavLink>
                        <NavLink to="/support" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <SupportIcon />
                            Support & help
                        </NavLink>
                        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <SettingsIcon />
                            Settings
                        </NavLink>
                    </nav>

                </SheetContent>
            </Sheet> */}

            {/* <div className="w-full ml-8">
                <h1>{pages}</h1>
            </div> */}

            <nav className="flex items-start px-2 mt-6 text-sm font-medium lg:px-4">
                        <NavLink to="/hotels/view/overview" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                           Overview
                        </NavLink>
                        <NavLink to="/hotels/view/users" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            Users
                        </NavLink>
                        <NavLink to="/hotels/view/locations" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            Locations
                        </NavLink>
                        <NavLink to="/hotels/view/rooms" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            Room Type
                        </NavLink>
                        <NavLink to="/hotels/view/suscription_history" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            Subscription Plan
                        </NavLink>
                        <NavLink to="/hotels/view/settings" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            Settings
                        </NavLink>
                    </nav>

            {/* <DropdownMenu className="">
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="w-[85px] flex lg:justify-start lg:pl-1 lg:gap-2 items-center rounded-[2rem]">
                        <h1 className="bg-lightPrimary w-[30px] h-[30px] text-[1.5rem] pt-1 rounded-[50%] lg:ml-0">{username?.charAt(0) }</h1>
                        <ChevronDown className="p-[0.3rem]"/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> */}
        </header>
    );
}

import { ArrowDown, Bell, ChevronDown, ChevronRight, ChevronsDown, CircleUser, LayoutDashboard, Menu, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, Navigate, NavLink } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { AUTH_DATA_KEY, BACKEND_URL, USER_DATA_KEY } from "@/constants";
import { getDataObject, post } from "@/functions";
import HotelIcon from "./icons/hotel";
import AccountIcon from "./icons/account";
import ReportIcon from "./icons/Report";
import CommunicationIcon from "./icons/communication";
import SupportIcon from "./icons/Support";
import SettingsIcon from "./icons/Setting";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { usePermission } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

export default function UserAreaHeader({ pages }) {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [username, setUsername] = useState('');


    const { setTheme } = useTheme()
    const { hasPermission } = usePermission()

    const hasAnyPermission =
        hasPermission(PERMISSIONS.USER_MANAGEMENT.name) ||
        hasPermission(PERMISSIONS.ACCESS_CONTROL.name) ||
        hasPermission(PERMISSIONS.SUBSCRIPTION_MANAGMENT.name);


    useEffect(() => {
        // Get user data from localStorage
        const userData = getDataObject(USER_DATA_KEY);
        if (userData) {
            setUsername(userData || 'U');
        }
    }, []);


    const handleToggle = () => {
        setOpenSidebar(!openSidebar);
    };

    const handleClose = () => {
        setOpenSidebar(false);
    };

    async function logOut() {
        try {
            const res = await post('/auth/logout');

            if (!res.ok) return alert("Logout failed! Try again.");

            window.localStorage.clear();
            console.log("All data cleared from localStorage.");
            window.location.href = "/";
        } catch (error) {
            alert("Logout failed! Try again.");
            console.log("logout error:", error);
        }
    }

    // Check if the collapsible state is saved in localStorage, defaulting to false
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem("collapsibleState");
        return savedState ? JSON.parse(savedState) : false;
    });

    // Update localStorage whenever the state changes
    useEffect(() => {
        localStorage.setItem("collapsibleState", JSON.stringify(isOpen));
    }, [isOpen]);



    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] mb-6 lg:px-6">
            <Sheet open={openSidebar}>
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
                    <nav className="grid items-start px-2 mt-6 text-sm font-medium lg:px-4">
                        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <LayoutDashboard className="text-gray-500 w-4" />
                            Dashboard
                        </NavLink>
                        {hasPermission(PERMISSIONS.HOTEL_VIEW.name) && (
                            <NavLink to="/hotels" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                <HotelIcon />
                                Hotel Management
                            </NavLink>
                        )}
                        <NavLink to="/accounts" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <AccountIcon size='w-4' />
                            Account
                        </NavLink>
                        <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <ReportIcon />
                            Report & Analytics
                        </NavLink>
                        <NavLink to="/communication" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <CommunicationIcon />
                            Communication
                        </NavLink>
                        <NavLink to="/support" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`} onClick={handleClose}>
                            <SupportIcon />
                            Support & help
                        </NavLink>

                        {hasAnyPermission && (
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
                                    {hasPermission(PERMISSIONS.USER_MANAGEMENT.name) && (
                                        <NavLink to="/setting/users" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            {/* <Users className="text-gray-500 w-4" /> */}
                                            User
                                        </NavLink>
                                    )}

                                    {hasPermission(PERMISSIONS.ACCESS_CONTROL.name) && (
                                        <NavLink to="/setting/access_control" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            Access Control
                                        </NavLink>
                                    )}

                                    {hasPermission(PERMISSIONS.SUBSCRIPTION_MANAGMENT.name) && (
                                        <NavLink to="/setting/subscriptions" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'active' : 'text-muted-foreground'}`}>
                                            {/* <Bell className="text-gray-500 w-4" /> */}
                                            Subscription
                                        </NavLink>
                                    )}


                                </CollapsibleContent>
                            </Collapsible>                            
                        )}
                    </nav>

                </SheetContent>
            </Sheet>

            <div className="w-full ml-8">
                <h1>{pages}</h1>
            </div>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu className="">
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="w-[85px] flex lg:justify-start lg:pl-1 focus-visible:outline-none lg:gap-2 items-center rounded-[2rem]">
                        <h1 className="bg-lightPrimary w-[30px] h-[30px] text-[1.5rem] pt-1 rounded-[50%] lg:ml-0">{username.firstName?.charAt(0)}</h1>
                        <ChevronDown className="p-[0.3rem]" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <div className="flex text-gray-600">
                        <DropdownMenuLabel className=' mr-[-0.7rem]'>{username.firstName}</DropdownMenuLabel>
                        <DropdownMenuLabel>{username.lastName}</DropdownMenuLabel>
                    </div>
                    <DropdownMenuItem className='text-gray-400  mt-[-0.5rem]'>{username.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

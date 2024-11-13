import { CircleUser, LayoutDashboard, Menu, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, Navigate, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants";
import { getDataObject, post } from "@/functions";
import HotelIcon from "./icons/hotel";
import AccountIcon from "./icons/account";
import ReportIcon from "./icons/Report";
import CommunicationIcon from "./icons/communication";
import SupportIcon from "./icons/Support";
import SettingsIcon from "./icons/Setting";

export default function UserAreaHeader({ pageName }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleClose = () => {
    setOpenSidebar(false);
  };

  async function logOut() {
    try {
      const res = await post(`${BACKEND_URL}/auth/logout`);

      if (!res.ok) return alert("Logout failed! Try again.");

      window.localStorage.clear();
      console.log("All data cleared from localStorage.");
      window.location.href = "/";
    } catch (error) {
      alert("Logout failed! Try again.");
      console.log("logout error:", error);
    }
  }

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
      </Sheet>
      {/* {navLinks.map((link) => ( */}
      <div className="w-full flex-1 overview">
        {/* <h1>{link.name}</h1> */}
        <h1>{pageName}</h1>
      </div>
      {/* ))} */}

      <DropdownMenu className="">
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

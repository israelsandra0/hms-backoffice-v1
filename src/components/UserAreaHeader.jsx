import { CircleUser, LayoutDashboard, Menu, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, Navigate } from "react-router-dom";
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
          <nav className="grid gap-2 text-lg mt-6 font-medium">
            <Link
              to={"/dashboard"}
              className="active mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={handleClose}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to={"/hotels"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/hotel.svg"
                className="h-4 w-4"
              />
              Hotel Management
            </Link>
            <Link
              to={"/users"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              to={"/accounts"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/account.svg"
                className="h-4 w-4"
              />
              Accounts
            </Link>
            <Link
              to={"/reports"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/report.svg"
                className="h-4 w-4"
              />
              Reports & Analytics
            </Link>
            <Link
              to={"/communication"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/communication.svg"
                className="h-4 w-4"
              />
              Communication
            </Link>
            <Link
              to={"/support"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/support.svg"
                className="h-4 w-4"
              />
              Support & help
            </Link>
            <Link
              to={"/settings"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={handleClose}
            >
              <img
                src="src/Pages/Sidebar/images&icons/setting.svg"
                className="h-4 w-4"
              />
              Settings
            </Link>
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

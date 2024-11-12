import { Link, Outlet } from "react-router-dom"
import { Accessibility, Activity, Airplay, BadgeHelp, CircleUser, Home,  LayoutDashboard, Menu, Settings2, Users} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom";
import { RequireAuth } from "./Auth";
import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants"
import { getDataObject } from "@/functions"
import { useState } from "react"
import $ from "jquery";


export default function UserAreaLayout() {

    const navigate = useNavigate();

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleToggle = () => {
        setOpenSidebar(!openSidebar);
    };

    const handleClose = () => {
        setOpenSidebar(false);
    };


    async function logOut() {
        try{
            const token = getDataObject(AUTH_DATA_KEY)?.accessToken
            // console.log(getDataObject(AUTH_DATA_KEY))
            const res = await fetch(`${BACKEND_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },    
            })

            if (!res.ok) return alert('Logout failed! Try again.')

            window.localStorage.clear();
            console.log("All data cleared from localStorage.");
            navigate("/");
       }catch(error){
            alert('Logout failed! Try again.')
            console.log('logout error:', error)
       }
    }

     // this makes the current navlink active
    function setActiveNavLink() {
        var currentPath = window.location.pathname;
    
        // Loop through all nav links and check for a match
        $("nav a").each(function() {
            var linkHref = $(this).attr("href");
    
            // Remove the domain part of the URL if present (e.g., "http://example.com/about")
            var linkPath = linkHref.startsWith("/") ? linkHref : new URL(linkHref).pathname;
    
            // Remove trailing slash for consistency
            linkPath = linkPath.endsWith("/") ? linkPath.slice(0, -1) : linkPath;
    
            // Compare linkPath with currentPath
            if (linkPath === currentPath) {
                $(this).addClass("active"); // Add active class to matched link
            } else {
                $(this).removeClass("active"); // Remove active class from others
            }
        });
    }
    
    setActiveNavLink();
    

  return (
    <RequireAuth>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            
            {/* containing the sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">

                    {/* containing the side bar */}
                    <div className="flex-1  sidebar">
                        <nav className="grid items-start px-2 mt-6 text-sm font-medium lg:px-4">
                            <Link to={'/dashboard'} className="active flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link to={'/hotels'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/hotel.svg" className="h-4 w-4" /> 
                                Hotels Management  
                            </Link>
                            <Link to={'/users'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Users className="h-4 w-4" />
                                Users  
                            </Link>
                            <Link to={'/accounts'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/account.svg" className="h-4 w-4" />
                                Accounts  
                            </Link>
                            <Link to={'/reports'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/report.svg" className="h-4 w-4" />
                                Reports & Analytics
                            </Link>
                            <Link to={'/communication'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/communication.svg" className="h-4 w-4" />
                                Communication  
                            </Link>
                            <Link to={'/support'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/support.svg" className="h-4 w-4" />
                                Support & help  
                            </Link>
                            <Link to={'/settings'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <img src="src/Pages/Sidebar/images&icons/setting.svg" className="h-4 w-4" />
                                Settings   
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* containing responsive sidebar */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet open={openSidebar}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={handleToggle}>
                                <Menu className="h-5 w-5 text-black" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col sidebar">

                            <nav className="grid gap-2 text-lg mt-6 font-medium">
                                <Link to={'/dashboard'}className="active mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground" onClick={handleClose}>
                                    <LayoutDashboard className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link to={'/hotels'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/hotel.svg" className="h-4 w-4" />
                                    Hotel Management   
                                </Link>
                                <Link to={'/users'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <Users className="h-4 w-4" />
                                    Users   
                                </Link>
                                <Link to={'/accounts'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/account.svg" className="h-4 w-4" />
                                    Accounts   
                                </Link>
                                <Link to={'/reports'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/report.svg" className="h-4 w-4" />
                                    Reports & Analytics 
                                </Link>
                                <Link to={'/communication'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/communication.svg" className="h-4 w-4" />
                                    Communication
                                </Link>
                                <Link to={'/support'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/support.svg" className="h-4 w-4" />
                                    Support & help   
                                </Link>
                                <Link to={'/settings'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={handleClose}>
                                    <img src="src/Pages/Sidebar/images&icons/setting.svg" className="h-4 w-4" />
                                    Settings   
                                </Link>
                               
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                    </div>
                    <DropdownMenu>
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
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                  <> <Outlet /> </>
                    
                </main>
            </div>
        </div>        
    </RequireAuth>
  )
}

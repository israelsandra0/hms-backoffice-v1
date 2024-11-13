import { Link, Outlet } from "react-router-dom"
import { Accessibility, Activity, Airplay, BadgeHelp, CircleUser, Home, LayoutDashboard, Menu, Settings2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom";
import { RequireAuth } from "./Auth";
import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants"
import { getDataObject } from "@/functions"
import { useState } from "react"
import $ from "jquery";




const navLinks = [
    { to: '/dashboard', name: 'Dashboard' },
    { to: '/hotels', name: 'Hotel Management' },
    { to: '/users', name: 'Users' },
    { to: '/accounts', name: 'Accounts' },
    { to: '/reports', name: 'Reports & Analytics' },
    { to: '/communication', name: 'Communication' },
    { to: '/support', name: 'Support & Help' },
    { to: '/settings', name: 'Settings' },
];

export default function UserAreaLayout() {

    const navigate = useNavigate();

    
    

    // this makes the current navlink active
    function setActiveNavLink() {
        var currentPath = window.location.pathname;

        // Loop through all nav links and check for a match
        $("nav a").each(function () {
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


    const [topBarLink, setTopBarLink] = useState(navLinks[0])

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
                    <Outlet />
                </div>
            </div>
        </RequireAuth>
    )
}

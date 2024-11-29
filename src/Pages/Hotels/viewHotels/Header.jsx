import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link, NavLink } from "react-router-dom"

const components = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]




export default function HotelsHeader({ title }) {
    return (
        <div>
            <div className="mb-8 border border-gray-500 w-[200px] bg-red-500">
                <h1 className="text-[1.3rem] text-center">{title}</h1>
                <div className=" text-[0.8rem] grid justify-end">
                    <span>expiry date</span>
                    <p>21/06/3045</p>
                </div>
            </div>

            {/* <nav className="flex items-center h-10 bg-grey justify-start gap-6 rounded-[3rem] ml-4 pl-4">
                        <NavLink to="" className={({ isActive }) => `activeView ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Overview
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Users
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Locations
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Users
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Room Type
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                            Subscription History
                        </NavLink>
                        <NavLink to="" className={({ isActive }) => `${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                           Settings
                        </NavLink>
            </nav> */}

            <NavigationMenu className="bg-grey justify-start gap-6 w-4/5 rounded-[3rem] ml-4 pl-4">
                <NavigationMenuList className="gap-6 h-10">
                    <NavigationMenuItem>
                        <Link to='/hotels/view/overview'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Overview</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to='/hotels/view/users'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Users</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to='/hotels/view/locations'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Locations</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to='/hotels/view/rooms'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Room Type</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to='/hotels/view/suscription_history'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Subscription History</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to='/hotels/view/settings'>
                            <NavigationMenuTrigger className="bg-transparent h-8 focus:bg-white hover:bg-white rounded-[3rem]">Settings</NavigationMenuTrigger>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div>

            </div>



        </div>
    )


    //     (({ className, title, children, ...props }, ref) => {
    //         return (
    //             <li>
    //                 <NavigationMenuLink asChild>
    //                     <a
    //                         ref={ref}
    //                         className={cn(
    //                             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    //                             className
    //                         )}
    //                         {...props}
    //                     >
    //                         <div className="text-sm font-medium leading-none">{title}</div>
    //                         <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
    //                             {children}
    //                         </p>
    //                     </a>
    //                 </NavigationMenuLink>
    //             </li>
    //         )
    //     })
    // ListItem.displayName = "ListItem"
}
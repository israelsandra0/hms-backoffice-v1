import { NavLink } from "react-router-dom";
export default function ViewAreaHeader({hotel}) {

    return (
        <div>

            {/* <div className="flex gap-4 my-6 border justify-center w-[150px]">
                <div>
                    {hotel?.logo ? (
                        <img src={hotel.logo} alt={`${hotel?.name} Logo`} className="w-16 h-16 rounded-full" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">No Logo</div>
                    )}
                </div>
                <div>
                    <h1>{hotel?.name}</h1>
                    <p>{hotel?.createdAt}</p>
                </div>
            </div> */}

            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] mb-6 lg:px-6">

                <nav className="flex bg-grey items-center px-2 my-6 py-1 text-sm font-medium lg:px-2  rounded-[3rem]">
                    <NavLink to="/hotels/view/overview" className={({ isActive }) => `flex  rounded-[3rem] items-center gap-3  px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Overview
                    </NavLink>
                    <NavLink to="/hotels/view/users" className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Users
                    </NavLink>
                    <NavLink to="/hotels/view/locations" className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Locations
                    </NavLink>
                    <NavLink to="/hotels/view/rooms" className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Room Type
                    </NavLink>
                    <NavLink to="/hotels/view/suscription_history" className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Subscription Plan
                    </NavLink>
                    <NavLink to="/hotels/view/settings" className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
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
        </div>
    );
}

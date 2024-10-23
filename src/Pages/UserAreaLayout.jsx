import { Link, Outlet } from "react-router-dom"
import { CircleUser, Home, Menu, Users} from "lucide-react"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom";
import { RequireAuth } from "./Auth";
import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants"
import { getDataObject } from "@/functions"

export const description = 
    "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

export default function UserAreaLayout() {

    const navigate = useNavigate();
    // const auth = useContext(AuthContext)

    async function logOut() {
        try{
            const token = getDataObject(AUTH_DATA_KEY)?.accessToken
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

  return (
    <RequireAuth>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            
            {/* containing the sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    {/* name and notification at the top */}
                    {/* <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6" />
                                <span className="">{auth.username}</span>
                            </Link>
                            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                <Bell className="h-4 w-4 text-black" />
                                <span className="sr-only">Toggle notifications</span>
                            </Button>
                    </div> */}

                    {/* containing the side bar */}
                    <div className="flex-1">
                        <nav className="grid items-start px-2 mt-6 text-sm font-medium lg:px-4">
                            <Link to={'/dashboard'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link to={'/clients'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Users className="h-4 w-4" />
                                Clients   
                            </Link>
                            {/*<Link href="#" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                                <Package className="h-4 w-4" />
                                    Products{" "}
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <Users className="h-4 w-4" />
                                Customers
                            </Link>
                            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                <LineChart className="h-4 w-4" />
                                Analytics
                            </Link> */}
                        </nav>
                    </div>

                    {/* containing the card below in the sidebar */}
                    {/* <div className="mt-auto p-4">
                        <Card x-chunk="dashboard-02-chunk-0">
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access to our support
                                    team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div> */}
                </div>
            </div>

            {/* containing responsive sidebar */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5 text-black" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">

                            <nav className="grid gap-2 text-lg font-medium">
                                {/* <Link href="#" className="flex items-center gap-2 text-black text-lg font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only text-black">{auth.username}</span>
                                </Link> */}
                                <Link to={'/dashboard'}className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link to={'/clients'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                                    <Users className="h-4 w-4" />
                                    Clients   
                                </Link>
                                {/* <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                                    <ShoppingCart className="h-5 w-5" />
                                        Orders
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Package className="h-5 w-5" />
                                        Products
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Users className="h-5 w-5" />
                                        Customers
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <LineChart className="h-5 w-5" />
                                        Analytics
                                </Link> */}
                            </nav>
                            {/* <div className="mt-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>
                                            Unlock all features and get unlimited access to our
                                            support team.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div> */}
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        {/* <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 text-black top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search products..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"/>
                            </div>
                        </form> */}
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
                            {/* <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator /> */}
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

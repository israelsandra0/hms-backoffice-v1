import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserAreaHeader from "@/components/UserAreaHeader";
import { get } from "@/functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Database, File, Hotel, Locate, Users } from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
export default function ViewAreaHeader() {

    const navigate = useNavigate()

    const { id } = useParams();  

    const { data: hotel, isLoading } = useQuery({
        queryKey: ['hotelData', id], 
        queryFn: async () => {
            const res = await get(`/hotels/show/${id}`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel data");
            }
            const response = await res.json();
            return response.data;
        },
        enabled: !!id,  
    });


    if (isLoading) {
        return (
            <>
                <UserAreaHeader pageName="Hotel Management" />
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            </>
        );
    }
   
    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/hotels">Hotels</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>View Hotels</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <div>
            <UserAreaHeader pages={breadcrumb}/>
            <div className="flex gap-4 my-6 ml-6">
                <img src={hotel?.logo || "/path/to/default-image.jpg"} className="w-16 h-16" />

                <div>
                    <h1 className="font-bold text-[22px]">{hotel?.name}</h1>
                    <p className="text-[13px] text-gray-500">Expiry Date</p>
                    {/* <p>{hotel.createdAt}</p> */}
                </div>
            </div>

            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] mb-6 lg:px-6">

                <nav className="flex bg-grey items-center px-2 my-6 py-1 text-sm font-medium lg:px-2  rounded-[3rem]">
                    <NavLink onClick={() => navigate(`/hotels/view/${client.id}`)} className={({ isActive }) => `flex  rounded-[3rem] items-center gap-3  px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Overview
                    </NavLink>
                    <NavLink to="/hotels/view/users"  className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Users
                    </NavLink>
                    <NavLink to="/hotels/view/locations"  className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Locations
                    </NavLink>
                    <NavLink to="/hotels/view/rooms"  className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Room Type
                    </NavLink>
                    <NavLink to="/hotels/view/suscription_history"  className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Subscription Plan
                    </NavLink>
                    <NavLink to="/hotels/view/settings"  className={({ isActive }) => `flex items-center gap-3  rounded-[3rem] px-3 py-2 transition-all ${isActive ? 'activeView' : 'text-muted-foreground'}`} >
                        Settings
                    </NavLink>
                </nav>
            </header>

            <div className="flex gap-6 ml-6 text-gray-500">
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Database className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Database</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <File className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>File Storage</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Locate className="text-[#8D561E] w-8 h-8  bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Locations</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Users className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Users</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Hotel className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Rooms</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
            </div>


            <h1 className=" mt-8 ml-6 font-bold text-[1.5rem]">Top Modules</h1>
            <Table  className="content w-4/5 my-6 ml-6 rounded-[2rem] border border-gray-200">
                <TableRow className="bg-lightPrimary w-full p-8 mx-6">
                    <TableHead>Modules</TableHead>
                    <TableHead>Number of Clicks</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>Module 1</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 2</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 3</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 4</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
            </Table>


        </div>
    );
}

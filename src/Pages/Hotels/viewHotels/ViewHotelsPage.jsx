import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserAreaHeader from "@/components/UserAreaHeader";
import { get } from "@/functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Database,
    Edit,
    Edit2,
    Edit3,
    File,
    Hotel,
    Locate,
    Users,
} from "lucide-react";
import { useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelsOverview from "./Overview";
import HotelPageUsers from "./viewHotelUsers/Users";
import Locations from "./viewHotelLocations/Locations";
import Rooms from "./RoomType";
import SubscriptionHistory from "./Subscription";
import PageSettings from "./Settings";
import { Badge } from "@/components/ui/badge";
import { RiEdit2Line } from "@remixicon/react";
import EditHotelModal from "../Edit";

export default function ViewHotelsPage() {
    const navigate = useNavigate();
    const [hotelToEdit, setHotelToEdit] = useState({});

    const { id } = useParams();

    const { data: hotel, isLoading, refetch: viewHotelRequest } = useQuery({
        queryKey: ["hotelData", id],
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



    const handleEditClose = () => {
        setHotelToEdit({});
        viewHotelRequest();
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate("/hotels")}>Hotels</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>View Hotels</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    
    if (isLoading) {
        return (
            <>
                <UserAreaHeader pages={breadcrumb} />
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            </>
        )
    }

    const locationId = hotel?.locations

    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />
            <div className="flex justify-between mx-6">
                <div className="flex gap-4 my-6">
                    <img
                        src={hotel?.logo || "/path/to/default-image.jpg"}
                        className="w-16 h-16"
                    />

                    <div>
                        <h1 className="font-bold text-[22px]">{hotel?.name}</h1>
                        <p className="text-[13px] text-gray-500">Expiry Date</p>
                        {/* <p>{hotel.createdAt}</p> */}
                    </div>
                </div>
                <div>
                    <div className="flex gap-2">
                        <Badge
                            variant="outline"
                            className="text-[#6A6779] cursor-pointer"
                            onClick={() => setHotelToEdit(hotel)}
                        >
                            <RiEdit2Line className=" h-3" /> Edit
                        </Badge>
                        <Badge variant={hotel?.isActive ? `success` : "error"}>
                            {hotel?.isActive ? `Active` : "Inactive"}
                        </Badge>
                    </div>
                </div>
            </div>



            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-[80%] ml-6 rounded-[3rem]">
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="overview"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="users"
                    >
                        Users
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="locations"
                    >
                        Locations
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="rooms"
                    >
                        Room Type
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="subscription"
                    >
                        Subscription Plan
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-[50%] rounded-[3rem] px-4 my-6"
                        value="settingd"
                    >
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="border border-b-0 border-l-0 border-r-0 mt-4">
                    <TabsContent value="overview">
                        <Card>
                            <HotelsOverview />
                        </Card>
                    </TabsContent>
                    <TabsContent value="users">
                        <Card>
                            <HotelPageUsers hotelId={hotel} />
                        </Card>
                    </TabsContent>
                    <TabsContent value="locations">
                        <Card>
                            <Locations hotelId={hotel.id} />
                        </Card>
                    </TabsContent>
                    <TabsContent value="rooms">
                        <Card>
                            <Rooms />
                        </Card>
                    </TabsContent>
                    <TabsContent value="subscription">
                        <Card>
                            <SubscriptionHistory />
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Card>
                            <PageSettings />
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {!!hotelToEdit?.id && (
                <EditHotelModal closeFn={handleEditClose} hotelToEdit={hotelToEdit}/>
            )}
        </div>
    );
}

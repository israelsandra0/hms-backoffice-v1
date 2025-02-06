import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import UserAreaHeader from "@/components/UserAreaHeader";
import { get } from "@/functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelsOverview from "./Overview";
import HotelPageUsers from "./viewHotelUsers/Users";
import Locations from "./viewHotelLocations/Locations";
import SubscriptionHistory from "./viewHotelSubscription/Subscription";
import PageSettings from "./Settings";
import { Badge } from "@/components/ui/badge";
import { RiEdit2Line } from "@remixicon/react";
import EditHotelModal from "../Edit";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Rooms from "./viewHotelRooms/Rooms";

export default function ViewHotelsPage() {
    const navigate = useNavigate();
    const [hotelToEdit, setHotelToEdit] = useState({});
    const [hotelLogo, setHotelLogo] = useState(false);

    let [searchParams, setSearchParams] = useSearchParams();

    const { id } = useParams();

    const validTabs = [
        "Overview",
        "Users",
        "Locations",
        "Room Type",
        "Subscription Plan",
        "Setting",
    ];
    const getInitialTab = () => {
        const requestedTab = searchParams.get("active");
        return validTabs.includes(requestedTab) ? requestedTab : validTabs[0];
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());

    const changeActiveTab = (newTab) => {
        setActiveTab(newTab);
        setSearchParams(new URLSearchParams({ active: newTab }));
    };

    const {
        data: hotel,
        isLoading,
        refetch: viewHotelRequest,
    } = useQuery({
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

    // Update the logo state when hotel data is loaded
    useEffect(() => {
        if (hotel?.logo) {
            setHotelLogo(hotel.logo);
        }
    }, [hotel]);

    const handleEditClose = () => {
        setHotelToEdit({});
        viewHotelRequest();
    };

    const handleLogoRemove = () => {
        setHotelLogo(false); // Remove the logo by setting state to null
        console.log("remioved");
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
        );
    }

    // const locationId = hotel?.locations

    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />

            <div className="flex justify-between mx-6">
                <div className="flex gap-4 my-6">
                    {!!hotelLogo && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <img src={hotelLogo} className="w-16 h-16" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=" ml-40 w-56">
                                <DropdownMenuItem onClick={handleLogoRemove}>
                                    Remove
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Change</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

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

            <Tabs className="w-full" value={activeTab}>
                <TabsList className="w-[95%] ml-6 px-2 rounded-[3rem]">
                    {validTabs.map((tab) => (
                        <TabsTrigger
                            className="w-[50%] rounded-[3rem] py-1 my-6"
                            value={tab}
                            key={tab}
                            onClick={() => changeActiveTab(tab)}
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="border border-b-0 border-l-0 border-r-0 mt-4">
                    <TabsContent value={validTabs[0]}>
                        <Card>
                            <HotelsOverview />
                        </Card>
                    </TabsContent>
                    <TabsContent value={validTabs[1]}>
                        <Card>
                            <HotelPageUsers hotelId={hotel} />
                        </Card>
                    </TabsContent>
                    <TabsContent value={validTabs[2]}>
                        <Card>
                            <Locations hotelId={hotel.id} />
                        </Card>
                    </TabsContent>
                    <TabsContent value={validTabs[3]}>
                        <Card>
                            <Rooms hotelId={hotel.id}/>
                        </Card>
                    </TabsContent>
                    <TabsContent value={validTabs[4]}>
                        <Card>
                            <SubscriptionHistory />
                        </Card>
                    </TabsContent>
                    <TabsContent value={validTabs[5]}>
                        <Card>
                            <PageSettings />
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {!!hotelToEdit?.id && (
                <EditHotelModal closeFn={handleEditClose} hotelToEdit={hotelToEdit} />
            )}
        </div>
    );
}

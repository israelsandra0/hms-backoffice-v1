import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import UserAreaHeader from "@/components/UserAreaHeader";
import { apiDelete, get } from "@/functions";
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
import { HOTEL_VIEW, MANAGE_HOTEL_ADMINS, MANAGE_HOTEL_LOCATIONS } from "@/lib/permissions";
import { usePermission } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";


const TAB_PERMISSION_MAP = {
    "Overview": HOTEL_VIEW.name,
    "Users": MANAGE_HOTEL_ADMINS.name,
    "Locations": MANAGE_HOTEL_LOCATIONS.name
};

export default function ViewHotelsPage() {
    const navigate = useNavigate();
    const [hotelToEdit, setHotelToEdit] = useState({});
    const [hotelLogo, setHotelLogo] = useState(null);
    const [hotel, setHotel] = useState({})
    const { hasPermission } = usePermission();
    const { toast } = useToast()
    const { confirmAction } = useConfirm()

    let [searchParams, setSearchParams] = useSearchParams();

    const { id } = useParams();

    const validTabs = [
        "Overview",
        "Users",
        "Locations",
        "Subscription Plan",
        "Setting",
    ];

    useEffect(() => {
        if (hotel?.logo) {
            setHotelLogo(hotel.logo);
        }
    }, [hotel]);

    const filteredTabs = validTabs.filter(tab => hasPermission(TAB_PERMISSION_MAP[tab]));

    const getInitialTab = () => {
        const requestedTab = searchParams.get("active");
        return filteredTabs.includes(requestedTab) ? requestedTab : filteredTabs[0];
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());

    const changeActiveTab = (newTab) => {
        setActiveTab(newTab);
        setSearchParams(new URLSearchParams({ active: newTab }));
    };

    const { isLoading, isFetching, refetch: viewHotelRequest } = useQuery({
        queryKey: ["hotelData", id],
        queryFn: async () => {
            const res = await get(`/hotels/show/${id}`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel data");
            }
            const response = await res.json();
            setHotel(response.data)
            return response.data;
        },
        enabled: !!id,
        staleTime: 0,
        cacheTime: 0,
    });

    const handleDeleteResponse = (res) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: 'Hotel logo deleted successfully!'
            });
            viewHotelRequest();
            setHotelLogo(false);
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete hotel logo. Please try again.'
            });
        }
    }

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this hotel logo, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        },
        activate: {
            title: 'Activate Hotel?',
            message: 'This action will activate the hotel and allow it to be visible to users.',
            confirmButtonText: 'Activate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        },
        deactivate: {
            title: 'Deactivate Hotel?',
            message: 'This action will deactivate the hotel and allow it to be invisible to users.',
            confirmButtonText: 'Deactivate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        }
    }

    const handleActionClick = (hotelId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(hotelId, actionType),
            completeFn: (res) => {
                if (actionType.toLowerCase() === 'delete') {
                    handleDeleteResponse(res)
                }
            }

        })
    };

    const handleConfirmation = async (hotelId, hotelAction) => {

        if (hotelAction === 'Delete' || hotelAction === 'Deactivate') {
            return await post(`/hotels/update-active-status/${hotelId}`, { isActive: hotelAction === 'Activate' })
        } else {
            return await apiDelete(`/hotels/${id}/remove-logo`)

        }
    }

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
                    <BreadcrumbPage>View Hotel</BreadcrumbPage>
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



    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />

            {isFetching ?
                <div className="text-center flex items-center justify-center mx-auto mt-40">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
                
                :

                <div>
                    <div className="flex justify-between mx-6">
                        <div className="flex gap-4 my-6">
                            {!!hotelLogo && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <img src={hotelLogo} className="w-16 h-16" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" ml-40 w-56">
                                        <DropdownMenuItem onClick={() => handleActionClick(hotel.id, 'delete')}>
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
                            {filteredTabs.map((tab) => (
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
                            {filteredTabs.includes("Overview") && (
                                <TabsContent value="Overview">
                                    <Card>
                                        <HotelsOverview />
                                    </Card>
                                </TabsContent>
                            )}
                            {filteredTabs.includes("Users") && (
                                <TabsContent value="Users">
                                    <Card>
                                        <HotelPageUsers hotelId={hotel.id} />
                                    </Card>
                                </TabsContent>
                            )}
                            {filteredTabs.includes("Locations") && (
                                <TabsContent value="Locations">
                                    <Card>
                                        <Locations hotelId={hotel.id} />
                                    </Card>
                                </TabsContent>
                            )}
                            {filteredTabs.includes("Subscription Plan") && (
                                <TabsContent value="Subscription Plan">
                                    <Card>
                                        <SubscriptionHistory hotelId={hotel.id} />
                                    </Card>
                                </TabsContent>
                            )}
                            {filteredTabs.includes("Setting") && (
                                <TabsContent value="Setting">
                                    <Card>
                                        <PageSettings closeFn={handleEditClose} hotelId={hotel} />
                                    </Card>
                                </TabsContent>
                            )}
                        </div>
                    </Tabs>
                </div>

            }



            {!!hotelToEdit?.id && (
                <EditHotelModal closeFn={handleEditClose} hotelToEdit={hotelToEdit} />
            )}
        </div>
    );
}

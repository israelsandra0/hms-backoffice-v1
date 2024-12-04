import { BACKEND_URL } from "@/constants";
import { apiDelete, get, post } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button_link";
import UserAreaHeader from "@/components/UserAreaHeader";
import { MoreVertical, } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import EditHotelModal from "./Edit";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";


export default function HotelsPage() {


    const [editBox, setEditBox] = useState(false)
    const [activeHotelId, setActiveHotelId] = useState(null);
    const [hotelDetails, setHotelDetails] = useState()
    const [hotelToEdit, setHotelToEdit] = useState({})
    const { toast } = useToast()
    const { confirmAction } = useConfirm()


    // handle hotel list
    const { data: clients, error, isPending: isLoadingHotels, refetch: fetchAllHotels } = useQuery({
        queryKey: ['clientsData'],
        queryFn: async () => {
            const res = await get('/hotels');
            if (!res.ok) {
                throw new Error(error.message);
            }
            const response = await res.json();
            return response.data;
        },
    });

    if (isLoadingHotels) {
        return (
            <>
                <UserAreaHeader pageName="Hotel Management" />
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            </>
        );
    }

    if (!clients?.length) {
        return (
            <>
                <UserAreaHeader pageName="Hotel Management" />
                <div className="text-right mr-4 mb-8">
                    <ButtonLink to="/hotels/add" variant="primary">
                        Add Hotels
                    </ButtonLink>
                </div>
                <Card className="p-4">
                    <p>No hotels found!</p>
                </Card>
            </>
        );
    }

    const handleDeleteResponse = (res) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: 'Hotel deleted successfully!'
            });
            fetchAllHotels()
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the hotel. Please try again.'
            });
        }
    }

    const handleStatusUpdateResponse = (res, isActivate) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: isActivate ? 'Hotel activated successfully!' : 'Hotel deactivated successfully!'
            });
            fetchAllHotels();
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to update hotel staus. Please try again.'
            });
        }
    }


    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this hotel, This action cannot be undone.",
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

    // Handle button click for delete/activation/deactivation
    const handleActionClick = (hotelId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(hotelId, actionType),
            completeFn: (res) => {
                if (actionType.toLowerCase() === 'delete'){
                    handleDeleteResponse(res)
                }
                else {
                    handleStatusUpdateResponse(res, actionType == 'Activate')
                }
            }

        })
    };
    
    //handle delete, activation / deactivation fetching
    const handleConfirmation = async (hotelId, hotelAction) => {

        if (hotelAction === 'Activate' || hotelAction === 'Deactivate') {
            return await post(`/hotels/update-active-status/${hotelId}`, { isActive:  hotelAction === 'Activate' })
        } else {
            return await apiDelete(`/hotels/destroy/${hotelId}`)

        }
    }

    const handleEditClose = () => {
        setHotelToEdit({})
        fetchAllHotels()
    }


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Hotels</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
    


    return (
        <>
            <UserAreaHeader pages={breadcrumb} />
            <div className="text-right mr-4 mb-8">
                <ButtonLink to="/hotels/add" variant="primary">
                    Add Hotels
                </ButtonLink>
            </div>


            <Table className="content w-full">
                <TableHeader>
                    <TableRow className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6">
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Locations</TableHead>
                        <TableHead>Subscription Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client?.id}>
                            <TableCell><img src={client?.logo} alt="" className="h-[50px] w-[50px]" /></TableCell>
                            <TableCell>{client?.name}</TableCell>
                            <TableCell>{client?.website}</TableCell>
                            <TableCell>{client?.locations_count}</TableCell>
                            <TableCell>{client?.subscription}</TableCell>
                            <TableCell><Badge variant={client?.isActive ? `success` : 'error'}>{client?.isActive ? `Active` : 'Inactive'}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 cursor-pointer">
                                        <Link variant='outline' to={`/hotels/view/overview?hotelId=${client.id}&logoUrl=${client.logo}`}>
                                            <DropdownMenuItem to="/hotels/view/overview">
                                                <span>View</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setHotelToEdit(client)}>
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleActionClick(client.id, client.isActive ? 'Deactivate' : 'Activate')}>
                                            <span>{client.isActive ? 'Deactivate' : 'Activate'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleActionClick(client.id, 'delete')}>
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {!!hotelToEdit?.id && <EditHotelModal closeFn={handleEditClose} hotelToEdit={hotelToEdit} />}

        </>
    );
}

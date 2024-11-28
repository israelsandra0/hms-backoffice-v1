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
import AlertBox from "@/components/ui/alert-box";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import EditHotelModal from "./Edit";
import { useConfirm } from "@/hooks/use-confirm";


export default function HotelsPage() {

    const [deletingHotelId, setDeletingHotelId] = useState(null);
    const [editBox, setEditBox] = useState(false)
    const [activeHotelId, setActiveHotelId] = useState(null);
    const [hotelAction, setHotelAction] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    // Fetching hotels data


    // handle hotel list
    const { data: clients, error, isPending, refetch: fetchAllHotels } = useQuery({
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

    const { toast } = useToast()
    const { confirmAction } = useConfirm()
    // handle hotel deletion
    const { refetch: sendDeleteRequest } = useQuery({
        enabled: false,
        queryKey: ['delete'],
        queryFn: async () => {

            const res = await apiDelete(`/hotels/destroy/${deletingHotelId}`)

            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Hotel deleted successfully!'
                });
            } else {
                toast({
                    error: true,
                    duration: 5000,
                    title: 'Failed to delete the hotel. Please try again.'
                });
            }


        },
    });

    // handle hotel activation / deactivation
    const { refetch: updateHotelStatus, isFetching } = useQuery({
        enabled: false,
        queryKey: ['hotelStatus'],
        queryFn: async () => {

            const hotelStatus = hotelAction === 'Activate';
            const res = await post(`/hotels/update-active-status/${activeHotelId}`, { isActive: hotelStatus })
            console.log(res)

            if (res.ok) {
                console.log('hello')
                toast({
                    success: true,
                    duration: 5000,
                    title: hotelStatus ? 'Hotel activated successfully!' : 'Hotel deactivated successfully!'
                });
            } else {
                console.log('yesssssss')
                toast({
                    error: true,
                    duration: 5000,
                    title: 'Failed to update hotel staus. Please try again.'
                });
            }


        },
    });

    // handle hotel editing
    const { refetch: editHotel } = useQuery({
        enabled: false,
        queryKey: ['editing'],
        queryFn: async () => {

            const res = await fetch(`${BACKEND_URL}/hotels/update/${hotelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });

            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Hotel edited successfully!'
                });
            } else {
                toast({
                    error: true,
                    duration: 5000,
                    title: 'Failed to edit hotel. Please try again.'
                });
            }
            return res;
        },
    });



    // Loading state
    if (isPending) {
        return <div>Loading ...</div>;
    }

    if (isFetching) {
        return <div>Loading ...</div>;
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

        // setHotelAction(actionType);
        // setDeletingHotelId(hotelId);
        // setActiveHotelId(hotelId)
        // setIsDialogOpen(true);
    };

    
    

    const handleConfirmation = async (hotelId, hotelAction) => {

        if (hotelAction === 'Activate' || hotelAction === 'Deactivate') {
            return await post(`/hotels/update-active-status/${hotelId}`, { isActive:  hotelAction === 'Activate' })
        } else {
            return await apiDelete(`/hotels/destroy/${hotelId}`)

        }
    }

    //

    // Handle dialog cancel
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setDeletingHotelId(null);
        setActiveHotelId(null)
        setHotelAction(null)
    };

    const handleEditClick = (hotelId) => {
        setEditBox(true);
        setActiveHotelId(hotelId);
    };
    const handleEditClose = () => {
        setEditBox(false)
    }


    return (
        <>
            <UserAreaHeader pageName="Hotel Management" />
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
                        <TableHead>Number of Locations</TableHead>
                        <TableHead>Subscription Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client?.id}>
                            <TableCell>{client?.name}</TableCell>
                            <TableCell>{client?.website}</TableCell>
                            <TableCell>{client?.number}</TableCell>
                            <TableCell>{client?.subscription}</TableCell>
                            <TableCell><Badge variant={client?.isActive ? `success` : 'error'}>{client?.isActive ? `Active` : 'Inactive'}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer hover:bg-gray-100" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuItem>
                                            <span>View</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleEditClick(client.id)}>
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

            {isDialogOpen && (
                <AlertBox title={
                    hotelAction === 'delete' ? "Are you sure?" :
                    hotelAction === 'Activate' ? "Activate Hotel?" : "Deactivate Hotel?"
                    }
                    message={
                        hotelAction === 'delete' ? "you're about to delete this hotel, This action cannot be undone." :
                            hotelAction === 'Activate' ? "This action will activate the hotel and allow it to be visible to users."
                                : "This action will deactivate the hotel and allow it to be invisible to users."
                    }
                    buttonVariant={
                        hotelAction === 'delete' ? "error" :
                            hotelAction === 'Activate' ? "primary" : "primary"
                    }
                    confirmButtonText={
                        hotelAction === 'delete' ? "Delete" :
                            hotelAction === 'Activate' ? "Activate" : "Deactivate"
                    }
                    cancelButtonText={
                        hotelAction === 'delete' ? "Cancel" :
                            hotelAction === 'Activate' ? "Cancel" : "Cancel"
                    }
                    boxIcon={
                        hotelAction === 'Active'
                    }
                    confirmFn={handleConfirmation}
                    cancelFn={handleDialogClose}

                />
            )}

            {editBox && <EditHotelModal closeFn={handleEditClose} />}

        </>
    );
}

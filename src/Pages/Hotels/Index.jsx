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


export default function HotelsPage() {

    const [deletingHotelId, setDeletingHotelId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetching hotels data
    
    
    // handle hotel list
    const { data: clients, error, isPending, refetch: fetchAllHotels } = useQuery({
        queryKey: ['clientsData'],
        queryFn: async () => {
            const res = await get(`${BACKEND_URL}/hotels`);
            if (!res.ok) {
                throw new Error(error.message);
            }
            const response = await res.json();
            return response.data;
        },
    });

    const {toast} = useToast()
    // handle hotel deletion
    const { refetch: sendDeleteRequest } = useQuery({
        enabled: false,
        queryKey: ['delete'],
        queryFn: async () => {

            const res = await apiDelete(`${BACKEND_URL}/hotels/destroy/${deletingHotelId}`)

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

  

    // Loading state
    if (isPending) {
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

    // Handle delete button click
    const handleDeleteClick = (hotelId) => {
        setDeletingHotelId(hotelId);
        setIsDialogOpen(true);
    };

    // Handle dialog cancel
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setDeletingHotelId(null);
    };


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
                                        <DropdownMenuItem>
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem >
                                            <span>{client.isActive ? 'Deactivate' : 'Activate'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setDeletingHotelId(client.id)
                                                setIsDialogOpen(true)
                                            }}>
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
                <AlertBox title="Are you sure?"
                    message="This will permanently delete the hotel and remove its data from our servers. This action cannot be undone."
                    confirm={async () => {
                        setIsDialogOpen(false);
                        await sendDeleteRequest();
                        fetchAllHotels();                        
                    }}
                    cancel={handleDialogClose}
                />
            )}

        </>
    );
}

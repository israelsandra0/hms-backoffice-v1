
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
import { ExternalLink, MoreVertical, Search, } from "lucide-react"
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
import Spinner from "@/components/ui/spinner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";


export default function HotelsPage() {

    const [hotelToEdit, setHotelToEdit] = useState({})
    const { toast } = useToast()
    const { confirmAction } = useConfirm()
    const navigate = useNavigate()
    const [searchFilter, setSearchFilter] = useState("");


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
                if (actionType.toLowerCase() === 'delete') {
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
            return await post(`/hotels/update-active-status/${hotelId}`, { isActive: hotelAction === 'Activate' })
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

    const filteredHotels = clients.filter(({ name }) => {
        return name.toLowerCase().includes(searchFilter.toLowerCase());
    });

    return (
        <>
            <UserAreaHeader pages={breadcrumb} />
            <div className="flex justify-between mx-6 my-4">
                <div className="mb-4">
                    <Search className="text-gray-300 w-4 absolute mt-[10px] ml-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="border border-b-gray-300 pl-9 rounded py-2 w-[300px] outline-none"
                    />
                </div>
                <ButtonLink to="/hotels/add" variant="primary">
                    Add Hotel
                </ButtonLink>
            </div>

            <Table className="content w-full rounded overflow-hidden">
                <TableHeader className="">
                    <TableRow className="bg-lightPrimary ">
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Locations</TableHead>
                        <TableHead>Subscription Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredHotels.map((hotel) => (
                        <TableRow key={hotel?.id}  className="hover:bg-grey">
                            <TableCell>
                                <Link onClick={() => navigate(`/hotels/view/${hotel.id}`)} className="text-primary">
                                    {hotel?.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <a  href={`https://${hotel?.website}`} className="text-primary flex gap-1 items-center"  target="_blank" rel="noopener noreferrer">
                                    {hotel?.website}
                                    <ExternalLink className='w-4'/>
                                </a>
                            </TableCell>
                            <TableCell>{hotel?.locations_count}</TableCell>
                            <TableCell>{hotel?.subscription}</TableCell>
                            <TableCell><Badge variant={hotel?.isActive ? `success` : 'error'}>{hotel?.isActive ? `Active` : 'Inactive'}</Badge></TableCell>
                            {/* <TableCell></TableCell> */}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 cursor-pointer">
                                        <DropdownMenuItem onClick={() => navigate(`/hotels/view/${hotel.id}`)}>
                                            <span>View</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setHotelToEdit(hotel)}>
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleActionClick(hotel.id, hotel.isActive ? 'Deactivate' : 'Activate')}>
                                            <span>{hotel.isActive ? 'Deactivate' : 'Activate'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleActionClick(hotel.id, 'delete')}>
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

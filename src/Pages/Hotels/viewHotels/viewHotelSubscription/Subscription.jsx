import Pagination from "@/components/Pagination";import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useConfirm } from "@/hooks/use-confirm";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { CalendarIcon, ChevronDown, Currency, MoreVertical, Search, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AddSubscriptionPage from "./AddSubscription";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function SubscriptionHistory({ hotelId }) {

    const navigate = useNavigate()
    const [date, setDate] = useState()
    const [searchFilter, setSearchFilter] = useState("");
    const [addSubscriptionBox, setAddSubscriptionBox] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()


    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this Plan, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        },
        activate: {
            title: 'Activate Role?',
            message: 'This action will activate the role and allow it to be visible to users.',
            confirmButtonText: 'Activate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        },
        deactivate: {
            title: 'Deactivate Role?',
            message: 'This action will deactivate the role and allow it to be invisible to users.',
            confirmButtonText: 'Deactivate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        }
    }

    const handleEditPlan = (editId) => {
        navigate('/setting/subscriptions/edit', { state: { editId } });
    };

    const handleConfirmation = async (planId) => await apiDelete(`/subscription-plans/${planId}/destroy`)


    const columns = useMemo(() => [
        {
            header: "Subscription Plans",
            cell: (info) => {
                return (
                    <ul>
                        <li>{info.row.original.subscriptionPlan.name}</li>
                    </ul>
                );
            },
        },
        {
            header: "Start Date",
            accessorKey: "startDate",
        },
        {
            header: "Amount",
            cell: (info) => {
                return (
                    <span>
                        ₦
                        {`${info.row.original.paidAmount}`}
                    </span>
                );
            },
        },
        {
            header: "Expiry Date",
            accessorKey: "expiryDate",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem>
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPlan(row.original)}>
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(row.original.id, 'delete')}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);


    const { data: Hotelsubscription, isFetching, refetch: fetchHotelSubscriptions } = useQuery({
        queryKey: ["Hotelsubscription"],
        queryFn: async () => {
            const res = await get(`/hotels/${hotelId}/subscriptions`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
                // return []
            }

            const response = await res.json();
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        console.log("subs", Hotelsubscription)
        fetchHotelSubscriptions()
    }, [])

    const filteredPlan = useMemo(() => {
        if (!searchFilter) return Hotelsubscription || [];

        const lowerCaseFilter = searchFilter.toLowerCase();

        return (Hotelsubscription || []).filter(subscription =>
            subscription.name.toLowerCase().includes(lowerCaseFilter)
        );
    }, [Hotelsubscription, searchFilter]);


    const table = useReactTable({
        data: filteredPlan,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: ({ pageIndex }) => {
            setPageIndex(pageIndex ?? 0);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const handleDeleteResponse = (res) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: 'Plan deleted successfully!'
            });
            fetchHotelSubscriptions()
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the Plan, Please try again.'
            });
        }
    }

    const handleActionClick = (planId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(planId, actionType),
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

    const closeAddSubscriptionBox = () => {
        setAddSubscriptionBox(false)
        fetchHotelSubscriptions()
    };


    return (
        <div>

            {isFetching ?
                (
                    <div className="text-center flex items-center justify-center mx-auto mt-28">
                        <Spinner className="me-3 text-gray-300 h-16 w-16" />
                    </div>
                )
                :
                Hotelsubscription && Hotelsubscription?.length > 0 ? (
                    <div>
                        <div className="flex justify-between mx-6 my-8 ">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-between font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="h-4 mr-1" />
                                        {date ? format(date, "PPP") : <span>Date</span>}
                                        <ChevronDown className="h-4 ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button variant='primary' onClick={() => (setAddSubscriptionBox(true))}>Add </Button>
                        </div>
                        <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                            {table.getPageCount() > 0 && (
                                <Table>
                                    <TableHeader className="bg-lightPrimary">
                                        <TableRow>
                                            <TableHead>Subscription Plan</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => {

                                                    return (
                                                        <TableCell key={row.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

                        </div>
                    </div>
                ) : (
                    <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                        <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                            <Shield className='w-[100px] h-[100px] text-primary' />
                        </div>
                        <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                        <Button variant='primary' onClick={() => (setAddSubscriptionBox(true))}>Add</Button>
                    </div>
                )

            }


            {!!addSubscriptionBox && (
                <AddSubscriptionPage closeFn={closeAddSubscriptionBox} hotelId={hotelId} />
            )}

        </div>
    )
}

import Pagination from "@/components/Pagination"; import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useConfirm } from "@/hooks/use-confirm";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { CalendarIcon, ChevronDown, Currency, MoreVertical, Search, Shield, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

export default function SubscriptionHistory({ hotelId }) {

    const navigate = useNavigate()
    const [date, setDate] = useState()
    const [searchFilter, setSearchFilter] = useState("");
    const [addSubscriptionBox, setAddSubscriptionBox] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null)
    const pageSize = 10


    const columns = useMemo(() => [
        {
            header: "Subscription Plans",
            cell: (info) => {
                return (
                    <ul>
                        <li onClick={() => setSelectedPlan(info.row.original)}>
                            {info.row.original.subscriptionPlan.name}
                        </li>
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
                        {info.row.original.paidAmount
                            ? new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 2,
                            }).format(Number(info.row.original.paidAmount))
                            : "₦0.00"}

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
                            <DropdownMenuItem onClick={() => setSelectedPlan(row.original)}>
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Upgrade</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Renew</span>
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

            {!!selectedPlan && (
                <Card className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
                    <CardContent className="fixed rounded sm:rounded-xl md:rounded-xl lg:rounded-xl left-[50%] top-[50%] z-50 grid w-[400px] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200">
                        <div className="flex">
                            <X
                                className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400"
                                onClick={() => setSelectedPlan(null)}
                            />
                            <h1 className="mx-auto text-[1.3rem] font-bold mb-2">Subscription Details</h1>
                        </div>

                        <p className="text-[1rem]">
                            <h1 className="">Subscription Plan</h1>
                            <strong>
                                {`${selectedPlan.subscriptionPlan.name}`}
                            </strong>
                        </p>

                        <p className="text-[1rem]">
                            <h1 className="">Amount</h1>
                            <strong>
                                {selectedPlan.paidAmount
                                    ? new Intl.NumberFormat("en-NG", {
                                        style: "currency",
                                        currency: "NGN",
                                        minimumFractionDigits: 2,
                                    }).format(Number(selectedPlan.paidAmount))
                                    : "₦0.00"}
                            </strong>
                        </p>

                        <p className="text-[1rem]">
                            <h1 className="">Start Date</h1>
                            <strong>
                                {`${selectedPlan.startDate ? format(new Date(selectedPlan.startDate), "do MMMM, yyyy") : "N/A"}`}
                            </strong>
                        </p>
                        <p className="text-[1rem]">
                            <h1 className="">Expiry Date</h1>
                            <strong>
                                {selectedPlan.expiryDate ? format(new Date(selectedPlan.expiryDate), "do MMMM, yyyy") : "N/A"}
                            </strong>
                        </p>



                    </CardContent>
                </Card>
            )}


            {!!addSubscriptionBox && (
                <AddSubscriptionPage closeFn={closeAddSubscriptionBox} hotelId={hotelId} />
            )}

        </div>
    )
}

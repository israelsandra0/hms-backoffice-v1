
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, MoreVertical, Search } from "lucide-react";
import { useState } from "react";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function SubscriptionHistory() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [date, setDate] = useState()

    const data = [
        {
            id: "m5gr84i9",
            plan: "Standard",
            datePaid: "01st-Nov-2024",
            amount: "₦180,000.00",
            expiryDate: "30th-Nov-2024",
        },
        {
            id: "m5gr84i9",
            plan: "Premium Plan",
            datePaid: "15tht-Oct-2024",
            amount: "₦250,000.00",
            expiryDate: "14th-Nov-2024",
        },
        {
            id: "m5gr84i9",
            plan: "Basic Plan",
            datePaid: "20th-Sep-2024",
            amount: "₦100,000.00",
            expiryDate: "19th-Oct-2024",
        },
        {
            id: "m5gr84i9",
            plan: "Basic Plan",
            datePaid: "5th-Aug-2024",
            amount: "₦100,000.00",
            expiryDate: "5th-Sep-2024",
        },
        {
            id: "m5gr84i9",
            plan: "Premium Plan",
            datePaid: "01st-Jul-2024",
            amount: "₦250,000.00",
            expiryDate: "31st-Jul-2024",
        },
    ];

    // React Table setup
    const table = useReactTable({
        data: data, // Use paginated data
        columns: [
            { accessorKey: "plan", header: "Plan" },
            { accessorKey: "date paid", header: "Date Paid" },
            { accessorKey: "amount", header: "Amount" },
            { accessorKey: "expiry date", header: "Expiry Date" },
        ],
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });


    return (
        <div>
            <div className="flex items-center justify-between px-6 pt-6 mx-2">

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-between font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="h-4 mr-1"/>
                            {date ? format(date, "PPP") : <span>Date</span>}
                            <ChevronDown className="h-4 ml-2"/>
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

                <Button variant="primary" onClick={() => setAddUserBox(true)}>
                    + New Subscription
                </Button>
            </div>

            {/* <h1 className=" mt-8 font-bold text-[1.5rem] text-center">No Available Content !</h1> */}

            <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Plan</TableHead>
                            <TableHead>Date Paid</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.plan}</TableCell>
                                <TableCell>{data.datePaid}</TableCell>
                                <TableCell>{data.amount}</TableCell>
                                <TableCell>{data.expiryDate}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <MoreVertical className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 cursor-pointer">
                                            <DropdownMenuItem>
                                                <span>View</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <span>Upgrade</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <span>Renew</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

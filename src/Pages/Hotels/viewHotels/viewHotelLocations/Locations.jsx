import { ButtonLink } from "@/components/ui/button_link";
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
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import AddHotelLocation from "./AddHotelLocation";
import { useState, useMemo } from "react";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResponsivePaginationComponent from "react-responsive-pagination";
import Pagination from "@/components/Pagination";

export default function Locations({ locations, hotelId }) {
    const [addLocationBox, setAddLocationBox] = useState(false);
    const closeAddLocationBox = () => setAddLocationBox(false);

    // Pagination state
    const [pageIndex, setPageIndex] = useState(0); // Current page
    const pageSize = 5 // Number of items per page

    // Define columns (no change needed to the columns)
    const columns = useMemo(() => [
        {
            header: "Address",
            accessorKey: "address",
        },
        {
            header: "State",
            accessorKey: "state",
        },
        {
            header: "City",
            accessorKey: "location_counts",
        },
        {
            header: "Number of Users",
            accessorKey: "location_counts",
        },
        {
            header: "Rooms",
            accessorKey: "rooms",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem>
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    // Set up the table with pagination
    const table = useReactTable({
        data: locations,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: ({ pageIndex }) => {
            setPageIndex(pageIndex);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    // const pageCount = table.getPageCount(); // Total number of pages

    // // Pagination controls functions
    // const goToPreviousPage = () => {
    //     if (pageIndex > 0) {
    //         setPageIndex(pageIndex - 1);
    //     }
    // };

    // const goToNextPage = () => {
    //     if (pageIndex < pageCount - 1) {
    //         setPageIndex(pageIndex + 1);
    //     }
    // };

    // // const totalPages = 5;

    // function handlePageChange(page) {
    //     setPageIndex(page - 1);
    //     // ... do something with `page`
    // }

    return (
        <div>
            <div className="flex items-center justify-between px-6 py-4">
                <div className="text-right mr-4 mt-4">
                    <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                        + Add
                    </Button>
                </div>
            </div>

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Address</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Number of Users</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

           <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex}/>

            {/* Add Location Modal */}
            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}
        </div>
    );
}

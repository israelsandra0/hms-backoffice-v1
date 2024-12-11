import { ButtonLink } from "@/components/ui/button_link";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ResponsivePaginationComponent from "react-responsive-pagination";

export default function Locations({ locations, hotelId }) {
    const columns = [
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("address")}</div>
            ),
        },
        {
            accessorKey: "state",
            header: "State",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("state")}</div>
            ),
        },
        {
            accessorKey: "city",
            header: "City",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("city")}</div>
            ),
        },
        {
            accessorKey: "users",
            header: "Number of Users",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("users")}</div>
            ),
        },
        {
            accessorKey: "rooms",
            header: "Rooms",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("rooms")}</div>
            ),
        },

        // {
        //     accessorKey: "amount",
        //     header: () => <div className="text-right">Amount</div>,
        //     cell: ({ row }) => {
        //         const amount = parseFloat(row.getValue("amount"))

        //         // Format the amount as a dollar amount
        //         const formatted = new Intl.NumberFormat("en-US", {
        //             style: "currency",
        //             currency: "USD",
        //         }).format(amount)

        //         return <div className="text-right font-medium">{formatted}</div>
        //     },
        // },
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
    ];

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    // Pagination state
    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 5;

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 5, //default page size
    });


    const table = useReactTable({
        data: locations, // Use the locations prop here
        columns,
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
            pagination,
        },
        // Handling page changes manually
        onPaginationChange: (page) => {
            setPagination({
                ...pagination,
                pageIndex: page,
            });
        },
    });

    const [addLocationBox, setAddLocationBox] = useState(false);
    const [locationsList, setLocationsList] = useState(locations);

    // Function to refresh or update locations after adding
    const refreshLocations = (newLocation) => {
        setLocationsList((prevLocations) => [...prevLocations, newLocation]);
    };

    const closeAddLocationBox = () => setAddLocationBox(false);

    return (
        <div>
            <div className="flex items-center justify-between px-6 py-4">
                <Input
                    placeholder="Filter states..."
                    value={table.getColumn("state")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("state")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-transparent"
                />
                <div className="text-right mr-4 mt-4">
                    <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                        + Add
                    </Button>
                </div>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </div>

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6 rounded-[8px] ">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex items-center justify-end space-x-2 py-4 mx-6">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div> */}

            {!!addLocationBox && (
                <AddHotelLocation
                    closeFn={closeAddLocationBox}
                    onLocationAdded={refreshLocations}
                    hotelId={hotelId}
                />
            )}

             {/* Pagination */}
            <div className="flex items-center justify-between mx-6 my-6">
                <Button
                    variant="outline"
                    className="rounded-[8px]"
                    onClick={() => table.previousPage()}
                    // disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4" /> Previous
                </Button>

                {/* Pagination component */}
                <ResponsivePaginationComponent
                    renderNav={false}
                    total={table.getPageCount()}  // Number of total pages
                    current={table.getState().pagination.pageIndex + 1}  // Current page index (1-based)
                    onPageChange={(page) => table.setPageIndex(page - 1)}  // Adjust page change
                />

                <Button
                    variant="outline"
                    className="rounded-[8px]"
                    onClick={() => table.nextPage()}
                    // disabled={!table.getCanNextPage()}
                >
                    Next <ChevronRight className="h-4" />
                </Button>
            </div>
        </div>
    );

    //         {/* <Table className="content w-[95%] my-6 ml-6 rounded-[2rem] border border-gray-200">
    //             <TableHeader>
    //                 <TableRow className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6">
    //                     <TableHead>Address</TableHead>
    //                     <TableHead>State</TableHead>
    //                     <TableHead>City</TableHead>
    //                     <TableHead>Number of Users</TableHead>
    //                     <TableHead>Rooms</TableHead>
    //                     <TableHead></TableHead>
    //                 </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //                 {Locations?.map((location) => (
    //                     <TableRow key={location?.id}>
    //                         <TableCell>{location?.address}</TableCell>
    //                         <TableCell>{location?.state}</TableCell>
    //                         <TableCell>{location?.city}</TableCell>
    //                         <TableCell>{location?.city}</TableCell>
    //                         <TableCell>{location?.city}</TableCell>
    //                         <TableCell>
    //                             <DropdownMenu>
    //                                 <DropdownMenuTrigger asChild>
    //                                     <MoreVertical className="cursor-pointer" />
    //                                 </DropdownMenuTrigger>
    //                                 <DropdownMenuContent className="w-56 cursor-pointer">
    //                                     <DropdownMenuItem >
    //                                         <span>Edit</span>
    //                                     </DropdownMenuItem>
    //                                     <DropdownMenuSeparator />
    //                                     <DropdownMenuItem>
    //                                         <span>Delete</span>
    //                                     </DropdownMenuItem>
    //                                 </DropdownMenuContent>
    //                             </DropdownMenu>
    //                         </TableCell>
    //                     </TableRow>
    //                 ))}
    //             </TableBody>
    //         </Table> */}

    //         {!!addLocationBox && <AddHotelLocation closeFn={closeAddLocationBox}  onLocationAdded={refreshLocations} hotelId={hotelId}/> }
    //     </div>
    // )
}

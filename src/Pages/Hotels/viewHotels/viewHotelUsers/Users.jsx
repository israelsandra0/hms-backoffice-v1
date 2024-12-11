
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddHotelUsers from "./AddHotelUsers";
import { Badge } from "@/components/ui/badge";
import ResponsivePaginationComponent from "react-responsive-pagination";



export default function HotelPageUsers({ hotelId }) {

    const data = [
        {
            id: "m5gr84i9",
            name: "success",
            role: "manager",
            location: "lagos",
            staus: hotelId?.isActive ? "Active" : "Inactive"
        },
        {
            id: "m5gr84i9",
            name: "merry",
            role: "manager",
            location: "lagos",
        },
        {
            id: "m5gr84i9",
            name: "john",
            role: "manager",
            location: "lagos",
        },
        {
            id: "m5gr84i9",
            name: "kelvin",
            role: "manager",
            location: "lagos",
        },

    ]

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("role")}</div>
            ),
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("location")}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status");
                return (
                    <div className="capitalize">
                        <Badge variant={hotelId?.isActive ? `success` : 'error'}>{hotelId?.isActive ? `Active` : 'Inactive'}</Badge>
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original

                return (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <MoreVertical className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 cursor-pointer">
                                <DropdownMenuItem >
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span>Resend Password</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem >
                                    <span>{hotelId.isActive ? 'Deactivate' : 'Activate'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [addUsersBox, setAddUsersBox] = useState(false)



    // const closeAddUsersBox = () => setAddUsersBox(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Define the page size (how many items per page)
    const totalPages = Math.ceil(data.length / pageSize); // Calculate total pages

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const table = useReactTable({
        data,
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
        },
        // Pagination settings
        // manualPagination: true,
        // pageCount: totalPages,
        // state: {
        //     pagination: {
        //         pageIndex: currentPage - 1, // React Table uses zero-based indexing
        //         pageSize: pageSize,
        //     },
        // },
    });


    return (
        <div>
            <div className="flex items-center justify-between px-6 py-4">
                <Input
                    placeholder="Search..."
                    value={(table.getColumn("location")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("location")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-transparent"
                />
                <div className="text-right mr-4 mt-4">
                    <Button variant="primary" onClick={() => setAddUsersBox(true)}>
                        + Add
                    </Button>
                </div>
            </div>

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200">
                <Table>
                    <TableHeader className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6 rounded-[8px]">
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
                                    )
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

            <div className="flex items-center justify-end space-x-2 py-4 mx-6">
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
            </div>


            {!!addUsersBox && ( <AddHotelUsers /> )}

            {/* Responsive Pagination Component */}
            <div className="pagination">
                <ResponsivePaginationComponent
                    previousClassName="previous-justified"
                    nextClassName="next-justified"
                    total={totalPages}
                    current={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )


}
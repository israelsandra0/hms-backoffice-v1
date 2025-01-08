import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import AddHotelUsers from "./AddHotelUsers";
import Pagination from "@/components/Pagination";

export default function HotelPageUsers({ hotelId }) {
    
    const [addUserBox, setAddUserBox] = useState(false);
    const closeAddUserBox = () => setAddUserBox(false);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    

    const data = [
        { id: "m5gr84i9", name: "success", role: "manager", location: "lagos", status: hotelId?.isActive ? "Active" : "Inactive" },
        { id: "m5gr84i9", name: "merry", role: "manager", location: "lagos",  status: hotelId?.isActive ? "Active" : "Inactive" },
        { id: "m5gr84i9", name: "john", role: "manager", location: "lagos",  status: hotelId?.isActive ? "Active" : "Inactive" },
        { id: "m5gr84i9", name: "kelvin", role: "manager", location: "lagos",  status: hotelId?.isActive ? "Active" : "Inactive" },
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; 
    const totalPages = 5; 
    const [pageIndex, setPageIndex] = useState(0);
    // const totalPages = Math.ceil(data.length / pageSize); 

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Paginate data manually based on current page and page size
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // React Table setup
    const table = useReactTable({
        data: paginatedData, // Use paginated data
        columns: [
            { accessorKey: "name", header: "Name" },
            { accessorKey: "role", header: "Role" },
            { accessorKey: "location", header: "Location" },
            { accessorKey: "status", header: "Status" }
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

    // Handler for "Previous" button
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handler for "Next" button
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end px-6 py-4">
                <div className="text-right mr-4 mt-4">
                    <Button variant="primary" onClick={() => setAddUserBox(true)}>
                        + Add
                    </Button>
                </div>
            </div>

            {/* <h1 className=" mt-8 font-bold text-[1.5rem] text-center">No Available Content !</h1> */}

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className='bg-lightPrimary'>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.name}</TableCell>
                                <TableCell>{data.role}</TableCell>
                                <TableCell>{data.location}</TableCell>
                                <TableCell>
                                    <Badge variant={data.status === 'Active' ? 'success' : 'error'}>{data.status}</Badge>
                                </TableCell>
                                <TableCell>
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
                                                <span>Resend Password</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <span>{hotelId.isActive ? 'Deactivate' : 'Activate'}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

            {/* Add User modal */}
            {!!addUserBox && (
                <AddHotelUsers closeFn={closeAddUserBox} hotelId={hotelId} />
            )}
        </div>
    );
}


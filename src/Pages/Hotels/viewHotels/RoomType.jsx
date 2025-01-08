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
import { MoreVertical, Search } from "lucide-react";
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

export default function Rooms() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchFilter, setSearchFilter] = useState("");

    const data = [
        {
            id: "m5gr84i9",
            name: "Deluxe Room",
            locations: "5",
            description: "Spacious room with king-sized bed with garden view",
        },
        {
            id: "m5gr84i9",
            name: "Standard Room",
            locations: "3",
            description: "Cozy room with queen-sized bed",
        },
        {
            id: "m5gr84i9",
            name: "Executive Room",
            locations: "2",
            description: "Luxurious suite with living area and pool access",
        },
        {
            id: "m5gr84i9",
            name: "Single Room",
            locations: "5",
            description: "Compact room with essential amenities",
        },
        {
            id: "m5gr84i9",
            name: "Family Suite",
            locations: "4",
            description: "Large room with double beds, perfect for families",
        },
    ];

    // React Table setup
    const table = useReactTable({
        data: data, // Use paginated data
        columns: [
            { accessorKey: "name", header: "Name" },
            { accessorKey: "location", header: "Location" },
            { accessorKey: "description", header: "Description" },
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

    // Filter rooms based on the searchFilter
    const filteredRooms = data.filter(({name}) => {
        return name.toLowerCase().includes(searchFilter.toLowerCase());
    });

    return (
        <div>
            <div className="flex items-center justify-center px-6 pt-6">
                <div className="mb-4">
                    <Search className="text-gray-300 w-4 absolute mt-[10px] ml-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="border border-b-gray-300 pl-9 rounded py-2 w-[400px] outline-none"
                    />
                </div>
            </div>

            {/* <h1 className=" mt-8 font-bold text-[1.5rem] text-center">No Available Content !</h1> */}

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRooms.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.name}</TableCell>
                                <TableCell>{data.locations}</TableCell>
                                <TableCell>{data.description}</TableCell>
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
        </div>
    );
}

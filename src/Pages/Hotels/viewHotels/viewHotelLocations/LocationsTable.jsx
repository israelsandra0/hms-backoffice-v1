import Pagination from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import {useMemo, useState } from "react";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";

export default function LocationsTable({locations, searchFilter }) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    
    const columns = useMemo(() => [
        {
            header: "Name",
            accessorKey: "name",
        },
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
    ], []);
   

    const filteredLocations = useMemo(() => {
        if (!searchFilter) return locations;

        const lowerCaseFilter = searchFilter.toLowerCase();

        return locations.filter(location => 
            location.name.toLowerCase().includes(lowerCaseFilter) ||
            location.address.toLowerCase().includes(lowerCaseFilter) ||
            location.state.toLowerCase().includes(lowerCaseFilter)
        );
    }, [locations, searchFilter]);

    const table = useReactTable({
        data: filteredLocations,
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

    return (
        <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
            {table.getPageCount() > 0 && (
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Number of Users</TableHead>
                            <TableHead>Rooms</TableHead>\
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={row.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

        </div>
    )
}
import Pagination from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";

export default function LocationsTable({ locations, searchFilter }) {

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
            accessorKey: "city",
        },
        {
            header: "Number of Users",
            accessorKey: "users_count",
        },
        {
            header: "Rooms",
            accessorKey: "rooms_count",
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
            {filteredLocations.length > 0 ? (
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Number of Users</TableHead>
                            <TableHead>Rooms</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-grey">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={row.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-[1.5rem]">No locations match your search.</p>
                </div>
            )}

            {filteredLocations.length > 0 && (
                <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />
            )}


        </div>
    )
}
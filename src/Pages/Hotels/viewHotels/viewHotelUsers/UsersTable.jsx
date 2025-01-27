import Pagination from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import {useMemo, useState } from "react";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";

export default function UsersTable({users, hotelId, searchFilter }) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    
    const columns = useMemo(() => [
        {
            header: "Name",
            cell: info => `${info.row.original.firstName} ${info.row.original.lastName}`,
        },
        {
            header: "Location",
            accessorKey: "hotelLocationId",
        },
        {
            header: "Status",
            accessorKey: hotelId?.isActive ? "Active" : "Inactive",
        }
    ], []);
   

    const filteredUsers = useMemo(() => {
        if (!searchFilter) return users;

        const lowerCaseFilter = searchFilter.toLowerCase();

        return users.filter(user => 
            user.name.toLowerCase().includes(lowerCaseFilter) ||
            user.role.toLowerCase().includes(lowerCaseFilter) 
            // user.state.toLowerCase().includes(lowerCaseFilter)
        );
    }, [users, searchFilter]);

    const table = useReactTable({
        data: filteredUsers,
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
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}  className="hover:bg-grey">
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
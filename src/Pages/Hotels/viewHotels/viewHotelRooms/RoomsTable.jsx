import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import Pagination from "@/components/Pagination";



export default function RoomsTable({ rooms, searchFilter }) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10

    const columns = useMemo(() => [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Locations",
            accessorKey: "locations",
        },
        {
            header: "Description",
            accessorKey: "description",
        }
    ], []);

    const filteredRooms = useMemo(() => {
        if (!searchFilter) return rooms || [];

        const lowerCaseFilter = searchFilter.toLowerCase();

        return (rooms || []).filter(room =>
            room.name.toLowerCase().includes(lowerCaseFilter)
        );
    }, [rooms, searchFilter]);


    const table = useReactTable({
        data: filteredRooms,
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
                            <TableHead> Locations</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
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
            )}

            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

        </div>
    )
}
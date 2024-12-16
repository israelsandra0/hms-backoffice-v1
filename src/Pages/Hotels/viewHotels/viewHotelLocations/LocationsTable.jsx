import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export default function LocationsTable({table}) {

    return (
        <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                {table.getPageCount() > 1 && (
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
                        {/* <TableBody>
                            {locations.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell>{location.address}</TableCell>
                                    <TableCell>{location.state}</TableCell>
                                    <TableCell>{location.city}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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
                                                <DropdownMenuItem onClick={() => handleActionClick(location.id, 'delete')}>
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody> */}
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
    )
}
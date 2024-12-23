import { Database, File, Hotel, Locate, Users } from "lucide-react";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default function HotelsOverview() {


    return (
        <div className="mt-4">
            <div className="flex gap-6 ml-6 text-gray-500">
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Database className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Database</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <File className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>File Storage</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Locate className="text-[#8D561E] w-8 h-8  bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Locations</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Users className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Users</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
                <div className="flex w-[150px] px-2 py-4 rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Hotel className="text-[#8D561E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]"/>
                    <div>
                        <b>Rooms</b>
                        <p className="text-gray-500 text-[12px]">20.5mb</p>
                    </div>
                </div>
            </div>


            <h1 className=" mt-8 ml-6 font-bold text-[1.5rem]">Top Modules</h1>
            <Table  className="content w-[95%] my-6 ml-6 rounded  overflow-hidden border border-gray-200">
                <TableRow className="bg-lightPrimary w-full p-8 mx-6">
                    <TableHead>Modules</TableHead>
                    <TableHead>Number of Clicks</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>Module 1</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 2</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 3</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Module 4</TableHead>
                    <TableCell>20 Clicks</TableCell>
                </TableRow>
            </Table>

        </div>
    );
}
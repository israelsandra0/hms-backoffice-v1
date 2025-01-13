import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

import { Database, File, Hotel, Locate, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Reports() {

    const reports = [
        {
            modules: 'Booking Overview',
            numOfClicks: '150',
            lastUsed: '30 minutes ago'
        },
        {
            modules: 'Rooms Management',
            numOfClicks: '85',
            lastUsed: '2 hours ago'
        },
        {
            modules: 'Revenue Reports',
            numOfClicks: '63',
            lastUsed: '5 hours ago'
        },
        {
            modules: 'Dining Reservations',
            numOfClicks: '21',
            lastUsed: '9 hours'
        },
        {
            modules: 'Inventory Management',
            numOfClicks: '56',
            lastUsed: '14 hours'
        },
    ]

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Report</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <div className="mt-4">

            <UserAreaHeader pages={breadcrumb} />

            <div className=" mt-10 rounded-[1rem] shadow-[3px_3px_25px_-14px_rgba(0,0,0,0.5)] mx-8">
                <div className="mx-8 pt-6 flex justify-between items-center">
                    <h1 className=" font-bold text-[1.5rem]">Module Usage</h1>
                    <Badge variant='outline' className='py-2'>See all</Badge>
                </div>
                <Table className="content w-[95%] my-6 mx-auto rounded  overflow-hidden border border-gray-200">
                    <TableHeader>
                        <TableRow className="bg-lightPrimary w-full p-8 mx-6">
                            <TableHead>Modules</TableHead>
                            <TableHead>Number of Clicks</TableHead>
                            <TableHead>Last Used</TableHead>
                        </TableRow>

                    </TableHeader>

                    <TableBody>
                        {reports.map((reportData) => (
                            <TableRow>
                                <TableCell>{reportData.modules}</TableCell>
                                <TableCell>{reportData.numOfClicks}</TableCell>
                                <TableCell>{reportData.lastUsed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


        </div>
    );
}

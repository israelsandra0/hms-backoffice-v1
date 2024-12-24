import { Book, DollarSign, Hotel, Hourglass, Info, MessageCircle, MessageCircleCode, MessageCircleReply, MessageSquareText, Text, TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { ButtonLink } from "@/components/ui/button_link"
import { Badge } from "@/components/ui/badge"


export default function Dashboard() {

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-6))",
        },
    }

    const chartData = [
        { month: "January", desktop: 260 },
        { month: "February", desktop: 200 },
        { month: "March", desktop: 240 },
        { month: "April", desktop: 110 },
        { month: "May", desktop: 305 },
        { month: "June", desktop: 260 },
        { month: "July", desktop: 260 },
        { month: "August", desktop: 260 },
        { month: "September", desktop: 305 },
        { month: "October", desktop: 305 },
        { month: "November", desktop: 140 },
        { month: "December", desktop: 220 },
    ]

    const pieChartData = [
        { chart: "premuim", subscription: 20, fill: "hsl(var(--chart-8))" },
        { chart: "standard", subscription: 50, fill: "hsl(var(--chart-7))" },
        { chart: "Basic", subscription: 30, fill: "hsl(var(--chart-6))" }
    ]

    const pieChartConfig = {
        subscription: {
            label: "subscription",
        },
        premuim: {
            label: "Premuim",
            color: "hsl(var(--chart-1))",
        },
        standard: {
            label: "Standard",
            color: "hsl(var(--chart-2))",
        }
    }

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />

            <div className="flex justify-around gap-6 mx-6">
                <div className=" w-[150px] px-2 py-4   rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Hotel className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />
                    <div>
                        <p className="text-gray-500 py-2 text-[12px]">Total Hotels</p>
                        <b>62</b>
                        <p className="text-green-500 py-2 text-[12px]">50 Active</p>
                    </div>
                </div>
                <div className=" w-[150px] px-2 py-4   rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Book className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />
                    <div>
                        <p className="text-gray-500 py-2 text-[12px]">Booking Overview</p>
                        <b>50,234</b>
                        <p className="py-2 text-[12px]">Across all hotels</p>
                    </div>
                </div>
                <div className=" w-[150px] px-2 py-4   rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <DollarSign className="text-[#8D61E] w-8 h-8  bg-lightPrimary p-[0.50rem] rounded-[50%]" />
                    <div>
                        <p className="text-gray-500 py-2 text-[12px]">Revenue</p>
                        <b>₦100K </b>
                        <div className="flex gap-1">
                            <TrendingUp className="h-9 w-4 text-green-500" />
                            <p className="py-2 text-[12px]">15% Increased in the last 24 hours</p>
                        </div>
                    </div>
                </div>
                <div className=" w-[150px] px-2 py-4   rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Info className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />
                    <div>
                        <p className="text-gray-500 py-2 text-[12px]">Pending Requests</p>
                        <b>12</b>
                        <p className="py-2 text-[12px]">Requires attention</p>
                    </div>
                </div>
                <div className=" w-[150px] px-2 py-4   rounded-[10px] shadow-[0_2px_25px_-16px_rgba(0,0,0,0.5)] items-center gap-2">
                    <Hourglass className="text-[#8D51E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />
                    <div>
                        <p className="text-gray-500 py-2 text-[12px]">Expiring Subscriptions</p>
                        <b>20</b>
                        <p className="py-2 text-[12px]">Renewals due soon</p>
                    </div>
                </div>
            </div>

            <div className="my-12 flex gap-8 mx-8">
                <Card className="rounded-[1rem] shadow-[3px_3px_25px_-14px_rgba(0,0,0,0.5)]">
                    <CardHeader>
                        <CardTitle>Booking Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <div className="flex flex-col gap-10 mb-4">
                            <p>100%</p>
                            <p>75%</p>
                            <p>50%</p>
                            <p>25%</p>
                            <p>0%</p>
                        </div>
                        <ChartContainer config={chartConfig} className="h-[320px]">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* <Card className="rounded-[1rem] shadow-[3px_3px_25px_-14px_rgba(0,0,0,0.5)]">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Pie Chart - Label</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={pieChartConfig}
                            className="mx-auto aspect-square h-[300px]"
                        >
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={pieChartData} dataKey="subscription" label nameKey="chart" />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <div className=" text-[12px] w-[200px] mx-auto">
                        <div className="flex justify-between p-1">
                            <p>Basic</p>
                            <p>30%</p>
                        </div>
                        <div className="flex justify-between p-1">
                            <p>Standard</p>
                            <p>50%</p>
                        </div>
                        <div className="flex justify-between p-1">
                            <p>Premuim</p>
                            <p>20%</p>
                        </div>
                    </div>
                </Card> */}

                <Card className="w-full rounded-[1rem] shadow-[3px_3px_25px_-14px_rgba(0,0,0,0.5)]">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Subscription Chart</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={pieChartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    label
                                    data={pieChartData}
                                    dataKey="subscription"
                                    nameKey="chart"
                                    innerRadius={60}
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <div className=" text-[12px] w-[200px] mx-auto">
                        <div className="flex justify-between p-1">
                            <div className="flex items-center gap-1">
                                <p className="bg-primary w-2 h-2 rounded"></p>
                                <p>Basic</p>
                            </div>
                            <p>30%</p>
                        </div>
                        <div className="flex justify-between p-1">
                            <div className="flex items-center gap-1">
                                <p className="bg-[#F4A79D] w-2 h-2 rounded"></p>
                                <p>Standard</p>
                            </div>
                            <p>50%</p>
                        </div>
                        <div className="flex justify-between p-1">
                            <div className="flex items-center gap-1">
                                <p className="bg-[#F68D2B] w-2 h-2 rounded"></p>
                                <p>Premuim</p>
                            </div>
                            <p>20%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mx-8 px-8 py-8 mb-6 rounded-[1rem] shadow-[3px_3px_25px_-14px_rgba(0,0,0,0.5)]">
                <div className='flex justify-between cursor-pointer items-center'>
                    <b>Support Message</b>
                    <Badge variant='outline' className='py-2'>See all</Badge>
                </div>
                <div className="content mt-4 rounded overflow-hidden border border-gray-200"> 
                    <Table>
                        <TableRow className="bg-lightPrimary w-full p-8 mx-6">
                            <TableHead>Clients</TableHead>
                            <TableHead className="pl-10">Support Message </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Grand Horizontal Hotel</TableHead>
                            <TableCell className="flex items-center gap-2 text-[13px] ml-6">
                                <MessageSquareText className="w-4" />
                                The system isn't reflecting our recent subscription renewal. could you help sort this?
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Azure Bay Resorts</TableHead>
                            <TableCell className="flex items-center gap-2 text-[13px] ml-6">
                                <MessageSquareText className="w-4" />
                                The check-in process is taking longer than usual due to system delays. pleae investigate.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Paradise Hotel</TableHead>
                            <TableCell className="flex items-center gap-2 text-[13px] ml-6">
                                <MessageSquareText className="w-4" />
                                We're experiencing an issue with room inventory update not reflecting on the dashboard.
                                Could you assist us in...
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Oasis Hotel</TableHead>
                            <TableCell className="flex items-center gap-2 text-[13px] ml-6">
                                <MessageSquareText className="w-4" />
                                The system froze during peak hours yesterday. Could you check for performance issue
                                and get back to us ASAP.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Sheraton</TableHead>
                            <TableCell className="flex items-center gap-2 text-[13px] ml-6">
                                <MessageSquareText className="w-4" />
                                Would it be possible to introduce a comprehensive training module within the system
                                that is specifically designed...
                            </TableCell>
                        </TableRow>
                    </Table>
                </div>
            </div>

        </div>
    )
}
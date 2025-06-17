import { Book, CalendarIcon, ChevronDown, DollarSign, DoorOpen, File, FileLineChart, Hotel, Hourglass, Info, LocateIcon, Map, MapPin, MessageSquareText, TrendingUp, User, Users } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react"

export default function HotelsOverview() {

    const [date, setDate] = useState()
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

    const overflowCards = [
        {
            icon: <Hotel className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />,
            gig: '2.5/500 MB',
            name: 'Database Usage'
        },
        {
            icon: <FileLineChart className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />,
            gig: '100/500 MB',
            name: 'File Storage'
        },
        {
            icon: <MapPin className="text-[#8D61E] w-8 h-8  bg-lightPrimary p-[0.50rem] rounded-[50%]" />,
            gig: '10',
            name: 'Location'
        },
        {
            icon: <Users className="text-[#8D561E] w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />,
            gig: '45',
            name: 'Users'
        },
        {
            icon: <DoorOpen className="text-[#8D51E]  w-8 h-8 bg-lightPrimary p-[0.50rem] rounded-[50%]" />,
            gig: '100',
            name: 'Rooms'
        },
    ]


    return (
        <div>
            <div className="flex justify-center gap-7 mt-9">
                {overflowCards.map((card) => (
                    <div className="dashboardCards h-[120px] w-[170px]">
                        <p>{card.icon}</p>
                        <b>{card.gig}</b>
                        <p className="py-2 text-[12px]">{card.name}</p>
                    </div>
                ))}
            </div>

            <div className="my-10 mx-12">
                <Card className="rounded-[1rem]  border shadow-[3px_3px_20px_-14px_rgba(0,0,0,0.5)]">
                    <CardHeader className="flex gap-6 flex-row justify-between items-center">
                        <CardTitle>Booking </CardTitle>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-between font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="h-4 mr-1" />
                                        {date ? format(date, "PPP") : <span>Monthly</span>}
                                        <ChevronDown className="h-4 ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex">
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
                                    <Bar dataKey="desktop" fill="var(--color-desktop)" barSize={20} />
                                </BarChart>
                            </ChartContainer>

                        </div>

                        <div className=" mt-9">
                            <div className="dashboardCards h-[120px] w-[170px]">
                                <b>847</b>
                                <p className="py-2 text-[12px]">Total Bookings</p>
                            </div>
                            <div className="dashboardCards h-[120px] w-[170px]">
                                <p className="py-2 text-[12px]">Last Booking</p>
                                <b>847</b>
                                <p className="py-2 text-[12px]">Jun 10, 2025</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
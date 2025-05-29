import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Search, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Subscription() {

    const navigate = useNavigate()
    const [subscription, setSubscription] = useState([])
    const [searchFilter, setSearchFilter] = useState("");
    // const [addUserBox, setAddUserBox] = useState(false);
    // const [editUserBox, setEditUserBox] = useState(false);
    // const [userId, setUserId] = useState(null)
    const [pageIndex, setPageIndex] = useState(0);
    const [planData, setPlanData] = useState()
    const pageSize = 10
    // const { confirmAction } = useConfirm ()

   
    const columns = useMemo(() => [
        {
            header: "Name",
            cell: (info) => {
                return (
                    <span>
                        {`${info.row.original.firstName} ${info.row.original.lastName}`}
                    </span>
                );
            },
        },
        {
            header: "Role",
            cell: (info) => {
                return (
                    info.row.original.isAdmin == 1 ? (

                        <span>
                            <Badge variant='primary' className=" bg-lightPrimary text-primary">Admin <Star className=" p-1" /> </Badge>
                        </span>
                    ) : (
                        <span>
                            <Badge variant='gray'>{`${info.row.original.role?.name}`}</Badge>
                        </span>
                    )
                );
            },
        },
        {
            header: "Status",
            cell: (info) => {
                return (
                    <span>
                        <Badge variant={info.row.original.isActive ? `success` : 'error'}>{info.row.original.isActive ? `Active` : 'Inactive'}</Badge>
                    </span>
                );
            },
        },

        // {
        //     header: "Email",
        //     cell: (info) => {
        //         return (
        //             <span>
        //                 {info.row.original.email ? `${info.row.original.email.slice(0, 2)}${"*".repeat(info.row.original.email.indexOf("@") - 1)}
        //                     ${info.row.original.email.slice(info.row.original.email.indexOf("@"))}` : "N/A"}
        //             </span>
        //         );
        //     },
        // },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {

                const isLoggedInUser = row.original.id === loggedInUser.id;


                return (
                    <div>

                        {!isLoggedInUser && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <MoreVertical className="cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 cursor-pointer">
                                    <DropdownMenuItem onClick={() => { setUserId(row.original); setEditUserBox(true) }}>
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick(row.original.id, row.original.isActive ? 'Deactivate' : 'Activate')}>
                                        <span>{row.original.isActive ? 'Deactivate' : 'Activate'}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                );
            },
        },
    ], []);

    const filteredPlan = useMemo(() => {
        if (!searchFilter) return subscription || [];

        const lowerCaseFilter = searchFilter.toLowerCase();

        return (subscription || []).filter(subscription =>
            subscription.name.toLowerCase().includes(lowerCaseFilter)
        );
    }, [subscription, searchFilter]);


    const table = useReactTable({
        data: filteredPlan,
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


    const { data: data2, refetch: fetchAllPlans } = useQuery({
        queryKey: ["subscription/plans"],
        queryFn: async () => {
            const res = await get(`/subscription-plans/create`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            setPlanData(response.data)
            return response.data;
        },
        enabled: false
    });

    const { isFetching, refetch: fetchsubScriptions } = useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const res = await get(`/subscription-plans`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            setSubscription(response.data)
            console.log("jjjjjjjjjjjjjj",response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchAllPlans()
        fetchsubScriptions()
    }, [])

    // const closeAddUserBox = () => {
    //     setAddUserBox(false)
    //     fetchsubScriptions()
    // }

    // const handleEditClose = () => {
    //     setEditUserBox(false)
    //     fetchsubScriptions()
    // }


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbPage>Subscription</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
            <div>
                <UserAreaHeader pages={breadcrumb} />
    
                {isFetching ?
                    (
                        <div className="text-center flex items-center justify-center mx-auto mt-28">
                            <Spinner className="me-3 text-gray-300 h-16 w-16" />
                        </div>
                    )
                    :
                    subscription && subscription?.length > 0 ? (
                        <div>
                            <div className="flex justify-between mx-6 my-8 ">
                                <div className="mb-4">
                                    <Search className="text-gray-300 w-4 absolute mt-[10px] ml-4" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchFilter}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                        className="border border-b-gray-300 pl-9 rounded px-4 py-2 w-[300px] outline-none"
                                    />
                                </div>
                                <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add </Button>
                            </div>
                            <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                                {table.getPageCount() > 0 && (
                                    <Table>
                                        <TableHeader className="bg-lightPrimary">
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} className="hover:bg-grey">
                                                    {row.getVisibleCells().map((cell) => {
    
                                                        return (
                                                            <TableCell key={row.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
    
                                <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />
    
                            </div>
                        </div>
                    ) : (
                        <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                            <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                                <Shield className='w-[100px] h-[100px] text-primary' />
                            </div>
                            <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                            <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add</Button>
                        </div>
                    )
    
                }
    
               
                {/* {!!addUserBox && (
                    <AddUsers closeFn={closeAddUserBox} roleData={roleData} />
                )}
    
                {!!editUserBox && <EditUserManagement closeFn={handleEditClose} editId={userId} />} */}
            </div>
        )
}
import Pagination from "@/components/Pagination";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useConfirm } from "@/hooks/use-confirm";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Currency, MoreVertical, Search, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Subscription() {

    const navigate = useNavigate()
    // const [subscription, setSubscription] = useState([])
    const [searchFilter, setSearchFilter] = useState("");
    // const [addUserBox, setAddUserBox] = useState(false);
    // const [editUserBox, setEditUserBox] = useState(false);
    // const [userId, setUserId] = useState(null)
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()
    

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this Plan, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        },
        activate: {
            title: 'Activate Role?',
            message: 'This action will activate the role and allow it to be visible to users.',
            confirmButtonText: 'Activate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        },
        deactivate: {
            title: 'Deactivate Role?',
            message: 'This action will deactivate the role and allow it to be invisible to users.',
            confirmButtonText: 'Deactivate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        }
    }

    const handleEditPlan = (editId) => {
        navigate('/setting/subscriptions/edit', { state: { editId } });
    };

    const handleConfirmation = async (planId) => await apiDelete(`/subscription-plans/${planId}/destroy`)


    const columns = useMemo(() => [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Price",
            cell: (info) => {
                return (
                    <span>
                        ₦
                        {`${info.row.original.price}`}
                    </span>
                );
            },
        },
        {
            header: "hotels_count",
            accessorKey: "hotels_count",
        },
        {
            header: "Modules",
            cell: (info) => {
                return (
                    <ul>
                        {info.row.original.modules.map((module) => (
                            <li>{module.name}</li>
                        ))}
                    </ul>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem>
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPlan(row.original)}>
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(row.original.id, 'delete')}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);


    const { data: subscription, isFetching, refetch: fetchSubscriptions } = useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const res = await get(`/subscription-plans`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
                // return []
            }

            const response = await res.json();

            return response.data.plans;
        },
        enabled: false
    });

    useEffect(() => {
        fetchSubscriptions()
    }, [])

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

    const handleDeleteResponse = (res) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: 'Plan deleted successfully!'
            });
            fetchSubscriptions()
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the Plan, Please try again.'
            });
        }
    }

    const handleActionClick = (planId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(planId, actionType),
            completeFn: (res) => {
                if (actionType.toLowerCase() === 'delete') {
                    handleDeleteResponse(res)
                }
                else {
                    handleStatusUpdateResponse(res, actionType == 'Activate')
                }
            }

        })
    };


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
                            <Button variant='primary' onClick={() => navigate("/setting/subscriptions/subscription_plan")}>Add </Button>
                        </div>
                        <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                            {table.getPageCount() > 0 && (
                                <Table>
                                    <TableHeader className="bg-lightPrimary">
                                        <TableRow>
                                            <TableHead>Plan Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Hotel</TableHead>
                                            <TableHead>Module</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
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
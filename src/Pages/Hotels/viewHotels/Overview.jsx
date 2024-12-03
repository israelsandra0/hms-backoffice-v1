import UserAreaHeader from "@/components/UserAreaHeader";
import HotelsHeader from "./Header";
import ViewAreaHeader from "./ViewAreaHeader";

export default function HotelsOverview() {

    // handle hotel list
    // const { data: clients, error, isPending, refetch: fetchAllHotels } = useQuery({
    //     queryKey: ['clientsData'],
    //     queryFn: async () => {
    //         const res = await get('/hotels');
    //         if (!res.ok) {
    //             throw new Error(error.message);
    //         }
    //         const response = await res.json();
    //         return response.data;
    //     },
    // });

    // Loading state
    // if (isPending) {
    //     return <div>Loading ...</div>;
    // }


    // if (!clients?.length) {
    //     return (
    //         <>
    //             <UserAreaHeader pageName="Hotel Management" />
    //             <div className="text-right mr-4 mb-8">
    //                 <ButtonLink to="/hotels/add" variant="primary">
    //                     Add Hotels
    //                 </ButtonLink>
    //             </div>
    //             <Card className="p-4">
    //                 <p>No hotels found!</p>
    //             </Card>
    //         </>
    //     );
    // }

    return (
        <div>
            <UserAreaHeader pageName="View Hotels "/>
            <ViewAreaHeader />
            {/* <HotelsHeader title='ATSL Hotel' /> */}
            <h1>welcome !!</h1>
            {/* <Table className="content w-full">
                <TableHeader>
                    <TableRow className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6">
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Number of Locations</TableHead>
                        <TableHead>Subscription Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client?.id}>
                            <TableCell>{client?.name}</TableCell>
                            <TableCell>{client?.website}</TableCell>
                            <TableCell>{client?.number}</TableCell>
                            <TableCell>{client?.subscription}</TableCell>
                            <TableCell><Badge variant={client?.isActive ? `success` : 'error'}>{client?.isActive ? `Active` : 'Inactive'}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer hover:bg-gray-100" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuItem>
                                            <span>View</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setHotelToEdit(client)}>
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleActionClick(client.id, client.isActive ? 'Deactivate' : 'Activate')}>
                                            <span>{client.isActive ? 'Deactivate' : 'Activate'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleActionClick(client.id, 'delete')}>
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}

        </div>
    );
}
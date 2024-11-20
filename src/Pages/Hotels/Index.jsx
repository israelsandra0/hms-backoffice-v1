import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants";
import { get, getDataObject } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button_link";
import UserAreaHeader from "@/components/UserAreaHeader";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function HotelsPage() {
    const {
        data: clients,
        error,
        isPending,
    } = useQuery({
        queryKey: ["clientsData"],
        queryFn: async () => {
            const res = await get(`${BACKEND_URL}/hotels`);
            if (!res.ok) {
                throw new Error(error.message);
            }

            const response = await res.json();

            return response.data;
        },
    });

    if (isPending) {
        return <div>Loading ...</div>;
    }
    if (!clients?.length) {

        return (
            <Card className="p-4">
                <p>No hotels found!</p>
            </Card>
        );
    }

    return (
        <>
            <UserAreaHeader pageName="Hotel Management" />
            <div className="text-right mr-4 mb-8">
                <ButtonLink to="/hotels/add" variant='primary'>Add Hotels</ButtonLink>
                {/* <Button>Add Hotels</Button> */}
            </div>
            <Table className="content">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Number of Locations</TableHead>
                        <TableHead>Subscription Plan</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client?.id}>
                            <TableCell>{client?.name}</TableCell>
                            <TableCell>{client?.website}</TableCell>
                            <TableCell>{client.nuber}</TableCell>
                            <TableCell>{client.subscription}</TableCell>
                            <TableCell>{client.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

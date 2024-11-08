import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants";
import { getDataObject } from "@/functions";
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

export default function ClientsPage() {

    const { data:clients, error, isPending } = useQuery({
        queryKey: ["clientsData"],
        queryFn: async () => {
            const token = getDataObject(AUTH_DATA_KEY)?.accessToken;
            const res = await fetch(`${BACKEND_URL}/hotels`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
    if (!clients?.length){
        return (
            <Card className='p-4'>
                <p>No hotels found!</p>
            </Card>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>WEBSITE</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                
                {clients.map((client) => (
                    <TableRow key={client?.id}>                        
                        <TableCell>{client?.name}</TableCell>
                        <TableCell>{client?.website}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

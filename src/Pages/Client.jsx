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

export default function ClientsPage() {

    const { data:clients, error, isPending } = useQuery({
        queryKey: ["clientsData"],
        queryFn: async () => {
            const token = getDataObject(AUTH_DATA_KEY)?.accessToken;
            const res = await fetch(`${BACKEND_URL}/clients`, {
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
                    <TableRow key={client.id}>                        
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.website}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

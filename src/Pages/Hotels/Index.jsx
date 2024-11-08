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

export default function HotelsPage() {

    const { data:clients, error, isPending } = useQuery({
        queryKey: ["clientsData"],
        queryFn: async () => {
            const res = await get(`${BACKEND_URL}/hotels`)
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
        <>
            <div className="text-right">
                <ButtonLink to='/hotels/add'>Add Hotels</ButtonLink>
                {/* <Button>Add Hotels</Button> */}
            </div>
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
        </>
    );
}

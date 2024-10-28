import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants"
import { getDataObject } from "@/functions"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"





export default function ClientsPage(){

    const { data, error, isPending} = useQuery({
        queryKey: ['clientsData'],
        queryFn: async () => {
            const token = getDataObject(AUTH_DATA_KEY)?.accessToken
            const res = await fetch(`${BACKEND_URL}/clients`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },  
            })
            if (!res.ok) {
                throw new Error(error.message);
            } 

            // console.log(await res.json())

            const response = await res.json()
            return  response?.data ?? []
        } 
        
    })
    
    if(isPending){
        return <div>Loading ...</div>
    }
    console.log(data)  
    

  return (
    <Table>
        <TableCaption>A list of clients and their websites .</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>WEBSITE</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.website}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
  )
}











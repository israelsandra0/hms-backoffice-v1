import { BACKEND_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"





export default function ClientsPage(){

    const clients = {
        name: 'sandra',
        website: 'https://www.com'
    }

    const { data, error} = useQuery({
        queryKey: ['clientsData'],
        queryFn: async (token) => {
            const res = await fetch(`${BACKEND_URL}/clients`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass JWT via Authorization header
                },  
            })
            if (!res.ok) {
                throw new Error(error.message);
            }

            return res.json(); 
        } 
        
    })
    console.log(data)       


    return (

        <table>
            <thead>
                <tr>
                    <th>Name:</th>
                    <th>Website: {data}</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>{clients.name}</td>
                    <td><a href={clients.website}>{clients.website}</a></td>
                </tr>
            </tbody>
            
            {data.map(client => (
                <tr key={client.id}>
                    <td>{client.name}</td>
                    <td><a href={client.website}>{client.website}</a></td>
                </tr>
            ))}
        </table>
    
  )

}
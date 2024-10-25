import { AUTH_DATA_KEY, BACKEND_URL } from "@/constants"
import { getDataObject } from "@/functions"
import { useQuery } from "@tanstack/react-query"





export default function ClientsPage(){

    // const clients = {
    //     name: 'sandra',
    //     website: 'https://www.com'
    // }

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

        <table>
            <thead>
                <tr>
                    <th>Name:</th>
                    <th>Website:</th>
                </tr>
            </thead>

            <tbody>
                {data.map(client => (
                    <tr key={client.id}>
                        <td>{client.name}</td>
                        <td><a href={client.website}>{client.website}</a></td>
                    </tr>
                ))}
                
            </tbody>
            
        </table>
    
  )

}
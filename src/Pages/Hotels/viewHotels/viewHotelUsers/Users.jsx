import { get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useEffect } from "react";
import UsersTable from "./UsersTable";
import { Button } from "@/components/ui/button";
import AddHotelUsers from "./AddHotelUsers";


export default function HotelPageUsers({ hotelId }) {
    
    const [searchFilter, setSearchFilter] = useState("");
    const [addUserBox, setAddUserBox] = useState(false);

    const closeAddUserBox = () => setAddUserBox(false);

    const { data: users, isLoading, isPending, refetch: fetchHotelUsers } = useQuery({
        queryKey: ["hotelUsers"],
        queryFn: async () => {
            // setLocations([])
            const res = await get(`/hotels/${hotelId.id}/users`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel users data");
            }
            const response = await res.json();
            //setLocations(response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchHotelUsers()
    }, [])


    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
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
                <Button variant="primary" onClick={() => setAddUserBox(true)}>
                    + Add
                </Button>
            </div>

            {!isPending && users?.length && (
                <UsersTable users={users} hotelId={hotelId}  searchFilter={searchFilter}  />
            )}

            {!!addUserBox && (
                <AddHotelUsers closeFn={closeAddUserBox} hotelId={hotelId} />
            )}
        </div>
    )
}




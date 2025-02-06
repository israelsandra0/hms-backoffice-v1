import { useQuery } from "@tanstack/react-query";
import { get } from "@/functions";
import Spinner from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { RiUser3Fill } from "@remixicon/react";
import RoomsTable from "./RoomsTable";
import { Search } from "lucide-react";


export default function Rooms({ hotelId }) {

    const [searchFilter, setSearchFilter] = useState("");

    const { data: rooms, isLoading, refetch: fetchHotelRooms } = useQuery({
        queryKey: ["hotelRooms"],
        queryFn: async () => {
            console.log(hotelId);
            const res = await get(`/hotels/${hotelId}/room-categories`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel rooms data");
            }
            const response = await res.json();
            return response.data;
        },
        enabled: false
    });
    useEffect(() => {
        fetchHotelRooms()
    }, [])

    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
        <div>
            {!rooms?.length && (
                <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                    <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                        <RiUser3Fill className='w-[100px] h-[100px] text-primary' />
                    </div>
                    <h1 className="text-[1.5rem] my-6  font-bold">No Room Found!</h1>
                </div>
            )}
            {!!rooms?.length && (
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
                </div>
            )}

            {!isLoading && rooms?.length > 0 && (
                <RoomsTable rooms={rooms} searchFilter={searchFilter} />
            )}

        </div>
    )
}



import { get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useEffect } from "react";
import UsersTable from "./UsersTable";
import { Button } from "@/components/ui/button";
import AddHotelUsers from "./AddHotelUsers";
import { RiUser3Fill } from "@remixicon/react";


export default function HotelPageUsers({ hotelId }) {

    const [searchFilter, setSearchFilter] = useState("");
    const [addUserBox, setAddUserBox] = useState(false);
    const [users, setUsers] = useState({})
    const [errorMessage, setErrorMessage] = useState("")



    const { isLoading, isFetching, refetch: fetchHotelUsers } = useQuery({
        queryKey: ["hotelUsers"],
        queryFn: async () => {
            setErrorMessage("")
            const res = await get(`/hotels/${hotelId}/users`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel users data");
            }

            if (res.status >= 500) {
                setErrorMessage("An error occurred, please try again");
            }
            const response = await res.json();
            setUsers(response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchHotelUsers()
        return () => setUsers({})
    }, [])

    const closeAddUserBox = () => {
        setAddUserBox(false)
        fetchHotelUsers()
    };

    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
        <div>
            {!!errorMessage?.length && (
                <div className="mx-auto items-center mt-16 grid place-items-center text-center">
                    <h1 className="text-[1.5rem] my-6 font-bold">An error occurred!</h1>
                    <Button
                        variant="primary"
                        className="mb-[7rem]"
                        onClick={fetchHotelUsers}
                    >
                        Please try again
                    </Button>
                </div>
            )}

            {isFetching ?
                (
                    <div className="text-center flex items-center justify-center mx-auto mt-28">
                        <Spinner className="me-3 text-gray-300 h-16 w-16" />
                    </div>
                )
                :
                !users?.length ? (
                    <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                        <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                            <RiUser3Fill className='w-[100px] h-[100px] text-primary' />
                        </div>
                        <h1 className="text-[1.5rem] my-6  font-bold">No User Found!</h1>
                        <Button variant="primary" className='mb-[7rem]' onClick={() => setAddUserBox(true)}>
                            Add
                        </Button>
                    </div>
                ) :
                !!users?.length && (
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
                            Add
                        </Button>
                    </div>
                )
            }

            {!isFetching && users?.length > 0 && (
                <UsersTable users={users} hotelId={hotelId} pageUpdate={fetchHotelUsers} searchFilter={searchFilter} />
            )}

            {!!addUserBox && (
                <AddHotelUsers closeFn={closeAddUserBox} hotelId={hotelId} />
            )}
        </div>
    )
}




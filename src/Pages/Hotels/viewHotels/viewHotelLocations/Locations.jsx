import { ButtonLink } from "@/components/ui/button_link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button"
import AddHotelLocation from "./AddHotelLocation";
import { useState } from "react";


export default function Locations({ Locations, hotelId }) {

    const [addLocationBox, setAddLocationBox] = useState(false)
    const [locationsList, setLocationsList] = useState(Locations);


    // Function to refresh or update locations after adding
    const refreshLocations = (newLocation) => {
        setLocationsList((prevLocations) => [...prevLocations, newLocation]);
    };

    const closeAddLocationBox = () => setAddLocationBox(false)


    return (
        <div>

            <div className="text-right mr-4 mt-4">
                <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                    + Add
                </Button>
            </div>



            {/* <Dialog>
                <DialogTrigger asChild className="float-right mr-4 mt-4">
                    <ButtonLink variant="primary">
                        + Add
                    </ButtonLink>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue="Pedro Duarte"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue="@peduarte"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog> */}

            <Table className="content w-4/5 my-6 ml-6 rounded-[2rem] border border-gray-200">
                <TableHeader>
                    <TableRow className="bg-lightPrimary w-full hover:bg-lightPrimary p-8 mx-6">
                        <TableHead>Address</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Locations?.map((location) => (
                        <TableRow key={location?.id}>
                            <TableCell>{location?.address}</TableCell>
                            <TableCell>{location?.state}</TableCell>
                            <TableCell>{location?.city}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 cursor-pointer">
                                        <DropdownMenuItem >
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {!!addLocationBox && <AddHotelLocation closeFn={closeAddLocationBox}  onLocationAdded={refreshLocations} hotelId={hotelId}/> }
        </div>
    )
}
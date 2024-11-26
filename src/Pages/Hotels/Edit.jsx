import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { CandyIcon, ChevronLeft, FolderClosed, RemoveFormatting, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";



export default function EditHotelModal({closeFn}) {

    const { register } = useForm({
        defaultValues: { name: "", email: "", website: "" },
        // resolver: yupResolver(yupBuild),
    });


    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <CardContent className='w-[30%] rounded-[24px] text-center mx-auto border-none bg-white py-8'>

                <form className="hotelForm text-left">
                    <div className="flex gap-20">
                        <Link>
                            <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn}/>
                        </Link>
                        <h1  className="text-[1.3rem] font-bold mb-2">Edit Hotel Details</h1>   
                    </div>
                    <div className="mt-4">
                        <div className="mb-2">
                            <Label htmlFor="name">Name</Label>
                            <br />
                            <Input {...register("name")} id="name" />
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <br />
                            <Input {...register("email")} type="email" id="email" />
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="website">Website</Label>
                            <br />
                            <Input {...register("website")} id="website" />
                        </div>
                    </div>

                    <br />
                    <Button variant="primary" type="submit" className="w-full p-[16px] text-[16px]">
                       Continue
                    </Button>

                </form>
            </CardContent>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";



export default function EditHotelModal({closeFn, hotelToEdit}) {

    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required").email(),
        website: yup.string().required("Website is required").url().nullable(),
    });

    const { register, handleSubmit, setError, formState: {errors} } = useForm({
        defaultValues: { 
            name: hotelToEdit.name, 
            email: hotelToEdit.email, 
            website: hotelToEdit.website 
        },
        resolver: yupResolver(yupBuild),
    });

    const {toast} = useToast()

    const {mutate, isPending} = useMutation({
        mutationFn: async(data) => {
            const res = await put(`/hotels/update/${hotelToEdit.id}`, data)
            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Hotel updated successfully!'
                });
                closeFn()
                
            }else if (res.status.toString().startsWith(4)) {

                const responseErrors = await res.json()
    
                if (responseErrors.errors) {
                    responseErrors.errors.forEach((error) => {
                        setError(error.field, {
                            type: "custom",
                            message: error.message,
                        });
                    });
                }
                return null; 
            }else {
                toast({
                    error: true,
                    duration: 5000,
                    title: 'Failed to edit hotel detail. Please try again.'
                });
            }
        }
    }) 

    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <CardContent className='w-[30%] rounded-[24px] text-center mx-auto border-none bg-white py-8'>

                <form onSubmit={handleSubmit(mutate)} className="hotelForm text-left">
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
                            <p>{errors.name?.message}</p>
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <br />
                            <Input {...register("email")} type="email" id="email" />
                            <p>{errors.email?.message}</p>
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="website">Website</Label>
                            <br />
                            <Input {...register("website")} id="website" />
                            <p>{errors.website?.message}</p>
                        </div>
                    </div>

                    <br />
                    <Button variant="primary" type="submit" className="w-full p-[16px] text-[16px]" disabled={isPending}>
                        {isPending ?  <Spinner /> : 'continue'}                       
                    </Button>

                </form>
            </CardContent>
        </div>
    )
}
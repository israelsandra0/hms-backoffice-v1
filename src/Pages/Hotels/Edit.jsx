import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { RiDeleteBin2Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";



export default function EditHotelModal({ closeFn, hotelToEdit }) {

    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required").email(),
        website: yup.string().required("Website is required").url().nullable(),
        logo: yup.mixed().required("Logo is required")
    });

    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: hotelToEdit.name,
            email: hotelToEdit.email,
            website: hotelToEdit.website,
            logo: hotelToEdit.logo,
        },
        resolver: yupResolver(yupBuild),
    });

    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await put(`/hotels/update/${hotelToEdit.id}`, data)
            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Hotel updated successfully!'
                });
                closeFn()

            } else if (res.status.toString().startsWith(4)) {

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
            } else {
                toast({
                    error: true,
                    duration: 5000,
                    title: 'Failed to edit hotel detail. Please try again.'
                });
            }
        }
    })

    const [fileDetails, setFileDetails] = useState({
        name: "",
        size: 0,
        preview: "",
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            // When the file is read, update the state with the file details
            reader.onloadend = () => {
                setFileDetails({
                    name: file.name,
                    size: file.size,
                    preview: reader.result, // Base64 string for the image preview
                });
            };

            setValue('logo', file)

            reader.readAsDataURL(file); // Read the file as a data URL (image preview)
        }
    };

    const handleFileDelete = () => {
        setFileDetails({
            name: "",
            size: 0,
            preview: "",
        });
    };



    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <CardContent className='w-[30%] rounded-[24px] text-center mx-auto border-none bg-white py-8'>

                <form onSubmit={handleSubmit(mutate)} className="hotelForm text-left">

                    {/* {JSON.stringify(errors)} */}

                    <div className="flex">
                        <Link>
                            <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn} />
                        </Link>
                        <h1 className="text-[1.3rem] font-bold mb-2 mx-auto">Edit Hotel Details</h1>
                    </div>



                    <div className="mt-4">
                        <div className="mb-2">
                            <Label>Logo</Label>
                            <div className="h-[100px] p-3 mt-1 flex gap-4 items-center bg-grey text-gray-600 rounded">
                                {!!fileDetails?.preview && (
                                    <div className="flex gap-20 items-center">
                                        <div className="flex gap-2 items-center">
                                            <img src={fileDetails.preview} alt="File preview" className="w-16 h-16 object-cover" />

                                            <div>
                                                {fileDetails.name && (
                                                    <div>
                                                        <strong>{fileDetails.name}</strong><br />
                                                        <h3>{(fileDetails.size / 1024).toFixed(2)} KB</h3>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <RiDeleteBin2Line
                                            className="text-red-500 cursor-pointer"
                                            onClick={handleFileDelete}
                                        />
                                    </div>

                                )}

                                {!fileDetails?.preview && (
                                    <div className="h-[100px] p-3 mt-1 flex gap-2 items-center bg-grey text-gray-600 rounded">
                                        <div className="w-16 h-16 object-cover border border-gray-300">
                                            {!!hotelToEdit.logo && (
                                                <img src={hotelToEdit.logo} alt="Hotel Logo" className="w-16 h-16 object-cover" />
                                            )}

                                            {!fileDetails?.preview && !hotelToEdit.logo && (
                                                <div className="w-16 h-16 border-gray-300 flex items-center justify-center text-gray-700 pr-1">No Logo</div>
                                            )}

                                        </div>

                                        <div className="grid justify-center gap-2">
                                            <Label htmlFor="file-upload" className="text-[12px] font-bold">
                                                <Upload htmlFor="file-upload" className="p-1 mx-auto mb-1 cursor-pointer" />
                                                Drag & Drop or
                                                <span className="text-[#8D561E]"> Choose a file</span> to
                                                upload
                                            </Label>
                                            <Input
                                                {...register("logo")}
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={(e) => {
                                                    handleFileChange(e)
                                                }}
                                            />
                                            <h1 className="text-[12px] mx-auto mb-2">PNG or JPG</h1>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p>{errors.logo?.message}</p>
                        </div>
                        
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
                        {isPending ? <Spinner /> : 'continue'}
                    </Button>

                </form>
            </CardContent>
        </div>
    )
}
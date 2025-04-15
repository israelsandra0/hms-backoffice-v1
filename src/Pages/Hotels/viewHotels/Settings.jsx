import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { RiDeleteBin2Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";


export default function PageSettings({ closeFn, hotelId }) {

    const { toast } = useToast()

    const yupBuild = yup.object({
        logo: yup.mixed().test("file", "Logo must be a file", (value) => {
            if (!value) {
                return true;
            }
            return value && value.size > 0;
        }),
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            logo: "",
        },
        resolver: yupResolver(yupBuild),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            if (!data.logo) {
                delete data.logo;
            }
            const res = await put(`/hotels/${hotelId.id}/update-logo`, data)

            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Data updated successfully!'
                });
                
                closeFn()

                setFileDetails({
                    name: "",
                    size: 0,
                    preview: "",
                });
                setValue('logo', null);

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
                    title: 'Failed to update Data  detail. Please try again.'
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
                    preview: reader.result,
                });
            };

            setValue('logo', file)

            reader.readAsDataURL(file); // Read the file as a data URL (image preview)
        } else {
            setFileDetails({
                name: "",
                size: 0,
                preview: "",
            });
            setValue('logo', hotelId.logo || null);
        }
    };

    const handleFileDelete = () => {
        setFileDetails({
            name: "",
            size: 0,
            preview: "",
        });
        setValue('logo', null);
    };


    return (
        <div className="ml-4 mb-28">

            <div>
                <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            Logo 
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!!fileDetails?.preview && (
                            <form  onSubmit={handleSubmit(mutate)}>
                                <div className="flex justify-between gap-6 items-center mb-4">

                                    <div className="w-[150px] h-[100px] object-cover">
                                        <img src={fileDetails.preview} alt="File preview" className="w-[150px] h-[100px] object-cover" />
                                    </div>

                                    {fileDetails.name && (
                                        <div>
                                            <strong>{fileDetails.name}</strong><br />
                                            <h3>{(fileDetails.size / 1024).toFixed(2)} KB</h3>
                                        </div>
                                    )}
                                </div>
                                <RiDeleteBin2Line
                                    className="text-red-500 cursor-pointer float-end"
                                    onClick={handleFileDelete}
                                />

                                <Button variant='primary'>Upload</Button>
                            </form>

                        )}

                        {!fileDetails?.preview && (
                            <form className=" grid grid-cols-2  items-center">

                                <div className="w-[150px] h-[100px] object-cover bg-gray-200  border border-gray-300">
                                    {!!hotelId.logo && (
                                        <img src={hotelId.logo} alt="Logo" className="w-[150px] h-[100px] mx-auto my-auto object-cover" />
                                    )}

                                    {!fileDetails?.preview && !hotelId.logo && (
                                        <div className="w-[150px] h-[100px] border-gray-300 flex items-center justify-center text-gray-700 pr-1"></div>
                                    )}
                                </div>

                                <Input
                                    {...register("logo")}
                                    type="file"
                                    id="file-upload"
                                    onChange={(e) => {
                                        handleFileChange(e)
                                    }}
                                /> 
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                    <CardHeader>
                        <CardTitle>Home Page Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!!fileDetails?.preview && (
                            <div>
                                <div className="flex justify-between items-center mb-4">

                                    <div className="w-[150px] h-[100px] object-cover">
                                        <img src={fileDetails.preview} alt="File preview" className="w-[150px] h-[100px] object-cover" />
                                    </div>

                                    <RiDeleteBin2Line
                                        className="text-red-500 cursor-pointer"
                                        onClick={handleFileDelete}
                                    />
                                </div>

                                {fileDetails.name && (
                                    <div>
                                        <strong>{fileDetails.name}</strong><br />
                                        <h3>{(fileDetails.size / 1024).toFixed(2)} KB</h3>
                                    </div>
                                )}

                            </div>

                        )}

                        {!fileDetails?.preview && (
                            <div className=" px-3  flex gap-8 items-center">

                                <div className="w-[150px] h-[100px] object-cover  border border-gray-300">
                                    {!!hotelId.logo && (
                                        <img src={hotelId.logo} alt="Logo" className="w-[150px] h-[100px] mx-auto my-auto object-cover" />
                                    )}

                                    {!fileDetails?.preview && !hotelId.logo && (
                                        <div className="w-[150px] h-[100px] border-gray-300 flex items-center justify-center bg-gray-200 text-gray-700 pr-1"></div>
                                    )}
                                </div>


                                <div className="grid justify-center gap-2 w-[250px]">
                                    <Input
                                        {...register("logo")}
                                        type="file"
                                        id="file-upload"
                                        onChange={(e) => {
                                            handleFileChange(e)
                                        }}
                                    />
                                    <Button variant='outline'>Upload</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Color */}
                        <div className="grid gap-2">
                            <Label htmlFor="primaryColor">Colors</Label>
                            <Input
                                id="primaryColor"
                                type="color"
                                defaultValue="#1E90FF"
                                className="w-[100px] h-[40px] p-0 border-none"
                            />
                        </div>

                        {/* Font */}
                        <div className="grid gap-2">
                            <Label htmlFor="primaryFont">Fonts</Label>
                            <select
                                id="primaryFont"
                                className="border rounded px-3 py-2 text-sm outline-none"
                                defaultValue="Inter"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Poppins">Poppins</option>
                                <option value="Open Sans">Open Sans</option>
                                <option value="Helvetica">Helvetica</option>
                            </select>
                        </div>

                        <Button variant='primary'>Save</Button>

                    </CardContent>
                </Card>

            </div>
        </div>
    )
}  
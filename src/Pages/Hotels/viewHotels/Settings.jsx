import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";


export default function PageSettings({ closeFn, hotelId }) {

    const { toast } = useToast()
    const [logoDetails, setLogoDetails] = useState({ name: "", size: 0, preview: "" });
    const [bgDetails, setBgDetails] = useState({ name: "", size: 0, preview: "" });

    // const yupBuild = yup.object({
    //     logo: yup.mixed().test("file", "Logo must be a file", value => !value || value.size > 0),
    //     homeBgImage: yup.mixed().test("file", "Image must be a file", value => !value || value.size > 0),
    // });

    // const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    //     defaultValues: {
    //         logo: null,
    //         homeBgImage: null,
    //     },
    //     resolver: yupResolver(yupBuild),
    // });

    // const [fileDetails, setFileDetails] = useState({
    //     name: "",
    //     size: 0,
    //     preview: "",
    // });

    // const { mutate: logoRequest, isPending } = useMutation({
    //     mutationFn: async (data) => {
    //         if (!data.logo) {
    //             delete data.logo;
    //         }
    //         const res = await put(`/hotels/${hotelId.id}/update-logo`, data)

    //         if (res.ok) {
    //             toast({
    //                 success: true,
    //                 duration: 5000,
    //                 title: 'Data updated successfully!'
    //             });

    //             closeFn()

    //             setFileDetails({
    //                 name: "",
    //                 size: 0,
    //                 preview: "",
    //             });
    //             setValue('logo', null);

    //         } else if (res.status.toString().startsWith(4)) {

    //             const responseErrors = await res.json()

    //             if (responseErrors.errors) {
    //                 responseErrors.errors.forEach((error) => {
    //                     setError(error.field, {
    //                         type: "custom",
    //                         message: error.message,
    //                     });
    //                 });
    //             }
    //             return null;
    //         } else {
    //             toast({
    //                 error: true,
    //                 duration: 5000,
    //                 title: 'Failed to update Data  detail. Please try again.'
    //             });
    //         }
    //     }
    // })

    // const { mutate: backgroudimageRequest, isPending: loader } = useMutation({
    //     mutationFn: async (data) => {
    //         if (!data.homeBgImage) {
    //             delete data.homeBgImage;
    //         }
    //         console.log("dataaa", data)
    //         const res = await put(`/hotels/${hotelId.id}/update-home-image`, data)

    //         console.log("resss", res)
    //         if (res.ok) {
    //             toast({
    //                 success: true,
    //                 duration: 5000,
    //                 title: 'Data updated successfully!'
    //             });

    //             closeFn()

    //             setFileDetails({
    //                 name: "",
    //                 size: 0,
    //                 preview: "",
    //             });
    //             setValue('homeBgImage', null);

    //         } else if (res.status.toString().startsWith(4)) {

    //             const responseErrors = await res.json()

    //             if (responseErrors.errors) {
    //                 responseErrors.errors.forEach((error) => {
    //                     setError(error.field, {
    //                         type: "custom",
    //                         message: error.message,
    //                     });
    //                 });
    //             }
    //             return null;
    //         } else {
    //             toast({
    //                 error: true,
    //                 duration: 5000,
    //                 title: 'Failed to update Data  detail. Please try again.'
    //             });
    //         }
    //     }
    // })


    // const handlelogoChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();

    //         // When the file is read, update the state with the file details
    //         reader.onloadend = () => {
    //             setFileDetails({
    //                 name: file.name,
    //                 size: file.size,
    //                 preview: reader.result,
    //             });
    //         };

    //         setValue('logo', file)

    //         reader.readAsDataURL(file); // Read the file as a data URL (image preview)
    //     } else {
    //         setFileDetails({
    //             name: "",
    //             size: 0,
    //             preview: "",
    //         });
    //         setValue('logo', hotelId.logo || null);
    //     }
    // };

    // const handlelogoDelete = () => {
    //     setFileDetails({
    //         name: "",
    //         size: 0,
    //         preview: "",
    //     });
    //     setValue('logo', null);
    // };

    // const handleBgChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();

    //         // When the file is read, update the state with the file details
    //         reader.onloadend = () => {
    //             setFileDetails({
    //                 name: file.name,
    //                 size: file.size,
    //                 preview: reader.result,
    //             });
    //         };

    //         setValue('homeBgImage', file)

    //         reader.readAsDataURL(file); // Read the file as a data URL (image preview)
    //     } else {
    //         setFileDetails({
    //             name: "",
    //             size: 0,
    //             preview: "",
    //         });
    //         setValue('logo', hotelId.homeBgImage || null);
    //     }
    // };

    // const handleBgDelete = () => {
    //     setFileDetails({
    //         name: "",
    //         size: 0,
    //         preview: "",
    //     });
    //     setValue('homeBgImage', null);
    // };

    const logoSchema = yup.object({
        logo: yup.mixed().required("Please upload a logo"),
    });

    const bgImageSchema = yup.object({
        homeBgImage: yup.mixed().required("Please upload a background image"),
    });

    const logoForm = useForm({
        resolver: yupResolver(logoSchema),
    });

    const bgForm = useForm({
        resolver: yupResolver(bgImageSchema),
    });

    const handleFileChange = (e, type, form, setDetails) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();

        if (!file) {
            form.setValue(type, null);
            setDetails({ name: "", size: 0, preview: "" });
            return;
        }

        reader.onloadend = () => {
            setDetails({ name: file.name, size: file.size, preview: reader.result });
        };

        form.setValue(type, file);
        reader.readAsDataURL(file);
    };

    const handleFileDelete = (type, form, setDetails) => {
        form.setValue(type, null);
        setDetails({ name: "", size: 0, preview: "" });
    };

    const createMutation = (endpoint, form, setDetails, fieldName) => async (data) => {
        const file = data[fieldName];
        if (!file) return;

        const res = await put(`/hotels/${hotelId.id}/${endpoint}`, data);

        if (res.ok) {
            toast({ success: true, duration: 5000, title: "Data updated successfully!" });
            closeFn();
            setDetails({ name: "", size: 0, preview: "" });
            form.setValue(fieldName, null);
        } else if (res.status.toString().startsWith("4")) {
            const responseErrors = await res.json();
            responseErrors.errors?.forEach(error => {
                form.setError(error.field, { type: "custom", message: error.message });
            });
        } else {
            toast({ error: true, duration: 5000, title: "Failed to update data. Please try again." });
        }
    };

    const { mutate: uploadLogo, isPending: logoPending } = useMutation({
        mutationFn: createMutation("update-logo", logoForm, setLogoDetails, "logo"),
    });

    const { mutate: uploadBgImage, isPending: bgPending } = useMutation({
        mutationFn: createMutation("update-home-image", bgForm, setBgDetails, "homeBgImage"),
    });


    const renderUploadForm = ({
        type,
        previewData,
        hotelImage,
        form,
        onChange,
        onDelete,
        onSubmit,
        isLoading,
    }) => {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = form;

        return previewData.preview ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between gap-6 items-center mb-4">
                    <img src={previewData.preview} alt="Preview" className="w-[150px] h-[100px] object-cover" />
                    <div>
                        <strong>{previewData.name}</strong>
                        <div>{(previewData.size / 1024).toFixed(2)} KB</div>
                    </div>
                </div>
                <Button type="submit" variant="primary" disabled={isLoading} className="p-4 text-[16px]">
                    {isLoading ? <Spinner /> : "Upload"}
                </Button>
                <Button variant="grey" type="button" onClick={onDelete} disabled={isLoading} className="p-4 text-[16px] ml-4">
                    {isLoading ? <Spinner /> : "Cancel"}
                </Button>
                {errors[type] && <p className="text-red-500 text-sm mt-2">{errors[type].message}</p>}
            </form>
        ) : (
            <form className="grid grid-cols-2 items-center gap-4">
                <div className="w-[150px] h-[100px] object-cover bg-gray-200 border border-gray-300 flex items-center justify-center">
                    {hotelImage ? (
                        <img src={hotelImage} alt="Current" className="w-[150px] h-[100px] object-cover" />
                    ) : (
                        <span className="text-gray-500">No image</span>
                    )}
                </div>
                <Input
                    {...register(type)}
                    type="file"
                    onChange={(e) => onChange(e, type, form, type === "logo" ? setLogoDetails : setBgDetails)}
                />
            </form>
        );
    };

    return (
        <div className="ml-4 mb-28">
            <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
                <CardContent>
                    {renderUploadForm({
                        type: "logo",
                        previewData: logoDetails,
                        hotelImage: hotelId.logo,
                        form: logoForm,
                        onChange: handleFileChange,
                        onDelete: () => handleFileDelete("logo", logoForm, setLogoDetails),
                        onSubmit: uploadLogo,
                        isLoading: logoPending,
                    })}
                </CardContent>
            </Card>

            <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                <CardHeader><CardTitle>Home Page Background</CardTitle></CardHeader>
                <CardContent>
                    {renderUploadForm({
                        type: "homeBgImage",
                        previewData: bgDetails,
                        hotelImage: hotelId.homeBgImage,
                        form: bgForm,
                        onChange: handleFileChange,
                        onDelete: () => handleFileDelete("homeBgImage", bgForm, setBgDetails),
                        onSubmit: uploadBgImage,
                        isLoading: bgPending,
                    })}
                </CardContent>
            </Card>

            {/* <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
                <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="primaryColor">Colors</Label>
                        <Input id="primaryColor" type="color" defaultValue="#1E90FF" className="w-[100px] h-[40px] p-0 border-none" />
                    </div>

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

                    <Button variant="primary">Save</Button>
                </CardContent>
            </Card> */}
        </div>
    );
}

// return (
//     <div className="ml-4 mb-28">

//         <div>
//             <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
//                 <CardHeader>
//                     <CardTitle className="flex justify-between">
//                         Logo
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {!!fileDetails?.preview && (
//                         <form onSubmit={handleSubmit(logoRequest)}>
//                             <div className="flex justify-between gap-6 items-center mb-4">

//                                 <div className="w-[150px] h-[100px] object-cover">
//                                     <img src={fileDetails.preview} alt="File preview" className="w-[150px] h-[100px] object-cover" />
//                                 </div>

//                                 {fileDetails.name && (
//                                     <div>
//                                         <strong>{fileDetails.name}</strong><br />
//                                         <h3>{(fileDetails.size / 1024).toFixed(2)} KB</h3>
//                                     </div>
//                                 )}
//                             </div>
//                             <Button variant="primary" type="submit" className="w-full p-[16px] text-[16px]" disabled={isPending}>
//                                 {isPending ? <Spinner /> : 'Upload'}
//                             </Button>
//                             <Button variant="grey" onClick={handlelogoDelete} className="ml-4 w-full p-[16px] text-[16px]" disabled={isPending}>
//                                 {isPending ? <Spinner /> : 'cancel'}
//                             </Button>
//                         </form>

//                     )}

//                     {!fileDetails?.preview && (
//                         <form className=" grid grid-cols-2  items-center">

//                             <div className="w-[150px] h-[100px] object-cover bg-gray-200  border border-gray-300">
//                                 {!!hotelId.logo && (
//                                     <img src={hotelId.logo} alt="Logo" className="w-[150px] h-[100px] mx-auto my-auto object-cover" />
//                                 )}

//                                 {!fileDetails?.preview && !hotelId.logo && (
//                                     <div className="w-[150px] h-[100px] border-gray-300 flex items-center justify-center text-gray-700 pr-1"></div>
//                                 )}
//                             </div>

//                             <Input
//                                 {...register("logo")}
//                                 type="file"
//                                 id="file-upload"
//                                 onChange={(e) => {
//                                     handlelogoChange(e)
//                                 }}
//                             />
//                         </form>
//                     )}
//                 </CardContent>
//             </Card>

//             <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
//                 <CardHeader>
//                     <CardTitle>Home Page Background</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {!!fileDetails?.preview && (
//                         <form onSubmit={handleSubmit(backgroudimageRequest)}>
//                             {/* {JSON.stringify(errors)} */}
//                             <div className="flex justify-between gap-6 items-center mb-4">

//                                 <div className="w-[150px] h-[100px] object-cover">
//                                     <img src={fileDetails.preview} alt="File preview" className="w-[150px] h-[100px] object-cover" />
//                                 </div>

//                                 {fileDetails.name && (
//                                     <div>
//                                         <strong>{fileDetails.name}</strong><br />
//                                         <h3>{(fileDetails.size / 1024).toFixed(2)} KB</h3>
//                                     </div>
//                                 )}
//                             </div>
//                             <Button variant="primary" type="submit" className="w-full p-[16px] text-[16px]" disabled={loader}>
//                                 {loader ? <Spinner /> : 'Upload'}
//                             </Button>
//                             <Button variant="grey" onClick={handleBgDelete} className="ml-4 w-full p-[16px] text-[16px]" disabled={loader}>
//                                 {loader ? <Spinner /> : 'cancel'}
//                             </Button>
//                         </form>

//                     )}

//                     {!fileDetails?.preview && (
//                         <form className=" grid grid-cols-2  items-center">

//                             <div className="w-[150px] h-[100px] object-cover bg-gray-200  border border-gray-300">
//                                 {!!hotelId.homeBgImage && (
//                                     <img src={hotelId.homeBgImage} alt="Logo" className="w-[150px] h-[100px] mx-auto my-auto object-cover" />
//                                 )}

//                                 {!fileDetails?.preview && !hotelId.homeBgImage && (
//                                     <div className="w-[150px] h-[100px] border-gray-300 flex items-center justify-center text-gray-700 pr-1"></div>
//                                 )}
//                             </div>

//                             <Input
//                                 {...register("homeBgImage")}
//                                 type="file"
//                                 id="file-upload"
//                                 onChange={(e) => {
//                                     handleBgChange(e)
//                                 }}
//                             />
//                         </form>
//                     )}
//                 </CardContent>
//             </Card>

//             <Card className="border mt-6 rounded-[15px] ml-4 w-[500px]">
//                 <CardHeader>
//                     <CardTitle>Appearance</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">

//                     {/* Color */}
//                     <div className="grid gap-2">
//                         <Label htmlFor="primaryColor">Colors</Label>
//                         <Input
//                             id="primaryColor"
//                             type="color"
//                             defaultValue="#1E90FF"
//                             className="w-[100px] h-[40px] p-0 border-none"
//                         />
//                     </div>

//                     {/* Font */}
//                     <div className="grid gap-2">
//                         <Label htmlFor="primaryFont">Fonts</Label>
//                         <select
//                             id="primaryFont"
//                             className="border rounded px-3 py-2 text-sm outline-none"
//                             defaultValue="Inter"
//                         >
//                             <option value="Inter">Inter</option>
//                             <option value="Roboto">Roboto</option>
//                             <option value="Poppins">Poppins</option>
//                             <option value="Open Sans">Open Sans</option>
//                             <option value="Helvetica">Helvetica</option>
//                         </select>
//                     </div>

//                     <Button variant='primary'>Save</Button>

//                 </CardContent>
//             </Card>
//         </div>
//     </div>
// )

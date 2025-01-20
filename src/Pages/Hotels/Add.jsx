import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { get, post } from "@/functions";
import { BACKEND_URL } from "@/constants";
import { Label } from "@/components/ui/label";
import StateField from "@/components/ui/state-field";
import { Link, useNavigate } from "react-router-dom";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Check, Delete, DeleteIcon, Upload } from "lucide-react";
import IntlPhoneField from "@/components/ui/intlphone-field";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonLink } from "@/components/ui/button_link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiDeleteBin2Line } from "@remixicon/react";
import CountryNames from "@/components/ui/country-names-input";

export default function Add() {
    // Yup schema
    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required").email(),
        website: yup.string()
        .required("Website is required")
        .test('valid-url', 'Website must be a valid URL', (value) => {
            if (!value) return false;
            const urlPattern = /^(https?:\/\/|www\.)?[a-zA-Z0-9-.]+(\.[a-zA-Z]{2,})$/;
            return urlPattern.test(value);
        })
        .nullable(),
        phone: yup.string().required("Phone number is required").min(10).max(15),
        address: yup.string().required("Address is required"),
        country: yup.string().required("Country is required"),
        state: yup.string().required("State is required"),
        city: yup.string().required("City is required"),
        logo: yup.mixed().required("Logo is required")
        //     return value && value.size <= 1000000}),
    });

    // UseForm hook
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        getValues,
        setValue
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            website: "",
            phone: "",
            address: "",
            country: "",
            state: "",
            city: "",
            logo: "",
        },
        resolver: yupResolver(yupBuild),
    });

    const [states, setStates] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const navigate = useNavigate();
    const [fileDetails, setFileDetails] = useState({
        name: "",
        size: 0,
        preview: "",
    });

    const { refetch: sendHotelDataRequest } = useQuery({
        enabled: false,
        queryKey: ["hotels"],
        queryFn: async () => {
            const hotelInput = getValues();
            setErrorMessage("");
            setDisabledButton(true);

            try {
                const hotelData = {
                    name: hotelInput.name,
                    email: hotelInput.email,
                    website: hotelInput.website,
                    phone: hotelInput.phone,
                    address: hotelInput.address,
                    country: hotelInput.country,
                    state: hotelInput.state, 
                    city: hotelInput.city, 
                    logo: hotelInput.logo, 
                };


                const res = await post("/hotels/store", hotelData);

                if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage(
                        "Hotel details not saved, correct all indicated fields and try again!"
                    );

                    const responseErrors = await res.json();

                    if (responseErrors.errors) {
                        responseErrors.errors.forEach((error) => {
                            setError(error.field, {
                                type: "custom",
                                message: error.message,
                            });
                        });
                    }
                    return null;
                }

                if (res.status === 500) {
                    setDisabledButton(false);
                    setErrorMessage("An error occurred, please try again");
                    return null;
                }

                const responseData = await res.json();
                setIsSuccess(true);
                setDisabledButton(true);
                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    });

    const { refetch: fetchStates, isLoading: isLoadingStates } = useQuery({
        enabled: false,
        queryKey: ["states"],
        queryFn: async () => {
            setErrorMessage("");

            try {
                const res = await get("/hotels/create");
                return await res.json();
            } catch (error) {
                setErrorMessage("Failed to load states data");
                setDisabledButton(false);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        fetchStates().then((response) => {
            setStates(response.data.data);
        });
    }, []);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <Link onClick={() => navigate('/hotels')}>Hotels</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add Hotels</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

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
        <>
            <UserAreaHeader pages={breadcrumb} />

            {isLoadingStates && (
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            )}

            <div
                className={`${isLoadingStates
                    ? "hidden"
                    : " w-2/5 text-center mx-auto border-none bg-transparent ring-0"
                    }`}
            >
                <CardContent className="mt-4">
                    {!!errorMessage?.length && (
                        <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form
                        onSubmit={handleSubmit(sendHotelDataRequest)}
                        className="hotelForm text-left"
                    >
                        <div className="mt-4">

                            <div>
                                <Label>Logo</Label>
                                <div className="h-[100px] p-3 mt-1 grid items-center text-gray-600 border border-gray-200 rounded">
                                    {!!fileDetails?.preview && (
                                        <div className="flex gap-2 items-center justify-between">
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
                                        <>

                                            <div className="grid justify-center gap-2">
                                                <Label htmlFor="file-upload">
                                                    <Upload htmlFor="file-upload" className="p-1 mx-auto mb-1 cursor-pointer" />
                                                    Drag & Drop or 
                                                    <span className="text-red-600"> Choose a file</span> to
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
                                                <h1 className="text-sm mx-auto mb-2">PNG or JPG</h1>
                                            </div>
                                            <p>{errors.logo?.message}</p>
                                        </>
                                    )}
                                </div>
                            </div> <br />

                            <div className="mb-2">
                                <Label htmlFor="name">Name of hotel</Label>
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

                            <div className="mb-2">
                                <Label htmlFor="phone">Phone</Label>
                                <br />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <IntlPhoneField {...field} id="phone" />
                                    )}
                                />
                                <p>{errors.phone?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="address">Address</Label>
                                <br />
                                <Input {...register("address")} id="address" />
                                <p>{errors.address?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="country">Country</Label>
                                <br />
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => (
                                        <CountryNames {...field} id="country" />
                                    )}
                                />
                                <p>{errors.country?.message}</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="mb-2 w-full">
                                    <Label htmlFor="state">Location (state)</Label>
                                    <br />
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <StateField {...field} options={states} />
                                        )}
                                    />
                                    <p>{errors.state?.message}</p>
                                </div>

                                <div className="mb-2 w-full">
                                    <Label htmlFor="city">City</Label>
                                    <br />
                                    <Input {...register("city")} id="city" />
                                    <p>{errors.city?.message}</p>
                                </div>
                            </div>
                        </div>

                        <br />
                        <Button
                            variant="primary"
                            disabled={disabledButton}
                            type="submit"
                            className="w-full p-[16px] text-[16px]"
                        >
                            {disabledButton ? "Submitting..." : "Submit"}
                        </Button>

                        <AlertDialog
                            open={isSuccess}
                            onOpenChange={(open) => setIsSuccess(open)}
                        >
                            <AlertDialogContent className="w-[340px] h-[210px] p-8 border-none rounded-[1.5rem] lg:rounded-[1.5rem]">
                                <AlertDialogHeader>
                                    <Check className="bg-lightPrimary text-[#542A12] mb-4 rounded-full p-2 w-[50px] h-[50px] mx-auto" />
                                    <AlertDialogTitle className="mx-auto ">
                                        Hotel Added Successfully!
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-2">
                                    <ButtonLink
                                        variant="primary"
                                        className="w-full p-[16px] text-[16px]"
                                        onClick={() => {
                                            setIsSuccess(false);
                                            navigate("/hotels");
                                        }}
                                    >
                                        Done
                                    </ButtonLink>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </form>
                </CardContent>
            </div>
        </>
    );
}

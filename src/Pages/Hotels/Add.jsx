import { Button } from "@/components/ui/button";
import { CardContent, } from "@/components/ui/card";
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
import { Check, Upload } from "lucide-react";
import IntlPhoneField from "@/components/ui/intlphone-field";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ButtonLink } from "@/components/ui/button_link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";


export default function Add() {
    // Yup schema
    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required").email(),
        website: yup.string().required("Website is required").url().nullable(),
        phone: yup.string().required("Phone number is required").min(10).max(15),
        address: yup.string().required("Address is required"),
        state: yup.string().required("State is required"),
        city: yup.string().required("City is required")
    });

    // UseForm hook
    const { register, handleSubmit, setError, formState: { errors }, control, getValues } = useForm({
        defaultValues: { name: "", email: "", website: "", phone: "", address: "", state: "", city: "" },
        resolver: yupResolver(yupBuild),
    });

    const [states, setStates] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const navigate = useNavigate();





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
                    state: hotelInput.state,  // Fixed: state should be hotelInput.state
                    city: hotelInput.city,    // Fixed: city should be hotelInput.city
                };

                const res = await post('/hotels/store', hotelData);
                console.log(res);

                if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage("Hotel details not saved, correct all indicated fields and try again!");


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

                const res = await get('/hotels/create');
                return await res.json();


            } catch (error) {
                setErrorMessage('Failed to load states data');
                setDisabledButton(false);
                console.log(error);
            }
        },
    });


    useEffect(() => {
        fetchStates().then(response => {
            setStates(response.data.data);
        })
    }, [])


    return (
        <>
            <UserAreaHeader pageName="Add Hotels" />

            {isLoadingStates && 
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            }

            <div className={`${isLoadingStates ? 'hidden' : ' w-2/5 text-center mx-auto border-none bg-transparent ring-0'}`}>
                <CardContent className='mt-4'>
                    {!!errorMessage?.length && (
                        <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(sendHotelDataRequest)} className="hotelForm text-left">
                        <div className="mt-4">
                            <div>
                                <Label>Logo</Label>
                                <div className="h-[100px] p-3 mb-4 mt-1 grid justify-center items-center text-gray-600 border border-gray-200 rounded">
                                    <div>
                                        <Upload className="p-1 mx-auto" />
                                        <Label for="file-upload">Drag & Drop or <span className="text-red-600"> Choose a file</span>to upload</Label>
                                    </div>
                                    
                                    <Input type='file' id="file-upload" className='hidden' />
                                    <h1 className="text-sm mx-auto">PNG or JPG</h1>
                                </div>
                            </div>

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
                                    render={({ field }) => <IntlPhoneField {...field} id="phone" />}
                                />
                                <p>{errors.phone?.message}</p>

                            </div>

                            <div className="mb-2">
                                <Label htmlFor="address">Address</Label>
                                <br />
                                <Input {...register("address")} id="address" />
                                <p>{errors.address?.message}</p>

                            </div>

                            <div className="flex gap-2">
                                <div className="mb-2 w-full">
                                    <Label htmlFor="state">Location (state)</Label>
                                    <br />
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => <StateField {...field} options={states} />}
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
                        <Button variant="primary" disabled={disabledButton} type="submit" className="w-full p-[16px] text-[16px]">
                            {disabledButton ? "Submitting..." : "Submit"}
                        </Button>

                        <AlertDialog open={isSuccess} onOpenChange={(open) => setIsSuccess(open)}>
                            <AlertDialogContent className="w-[340px] h-[210px] p-8 border-none rounded-[1.5rem] lg:rounded-[1.5rem]">
                                <AlertDialogHeader>
                                    <Check className="bg-lightPrimary text-[#542A12] mb-4 rounded-full p-2 w-[50px] h-[50px] mx-auto" />
                                    <AlertDialogTitle className="mx-auto ">Hotel Added Successfully!</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-2">
                                    <ButtonLink variant="primary" className="w-full p-[16px] text-[16px]" onClick={() => { setIsSuccess(false); navigate("/hotels") }}>
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
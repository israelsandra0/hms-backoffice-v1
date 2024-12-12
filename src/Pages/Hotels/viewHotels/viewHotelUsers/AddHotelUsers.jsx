import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/functions";
import { BACKEND_URL } from "@/constants";
import { Label } from "@/components/ui/label";
import StateField from "@/components/ui/state-field";
import { Link, useNavigate } from "react-router-dom";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Check, Delete, DeleteIcon, Upload, X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonLink } from "@/components/ui/button_link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IntlPhoneField from "@/components/ui/intlphone-field";

export default function AddHotelUsers({ closeFn, hotelId }) {
    // Yup schema
    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required").email(),
        phone: yup.string().required("Phone number is required").min(10).max(15),
        role: yup.string().required("State is required"),
        location: yup.string().required("City is required")
    });

    // UseForm hook
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        getValues,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "",
            location: "",
        },
        resolver: yupResolver(yupBuild),
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [states, setStates] = useState([]);

    
    // const { mutate } = useMutation({
    //     mutationFn: async () => {

    //         const hotelInput = getValues();
    //         setErrorMessage("");
    //         setDisabledButton(true);

    //         try {
    //             const hotelData = {
    //                 name: hotelInput.name,
    //                 email: hotelInput.email,
    //                 phone: hotelInput.phone,
    //                 role: hotelInput.role,
    //                 location: hotelInput.location,
    //             };


    //             const res = await post(`/hotels/${hotelId}/locations/store`, hotelData);

    //             if (res.status.toString().startsWith(4)) {
    //                 setDisabledButton(false);
    //                 setErrorMessage(
    //                     "Hotel details not saved, correct all indicated fields and try again!"
    //                 );

    //                 const responseErrors = await res.json();

    //                 if (responseErrors.errors) {
    //                     responseErrors.errors.forEach((error) => {
    //                         setError(error.field, {
    //                             type: "custom",
    //                             message: error.message,
    //                         });
    //                     });
    //                 }
    //                 return null;
    //             }

    //             if (res.status === 500) {
    //                 setDisabledButton(false);
    //                 setErrorMessage("An error occurred, please try again");
    //                 return null;
    //             }

    //             const responseData = await res.json();
    //             setIsSuccess(true);
    //             setDisabledButton(true);

    //             // Trigger the callback to update the location list
    //             if (onLocationAdded) {
    //                 onLocationAdded(responseData);
    //             }

    //             // Close the modal after success
    //             // if (closeFn) {
    //             //     closeFn(); 
    //             //     setIsSuccess(open)
    //             // }

    //             // closeFn();

    //             return responseData;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     },
    // })



    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <CardContent className='w-[30%] rounded-[24px] text-center mx-auto border-none bg-white py-8'>
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee] mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="flex gap-20">
                    <Link>
                        <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn} />
                    </Link>
                    <h1 className="text-[1.3rem] font-bold mb-2">Add New Users</h1>
                </div>

                <form
                    className="hotelForm text-left"
                >
                    {/* {JSON.stringify(errors)} */}
                    <div className="mt-4">

                        <div className="mb-2">
                            <Label htmlFor="name">Full Name</Label>
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
                                <Label htmlFor="role">Role</Label>
                                <br />
                                <Input {...register("role")} type="role" id="role" />
                                <p>{errors.role?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="location">Location</Label>
                                <br />
                                <Input {...register("location")} type="location" id="location" />
                                <p>{errors.location?.message}</p>
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
                                    Location Added Successfully!
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-2">
                                <ButtonLink
                                    variant="primary"
                                    className="w-full p-[16px] text-[16px]"
                                    onClick={() => {
                                        setIsSuccess(false);
                                        // navigate(`/hotels/view/${hotelId}`);
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
    );
}

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
import { Dialog } from "@/components/ui/dialog";

export default function AddHotelLocation({ closeFn, onLocationAdded, hotelId  }) {
    // Yup schema
    const yupBuild = yup.object({
        address: yup.string().required("Address is required"),
        state: yup.string().required("State is required"),
        city: yup.string().required("City is required")
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
            address: "",
            state: "",
            city: "",
        },
        resolver: yupResolver(yupBuild),
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [states, setStates] = useState([]);

    // const { refetch: sendLocationRequest } = useQuery({
    //     enabled: false,
    //     queryKey: ["locations"],
    //     queryFn: async () => {
    //         const hotelInput = getValues();
    //         setErrorMessage("");
    //         setDisabledButton(true);

    //         try {
    //             const hotelData = {
    //                 address: hotelInput.address,
    //                 state: hotelInput.state,
    //                 city: hotelInput.city
    //             };


    //             const res = await post(`hotels/${hotelId}/locations/store`, hotelData);

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

    //             return responseData;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     },
    // });

    const { mutate } = useMutation({
        mutationFn: async () => {

            const hotelInput = getValues();
            setErrorMessage("");
            setDisabledButton(true);

            try {
                const hotelData = {
                    address: hotelInput.address,
                    state: hotelInput.state,
                    city: hotelInput.city
                };


                const res = await post(`hotels/${hotelId}/locations/store`, hotelData);

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

                // Trigger the callback to update the location list
                if (onLocationAdded) {
                    onLocationAdded(responseData);
                }

                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    })


    const { refetch: fetchStates } = useQuery({
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

    // useEffect(() => {
    //     fetchStates().then((response) => {
    //         setStates(response.data.data);
    //     });
    // }, []);
    useEffect(() => {
        const loadStates = async () => {
            try {
                const response = await fetchStates();
                setStates(response.data.data);
            } catch (error) {
                console.log(error);
                setErrorMessage("Failed to load states data");
                setDisabledButton(false);
            }
        };
        loadStates();
    }, []);


    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <CardContent className='w-[30%] rounded-[24px] text-center mx-auto border-none bg-white py-8'>
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="flex gap-20">
                    <Link>
                        <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn} />
                    </Link>
                    <h1 className="text-[1.3rem] font-bold mb-2">Add New Location</h1>
                </div>

                <form
                    onSubmit={handleSubmit(mutate)}
                    className="hotelForm text-left"
                >
                    {/* {JSON.stringify(errors)} */}
                    <div className="mt-4">

                        <div className="mb-2">
                            <Label htmlFor="address">Address</Label>
                            <br />
                            <Input {...register("address")} id="address" />
                            <p>{errors.address?.message}</p>
                        </div>

                        <div className="flex gap-2">
                            <div className="mb-2 w-full">
                                <Label htmlFor="state">State</Label>
                                <br />
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <StateField {...field}  options={states}/>
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
                                    Location Added Successfully!
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-2">
                                <ButtonLink
                                    variant="primary"
                                    className="w-full p-[16px] text-[16px]"
                                    onClick={() => {
                                        setIsSuccess(false);
                                        navigate("/hotels/view/locations");
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

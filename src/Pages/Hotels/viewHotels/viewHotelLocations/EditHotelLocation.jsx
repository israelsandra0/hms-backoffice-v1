import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { CardContent } from "@/components/ui/card";
import CountryNames from "@/components/ui/country-names-input";
import { Input } from "@/components/ui/input";
import IntlPhoneField from "@/components/ui/intlphone-field";
import Spinner from "@/components/ui/spinner";
import StateField from "@/components/ui/state-field";
import { get, put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { RiDeleteBin2Line } from "@remixicon/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";



export default function EditHotelLocation({ closeFn, locationId, hotelId }) {

    // Yup schema
    const yupBuild = yup.object({
        name: yup.string().required("Name is required"),
        address: yup.string().required("Address is required"),
        state: yup.string().required("State is required"),
        country: yup.string().required("Country is required"),
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
    } = useForm({
        defaultValues: {
            name: locationId.name,
            address: locationId.address,
            state: locationId.state,
            country: locationId.country,
            city: locationId.city,
            phone: locationId.phone,
        },
        resolver: yupResolver(yupBuild),
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [states, setStates] = useState([]);


    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await put(`/hotels/${hotelId}/locations/update/${locationId.id}`, data)
            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Hotel location updated successfully!'
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
                    title: 'Failed to edit hotel location. Please try again.'
                });
            }
        }
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

                <div className="flex">
                    <Link>
                        <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={() => closeFn()} />
                    </Link>
                    <h1 className="text-[1.3rem] font-bold mb-2 mx-auto">Edit Location</h1>
                </div>

                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee] mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <form
                    onSubmit={handleSubmit(mutate)}
                    className="hotelForm text-left"
                >
                    {/* {JSON.stringify(errors)} */}
                    <div className="mt-4">

                        <div className="mb-2">
                            <Label htmlFor="name">Name</Label>
                            <br />
                            <Input {...register("name")} id="name" />
                            <p>{errors.name?.message}</p>
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="address">Address</Label>
                            <br />
                            <Input {...register("address")} id="address" />
                            <p>{errors.address?.message}</p>
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
                                <Label htmlFor="state">State</Label>
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
                                    Location Added Successfully!
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-2">
                                <ButtonLink
                                    variant="primary"
                                    className="w-full p-[16px] text-[16px]"
                                    onClick={() => {
                                        setIsSuccess(false);
                                        closeFn()
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
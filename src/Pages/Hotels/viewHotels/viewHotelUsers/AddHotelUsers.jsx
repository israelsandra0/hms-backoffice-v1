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
import PasswordField from "@/components/ui/password-field";
import { useToast } from "@/hooks/use-toast";

export default function AddHotelUsers({ closeFn, hotelId }) {
    // Yup schema
    const yupBuild = yup.object({
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        email: yup.string().required("Email is required").email(),
        auto_generate_password: yup.boolean(),
        password: yup.string().when('auto_generate_password', {
            is: false,
            then: (password) => password.required('Password is requiored').min(6).max(25)
        }),
        phone: yup.string().required("Phone number is required").min(10).max(15),
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
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            auto_generate_password: true
        },
        resolver: yupResolver(yupBuild),
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const { toast } = useToast()
    const [generatePassword, setGeneratePassword] = useState(true)

    const handleCheckboxChange = () => {
        setGeneratePassword(!generatePassword);
    };


    const { mutate } = useMutation({
        mutationFn: async () => {

            const userInput = getValues();
            setErrorMessage("");
            setDisabledButton(true);

            try {
                const userData = {
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
                    email: userInput.email,
                    phone: userInput.phone,
                    password: userInput.password,
                    auto_generate_password: userInput.auto_generate
                };
                const res = await post(`/hotels/${hotelId.id}/users/store`, userData);

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 5000,
                        title: 'User added successfully!'
                    });
                    closeFn()

                } else if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage(
                        "User details not saved, correct all indicated fields and try again!"
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
                closeFn()
                setDisabledButton(true);


                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    })


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
                    onSubmit={handleSubmit(mutate)}
                >
                    {/* {JSON.stringify(errors)} */}
                    <div className="mt-4">

                        <div className="flex gap-2 mb-2">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input {...register("firstName")} id="firstName" />
                                <p>{errors.firstName?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input {...register("lastName")} id="lastName" />
                                <p>{errors.lastName?.message}</p>
                            </div>
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

                        {generatePassword && (

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => <PasswordField {...field} />}
                                />


                                <p className="text-red-700">{errors.password?.message}</p>

                            </div>
                        )}
                        <div className="mt-2 flex items-center">
                            <input type="checkbox"
                                checked={!generatePassword}
                                onChange={handleCheckboxChange}
                            />
                            <h2 className="ml-2 text-[12px]">
                                auto-generate password?
                            </h2>
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
                </form>
            </CardContent>
        </div>
    );
}

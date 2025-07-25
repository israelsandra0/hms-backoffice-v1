import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/functions";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IntlPhoneField from "@/components/ui/intlphone-field";
import PasswordField from "@/components/ui/password-field";
import { useToast } from "@/hooks/use-toast";

export default function AddUsers({ closeFn, roleData }) {
    // Yup schema
    const yupBuild = yup.object({
        firstName: yup.string().required("First Name is required").max(25),
        lastName: yup.string().required("Last Name is required").max(25),
        email: yup.string().required("Email is required").email().max(50),
        isAdmin: yup.boolean(),
        roleId: yup.string().when('isAdmin', {
            is: false,
            then: (roleId) => roleId.required('roleId is required').min(1).max(50),
            otherwise: (roleId) => roleId.optional()
        }),
        autoGeneratePassword: yup.boolean(),
        password: yup.string().when('autoGeneratePassword', {
            is: false,
            then: (password) => password.required('Password is required').min(6).max(50),
            otherwise: (password) => password.optional()
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
        setValue
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            roleId: "",
            isAdmin: false,
            password: "",
            autoGeneratePassword: false,
        },
        resolver: yupResolver(yupBuild),
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const { toast } = useToast();
    const [autoGeneratePassword, setGeneratePassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleCheckboxChange = (e) => {
        setGeneratePassword(e.target.checked);
        setValue("autoGeneratePassword", e.target.checked);
    };

    const handleAdminChange = (e) => {
        setIsAdmin(e.target.checked);
        setValue("isAdmin", e.target.checked);
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
                    roleId: userInput.roleId,
                    isAdmin: userInput.isAdmin,
                    password: userInput.password,
                    autoGeneratePassword: userInput.autoGeneratePassword,
                };
                const res = await post(`/users/store`, userData);

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 5000,
                        title: "User added successfully!",
                    });
                    closeFn();
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
                closeFn();
                setDisabledButton(true);

                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 flex justify-center items-center">
            <CardContent
                style={{ borderRadius: "16px" }}
                className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee] mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="flex mt-4">
                    <Link>
                        <X
                            className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400"
                            onClick={closeFn}
                        />
                    </Link>
                    <h1 className="text-[1.3rem] font-bold mx-auto">Add New User</h1>
                </div>

                <form className="hotelForm text-left" onSubmit={handleSubmit(mutate)}>
                    {/* {JSON.stringify(errors)} */}
                    <div className="mt-4">
                        <div className="mb-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <br />
                            <Input {...register("firstName")} id="firstName" maxLength="25" />
                            <p>{errors.firstName?.message}</p>
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <br />
                            <Input {...register("lastName")} id="lastName" maxLength="25" />
                            <p>{errors.lastName?.message}</p>
                        </div>

                        <div className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <br />
                            <Input
                                {...register("email")}
                                type="email"
                                id="email"
                                maxLength="50"
                            />
                            <p>{errors.email?.message}</p>
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

                        {!isAdmin && (
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <br />

                                <select name='Select role' {...register("roleId")} className="flex h-10 mb-[-16px] w-full rounded border border-neutral-200 bg-[#F2F2F5] px-3 autofill:bg-[#F2F2F5] py-2 text-sm  file:border-0 file:bg-[#F2F2F5] file:text-sm file:font-medium file:text-neutral-950 placeholder:text-[#BBBAC5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-[#F2F2F5] dark:ring-offset-neutral-950 outline-none text-black dark:file:text-neutral-50 dark:placeholder:text-neutral-400 ">
                                <   option value="" disabled selected>Select a role</option> 
                                    {roleData.map((data) => (

                                        <option value={data.id}>{data.name}</option>
                                    ))}
                                </select>
                                <p>{errors.roleId?.message}</p>
                            </div>
                        )}
                        <div className="flex gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={handleAdminChange}
                            />
                            <h2 className="text-gray-700 mt-5">
                                <b className="text-[1rem] text-black">Set as Administrator </b> <br />
                                This grants the user access to all features and functionalities.
                            </h2>
                        </div>

                        {!autoGeneratePassword && (
                            <div className=" mb-[-12px]">
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
                            <input
                                type="checkbox"
                                checked={autoGeneratePassword}
                                onChange={handleCheckboxChange}
                            />
                            <h2 className="ml-2 text-[12px]">auto-generate password?</h2>
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

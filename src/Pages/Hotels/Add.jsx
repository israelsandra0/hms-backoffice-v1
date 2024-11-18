import { Button } from "@/components/ui/button";
import { CardContent,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { post } from "@/functions";
import { BACKEND_URL } from "@/constants";
import { Label } from "@/components/ui/label";
import StateField from "@/components/ui/state-field";
import CityField from "@/components/ui/city-field";
import { Link, useNavigate } from "react-router-dom";
import UserAreaHeader from "@/components/UserAreaHeader";
import { ChevronLeft  } from "lucide-react";
import IntlPhoneField from "@/components/ui/intlphone-field";

export default function Add() {
    //yup builder for input error msg
    const yupBuild = yup.object({
        name: yup.string().required("name is required"),
        email: yup.string().required("email is required").email(),
        website: yup.string().required("website is required").url().nullable(),
        phone: yup.string().required("phone number is required").min(10).max(15),
        address: yup.string().required("address is required"),
        state: yup.string().required("state is required"),
        city: yup.string().required("city is required")
    });

    //destructured hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control
    } = useForm({
        defaultValues: { name: "", email: "", website: "", phone: "", address: "", state: "", city: "" },
        resolver: yupResolver(yupBuild),
    });

    const [disabledButton, setDisabledButton] = useState(false);
    const navigate = useNavigate()

    const { refetch } = useQuery({
        enabled: false,
        queryKey: ["hotels"],
        queryFn: async () => {
            const hotelInput = getValues();

            setDisabledButton(true);

            try {
                const hotelData = {
                    name: hotelInput.name,
                    email: hotelInput.email,
                    website: hotelInput.website,
                    phone: hotelInput.phone,
                    address: hotelInput.address,
                    state: hotelInput.address,
                    city: hotelInput.address,
                };

                const res = await post(`${BACKEND_URL}/hotels/store`, hotelData);
                console.log(res);

                if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    // setErrorMessage('invalid credentials')

                    return null;
                }
                if (res.status === 500) {
                    setDisabledButton(false);
                    // setErrorMessage('An error occurred, please try again')
                    return null;
                }
                const responseData = await res.json();

                // navigate("/hotels")
                setTimeout(() => navigate("/hotels"), 100);

                setDisabledButton(true);
                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <>
            <div>
                <div className=" absolute mt-5 ml-4">
                    <Link to="/hotels" ><ChevronLeft className=" ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400"/></Link>
                </div>
                <UserAreaHeader pageName="Add Hotels" />
            </div>

            <div className="w-2/5 text-center mx-auto border-none bg-transparent ring-0">
                <CardContent className='mt-4'>
                    <form onSubmit={handleSubmit(refetch)} className="hotelForm  text-left">

                        <div className="mt-4">
                            <div className="mb-2">
                                {/* {JSON.stringify({ errors })} */}
                                <Label htmlFor="name">Name of hotel</Label>
                                <br />
                                <Input {...register("name")} id="name" className=" outline-none text-black  " />
                                <p className="text-red-700">{errors.name?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="email">Email</Label>
                                <br />
                                <Input {...register("email")} type="email" id="email" className=" outline-none text-black  " />
                                <p className="text-red-700">{errors.email?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="website">Website</Label>
                                <br />
                                <Input {...register("website")} className=" outline-none text-black " id="website" />
                                <p className="text-red-700">{errors.website?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="phone">Phone</Label>
                                <br />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => <IntlPhoneField {...field}  id="phone"/>}
                                />
                                <p className="text-red-700">{errors.phone?.message}</p>
                            </div>

                            <div className="mb-2">
                                <Label htmlFor="address">Address</Label>
                                <br />
                                <Input {...register("address")} id='address' className=" outline-none text-black " />
                                <p className="text-red-700">{errors.address?.message}</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="mb-2 w-full">
                                    <Label htmlFor="state">Location (state)</Label>
                                    <br />
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => <StateField {...field} />}
                                    />
                                </div>
                                <div className="mb-2 w-full">
                                    <Label htmlFor="city">City</Label>
                                    <br />
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => <CityField {...field} />}
                                    />
                                </div>

                            </div>
                        </div>


                        <br />
                        <Button variant="primary" disabled={!!disabledButton} type="submit" className=" w-full p-[16px] text-[16px]">
                            {disabledButton ? "Submitting..." : "submit"}
                        </Button>
                    </form>
                </CardContent>
            </div>
        </>
    );
}

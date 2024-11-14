import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { post } from "@/functions";
import { BACKEND_URL } from "@/constants";
import PhoneField from "@/components/ui/phone-field";
import { Label } from "@/components/ui/label";

export default function Add() {
    //yup builder for input error msg
    const yupBuild = yup.object({
        name: yup.string().required("name is required"),
        email: yup.string().required("email is required").email(),
        website: yup.string().required("website is required").url().nullable(),
        phone: yup.number().required().positive().integer(),
        address: yup.string().required("address is required")
    });

    //destructured hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control
    } = useForm({
        defaultValues: { name: "", email: "", website: "", phone: "", address: "" },
        resolver: yupResolver(yupBuild),
    });

    const [disabledButton, setDisabledButton] = useState(false);

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

                setTimeout(() => (window.location.href = "/hotels"), 100);

                setDisabledButton(true);
                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <>
            <div className="mt-6 ml-6">
                <ButtonLink to="/hotels">← Back</ButtonLink>
            </div>

            <Card className="w-2/5 text-center mx-auto p-2 mt-[-2rem]">
                <CardHeader className='p-0'>
                    <CardTitle className='mt-4'>ADD HOTEL</CardTitle>
                </CardHeader>
                <CardContent className='mt-4'>
                    <form onSubmit={handleSubmit(refetch)} className="hotelForm  text-left">

                        <Label htmlFor="picture">Logo</Label>
                        <div className=" bg-[#F2F2F5] flex justify-between items-center h-[100px]">
                            <img src="public/logo.png"  className=" bg-red-700 w-[50px] h-[50px] mx-auto"/>
                            <Input id="picture" type="file" className='w-4/5 h-full border-none rounded-none' />
                        </div>
                        <div className="grid">
                            <div className="p-2">
                                <Label htmlFor="name">Name of hotel</Label>
                                <br />
                                <Input {...register("name")} id="name" className=" outline-none text-black " />
                                <p className="text-red-700">{errors.name?.message}</p>
                            </div>

                            <div className="p-2">
                                <Label htmlFor="email">Email</Label>
                                <br />
                                <Input {...register("email")} type="email" id="email" className=" outline-none text-black " />
                                <p className="text-red-700">{errors.email?.message}</p>
                            </div>

                            <div className="p-2">
                                <Label htmlFor="website">Website</Label>
                                <br />
                                <Input {...register("website")} className=" outline-none text-black" />
                                <p className="text-red-700">{errors.website?.message}</p>
                            </div>
                            <div className="p-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <br />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => <PhoneField {...field} />}
                                />
                                {/* <Input {...register("phone")} id='phone'  className=" outline-none text-black" maxLength='10'/> */}
                                <p className="text-red-700">{errors.phone?.message}</p>
                            </div>
                            <div className="p-2">
                                <Label htmlFor="address">Address</Label>
                                <br />
                                <Input {...register("address")} id='address' className=" outline-none text-black" />
                                <p className="text-red-700">{errors.address?.message}</p>
                            </div>
                            <div className="flex">
                                <div className="p-2  w-full">
                                    <Label htmlFor="state">Location (state)</Label>
                                    <br />
                                    <Select id='state' >
                                        <SelectTrigger  className='bg-[#F2F2F5] rounded-[0.3rem]'>
                                            <SelectValue placeholder="Lagos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                                <SelectItem value="west">
                                                    Western European Summer Time (WEST)
                                                </SelectItem>
                                                <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                                <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                                <SelectLabel>Asia</SelectLabel>
                                                <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                                <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                                <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                                <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                                <SelectItem value="ist_indonesia">
                                                    Indonesia Central Standard Time (WITA)
                                                </SelectItem>
                                                <SelectLabel>Australia & Pacific</SelectLabel>
                                                <SelectItem value="awst">
                                                    Australian Western Standard Time (AWST)
                                                </SelectItem>
                                                <SelectItem value="acst">
                                                    Australian Central Standard Time (ACST)
                                                </SelectItem>
                                                <SelectItem value="aest">
                                                    Australian Eastern Standard Time (AEST)
                                                </SelectItem>
                                                <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                                <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                                <SelectLabel>South America</SelectLabel>
                                                <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                                <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                                <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                                <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="p-2  w-full">
                                    <Label htmlFor="city">City</Label>
                                    <br />
                                    <Select id='city' >
                                        <SelectTrigger  className='bg-[#F2F2F5] rounded-[0.3rem]'>
                                            <SelectValue placeholder="Ikeja" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectGroup>
                                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                                <SelectItem value="west">
                                                    Western European Summer Time (WEST)
                                                </SelectItem>
                                                <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                                <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                                <SelectLabel>Asia</SelectLabel>
                                                <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                                <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                                <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                                <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                                <SelectItem value="ist_indonesia">
                                                    Indonesia Central Standard Time (WITA)
                                                </SelectItem>
                                                <SelectLabel>Australia & Pacific</SelectLabel>
                                                <SelectItem value="awst">
                                                    Australian Western Standard Time (AWST)
                                                </SelectItem>
                                                <SelectItem value="acst">
                                                    Australian Central Standard Time (ACST)
                                                </SelectItem>
                                                <SelectItem value="aest">
                                                    Australian Eastern Standard Time (AEST)
                                                </SelectItem>
                                                <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                                <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                                <SelectLabel>South America</SelectLabel>
                                                <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                                <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                                <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                                <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>
                        </div>


                        <br />
                        <Button variant="primary" disabled={!!disabledButton} type="submit" className=" w-full p-[16px] text-[16px]">
                            {disabledButton ? "Submitting..." : "submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

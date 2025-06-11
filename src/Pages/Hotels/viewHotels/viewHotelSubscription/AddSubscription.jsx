import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/functions";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function AddSubscriptionPage({ closeFn, hotelId }) {

    const yupBuild = yup.object({
        subscriptionPlanId: yup.number().required("name is required"),
        numberOfMonths: yup.string().required("duration is required"),
        discountType: yup.string().required("discountType is required"),
        discountValue: yup
            .number()
            .typeError("Discount value must be a number")
            .required("Discount value is required")
            .test("discount-check", "Flat discount cannot exceed total amount", function (value) {
                const { discountType, subscriptionPlanId, numberOfMonths } = this.parent;
                const planData = this.options.context?.planData;
                if (!planData) return true;
                const selectedPlan = planData.subscriptionPlans.find(plan => plan.id === subscriptionPlanId);
                if (!selectedPlan) return true;
                const total = selectedPlan.price * numberOfMonths;

                if (discountType === "amount" && value > total) return false;
                if (discountType === "percentage" && value > 100) return false;

                return true;
            }),
        startDate: yup.string().required("datePaid is required")
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        getValues,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            subscriptionPlanId: "",
            numberOfMonths: "",
            startDate: "",
            discountType: "",
            discountValue: ""

        },
        resolver: yupResolver(yupBuild)
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const { toast } = useToast();

    const { data: planData, isFetching, refetch: fetchHotelPlans } = useQuery({
        queryKey: ["hotelSubscription"],
        queryFn: async () => {
            const res = await get(`/hotels/${hotelId}/subscriptions/create`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
                // return []
            }
            const response = await res.json();

            console.log("hotelId", hotelId)

            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchHotelPlans()
    }, [fetchHotelPlans])

    const { mutate } = useMutation({
        mutationFn: async () => {
            setDisabledButton(true)
            const subscriptionInput = getValues()

            try {
                const planData = {
                    subscriptionPlanId: subscriptionInput.subscriptionPlanId,
                    numberOfMonths: subscriptionInput.numberOfMonths,
                    startDate: subscriptionInput.startDate,
                    discountType: subscriptionInput.discountType,
                    discountValue: subscriptionInput.discountValue
                };
                const res = await post(`/hotels/${hotelId}/subscriptions/store`, planData);

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 5000,
                        title: "Subscription plan added successfully!",
                    });
                    closeFn();
                } else if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage(
                        "Subscription plan not saved, correct all indicated fields and try again!"
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

    const duration = watch("numberOfMonths");
    const discountType = watch("discountType");
    const discountValue = watch("discountValue");
    const selectedPlanId = watch("subscriptionPlanId");
    const startDate = watch("startDate");

    const selectedPlan = planData?.subscriptionPlans?.find(
        (plan) => String(plan.id) === String(selectedPlanId)
    );

    const pricePerMonth = selectedPlan ? Number(selectedPlan.price) : 0;
    const months = duration ? parseInt(duration) : 0;
    const discount = discountValue ? parseFloat(discountValue) : 0;

    let total = pricePerMonth * months;
    let discountAmount = 0;

    if (discountType === "percentage") {
        discountAmount = (discount / 100) * total;
    } else if (discountType === "amount") {
        discountAmount = discount;
    }

    const grandTotal = total - discountAmount;


    let expirationDate = "";
    if (startDate && months > 0) {
        const start = new Date(startDate);
        const expiry = new Date(start.setMonth(start.getMonth() + months));
        expirationDate = `${expiry.getDate().toString().padStart(2, "0")}-${(expiry.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${expiry.getFullYear()

            }`;
    }



    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 flex justify-center items-center">

            <CardContent style={{ borderRadius: "16px" }}
                className="fixed overflow-hidden left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
                <div className="flex gap-6 mr-[-1.4rem]">
                    <div className="w-full">
                        {!!errorMessage?.length && (
                            <Alert className="alert text-red-900 border-0  bg-[#fee] mb-4">
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
                            <h1 className="text-[1.3rem] font-bold mx-auto">Add New Subscription</h1>
                        </div>

                        <form className="hotelForm text-left"
                            onSubmit={async(e) => {
                                e.preventDefault()
                                const subscriptionInput = getValues();
                                const selectedPlan = planData?.subscriptionPlans?.find(
                                    (plan) => String(plan.id) === String(subscriptionInput.subscriptionPlanId)
                                );
                                const pricePerMonth = selectedPlan ? Number(selectedPlan.price) : 0;
                                const months = subscriptionInput.numberOfMonths ? parseInt(subscriptionInput.numberOfMonths, 10) : 0;
                                const total = pricePerMonth * months;
                                const discountType = subscriptionInput.discountType;
                                const discountValue = parseFloat(subscriptionInput.discountValue);

                                if (discountType === "flat_amount" && discountValue > total) {
                                    setError("discountValue", {
                                        type: "manual",
                                        message: "Flat discount amount cannot exceed total amount",
                                    });
                                    setDisabledButton(false);
                                    return; // stop submission
                                }

                                if (discountType === "percentage" && discountValue > 100) {
                                    setError("discountValue", {
                                        type: "manual",
                                        message: "Percentage discount cannot exceed 100%",
                                    });
                                    setDisabledButton(false);
                                    return;
                                }
                                await handleSubmit(mutate)(e)
                                console.log(e)
                            }}
                        >
                            {/* {JSON.stringify(errors)} */}
                            <div className="mt-4">

                                <div className="mb-2">
                                    <Label htmlFor="name">Subscription Plan</Label>
                                    <br />
                                    <select
                                        id="name"
                                        {...register("subscriptionPlanId")}
                                        className="flex h-10 w-full rounded border border-neutral-200 bg-[#F2F2F5] px-3 py-2 text-sm text-black outline-none"
                                    >
                                        <option value="" disabled selected>Select a subscription plan</option>
                                        {planData?.subscriptionPlans?.map((plan) => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p>{errors.subscriptionPlanId?.message}</p>
                                </div>

                                {/* Dynamic display of plan details */}
                                {selectedPlan && (
                                    <div className="mt-2 text-sm mb-2 text-gray-700 rounded px-2 py-2 bg-[#F1E2D3] border-2 border-[#8D561E]">
                                        <h2 className="flex justify-between text-[0.9rem]">
                                            <b>{selectedPlan.name} Plan</b>
                                            <b>₦{Number(selectedPlan.price).toLocaleString()}.00/month</b>
                                        </h2>
                                        {selectedPlan.description && (
                                            <p className="text-[12px] text-gray-500">{selectedPlan.description}</p>
                                        )}

                                        <div className="py-3">
                                            <b className="text-[0.8rem] mt-2">Included Modules:</b>
                                            <ul>
                                                {selectedPlan.modules.map((module) => (
                                                    <li className="text-[0.8rem] mt-2 list-disc ml-6" key={module.id}>
                                                        {module.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-2">
                                    <Label htmlFor="duration">Duration (months)</Label>
                                    <br />
                                    <Input type="number" {...register("numberOfMonths")} id="duration" />
                                    <p>{errors.numberOfMonths?.message}</p>
                                </div>

                                <div className="mb-2">
                                    <Label htmlFor="discountType">Discount Type</Label>
                                    <br />
                                    <select
                                        {...register("discountType")}
                                        id="discountType"
                                        className="flex h-10 w-full rounded border border-neutral-200 bg-[#F2F2F5] px-3 py-2 text-sm text-black outline-none"
                                    >
                                        <option value="" disabled selected>Select discount type</option>
                                        {planData?.discountOptions &&
                                            Object.entries(planData.discountOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                    </select>
                                    <p>{errors.discountType?.message}</p>
                                </div>

                                <div className="mb-2">
                                    <Label htmlFor="discountValue">Discount Value</Label>
                                    <br />
                                    <Input type="number" id="discountValue" {...register("discountValue")} />
                                    <p>{errors.discountValue?.message}</p>
                                </div>

                                <div className="mb-2">
                                    <Label htmlFor="datePaid">Start Date</Label>
                                    <br />
                                    <Input type="date" {...register("startDate")} id="datePaid" />
                                    <p>{errors.startDate?.message}</p>
                                </div>

                                <div className="mb-2 text-sm text-primary mt-1">
                                    <span>
                                        Expiration Date:
                                    </span>
                                    <span className="ml-2">
                                        {expirationDate ? expirationDate : "Select a start date and duration"}
                                    </span>
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
                    </div>

                    <div className="w-full bg-[#F2F2F5] pt-4">
                        <strong className="text-[1.3rem]">Subscription Summary</strong>
                        <div className="px-4 mt-4">
                            {selectedPlan && months > 0 && (
                                <>
                                    <div className="flex mb-6 justify-between">
                                        <p className="font-bold">
                                            {selectedPlan.name} Plan <br />
                                            <span className="text-[0.7rem] font-light">
                                                ₦{pricePerMonth.toLocaleString()}/month
                                            </span>
                                        </p>
                                        <p>x{months}</p>
                                        <strong>₦{total.toLocaleString()}</strong>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between mb-6">
                                            <p>
                                                Discount{" "}
                                                {discountType === "percentage" ? `(${discount}% off)` : ""}
                                            </p>
                                            <strong className="text-[#1B746E]">
                                                - ₦{discountAmount.toLocaleString()}
                                            </strong>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <p>Grand Total</p>
                                        <strong className="text-primary">₦{grandTotal.toLocaleString()}</strong>
                                    </div>
                                </>
                            )}
                            {!selectedPlan && <p className="text-gray-500 mt-4">No plan selected.</p>}
                        </div>
                    </div>

                </div>
            </CardContent>

        </div>
    );
}
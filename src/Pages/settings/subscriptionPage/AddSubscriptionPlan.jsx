import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { get, post } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";

export default function SubscriptionPlan() {

    const yupBuild = yup.object({
        name: yup.string().required("Name is required").max(50),
        price: yup.string().required("Price is required").max(50),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        getValues,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            name: "",
            price: "",
            modules: []
        },
        resolver: yupResolver(yupBuild),
    });


    const navigate = useNavigate()
    const selectedModules = watch('modules')
    const { toast } = useToast();
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [moduleCategories, setModuleCategories] = useState([])


    const { data: planData, isFetching, refetch: fetchAllPlans } = useQuery({
        queryKey: ["subscription/plans"],
        queryFn: async () => {
            const res = await get(`/subscription-plans/create`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
                // return []
            }
            const response = await res.json();

            setModuleCategories(response.data.modules)

            return response.data.modules;
        },
        enabled: false
    });


    const { data: subscriptionData, refetch: submitSubscription } = useQuery({
        enabled: false,
        queryKey: ["submitSubscription"],
        queryFn: async () => {
            const plansInput = getValues();
            setErrorMessage("");
            setDisabledButton(true);

            try {
                const plans = {
                    name: plansInput.name,
                    price: plansInput.price,
                    modules: [...plansInput.modules]
                };


                const res = await post("/subscription-plans/store", plans);

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 5000,
                        title: "Subscription plan added successfully!",
                    });
                    navigate('/setting/subscriptions')
                } else if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage(
                        "Subscription plan not added, correct all indicated fields and try again!"
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

                setDisabledButton(true);

                return responseData;
            } catch (error) {
                console.log(error);
            }
        },
    });

    useEffect(() => {
        fetchAllPlans()
    }, [fetchAllPlans])


    const handleModuleChange = (moduleId) => {
        const currentModules = getValues("modules"); // Get current modules from the form state
        const updatedModules = currentModules.includes(moduleId)
            ? currentModules.filter((id) => id !== moduleId) // Remove if already selected
            : [...currentModules, moduleId]; // Add if not selected

        setValue("modules", updatedModules);
    };


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/setting/subscriptions')}>Subscription</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add Subscription Plan</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb} />

            {isFetching ?
                (
                    <div className="text-center flex items-center justify-center mx-auto mt-28">
                        <Spinner className="me-3 text-gray-300 h-16 w-16" />
                    </div>
                )
                :

                <form onSubmit={handleSubmit(submitSubscription)}>
                    {/* {JSON.stringify(errors)} */}
                    <div className='w-[95%] m-auto'>
                        <b className='ml-6'>Create Subscription Plan</b>
                        <hr />
                    </div>

                    <Card className='w-[400px] ml-12 my-6'>
                        <div>
                            <Label>Plan Name</Label>
                            <Input {...register("name")} placeholder='Basic Plan' className='border-none mt-1 mb-2' />
                            <p className="text-red-500 mb-2">{errors.name?.message}</p>
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Input {...register("price")} placeholder='₦250,000.00' className='border-none mt-1 mb-2' />
                            <p className="text-red-500 mb-2">{errors.price?.message}</p>
                        </div>
                    </Card>

                    <div className="ml-16 w-[400px]">
                        <b>Available Features</b>
                        <div className="py-3">
                            <ul>
                                {moduleCategories.map((category) => (
                                    <li key={category.id}>
                                        <label>
                                            <input
                                                className="mr-2"
                                                type="checkbox"
                                                value={category.id}
                                                checked={selectedModules.includes(category.id)}
                                                onChange={() => handleModuleChange(category.id)}
                                            />
                                            {category.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                    <Button
                        variant="primary"
                        disabled={disabledButton}
                        type="submit"
                        className="ml-44 mt-6 mb-12 px-20"
                    >
                        {disabledButton ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            }
        </>
    )
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import UserAreaHeader from "@/components/UserAreaHeader";
import { get, put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";




export default function EditSubscriptionPlan() {

    const location = useLocation();
    const { editId } = location.state || {};
    const [errorMessage, setErrorMessage] = useState("");
    const [moduleCategories, setModuleCategories] = useState([]);
    const [selectedModules, setSelectedModules] = useState(editId.modules?.map(module => module.id) || []);
    const navigate = useNavigate()
    const [disabledButton, setDisabledButton] = useState(false);

    const yupBuild = yup.object({
        name: yup.string().required("Name is required").max(50),
        price: yup.string().required("Price is required").max(150)
    });

    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: editId.name || "",
            price: editId.price || "",
            modules: selectedModules
        },
        resolver: yupResolver(yupBuild),
    });

    const { toast } = useToast()

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            setDisabledButton(true);
            const res = await put(`/subscription-plans/${editId.id}/update`, data)

            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: "Data updated successfully!",
                });
                navigate('/setting/subscriptions')
            } else if (res.status.toString().startsWith(4)) {
                setDisabledButton(false);
                setErrorMessage(
                    "Data not updated, correct all indicated fields and try again!"
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
        }
    })


    const { refetch: modulesForPlans, isFetching } = useQuery({
        queryKey: ["modulesForPlans"],
        queryFn: async () => {
            const res = await get(`/subscription-plans/${editId.id}/edit`);
            if (!res.ok) {
                throw new Error("Failed to edit data");
            }
            const response = await res.json();


            const moduleData = response.data.modules;
            setModuleCategories(moduleData);

            return moduleData;
        },
    });

    useEffect(() => {
        modulesForPlans();
    }, [modulesForPlans]);




    const handleModuleChange = (moduleId) => {
        const updatedModules = selectedModules.includes(moduleId)
            ? selectedModules.filter((id) => id !== moduleId)
            : [...selectedModules, moduleId]; // Add if not selected

        setSelectedModules(updatedModules);
        setValue("modules", updatedModules);
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    Setting
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/setting/subscriptions')}>Subscription</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                    <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );



    return (

        <div className="h-full">
            <UserAreaHeader pages={breadcrumb} />

            <CardContent>
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Link to='/setting/subscriptions'>
                    <ArrowLeft className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" />
                </Link>

                {isFetching ? (

                    <div className="text-center mt-28">
                        <Spinner className="text-gray-300 mb-4 mx-auto h-16 w-16" />
                    </div>

                ) : (

                    <form onSubmit={handleSubmit(mutate)}>
                        {/* {JSON.stringify(errors)} */}
                        <div className='w-[95%] m-auto'>
                            <b className='ml-6'>Edit Subscription Plan</b>
                            <hr />
                        </div>

                        <div className='w-[400px] ml-12 my-6 border-none'>
                            <div>
                                <Label>Plan Name</Label>
                                <Input {...register("name")} className='border-none mt-1 mb-2' />
                                <p className="text-red-500 mb-2">{errors.name?.message}</p>
                            </div>
                            <div>
                                <Label>Price</Label>
                                <Input {...register("price")} className='border-none mt-1 mb-2' />
                                <p className="text-red-500 mb-2">{errors.price?.message}</p>
                            </div>
                        </div>

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
                )}

            </CardContent>
        </div>
    );
}
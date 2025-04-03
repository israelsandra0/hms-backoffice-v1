import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/functions";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";

export default function AddRole() {

    const yupBuild = yup.object({
        name: yup.string().required("Name is required").max(50),
        description: yup.string().required("Description is required").max(150)
    });

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        getValues,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            permissions: []
        },
        resolver: yupResolver(yupBuild),
    });

    const selectedPermissions = watch('permissions')
    const [errorMessage, setErrorMessage] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [permissionCategories, setPermissionCategories] = useState([]);

    const { mutate } = useMutation({
        mutationFn: async () => {
            const roleInput = getValues();
            setErrorMessage("");
            setDisabledButton(true);

            try {
                const roleData = {
                    name: roleInput.name,
                    description: roleInput.description,
                    permissions: [...roleInput.permissions]
                };

                const res = await post("/roles/store", roleData);

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 5000,
                        title: 'Data added successfully!'
                    });
                    navigate("/setting/access_control");
                    // Add code to handle success (close modal, navigate, etc.)
                } else if (res.status.toString().startsWith(4)) {
                    setDisabledButton(false);
                    setErrorMessage(
                        "Data not saved, correct all indicated fields and try again!"
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

                if (res.status >= 500) {
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

    const { refetch: fetchPermissions, isFetching } = useQuery({
        queryKey: ["permissions"],
        queryFn: async () => {
            const res = await get(`/roles/create`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();

            const PermissionData = response.data.permissionCategories;
            setPermissionCategories(PermissionData);

            return PermissionData;
        },
    });

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handlePermissionChange = (permissionId) => {
        const currentPermissions = getValues("permissions"); // Get current permissions from the form state
        const updatedPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter((id) => id !== permissionId) // Remove if already selected
            : [...currentPermissions, permissionId]; // Add if not selected

        setValue("permissions", updatedPermissions);
    };



    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    Setting
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/setting/access_control')}>Access Control</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <div className="bg-[#f1f1f1] h-full">
            <UserAreaHeader pages={breadcrumb} />

            <CardContent>
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Link to='/setting/access_control'>
                    <ArrowLeft className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" />
                </Link>

                <form
                    onSubmit={handleSubmit(mutate)}
                    className="hotelForm text-left w-[500px] mx-auto"
                >
                    <div className="mt-4">
                        <div className="mb-2">
                            <Label htmlFor="name">Name</Label>
                            <br />
                            <Input className="bg-white" {...register("name")} id="name" placeholder="name" maxLength='100' />
                            <p>{errors.name?.message}</p>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <br />
                            <Input className="h-16 bg-white" {...register("description")} id="description" placeholder="description" maxLength='100' />
                            <p>{errors.description?.message}</p>
                        </div>
                    </div>
                    <br />

                    <div>
                        <b>Select Role Permissions</b>
                        <hr />
                        {isFetching ? (
                            <div className="text-center mt-4">
                                <Spinner className="text-gray-300 h-16 w-16" />
                                <p>Loading permissions...</p>
                            </div>
                        ) : (
                            <div>
                                {permissionCategories.map((category) => (
                                    <Card key={category.id} className='border mt-6 rounded-[15px]'>
                                        <CardHeader>
                                            <CardTitle>{category.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul>
                                                {category.permissions.map((permission) => (
                                                    <li key={permission.id}>
                                                        <label>
                                                            <input
                                                                className="mr-2"
                                                                type="checkbox"
                                                                value={permission.id}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => handlePermissionChange(permission.id)}
                                                            />
                                                            {permission.name} - {permission.category}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        disabled={disabledButton}
                        type="submit"
                        className="w-full p-[16px] text-[16px] mt-6"
                    >
                        {disabledButton ? "Adding..." : "Add"}
                    </Button>
                </form>
            </CardContent>

        </div>

    );
}

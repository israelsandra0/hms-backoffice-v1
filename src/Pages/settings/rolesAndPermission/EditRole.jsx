import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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




export default function EditRole() {

    const location = useLocation();
    const { editId } = location.state || {};  
    const [errorMessage, setErrorMessage] = useState("");
    const [permissionCategories, setPermissionCategories] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(editId.permissions?.map(permission => permission.id) || []);
    const navigate = useNavigate()

    const yupBuild = yup.object({
        name: yup.string().required("Name is required").max(50),
        description: yup.string().required("Description is required").max(150)
    });

    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: editId.name || "",
            description: editId.description || "",
            permissions: selectedPermissions
        },
        resolver: yupResolver(yupBuild),
    });

    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await put(`/roles/${editId.id}/update`, data)
            if (res.ok) {
                toast({
                    success: true,
                    duration: 5000,
                    title: 'Data updated successfully!'
                });
                navigate('/setting/access_control')

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
                    title: 'Failed to edit detail. Please try again.'
                });
            }
        }
    })


    const { refetch: permissionForRole, isFetching } = useQuery({
        queryKey: ["permissionsForRole"],
        queryFn: async () => {
            const res = await get(`/roles/${editId.id}/edit`);
            if (!res.ok) {
                throw new Error("Failed to edit data");
            }
            const response = await res.json();

            
            const PermissionData = response.data.permissionCategories;
            setPermissionCategories(PermissionData);

            return PermissionData;
        },
    });

    useEffect(() => {
        permissionForRole();
    }, [permissionForRole]);
    

    // Handle permission change
    const handlePermissionChange = (permissionId) => {
        const updatedPermissions = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter((id) => id !== permissionId) // Remove if already selected
            : [...selectedPermissions, permissionId]; // Add if not selected
        
        setSelectedPermissions(updatedPermissions); // Update local state
        setValue("permissions", updatedPermissions); // Update form state
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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    


    return (

        <div>
            <UserAreaHeader pages={breadcrumb} />

            <CardContent>               
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <form
                    onSubmit={handleSubmit(mutate)}
                    className="hotelForm text-left"
                >
                    <div className="mt-4">

                        <div className="mb-2">
                            <Label htmlFor="name">Name</Label>
                            <br />
                            <Input {...register("name")} id="name" maxLength='50' />
                            <p>{errors.name?.message}</p>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="description">Description</Label>
                            <br />
                            <Input {...register("description")} id="description" maxLength='150' />
                            <p>{errors.description?.message}</p>
                        </div>
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
                                        <div key={category.id}>
                                            <h3>{category.name}</h3>
                                            <ul>
                                                {category.permissions.map((permission) => (
                                                    <li key={permission.id}>
                                                        <label>
                                                            <input
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
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <br />
                    <Button variant="primary" type="submit" className="w-full p-[16px] text-[16px]" disabled={isPending}>
                        {isPending ? <Spinner /> : 'continue'}
                    </Button>
                </form>
            </CardContent>
        </div>
    );
}
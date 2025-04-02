import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { get, put } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";



export default function EditRole({ closeFn, editId }) {

    const [errorMessage, setErrorMessage] = useState("");
    const [permissionCategories, setPermissionCategories] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(editId.permissions?.map(permission => permission.id) || []);

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
                    title: 'Failed to edit detail. Please try again.'
                });
            }
        }
    })


    const { refetch: permissionForRole } = useQuery({
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


    return (

        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">

            <CardContent style={{ borderRadius: '16px' }} className='fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950'>
                {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="flex mt-4">
                    <Link>
                        <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn} />
                    </Link>
                    <h1 className="text-[1.3rem] font-bold mx-auto">Edit Role and Permission</h1>
                </div>

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
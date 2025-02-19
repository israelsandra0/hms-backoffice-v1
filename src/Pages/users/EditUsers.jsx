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



export default function EditUserManagement({ closeFn, editId }) {

    const [errorMessage, setErrorMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    // const [roleData, setRoleData] = useState()

    const handleAdminChange = (e) => {
        setIsAdmin(e.target.checked);
        setValue("isAdmin", e.target.checked);
    };

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
    });

    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: editId.firstName || "",
            lastName: editId.lastName || "",
            email: editId.email || "",
            isAdmin: editId.isAdmin || "",
            roleId: editId.roleId || "",
        },
        resolver: yupResolver(yupBuild),
    });

    const { toast } = useToast()

    const { data: editUser, refetch: editUserRequest } = useQuery({
        queryKey: ["editUsers"],
        queryFn: async () => {
            const res = await get(`/users/${editId.id}/edit`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            return response.data;
        },
        enabled: false
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await put(`/users/${editId.id}/update`, data)
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

    useEffect(() => {
        // console.log(editUser)
        editUserRequest()
    }, [])

    const userRoles = editUser?.roles



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
                    <h1 className="text-[1.3rem] font-bold mx-auto">Edit Users</h1>
                </div>

                <form
                    onSubmit={handleSubmit(mutate)}
                    className="hotelForm text-left"
                >
                    <div className="mt-4">

                        <div className="mb-2">
                            <Label htmlFor="firstname">First Name</Label>
                            <br />
                            <Input {...register("firstName")} id="firstname" maxLength='50' />
                            <p>{errors.firstName?.message}</p>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <br />
                            <Input {...register("lastName")} id="lastname" maxLength='50' />
                            <p>{errors.lastName?.message}</p>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <br />
                            <Input {...register("email")} id="email" maxLength='150' />
                            <p>{errors.email?.message}</p>
                        </div>
                        {!isAdmin && (
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <br />

                                <select name='Select role' {...register("roleId")} className="flex h-10 mb-[-16px] w-full rounded border border-neutral-200 bg-[#F2F2F5] px-3 autofill:bg-[#F2F2F5] py-2 text-sm  file:border-0 file:bg-[#F2F2F5] file:text-sm file:font-medium file:text-neutral-950 placeholder:text-[#BBBAC5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-[#F2F2F5] dark:ring-offset-neutral-950 outline-none text-black dark:file:text-neutral-50 dark:placeholder:text-neutral-400 ">
                                    <   option value="" disabled selected>Select a role</option>
                                    {userRoles?.map((data) => (
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
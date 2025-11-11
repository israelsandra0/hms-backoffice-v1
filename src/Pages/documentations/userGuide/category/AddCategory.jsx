import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { post } from "@/functions";
import { toast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function AddCategory({
    setShowModal,
    formType,
    categories,
    fetchCategories,
    closeFn
}) {
    const schema = yup.object({
        name: yup.string().required("Name is required").max(50),
        description: yup.string().nullable(),
        categoryId: yup.number().nullable(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            categoryId: 0,
        },
    });

    const onSubmit = async () => {
        const values = getValues();

        try {
            let endpoint = "";
            let payload = {};

            if (formType === "category") {
                endpoint = "/userguide/categories/store";
                payload = { name: values.name, description: values.description };
            } else {
                endpoint = "/userguide/subcategories/store";
                payload = { name: values.name, category_id: values.categoryId };
            }

            const res = await post(endpoint, payload);
            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Success",
                    description: `New ${formType} added successfully`,
                    duration: 4000,
                });
                reset();
                setShowModal(false);
                fetchCategories();
            } else {
                toast({
                    title: "Error",
                    description: data.message || "",
                    duration: 5000,
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Something went wrong",
                duration: 5000,
            });
        }
    };

    return (
        <div className="fixed -mt-10 inset-x-0 inset-y-0 bg-black/50 h-vh flex justify-center items-center">
            <CardContent className='w-[50%] lg:w-[30%]  rounded-[24px] mx-auto border-none bg-white py-8'>
                <h1 className="text-center"> {formType === "category"
                    ? "Add New Category"
                    : "Add New Subcategory"}</h1>
                <Link>
                    <X className="-mt-6 ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={closeFn} />
                </Link>
                <form className="space-y-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
                    {/* {JSON.stringify(errors)} */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            {formType === "category" ? "Category Name" : "Subcategory Name"}
                        </Label>
                        <Input
                            id="name"
                            placeholder={`Enter ${formType} name`}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {formType === "category" && (
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter category description"
                                {...register("description")}
                            />
                        </div>
                    )}

                    {formType === "subcategory" && (
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Select Parent Category</Label>
                            <select
                                id="categoryId"
                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                                {...register("categoryId")}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-red-500 text-sm">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>
                    )}

                    <Button variant="primary" type="submit" className="rounded-full">
                        Save
                    </Button>
                </form>
            </CardContent>
        </div>
    );
}

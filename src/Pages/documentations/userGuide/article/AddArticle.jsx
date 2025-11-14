import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { get, post } from "@/functions";
import * as React from 'react';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PlateEditor } from "@/components/plate-editor";
import { Toaster } from "sonner";



const initialValue = [
    {
        children: [{ text: 'Title' }],
        type: 'h3',
    },
    {
        children: [{ text: 'This is a quote.' }],
        type: 'blockquote',
    },
    {
        children: [
            { text: 'With some ' },
            { bold: true, text: 'bold' },
            { text: ' text for emphasis!' },
        ],
        type: 'p',
    },
];



export default function AddArticle() {
    const navigate = useNavigate();
    const [disabledButton, setDisabledButton] = useState(false)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [editorValue, setEditorValue] = useState([]);

    const schema = yup.object({
        title: yup.string().required("Title is required").max(50),
        content: yup.mixed().required("Content is required"),
        category_id: yup.number().required("Category is required").typeError("Category is required"),
        subcategory_id: yup.number().nullable(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            category_id: "",
            subcategory_id: null
        },
    });

    //Load categories on page load
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await get("/userguide/categories");
                const data = await res.json();

                console.log("categories", data)
                setCategories(data);
            } catch (err) {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to load categories",
                });
            }
        }
        fetchCategories();
    }, []);

    const selectedCategoryId = watch("category_id");

    useEffect(() => {
        if (selectedCategoryId) {
            const selected = categories.find(c => c.id == selectedCategoryId);
            setSubcategories(selected ? selected.subcategories : []);
        } else {
            setSubcategories([]);
        }
    }, [selectedCategoryId, categories]);


    const onSubmit = async (values) => {
        setDisabledButton(true);

        try {
            // Convert IDs to numbers or null
            const categoryId = Number(values.category_id)
            const subcategoryId =
                values.subcategory_id && values.subcategory_id !== ""
                    ? Number(values.subcategory_id)
                    : null;

            // Validate subcategory belongs to category
            if (subcategoryId && !subcategories.some((s) => s.id === subcategoryId)) {
                toast({
                    title: "Error",
                    description: "Please select a valid subcategory for the chosen category.",
                    duration: 4000,
                });
                setDisabledButton(false);
                return;
            }

            const inputData = {
                title: values.title,
                content: values.content,
                category_id: categoryId,
                subcategory_id: subcategoryId,
            };

            console.log("Submitting article:", inputData);

            const res = await post("/userguide/articles/store", inputData);
            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Success",
                    description: "New article added successfully",
                    duration: 4000,
                });
                reset();
                navigate("/documentations/user_guide");
            } else {
                let message = "Failed, Something went wrong";

                if (message.includes("foreign key constraint fails")) {
                    message = "Select a value.";
                }

                toast({
                    title: "Error",
                    description: message,
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
        } finally {
            setDisabledButton(false);
        }
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate("/Documentations/user_guide")}>User Guide</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add Article </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <TooltipProvider>
            <UserAreaHeader pages={breadcrumb} />
            <div className="flex flex-col items-center justify-center w-full px-4">
                <div className="w-full max-w-2xl">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white rounded-2xl shadow-md p-6 space-y-6 border"
                    >
                        {/* Title */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <Input placeholder="Enter article title" {...register("title")} />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                {...register("category_id")}
                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Select a category</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-500 text-sm">{errors.category_id.message}</p>
                            )}
                        </div>

                        {/* Subcategory */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Subcategory</label>
                            <select
                                {...register("subcategory_id")}
                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option >Select a subcategory</option>
                                {subcategories.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-[400px] w-full">
                            <PlateEditor
                                value={editorValue}
                                onChange={(newValue) => {
                                    setEditorValue(newValue);
                                    console.log('new value',JSON.stringify(newValue.value))
                                    setValue("content", JSON.stringify(newValue.value), { shouldValidate: true });
                                }}
                            />
                            <Toaster />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/setting/user_guide")}
                            >
                                Save as Draft
                            </Button>
                            <Button type="submit" variant="primary">
                                {disabledButton ? "Publishing..." : "Publish"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </TooltipProvider>
    );

}

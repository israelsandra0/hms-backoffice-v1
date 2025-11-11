import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import AddCategory from "./AddCategory";
import { get } from "@/functions";

export default function Category() {
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("");

    const openModal = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    const {
        data: categories,
        error,
        isLoading,
        isFetching,
        refetch: fetchCategories,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await get("/userguide/categories");
            if (!res.ok) {
                throw new Error("Failed to fetch categories"); 
            }
            const response = await res.json();
            return response; 
        },
    });

    if (isLoading || isFetching) {
        return (
            <div className="text-center flex items-center justify-center mx-auto mt-28">
                <Spinner className="me-3 text-gray-300 h-16 w-16" />
            </div>
        );
    }

    if (!categories?.length) {
        return (
            <div className="mt-6">
                <div className="text-right mr-4 mb-8">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-full" variant="primary">
                                + Add
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openModal("category")}>
                                Add Category
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openModal("subcategory")}>
                                Add Subcategory
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Card className="p-4 text-center">
                    <p>No category found!</p>
                </Card>

                {/* Modal */}
                {!!showModal && (
                    <AddCategory
                        showModal={showModal}
                        setShowModal={setShowModal}
                        formType={formType}
                        categories={[]}
                        fetchCategories={fetchCategories}
                    />
                )}
            </div>
        );
    }

    const handleClose = () => {
        setShowModal(false)
        fetchCategories()
    }

    const handleEdit = (id) => console.log("Edit category:", id);
    const handleDelete = (id) => console.log("Delete category:", id);

    return (
        <div className="space-y-6">
            <div className="flex justify-end mr-6 mt-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" variant="primary">
                            + Add
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openModal("category")}>
                            Add Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openModal("subcategory")}>
                            Add Subcategory
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mx-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20%]">Category Name</TableHead>
                            <TableHead className="w-[40%]">Description</TableHead>
                            <TableHead className="w-[30%]">Subcategories</TableHead>
                            <TableHead className="w-[10%] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.description ?? <i>—</i>}</TableCell>
                                <TableCell>
                                    {cat.subcategories?.length > 0 ? (
                                        <ul className="list-disc ml-4">
                                            {cat.subcategories.map((sub) => (
                                                <li key={sub.id}>{sub.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <i className="text-gray-400">None</i>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(cat.id)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(cat.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {!!showModal && (
                <AddCategory
                    showModal={showModal}
                    setShowModal={setShowModal}
                    formType={formType}
                    categories={categories}
                    fetchCategories={fetchCategories}
                    closeFn={handleClose}
                />
            )}
        </div>
    );
}

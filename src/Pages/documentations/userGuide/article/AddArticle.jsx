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

export default function AddArticle() {
    const navigate = useNavigate();

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate("/setting/user_guide")}>User Guide</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add Article </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <>
            <UserAreaHeader pages={breadcrumb} />
            <div className="flex flex-col items-center justify-center w-full px-4 ">
                <div className="w-full max-w-2xl">

                    <form className="bg-white rounded-2xl shadow-md p-6 space-y-6 border">
                        {/* Title */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <Input placeholder="Enter article title" />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="" className="text-gray-400">
                                    Select a category
                                </option>
                                <option value="category-one">Category One</option>
                                <option value="category-two">Category Two</option>
                            </select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Subcategory</label>
                            <select
                                name="category"
                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="" className="text-gray-400">
                                    Select a subcategory
                                </option>
                                <option value="category-one">Sub One</option>
                                <option value="category-two">Sub Two</option>
                            </select>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Content</label>
                            <Input
                                placeholder="Write your content here..."
                                className="min-h-[150px]"
                            />
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
                            <Button variant="primary">Publish</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

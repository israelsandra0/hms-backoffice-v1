import UserAreaHeader from "@/components/UserAreaHeader";
import { get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlateEditor } from "@/components/plate-editor";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Spinner from "@/components/ui/spinner";

export default function ContentPage() {
    const { id } = useParams()

    const {
        data: showContent,
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ["content", id],
        queryFn: async () => {
            const res = await get(`/userguide/articles/${id}/show`);
            if (!res.ok) throw new Error("Failed to load content");
            return await res.json();
        },
    });


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate("/documentations/user_guide")}>User Guide</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>View Article </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    if (isLoading || isFetching) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Spinner className="text-gray-400 h-12 w-12" />
            </div>
        );
    }
    if (error) return <p>Error loading content</p>;
    if (!showContent) return <p>No content found</p>;



    return (
        <TooltipProvider>
            <div>
                <UserAreaHeader pages={breadcrumb} />

                <h1  className="text-center">Article's Content</h1>

                <div className="h-[400px] w-full">
                    <PlateEditor
                        readOnly={true}
                        value={JSON.parse(showContent.content ?? "[]")}
                    />
                    <Toaster />
                </div>
            </div>
        </TooltipProvider>
    );
}

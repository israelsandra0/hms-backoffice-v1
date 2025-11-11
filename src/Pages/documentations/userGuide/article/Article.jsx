import Pagination from "@/components/Pagination";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import Spinner from "@/components/ui/spinner";
import { get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Article() {
    const navigate = useNavigate();

    const {
        data: articles,
        error,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const res = await get("/userguide/articles");
            if (!res.ok) throw new Error("Failed to fetch articles");
            return res.json();
        },
    });

    if (isLoading || isFetching) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Spinner className="text-gray-400 h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-500">
                <p>Failed to load articles. Please try again.</p>
            </div>
        );
    }

    if (!articles?.length) {
        return (
            <div className="flex flex-col items-center justify-center text-center mt-24">
                <div className="bg-gray-100 w-[170px] h-[170px] rounded-full flex items-center justify-center">
                    <Shield className="w-[90px] h-[90px] text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-6 mb-2">No Articles Found</h1>
                <p className="text-gray-500 mb-6">
                    You haven’t added any articles yet.
                </p>
                <ButtonLink to="/documentations/user_guide/add" variant="primary">
                    Add New Article
                </ButtonLink>
            </div>
        );
    }

    return (
        <div className="px-6 py-8">

            <div className="flex justify-end mb-6">
                <ButtonLink to="/documentations/user_guide/add" variant="primary">
                    Add Article
                </ButtonLink>
            </div>

            <div className="space-y-10 max-w-3xl mx-auto">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <header className="mb-4">

                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                {article.title}
                            </h2>

                            <div className="flex justify-between">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    {article?.subcategory && (
                                        <span className="capitalize">{article.subcategory.name}</span>
                                    )}
                                    {article?.subcategory && (
                                        <ArrowRight className="mx-2 text-gray-400 w-3 h-3" />
                                    )}
                                    <span className="font-medium text-gray-700">
                                        {article.category?.name}
                                    </span>
                                    <p className="ml-6 text-gray-500 text-sm">
                                        {new Date(article.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    Edit
                                </Button>
                            </div>
                        </header>
                    </article>
                ))}
            </div>
        </div>
    );
}

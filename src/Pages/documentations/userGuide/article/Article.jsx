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
            {/* Header + Add button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">All Articles</h1>
                <ButtonLink to="/documentations/user_guide/add" variant="primary">
                    Add Article
                </ButtonLink>
            </div>

            {/* Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                {article.title}
                            </h2>

                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
                                {article?.subcategory && (
                                    <>
                                        <span className="capitalize">{article.subcategory.name}</span>
                                        <ArrowRight className="mx-2 text-gray-400 w-3 h-3" />
                                    </>
                                )}
                                <span className="font-medium text-gray-700">
                                    {article.category?.name}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {article.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <p className="text-xs text-gray-400">
                                {new Date(article.updatedAt).toLocaleDateString()}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/documentations/user_guide/edit/${article.id}`)}
                            >
                                Edit
                            </Button>
                        </div>
                    </article>
                ))}
            </div>

            {/* Optional Pagination */}
            {/* <Pagination /> */}
        </div>
    );
}

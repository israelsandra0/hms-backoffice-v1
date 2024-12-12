import { ChevronLeft, ChevronRight } from "lucide-react";
import ResponsivePaginationComponent from "react-responsive-pagination";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Pagination({table, pageIndex, setPageIndex}){

    const goToPreviousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    };

    const goToNextPage = () => {
        if (pageIndex < table.getPageCount() - 1) {
            setPageIndex(pageIndex + 1);
        }
    };



    return(
        <>
            {table.getPageCount() > 1 && (
                <div className="flex justify-between mt-8 pb-12 mx-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={pageIndex === 0}
                    >
                        <ChevronLeft className="h-4"/>
                        Previous
                    </Button>

                    <ResponsivePaginationComponent
                        renderNav={false}
                        total={table.getPageCount()}
                        current={pageIndex + 1}
                        onPageChange={page => setPageIndex(page - 1)}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={pageIndex === (table.getPageCount() - 1)}
                    >
                        Next
                        <ChevronRight className="h-4"/>
                    </Button>
                </div>
            )}
        </>
    )
}
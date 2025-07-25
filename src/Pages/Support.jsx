import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function Support() {

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Support and Help</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb}/>
            <div>
                <h1 className=" mt-8 font-bold text-[1.5rem] text-center">No Available Content !</h1>
            </div>
        </>
    )
}
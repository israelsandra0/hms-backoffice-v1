import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";

export default function AccessControl() {

    const navigate = useNavigate()

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/hotels')}>Hotels</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Setting / Access Control</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb} />
            <div>
                <h1 className=" mt-8 font-bold text-[1.5rem] text-center">No Available Content !</h1>
            </div>
        </>
    )
}
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import UserAreaHeader from "@/components/UserAreaHeader";

export default function Dashboard(){

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <div>
            <UserAreaHeader pages={breadcrumb}/>
            <h1>Dashboard</h1>
        </div>
    )
}
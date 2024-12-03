import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import UserAreaHeader from "@/components/UserAreaHeader";

export default function Users() {

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <>
            <UserAreaHeader pages={breadcrumb}/>
            <div>
                <h1>Users</h1>
            </div>
        </>
    )
}
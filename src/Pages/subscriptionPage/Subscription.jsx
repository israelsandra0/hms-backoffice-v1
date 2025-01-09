import UserAreaHeader from "@/components/UserAreaHeader";
import SubscriptionImg from "@/components/icons/SubscriptionImg";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";

export default function Subscription() {

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Subscription</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb}/>
            <div className='mx-auto my-auto grid place-items-center text-center'>
                <div className="bg-grey w-[170px] grid place-items-center pt-4 h-[170px] rounded-[50%]">
                    <SubscriptionImg className=''/>
                </div>
                <div className="p-4">
                    <b  className='text-[24px]'>No Subscription Yet</b>
                    <p className='text-gray-500 w-[450px] text-center'>
                        No subscription created yet. Get started by setting
                        up tailored subscription plans for your clients.
                    </p>
                </div>
                <ButtonLink to="/subscriptions/subscription_plan" variant="primary">
                    Create Subscription Plan
                </ButtonLink>
            </div>
        </>
    )
}
import UserAreaHeader from "@/components/UserAreaHeader";
import SubscriptionImg from "@/components/icons/SubscriptionImg";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button_link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";

export default function SubscriptionPlan() {

    const navigate = useNavigate()

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/subscriptions')}>Subscription</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Subscription Plan</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb} />
            <div>
                <div className='w-[95%] m-auto'>
                    <b className='ml-6'>Create Subscription Plan</b>
                    <hr />
                </div>

                <Card className='w-[400px] ml-12 my-6'>
                    <div>
                        <Label>Plan Name</Label>
                        <Input placeholder='Basic Plan' className='border-none mt-1 mb-4' />
                    </div> 
                    <div>
                        <Label>Price</Label>
                        <Input placeholder='₦250,000.00' className='border-none mt-1'/>
                    </div>
                </Card>

                <div className="ml-10 w-[400px]">
                    <b>Available Features</b>
                    <div className="py-3">
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Room availability and booking management
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Guest profile creation management
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Check-in and check-out processing
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Daily occupancy reports
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Role-based access control
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Multi-location property management
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Management of facilities eg: spa, resturant, gym
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Revenue tracking and reporting
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Real time inventory tracking
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                API access for custom tools
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Staff unboarding and training modules
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Housekeeping task assignment and tracking
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                24/7 technical support
                            </label>
                        </div>
                        <div className="py-2 flex items-center">
                            <Checkbox className="data-[state=checked]:bg-primary rounded" id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Data encryption for guest and payment information
                            </label>
                        </div>
                    </div>

                    <ButtonLink to="" variant="primary" className="ml-44 mt-6 mb-12 px-20">
                        Create Plan
                    </ButtonLink>
                </div>
            </div>
        </>
    )
}
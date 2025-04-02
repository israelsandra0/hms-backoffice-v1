import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button_link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AddSubscriptionPage() {

    const navigate = useNavigate()

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link onClick={() => navigate('/hotels')}>Hotels</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <Link onClick={() => navigate("/hotels/view/62?active=Subscription+Plan")}>Subscription</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Add Subscription Plan</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <>
            <UserAreaHeader pages={breadcrumb} />

            <div>
                <div className='w-[95%] m-auto'>
                    <b className='ml-6'>Add Subscription</b>
                    <hr />
                </div>

                <Card className='w-[400px] ml-12 my-6 '>
                    <div>
                        <Select>
                            <Label>Select Subscription Plan</Label>
                            <SelectTrigger className="w-full bg-grey border-none mb-4 text-gray-400 rounded mt-1">
                                <SelectValue placeholder="Basic Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">Basic Plan</SelectItem>
                                    <SelectItem value="banana">Standard Plan</SelectItem>
                                    <SelectItem value="blueberry">Premium Plan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select>
                            <Label>Duration</Label>
                            <SelectTrigger className="w-full mb-4 bg-grey border-none text-gray-400 rounded mt-1">
                                <SelectValue placeholder="Monthly" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">Monthly</SelectItem>
                                    <SelectItem value="banana">Quarterly</SelectItem>
                                    <SelectItem value="blueberry">Annually</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Discount</Label>
                        <Input placeholder='Enter discount code here' className='border-none mt-1' />
                    </div>

                    <ButtonLink variant="primary" className='flex justify-center mt-4'>
                        + New Subscription
                    </ButtonLink>
                </Card>
            </div>

        </>
    )
}
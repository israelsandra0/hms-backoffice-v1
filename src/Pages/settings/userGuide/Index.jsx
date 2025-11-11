import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import UserAreaHeader from "@/components/UserAreaHeader";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Article from "./article/Article";
import Category from "./category/Category";


export default function UserGuide() {

    const validTabs = [
        "Articles",
        "Categories",
    ];

    const [activeTab, setActiveTab] = useState("Articles");

    const changeActiveTab = (newTab) => {
        setActiveTab(newTab);
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>User Guide </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />

            <div>
                <Tabs className="w-full" value={activeTab}>
                    <TabsList className="w-[95%] ml-6 px-2 rounded-[3rem]">
                        {validTabs.map((tab) => (
                            <TabsTrigger
                                className="w-[50%] rounded-[3rem] py-1 my-6"
                                value={tab}
                                key={tab}
                                onClick={() => changeActiveTab(tab)}
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="border border-b-0 border-l-0 border-r-0 mt-4">
                        <TabsContent value="Articles">
                            <Card>
                                <Article />
                            </Card>
                        </TabsContent>
                        <TabsContent value="Categories">
                            <Card>
                                <Category />
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
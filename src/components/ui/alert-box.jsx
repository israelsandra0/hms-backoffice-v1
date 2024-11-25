import { Check, Eraser, Info } from "lucide-react";
import { Button } from "./button";
import { ButtonLink } from "./button_link";

export default function AlertBox({title, message, confirm, cancel}) {
    return (
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <div className="w-[380px] grid grid-rows-[1fr,auto] h-[230px] bg-white p-5 border-none rounded-[1.5rem]">
                <div className="text-center">
                    <Info className="bg-[#FEECEB] text-[#DF362B] mb-2 rounded-full p-[10px] w-[40px] h-[40px] mx-auto" />
                    <h2 className="text-[1.7rem]">{title}</h2>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>

                <div className="flex justify-center gap-2">
                    <Button  className="w-full" variant="outline" onClick={cancel}>Cancel</Button>
                    <ButtonLink  className="w-full" variant="error" onClick={confirm}>
                        Delete
                    </ButtonLink>
                </div>

            </div>
        </div>
    )
}
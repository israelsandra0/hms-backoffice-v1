import { Check, Eraser, Info, Power } from "lucide-react";
import { Button } from "./button";
import Spinner from "./spinner";

export default function AlertBox({
    title,
    message,
    confirmFn,
    cancelFn,
    cancelButtonText,
    confirmButtonText,
    buttonVariant,
    boxIcon,  
    isProcessing  
}) {
    return (
        
        <div className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
            <div className="w-[350px] grid grid-rows-[1fr,auto] h-[230px] bg-white p-4 border-none rounded-[1.5rem]">
                {isProcessing && isProcessing === true && (
                    <div className="text-center flex items-center justify-center mx-auto my-5">
                        <Spinner className="me-3 text-gray-300 h-16 w-16" />
                    </div>
                )}
                <div className={`${isProcessing && isProcessing === true && 'hidden'}`}>
                    <div className="text-center mb-8">
                        <Info
                            className={` ${boxIcon
                                    ? "hidden"
                                    : "bg-[#FEECEB] text-[#DF362B] mb-2 rounded-full p-[10px] w-[40px] h-[40px] mx-auto"
                            } `}
                        />
                        <h2 className="text-[1.3rem] font-bold mb-2">{title}</h2>
                        {message?.length && (
                            <p className="text-sm text-gray-600">{message}</p>
                        )}
                    </div>

                    <div className="flex justify-center gap-2">
                        <Button className="w-full" variant="outline" onClick={cancelFn}>
                            {cancelButtonText ?? "Cancel"}
                        </Button>
                        <Button
                            className={`w-full`}
                            variant={buttonVariant}
                            onClick={confirmFn}
                        >
                            {confirmButtonText ?? "Confirm"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

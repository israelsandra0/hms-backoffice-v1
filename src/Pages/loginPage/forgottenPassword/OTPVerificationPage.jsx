import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

export default function VerificationPage() {

    const navigate = useNavigate()

    return (
        <>
            <div className="grid place-items-center gap-12 mt-8">
                {/* {!!errorMessage?.length && (
                    <Alert className="alert text-red-900 border-0 h-full w-[320px]  bg-[#fee]">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )} */}

                <Card className="w-2/5 static rounded-[15px] p-4 mt-8">
                    <CardHeader>
                        <CardTitle className="loginText text-center text-[1.8rem]">
                            Verify OTP
                        </CardTitle>
                        <p className="text-center text-[1rem]">
                            Kindly provide the 6-digits OTP that has been sent to  your email
                            address isr********gmail.com to cofirm this process.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex gap-2 text-center justify-center mt-8">
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                                <p className="w-10 p-1 bg-grey text-gray-500 text-center rounded">0</p>
                            </div>
                            <div>
                                <p className="text-center text-[12px] mt-4">
                                    Didn't get the code?{" "}
                                    <Link className="text-[#8D561E]">Resend</Link>
                                </p>
                            </div>
                            <br />
                            <Button
                                variant="primary"
                                onClick={() => navigate("/reset_password")}
                                // disabled={!!disabledButton}
                                type="submit"
                                className=" w-full p-[16px] rounded-r-[1.3rem] rounded-l-[1.3rem] text-[16px]"
                            >
                                {/* {disabledButton ? "Submitting..." : "Submit"}Submit */}Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

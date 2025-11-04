import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { post } from "@/functions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import OTPInput from "otp-input-react"
import ResetPassPage from "../resetPassword/ResetPassPage"

export default function VerificationPage({ email }) {
    const [OTP, setOTP] = useState("")
    const [disabledButton, setDisabledButton] = useState(false)
    const [showResetPage, setShowResetPage] = useState(false)

    // Function to mask the email like "isr***@gmail.com"
    const maskEmail = (email) => {
        if (!email) return ""
        const [user, domain] = email.split("@")
        const maskedUser = user.length > 3 ? `${user.slice(0, 3)}***` : `${user[0]}***`
        return `${maskedUser}@${domain}`
    }

    const { mutate } = useMutation({
        mutationFn: async () => {
            setDisabledButton(true)

            try {
                const verifyData = {
                    email,
                    code: OTP,
                }

                const res = await post("/auth/verify_otp", verifyData)
                const responseData = await res.json()

                if (res.ok) {
                    toast({
                        success: true,
                        duration: 4000,
                        title: responseData.message,
                    })
                    setShowResetPage(true)
                } else {
                    toast({
                        error: true,
                        duration: 4000,
                        title: responseData.message,
                    })
                }

                setDisabledButton(false)
                return responseData
            } catch (error) {
                console.error("Verification error:", error)
                setDisabledButton(false)
                toast({
                    error: true,
                    duration: 4000,
                    title: "An error occurred while verifying OTP.",
                })
            }
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (OTP.length !== 6) {
            toast({
                error: true,
                duration: 3000,
                title: "Please enter a valid 6-digit OTP.",
            })
            return
        }
        mutate()
    }

    if (showResetPage) return <ResetPassPage email={email} />

    return (
        <div className="grid place-items-center gap-12 mt-8">
            <Card className="w-2/5 static rounded-[15px] p-4 mt-8">
                <CardHeader>
                    <CardTitle className="loginText text-center text-[1.8rem]">
                        Verify OTP
                    </CardTitle>
                    <p className="text-center text-[1rem]">
                        Kindly provide the 6-digit OTP that was sent to
                        <span className="font-semibold"> {maskEmail(email)} </span>
                        to confirm this process.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center mt-8">
                            <OTPInput
                                value={OTP}
                                onChange={setOTP}
                                autoFocus
                                OTPLength={6}
                                otpType="number"
                                disabled={disabledButton}
                                inputClassName="border rounded w-10 h-10 text-center mx-1"
                            />
                        </div>

                        <p className="text-center text-[12px] mt-4">
                            Didn’t get the code?{" "}
                            <Link className="text-[#8D561E]" to="#">
                                Resend
                            </Link>
                        </p>

                        <br />
                        <Button
                            variant="primary"
                            disabled={disabledButton}
                            type="submit"
                            className="w-full p-[16px] rounded-r-[1.3rem] rounded-l-[1.3rem] text-[16px]"
                        >
                            {disabledButton ? "Verifying..." : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

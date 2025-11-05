import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button_link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/functions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const schema = yup.object({
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum 6 characters")
        .max(12, "Maximum 12 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function ResetPassPage({ email }) {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);

    const maskEmail = (email) => {
        const [user, domain] = email.split("@")
        const maskedUser = user.length > 3 ? `${user.slice(0, 3)}***` : `${user[0]}***`
        return `${maskedUser}@${domain}`
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    
    const onSubmit = async (data) => {
        setDisabledButton(true);

        try {
            const res = await fetch("http://localhost:3330/auth/reset_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: data.password,
                }),
            });

            let responseData = {};
            try {
                responseData = await res.json();
            } catch {
                responseData = {};
            }

            if (res.ok) {
                toast({
                    success: true,
                    duration: 4000,
                    title: responseData.message || "Password reset successfully!",
                });
                navigate("/");
            } else {
                toast({
                    error: true,
                    duration: 4000,
                    title: responseData.message || "Failed to reset password.",
                });
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast({
                error: true,
                duration: 4000,
                title: "An unexpected error occurred.",
            });
        }

        setDisabledButton(false);
    };


    return (
        <>
            <div className="grid place-items-center gap-12 mt-8">
                <Card className="w-2/5 static rounded-[15px] p-4">
                    <CardHeader>
                        <CardTitle className="loginText text-center mb-2 text-[#8D561E]">
                            Create a new password
                        </CardTitle>
                        <p>
                            Kindly provide a new password for
                            <span className="font-semibold"> {maskEmail(email)} </span>
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid w-full items-center gap-4 login">
                                {/* <div className="flex flex-col space-y-1.5">
                                    <Input
                                        maxLength={50}
                                        {...register("email")}
                                        type="hidden"
                                        placeholder="info@atslng.com"
                                        id="email"
                                    />
                                    <p className="text-red-600 text-sm">{errors.email?.message}</p>
                                </div> */}

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        maxLength={50}
                                        {...register("password")}
                                        type="password"
                                        placeholder="Enter new password"
                                        id="password"
                                    />
                                    <p className="text-red-600 text-sm">{errors.password?.message}</p>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        maxLength={50}
                                        {...register("confirmPassword")}
                                        type="password"
                                        placeholder="Confirm password"
                                        id="confirmPassword"
                                    />
                                    <p className="text-red-600 text-sm">{errors.confirmPassword?.message}</p>
                                </div>
                            </div>

                            <br />
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-full p-[16px] text-[16px]"
                                disabled={disabledButton}
                            >
                                {disabledButton ? "Verifying..." : "Submit"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

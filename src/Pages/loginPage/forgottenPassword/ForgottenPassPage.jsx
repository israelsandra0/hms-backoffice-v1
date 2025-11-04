import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/functions";
import { toast, useToast } from "@/hooks/use-toast";
import VerificationPage from "./OTPVerificationPage";

export default function ForgottenPassPage() {

	const navigate = useNavigate()
	const [showVerification, setShowVerification] = useState(false);
	const [userEmail, setUserEmail] = useState("")
	const [dbError, setDbError] = useState("")


	const yupBuild = yup.object({
		email: yup.string().required("User email is required").email()
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm({
		defaultValues: { email: "" },
		resolver: yupResolver(yupBuild),
	});

	const [disabledButton, setDisabledButton] = useState(false);

	const { mutate } = useMutation({
		mutationFn: async () => {
			const userInput = getValues();
			
			setDisabledButton(true);

			try {
				const loginData = {
					email: userInput.email
				};

				const res = await post('/auth/sendotp', loginData);
				const responseData = await res.json();

				if (res.ok) {
					toast({
						success: true,
						duration: 5000,
						title: responseData.message
					});

					setUserEmail(userInput.email)
					setShowVerification(true);

				} else {
					// toast({
					// 	error: true,
					// 	duration: 5000,
					// 	title: responseData.message
					// });

					setDbError(responseData.message)
				}

				console.log('toast', responseData)

				// setData(AUTH_DATA_KEY, responseData.data);

				// await getAuthUser();

				// setTimeout(() => (window.location.href = "/dashboard"), 100);

				setDisabledButton(false);
				return responseData;
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<>
			{showVerification ? (
				<VerificationPage email={userEmail} />  
			) : (
				<div className="grid place-items-center gap-12 mt-8">
					<Card className="w-2/5 static rounded-[15px] p-4 mt-8">
						<CardHeader>
							<CardTitle className="loginText text-center text-[1.8rem]">
								Forgot your password?
							</CardTitle>
							<p className="text-center text-[1rem]">
								Enter your email address to receive password reset instructions.
							</p>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(mutate)}>
								<div className="flex flex-col space-y-1.5 mt-8">
									<Label htmlFor="email">Email</Label>
									<Input
										maxLength="50"
										{...register("email")}
										type="email"
										placeholder="info@atslng.com"
										id="email"
									/>
									<p className="text-red-700">{errors.email?.message ? errors.email?.message : dbError}</p>
									{/* <p className="text-red-700">{dbError}</p> */}
								</div>
								<br />
								<Button
									variant="primary"
									disabled={!!disabledButton}
									type="submit"
									className="w-full p-[16px] rounded-r-[1.3rem] rounded-l-[1.3rem] text-[16px]"
								>
									{disabledButton ? "Submitting..." : "Submit"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);

}

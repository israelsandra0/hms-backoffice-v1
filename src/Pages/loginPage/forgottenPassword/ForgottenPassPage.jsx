import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

export default function ForgottenPassPage() {

    const navigate = useNavigate()
	
	const yupBuild = yup.object({
		email: yup.string().required("user email is required").email()
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

	const [errorMessage, setErrorMessage] = useState("");

	// //for disabling button after first click
	const [disabledButton, setDisabledButton] = useState(false);

	// async function getAuthUser() {
	// 	try {
	// 		const response = await get('/auth/me');

	// 		const { data } = await response.json();

	// 		setData(USER_DATA_KEY, data);
	// 	} catch (error) {
	// 		console.log(error);
	// 	} finally {
	// 		console.log("done");
	// 	}
	// }

	// const { mutate } = useMutation({
    //     mutationFn: async () => {
	// 		const userInput = getValues();

	// 		setErrorMessage();
	// 		setDisabledButton(true);

	// 		try {
	// 			const loginData = {
	// 				email: userInput.email
	// 			};

	// 			const res = await post('/auth/login', loginData);

	// 			if (res.status.toString().startsWith(4)) {
	// 				setDisabledButton(false);
	// 				setErrorMessage("invalid credentials"); 

	// 				const responseErrors = await res.json();

	// 				if (responseErrors?.message) {
	// 					setErrorMessage(responseErrors.message); 
	// 				}

	// 				return null;
	// 			}
	// 			if (res.status >= 500) {
	// 				setDisabledButton(false);
	// 				setErrorMessage("An error occurred, please try again");
	// 				return null;
	// 			}
	// 			const responseData = await res.json();

	// 			setData(AUTH_DATA_KEY, responseData.data);

	// 			await getAuthUser();

	// 			setTimeout(() => (window.location.href = "/dashboard"), 100);

	// 			setDisabledButton(true);
	// 			return responseData;
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	},
	// });

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
							Forgot your password?
						</CardTitle>
						<p className="text-center text-[1rem]">Enter your email address to receive password reset instructions.</p>
					</CardHeader>
					<CardContent>
						<form>
							<div className="flex flex-col space-y-1.5 mt-8">
								
								<Label htmlFor="email">Email</Label>
								<Input
									maxLength='50'
									{...register("email")}
									type="email"
									placeholder="info@atslng.com"
									id="email"
								/>
								<p className="text-red-700">{errors.username?.message}</p>
							</div>
							<br />
							<Button
								variant="primary"
                                onClick={() => navigate("/forgotten_password/verification")}
								disabled={!!disabledButton}
								type="submit"
								className=" w-full p-[16px] rounded-r-[1.3rem] rounded-l-[1.3rem] text-[16px]"
							>
								{disabledButton ? "Submitting..." : "Submit"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

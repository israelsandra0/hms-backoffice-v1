import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { AUTH_DATA_KEY, USER_DATA_KEY } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { UAParser } from "ua-parser-js";
import { BACKEND_URL } from "@/constants";
import { encode, get, post, setData } from "@/functions";
import { Link, Navigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import PasswordField from "@/components/ui/password-field";

export default function LoginPage() {
	//yup builder for input error msg
	const yupBuild = yup.object({
		email: yup.string().required("user email is required").email(),
		password: yup.string().required("password is required").min(5).max(20),
	});

	//destructured hook form
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		control
	} = useForm({
		defaultValues: { email: "", password: "" },
		resolver: yupResolver(yupBuild),
	});

	// alert error message
	const [errorMessage, setErrorMessage] = useState("");

	//for disabling button after first click
	const [disabledButton, setDisabledButton] = useState(false);

	async function getAuthUser() {
		try {
			const response = await get(`${BACKEND_URL}/auth/me`);
			console.log(response);

			const { data } = await response.json();

			setData(USER_DATA_KEY, data);
		} catch (error) {
			console.log(error);
		} finally {
			console.log("done");
		}
	}

	const { refetch } = useQuery({
		enabled: false, //disables it from executing immediately
		queryKey: ["login"],
		queryFn: async () => {
			const userInput = getValues();

			//getting user device details
			let parser = new UAParser(window.navigator.userAgent);
			let parserResults = parser.getResult();

			setErrorMessage();

			setDisabledButton(true);

			try {
				const loginData = {
					email: userInput.email,
					password: userInput.password,
					deviceDetails: {
						deviceName: !parserResults?.device?.name
							? "unknown"
							: `${parserResults.device.vendor} - ${parserResults.device.model} (${parserResults.device.type}) `,
						os: `${parserResults.os.name} ${parserResults.os.version}`,
						browserName: `${parserResults.browser.name} ${parserResults.browser.version}`,
					},
				};

				const res = await post(`${BACKEND_URL}/auth/login`, loginData);

				if (res.status.toString().startsWith(4)) {
					setDisabledButton(false);
					setErrorMessage("invalid credentials");

					return null;
				}
				if (res.status === 500) {
					setDisabledButton(false);
					setErrorMessage("An error occurred, please try again");
					return null;
				}
				const responseData = await res.json();

				setData(AUTH_DATA_KEY, responseData.data);

				await getAuthUser();

				setTimeout(() => (window.location.href = "/dashboard"), 100);

				setDisabledButton(true);
				return responseData;
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<>
			<div className="grid place-items-center gap-12 mt-8">
				{!!errorMessage?.length && (
					<Alert className="alert text-red-900 border-0 h-full w-[320px]  bg-[#fee]">
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}

				<Card className="w-2/5 static rounded-[15px] p-4">
					<CardHeader>
						<CardTitle className="loginText text-center mb-2 text-[#8D561E]">
							Login
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(refetch)}>
							<div className="grid w-full items-center gap-4 login">
								<div className="flex flex-col space-y-1.5">
									{/* registers the username as a data */}
									<Label htmlFor="email">Email</Label>
									<Input
										{...register("email")}
										type="email"
										placeholder="info@atslng.com"
										id="email"
									/>
									<p className="text-red-700">{errors.username?.message}</p>
								</div>

								<div className="flex flex-col space-y-1.5">
									<div>
										<Label htmlFor="password">Password</Label>
										<p className="float-right text-[12px] reset">
											Forgotten password?{" "}
											<Link className="text-[#8D561E]">Reset it</Link>
										</p>
									</div>
									{/* <Input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    id="password"
                  /> */}

									<Controller 
										name="password"
										control={control}
										render={({ field }) => <PasswordField {...field} />}
									/>
									
									<p className="text-red-700">{errors.password?.message}</p>

								</div>
							</div>
							<br />
							<Button
								variant="primary"
								disabled={!!disabledButton}
								type="submit"
								className=" w-full p-[16px] text-[16px]"
							>
								{disabledButton ? "Submitting..." : "Log In"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

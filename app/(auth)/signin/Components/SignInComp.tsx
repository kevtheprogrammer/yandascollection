"use client";
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import FormikInput from "@/components/features/FormikField";

import { triggerAlert } from "@/store/reducers/appReducer";
import { useAppDispatch } from "@/store/hooks";

let LoginSchema = Yup.object({
	email: Yup.string().required("First name is required."),
	password: Yup.string().required("Password is required."),
});

export default function SignInComp() {
	const [serverError, setServerError] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleAlert = ({ title, text, icon }: AlertType) => {
		dispatch(
			triggerAlert({
				title: title,
				text: text,
				icon: icon,
			})
		);
	};

	const handleSubmit = async (values: any, { setSubmitting }: any) => {
		setLoading(true);
		setServerError("");

		const signin = await signIn("credentials", {
			redirect: false,
			email: values.email,
			password: values.password,
		});

		console.log("Signin Response:", signin);

		if (signin?.error) {
			dispatch(
				triggerAlert({
					title: "Signin Error",
					text: signin.error, // comes from authorize()
					icon: "error",
				})
			);
			setServerError(signin.error);
		} else {
			dispatch(
				triggerAlert({
					title: "Signin Success",
					text: "Welcome back! You have successfully signed in.",
					icon: "success",
				})
			);
			router.push(callbackUrl);
		}

		setLoading(false);
		setSubmitting(false);
	};

	return (
		<Formik
			initialValues={{
				email: "",
				password: "",
			}}
			validationSchema={LoginSchema}
			onSubmit={handleSubmit}
		>
			{({
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
				/* and other goodies */
			}) => (
				<form
					className=" mt-8 "
					onSubmit={handleSubmit}
					method="post"
				>
					<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
						<div className="sm:mx-auto sm:w-full sm:max-w-md">
							<img
								alt="Your Company"
								src="logo.png"
								className="mx-auto h-10 w-auto "
							/>
							<h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
								Sign in to your account
							</h2>
						</div>

						<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] ">
							<div className="bg-white space-y-6 px-6 py-12 shadow-sm sm:rounded-lg gap-10 sm:px-12">
								{serverError && (
									<p className="text-sm text-red-500 dark:text-red-500">
										{serverError}
									</p>
								)}

								<FormikInput
									label="Email"
									name="email"
									onChange={handleChange}
									onBlur={handleBlur}
									type="email"
									placeholder="example@domain.com"
								/>

								<FormikInput
									name="password"
									placeholder="Password"
									label="Password"
								/>

								<div className="flex items-center justify-between">
									<div className="flex gap-3">
										<div className="flex h-6 shrink-0 items-center">
											<div className="group grid size-4 grid-cols-1">
												<input
													id="remember-me"
													name="remember-me"
													type="checkbox"
													className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-pink-600 checked:bg-pink-600 indeterminate:border-pink-600 indeterminate:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
												/>
												<svg
													fill="none"
													viewBox="0 0 14 14"
													className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
												>
													<path
														d="M3 8L6 11L11 3.5"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
														className="opacity-0 group-has-checked:opacity-100"
													/>
													<path
														d="M3 7H11"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
														className="opacity-0 group-has-indeterminate:opacity-100"
													/>
												</svg>
											</div>
										</div>
										<label
											htmlFor="remember-me"
											className="block text-sm/6 text-gray-900"
										>
											Remember me
										</label>
									</div>

									<div className="text-sm/6">
										<a
											href="#"
											className="font-semibold text-gray-600 hover:text-pink-500"
										>
											Forgot password?
										</a>
									</div>
								</div>

								<div className="space-y-4">
									<button
										type="submit"
										disabled={isSubmitting}
										className="gap-3 flex w-full justify-center align-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										<span>Sign in</span>
										<span>
											{loading ? (
												<svg
													aria-hidden="true"
													role="status"
													className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-white"
													viewBox="0 0 100 101"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
														fill="currentColor"
													></path>
													<path
														d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
														fill="#1C64F2"
													></path>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-5 h-5 rtl:-scale-x-100"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</span>
									</button>
									<button
										type="button"
										disabled={isSubmitting}
										onClick={() => router.push("/signup")}
										className="flex w-full justify-center align-center rounded-md border-red-600 px-3 py-1.5 text-sm/6 font-semibold text-red shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										<span>Register</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);  
}

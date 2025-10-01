"use client";

import { useEffect, useState } from "react";

import { TrashIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCart, fetchCart } from "@/store/actions/cartActions";
import { RootState } from "@/store";
import { useAppContext } from "@/context/AppProvider";
import * as Yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import FormikInput from "@/components/features/FormikField";

import { createOrder } from "@/store/actions/orderActions";
import LoadingCompPop from "@/components/app/LoadingCompPop";
import Link from "next/link";

 

const validationSchema = Yup.object({
	// customerId: Yup.string().required("Product name is required"),
	email: Yup.string().required("email is required"),
	firstName: Yup.string().required("first name is required"),
	lastName: Yup.string().required("last name is required"),
	address: Yup.string().required("address is required"),
	company: Yup.string(),
	city: Yup.string().required("city is required"),
	country: Yup.string().required("country is required"),
	province: Yup.string().required("province is required"),
	postalAdd: Yup.string().required("postal address is required"),
	phone: Yup.string().required("phone is required"),
	shipping: Yup.number().positive("shipping fee must be a positive number"),
	tax: Yup.number().positive("tax must be a positive number"),
	total: Yup.number().positive("total must be a positive number"),
	cartItems: Yup.array().of(
		Yup.object().shape({
			id: Yup.number().required("Please select product quantity"),
		})
	),
});

export default function CheckOutComp() {

	// const { appAlert } = useAppContext();
	 
	const [loading, setLoading] = useState(true);

	const dispatch = useAppDispatch();
	const router = useRouter();

	const cart = useAppSelector((state: RootState) => state.cart.cart);

	// const user  = useAppSelector((state: RootState) => state.user.account) as any
	const tax = useAppSelector((state: RootState) => state.cart.tax);
	const total = useAppSelector((state: RootState) => state.cart.total);
	const shipping = useAppSelector((state: RootState) => state.cart.shipping);


	useEffect(() => {
		dispatch(fetchCart()).then(() => setLoading(false));
	}, [dispatch]);

	if (loading) return <LoadingCompPop />;

	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Checkout</h2>

				<Formik
					enableReinitialize
					validationSchema={validationSchema}
					initialValues={{
						// customerId: user?.id,
						email: "",
						firstName: "",
						lastName: "",
						phone: "",
						address: "",
						city: "",
						country: "Zambia",
						province: "",
						postalAdd: "",
						shipping: shipping || 0,
						tax: (tax / 100) * total || 0,
						total: total,
						cartItems:
							cart?.items?.map((item: any) => ({
								id: item.id,
							})) || [],
					}}
					onSubmit={async (values) => {
						try {
							setLoading(true);
							console.log('values:',values)
							dispatch(createOrder(values,router))
								.then(() => setLoading(false))
								.then(() => {
									// router.push("/checkout/payments");
								});
							// clear cart items
						} catch (error) {
							console.error("Request failed:", error);
						}
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleSubmit,
						handleBlur,
						isSubmitting,
					}) => (
						<form
							onSubmit={handleSubmit}
							className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
						>
							<div>
								{Object.keys(touched).length > 0 &&
									Object.keys(errors).length > 0 && (
										<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
											<ul className="list-disc list-inside text-sm text-red-700">
												{Object.entries(errors).map(([field, message]) => (
													<li key={field}>
														{typeof message === "string"
															? message
															: "Invalid value"}
													</li>
												))}
											</ul>
										</div>
									)}

								<div className="mt-10 border-t border-gray-200 pt-10">
									<h2 className="text-lg font-medium text-gray-900">
										Shipping information
									</h2>

									<div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
										<FormikInput
											label="email"
											name="email"
											onChange={handleChange}
											onBlur={handleBlur}
											type="email"
										/>
										<FormikInput
											label="First Name"
											name="firstName"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
										/>
										<FormikInput
											label="Last Name"
											name="lastName"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
										/>
										<FormikInput
											label="phone"
											name="phone"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
											autoComplete="tel"
										/>
										<FormikInput
											label="address"
											name="address"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
											autoComplete="street-address"
										/>
										<FormikInput
											label="city"
											name="city"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
										/>
										<FormikInput
											label="province"
											name="province"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
										/>
										<FormikInput
											label="postal code"
											name="postalAdd"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
										/>{" "}
										<FormikInput
											label="country"
											name="country"
											onChange={handleChange}
											onBlur={handleBlur}
											type="text"
											disabled={true}
										/>
									</div>
								</div>

								{/* <div className="mt-10 border-t border-gray-200 pt-10">
									<h2 className="text-lg font-medium text-gray-900">
										Payment method
									</h2>

									<fieldset
										aria-label="Delivery method"
										className="mt-4"
									>
										<div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
											{deliveryMethods.map((deliveryMethod) => (
												<label
													key={deliveryMethod.id}
													aria-label={deliveryMethod.title}
													aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
													className="group relative flex rounded-lg border border-gray-300 bg-white p-4 has-checked:outline-2 has-checked:-outline-offset-2 has-checked:outline-pink-600 has-focus-visible:outline-3 has-focus-visible:-outline-offset-1 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
												>
													<input
														defaultValue={deliveryMethod.id}
														defaultChecked={
															deliveryMethod === deliveryMethods[0]
														}
														name="delivery-method"
														type="radio"
														className="absolute inset-0 appearance-none focus:outline-none"
													/>
													<div className="flex-1">
														<span className="block text-sm font-medium text-gray-900">
															{deliveryMethod.title}
														</span>
														<span className="mt-1 block text-sm text-gray-500">
															{deliveryMethod.turnaround}
														</span>
														<span className="mt-6 block text-sm font-medium text-gray-900">
															{deliveryMethod.price}
														</span>
													</div>
													<CheckCircleIcon
														aria-hidden="true"
														className="invisible size-5 text-pink-600 group-has-checked:visible"
													/>
												</label>
											))}
										</div>
									</fieldset>
								</div> */}
							</div>

							{/* Order summary */}
							<div className="mt-10 lg:mt-0">
								<h2 className="text-lg font-medium text-gray-900">
									Order summary
								</h2>

								<div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
									<h3 className="sr-only">Items in your cart</h3>
									<ul
										role="list"
										className="divide-y divide-gray-200"
									>
										{cart?.items?.map((item: any) => (
											<li
												key={item.id}
												className="flex px-4 py-6 sm:px-6"
											>
												<div className="shrink-0">
													<img
														alt={item?.product?.imageUrl}
														src={item?.product?.imageUrl}
														className="w-20 rounded-md"
													/>
												</div>

												<div className="ml-6 flex flex-1 flex-col">
													<div className="flex">
														<div className="min-w-0 flex-1">
															<h4 className="text-lg capitalize">
																{item?.product?.name}
															</h4>
															<p className="mt-1 text-sm text-gray-500">
																size: {item?.size}
															</p>
														</div>

														<div className="ml-4 flow-root shrink-0">
															<button
																type="button"
																onClick={() => {
																	dispatch(deleteCart(item?.id));
																	// pass an alert
																	// setAppAlert({
																	// 	live: true,
																	// 	status: "success",
																	// 	title: "Remove an Item from cart",
																	// 	msg: "removed with success 1 item from cart, This item can not be retrieved from the server.",
																	// });
																}}
																className="-m-2.5 cursor-pointer flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
															>
																<span className="sr-only">Remove</span>
																<TrashIcon
																	aria-hidden="true"
																	className="size-5"
																/>
															</button>
														</div>
													</div>

													<div className="flex flex-1 items-end justify-between pt-2">
														<p className="mt-1 text-sm font-medium text-gray-900">
															ZMW {item?.product?.price} * {item?.quantity}{" "}
														</p>

														<div className="ml-4  text-pink-500">
															<p>ZMW {item?.product?.price * item?.quantity}</p>
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>
									{/* <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
										<div className="flex items-center justify-between">
											<dt className="text-sm">Subtotal</dt>
											<dd className="text-sm font-medium text-gray-900">
												K{total}
											</dd>
										</div>
										<div className="flex items-center justify-between">
											<dt className="text-sm">Shipping</dt>
											<dd className="text-sm font-medium text-gray-900">
												K{shipping}
											</dd>
										</div>
										<div className="flex items-center justify-between">
											<dt className="text-sm">Taxes</dt>
											<dd className="text-sm font-medium text-gray-900">
												K{(tax / 100) * total}
											</dd>
										</div>
										<div className="flex items-center justify-between border-t border-gray-200 pt-6">
											<dt className="text-base font-medium">Total</dt>
											<dd className="text-base font-bold text-pink-500 text-bold ">
												K{total + shipping + (tax / 100) * total}
											</dd>
										</div>
									</dl> */}

									<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
										<button
											disabled={isSubmitting}
											type="submit"
											className="w-full flex flex-row justify-center gap-3 rounded-md border border-transparent bg-pink-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
										>
											<span>Proceed to Payment</span>
											{isSubmitting ? (
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
										</button>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
}

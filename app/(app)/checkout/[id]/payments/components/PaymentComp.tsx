"use client";
import LoadingComp from "@/components/app/LoadingComp";
import FormikInput from "@/components/features/FormikField";
import { RootState } from "@/store";
import { deleteCart } from "@/store/actions/cartActions";
import { fetchOrderDetails } from "@/store/actions/orderActions";
import { createPayment } from "@/store/actions/payments";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const paymentMethods = [
	// { id: "bank", title: "Bank" },
	{
		id: "airtel-money",
		title: "Airtel Money ",
	},
];

export default function PaymentComp({ id }: { id: any }) {
	const [loading, setLoading] = useState(true);
	const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
	const router = useRouter();

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchOrderDetails(id)).then(() => setLoading(false));
	}, [id, dispatch]);

	const ord = useAppSelector((state: RootState) => state.cart.selected_order);
	//filter only pending orders
	const order = ord?.status === "PENDING" ? ord : null;

	if (loading) return <LoadingComp />;

	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
				<Formik
					enableReinitialize
					initialValues={{
						paymentMethod: "AIRTELMONEY",
						photo: "",
						charge: "",
						orderId: order?.id || "",
						amount: 
							order?.orderItems?.reduce(
								(acc: number, item: any) =>
									acc + item.cartItem?.product?.price* item.cartItem?.quantity,
								0
							) || "",
					}}
					validationSchema={Yup.object({
						paymentMethod: Yup.string().required("Please select a payment method"),
						photo: Yup.mixed(),
						orderId: Yup.string().required("Order ID is required"),
						amount: Yup.number().required("Amount is required").min(1),
					})}
					onSubmit={async (values) => {
						try {
							setLoading(true);
							const formData = new FormData();
							formData.append(
								"data",
								JSON.stringify({
									paymentMethod: values.paymentMethod,
									 
									charge: values.charge,
									orderId: values.orderId,
									amount: values.amount,
								})
							);
							if (values.photo) {
								formData.append("files", values.photo);
							}

							dispatch(createPayment(formData));
							router.push("/checkout/order-history");
						} catch (error) {
							console.error("Request failed:", error);
						} finally {
							setLoading(false);
						}
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						setFieldValue,
						handleSubmit,
						handleBlur,
						isSubmitting,
					}) => (
						<form
							onSubmit={handleSubmit}
							className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
						>
							<div>
								{/* Delivery Method */}
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

								{/* Payment Method */}
								<div className="mt-10 border-t border-gray-200 pt-10">
									<h2 className="text-lg font-medium text-gray-900">Payment</h2>

									<fieldset className="mt-4">
										<legend className="sr-only">Payment type</legend>
										<div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
											{paymentMethods.map((paymentMethod) => (
												<div
													key={paymentMethod.id}
													className="flex items-center"
												>
													<input
														checked={selectedPayment === paymentMethod.id}
														onChange={() =>
															setSelectedPayment(paymentMethod.id)
														}
														id={paymentMethod.id}
														name="payment-type"
														type="radio"
														className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-600"
													/>
													<label
														htmlFor={paymentMethod.id}
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														{paymentMethod.title}
													</label>
												</div>
											))}
										</div>
									</fieldset>

									{/* Conditional Inputs */}
									{selectedPayment === "bank" ? (
										<div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6"></div>
									) : (
										<div className="mt-6">
											<label
												htmlFor="receipt"
												className="block text-sm font-medium text-gray-700"
											>
												Upload transaction receipt (screenshot)
											</label>
											<p>
												step 1. make payments to +260975840604 (Miyanda Hatyoka)
											</p>
											<p>
												step 2. take a screenshot of the successful payment.
											</p>
											<p>step 3. upload the transaction here.</p>

											<p>
												please make sure to show the sender of the text for
												clarity.
											</p>
											<br />
											<FormikInput
												label="Amount"
												name="amount"
												type="number"
												disabled
											/>
											 
											<input
												id="photo"
												name="photo"
												type="file"
												onChange={(event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      // set value in Formik
      setFieldValue("photo", file);
    }
												}}
  className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-pink-700"
	/>
										</div>
									)}
								</div>
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
										{order?.orderItems?.map((item: any, idx: number) => (
											<li
												key={idx}
												className="flex px-4 py-6 sm:px-6"
											>
												<div className="shrink-0">
													<img
														alt={item?.cartItem?.product?.name}
														src={item?.cartItem?.productImage?.media?.[0]?.url}
														className="w-20 rounded-md"
													/>
												</div>

												<div className="ml-6 flex flex-1 flex-col">
													<div className="flex">
														<div className="min-w-0 flex-1">
															<h4 className="text-lg capitalize">
																{item?.cartItem?.product?.name}
															</h4>
															<p className="mt-1 text-sm text-gray-500">
																size: {item?.cartItem?.size?.size} (
																{item?.cartItem?.size?.range})
															</p>
														</div>

														<div className="ml-4 flow-root shrink-0">
															<button
																type="button"
																onClick={() => dispatch(deleteCart(item?.id))}
																className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
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
															ZMW {item?.cartItem?.product?.price} ×{" "}
															{item?.cartItem?.quantity}
														</p>

														<div className="ml-4 text-pink-500">
															<p>
																ZMW{" "}
																{item?.cartItem?.product?.price *
																	item?.cartItem?.quantity}
															</p>
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>

									<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
										<button
											type="submit"
											className="w-full flex flex-row justify-center gap-3 rounded-md border border-transparent bg-pink-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
										>
											<span>Submit Payment</span>
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

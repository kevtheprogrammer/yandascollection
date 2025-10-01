"use client";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { Heading, Subheading } from "@/components/heading";
import { useAppContext } from "@/context/AppProvider";
import { RootState } from "@/store";

import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as Yup from "yup";
import LoadingComp from "@/components/app/LoadingComp";
import {
	createProducts,
	fetchProduct,
	fetchProducts,
	updateProducts,
} from "@/store/actions/productActions";
import { fetchCategory, fetchSizes } from "@/store/actions/productAttrAction";
import Link from "next/link";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/16/solid";
import FormikInput from "@/components/features/FormikField";
import { Select } from "@/components/select";


export default function ProductActionComp({ id }: { id?: number }) {
	const appContext = useAppContext();
	// const setAppAlert = appContext.setAppAlert;
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	const isEditMode = !!id;

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (id) dispatch(fetchProduct(id)).finally(() => setLoading(false));
		dispatch(fetchCategory());
		dispatch(fetchSizes()).finally(() => setLoading(false));
	}, [id, dispatch]);

	const category: any = useAppSelector(
		(state: RootState) => state.products.category
	);

	const sizes: any = useAppSelector(
		(state: RootState) => state.products.product_sizes
	);

	const product = useAppSelector(
		(state: RootState) => state.products.selected_product
	);

	const handleSubmit = async (values: any, { setSubmitting }: any) => {
		try {
			const formData = new FormData();
			formData.append(
				"data",
				JSON.stringify({
					name: values.name,
					price: values.price,
					stock: values.stock,
					categoryId: values.categoryId,
					discount: values.discount,
					isPublished: values.isPublished,
					description: values.description,
					productImages: values.productImages,
				})
			);

			if (values.productImages && Array.isArray(values.productImages)) {
				values.productImages.forEach((group: any) => {
					group.mediaFiles.forEach((file: any) => {
						formData.append("files", file);
					});
				});
			}

			// const res = await fetch(`/business/products/api/${id}`, {
			// 	method: "PATCH",
			// 	body: formData,
			// });
			if (isEditMode) {
				//update product
				dispatch(updateProducts(formData, id));
			} else {
				// create new product
				dispatch(createProducts(formData)).then(()=>fetchProducts());
			}

			router.push("/business/products");
		} catch (error) {
			console.log("Error: ", error);
			// show alert here
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <LoadingComp />;

	return (
		<Formik
			initialValues={{
				name: product?.name || "",
				price: product?.price?.toString() || "",
				discount: product?.discount?.toString() || "",
				description: product?.description || "",
				stock: product?.stock?.toString() || "",
				categoryId: product?.categoryId?.toString() || "",
				productImages:
					Array.isArray(product?.images) && product.images.length > 0
						? product.images.map((img: any) => ({
								id: img.id,
								colorCode: img.colorCode || "",
								name: img.name || "",
								mediaFiles: [] as File[], // for uploading new images
								media: [],
								previewUrls: Array.isArray(img?.media)
									? img.media.map((m: any) => m.url)
									: [],
								stocks:
									Array.isArray(img?.stock) && img.stock.length > 0
										? img.stock.map((s: any) => ({
												id: s.id,
												sizeId: s.size?.id?.toString() || "",
												stock: s.stock?.toString() || "",
												sizeLabel: s.size?.size || "",
												range: s.size?.range || "",
										  }))
										: [
												{
													sizeId: "",
													stock: "",
													sizeLabel: "",
													range: "",
												},
										  ],
						  }))
						: [
								{
									colorCode: "",
									name: "",
									mediaFiles: [] as File[],
									previewUrls: [],
									stocks: [{ sizeId: "", stock: "", sizeLabel: "", range: "" }],
								},
						  ],
			}}
			validationSchema={Yup.object({
				name: Yup.string().required(),
				price: Yup.number().required(),
				discount: Yup.number(),
				description: Yup.string().required(),
				stock: Yup.number().required(),
				categoryId: Yup.string().required(),

				productImages: Yup.array().of(
					Yup.object().shape({
						colorCode: Yup.string().required(),
						name: Yup.string().required(),

						mediaFiles: !isEditMode
							? Yup.array()
									.min(1, "Upload at least one image")
									.required("Image is required")
							: Yup.array(),
						stocks: Yup.array().of(
							Yup.object().shape({
								sizeId: Yup.string().required("Size is required"),
								stock: Yup.number().min(0).required("Stock is required"),
							})
						),
					})
				),
			})}
			onSubmit={handleSubmit}
			enableReinitialize={true}
		>
			{({
				isSubmitting,
				values,
				handleSubmit,
				handleChange,
				setFieldValue,
			}) => (
				<form
					method="post"
					onSubmit={handleSubmit}
					className="mx-auto max-w-4xl"
				>
					<div className="flex flex-row justify-between">
						<div>
							<Heading>Create Product</Heading>
						</div>
						<Button href={`/stock/`}>Add Media & Stock</Button>
					</div>
					<div className="max-lg:hidden">
						<Link
							href="/business/products"
							className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
						>
							<ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
							Product List{" "}
							{isEditMode
								? ` / Update ${product?.name}`
								: " / Create New Product"}
						</Link>
					</div>

					<Divider className="my-10 mt-6" />

					<Subheading>Product Details</Subheading>
					<section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
						{category ? (
							<Select
								name="categoryId"
								onChange={handleChange}
							>
								<option value="" >select category</option>
								{category.map((item:any, idx:number)=>(
									<option key={idx} value={item.id}>{item.name}</option>
								))}								
							</Select>
						) : (
							<p>Loading category...</p>
						)}

						<FormikInput
							label="Name"
							name="name"
						/>
						<FormikInput
							label="price"
							name="price"
						/>
						<FormikInput
							label="Discount"
							name="discount"
						/>
						<FormikInput
							label="Description"
							name="description"
							type="text"
							onChange={handleChange}
						/>
						<FormikInput
							label="stock"
							name="stock"
						/>
					</section>

					<Divider className="my-5" />

					<Subheading className="mb-6">Product Media & Stock</Subheading>

					<FieldArray name="productImages">
						{({ push, remove }) => (
							<>
								{values.productImages.map((group: any, groupIndex: any) => (
									<div
										key={groupIndex}
										className="border border-zinc-300 mb-6 p-4 rounded-lg space-y-6 bg-white shadow"
									>
										<div className="grid grid-cols-1 gap-4">
											{/* Upload UI */}
											<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
												<div className="flex flex-col items-center justify-center pt-5 pb-6">
													<svg
														className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 20 16"
													>
														<path
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
														/>
													</svg>
													<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
														<span className="font-semibold">
															Click to upload
														</span>
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														SVG, PNG, JPG or GIF (MAX. 800x400px)
													</p>
												</div>
												<input
													type="file"
													multiple
													accept="image/*"
													className="hidden"
													onChange={(e) => {
														const files = e.currentTarget.files;
														if (!files) return;

														const fileArray = Array.from(files);
														const previews = fileArray.map((file) =>
															URL.createObjectURL(file)
														);

														setFieldValue(
															`productImages[${groupIndex}].mediaFiles`,
															[...group.mediaFiles, ...fileArray]
														);
														setFieldValue(
															`productImages[${groupIndex}].previewUrls`,
															[...group.previewUrls, ...previews]
														);
													}}
												/>
											</label>
											<ErrorMessage
												name={`productImages.${groupIndex}.mediaFiles`}
												component="div"
												className="text-red-500 text-sm"
											/>

											{/* Image Previews */}
											<div className="flex flex-wrap gap-4 mt-4">
												{group.previewUrls.map((url: any, imgIndex: any) => (
													<div
														key={imgIndex}
														className="relative w-32 h-32 border rounded overflow-hidden"
													>
														<img
															src={url}
															alt={`Preview ${imgIndex}`}
															className="object-cover w-full h-full"
															onError={(e) =>
																(e.currentTarget.src = "/placeholder.jpg")
															}
														/>
														<button
															type="button"
															onClick={() => {
																const newPreviews = [...group.previewUrls];
																const newFiles = [...group.mediaFiles];
																newPreviews.splice(imgIndex, 1);
																newFiles.splice(imgIndex, 1);
																setFieldValue(
																	`productImages[${groupIndex}].mediaFiles`,
																	newFiles
																);
																setFieldValue(
																	`productImages[${groupIndex}].previewUrls`,
																	newPreviews
																);
															}}
															className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-75"
														>
															&times;
														</button>
													</div>
												))}
											</div>

											<div className="grid grid-cols-2 gap-4">
												<FormikInput
													label="Color"
													type="color"
													name={`productImages.${groupIndex}.colorCode`}
												/>
												<FormikInput
													label="Color Name"
													name={`productImages.${groupIndex}.name`}
												/>
											</div>

											{/* Stocks FieldArray */}
											<FieldArray name={`productImages.${groupIndex}.stocks`}>
												{({ push, remove }) => (
													<div className="space-y-4">
														{group.stocks.map(
															(stock: any, stockIndex: number) => (
																<>
																	<div
																		key={stockIndex}
																		className="flex gap-4 items-center"
																	>
																		<Field
																			as="select"
																			name={`productImages.${groupIndex}.stocks.${stockIndex}.sizeId`}
																			className="w-32 border px-2 py-1 rounded"
																		>
																			<option value="">Select Size</option>
																			{sizes?.map((s: any) => (
																				<option
																					key={s?.id}
																					value={s?.id}
																				>
																					{s?.size}
																				</option>
																			))}
																		</Field>
																		<Field
																			name={`productImages.${groupIndex}.stocks.${stockIndex}.stock`}
																			type="number"
																			placeholder="Stock"
																			className="w-24 border px-2 py-1 rounded"
																		/>
																		<Button
																			type="button"
																			onClick={() => remove(stockIndex)}
																		>
																			<TrashIcon className="w-4 h-4" />
																		</Button>
																	</div>
																	<ErrorMessage
																		name={`productImages.${groupIndex}.stocks.${stockIndex}.sizeId`}
																		component="div"
																		className="text-red-500 text-sm"
																	/>
																	<ErrorMessage
																		name={`productImages.${groupIndex}.stocks.${stockIndex}.stock`}
																		component="div"
																		className="text-red-500 text-sm"
																	/>
																</>
															)
														)}
														<Button
															type="button"
															color="green"
															onClick={() => push({ sizeId: "", stock: "" })}
														>
															+ Add Size
														</Button>
													</div>
												)}
											</FieldArray>

											<div className="text-right">
												<Button
													type="button"
													color="red"
													onClick={() => remove(groupIndex)}
												>
													Remove Group
												</Button>
											</div>
										</div>
									</div>
								))}

								<Button
									type="button"
									color="green"
									onClick={() =>
										push({
											colorCode: "",
											name: "",
											mediaFiles: [] as File[],
											previewUrls: [] as string[],
											stocks: [{ sizeId: "", stock: "" }],
										})
									}
								>
									+ Add Product Image Group
								</Button>
							</>
						)}
					</FieldArray>

					<div className="flex justify-end gap-4">
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={isSubmitting}
						>
							<span>{isEditMode ? "Update Product" : "Save products"}</span>
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
						</Button>
					</div>
				</form>
			)}
		</Formik>
	);
}

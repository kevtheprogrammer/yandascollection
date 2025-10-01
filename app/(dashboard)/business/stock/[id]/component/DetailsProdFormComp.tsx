"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import * as Yup from "yup";

import { RootState } from "@/store";
import { useAppContext } from "@/context/AppProvider";
import LoadingComp from "@/components/app/LoadingComp";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Heading, Subheading } from "@/components/heading";
import { Input } from "@/components/input";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

export default function StockDetailsComp({ id }: { id: number }) {
	const [loading, setLoading] = useState(true);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	// const { setAppAlert } = useAppContext();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const size = useAppSelector(
		(state: RootState) => state.products.product_sizes
	);
	const product = useAppSelector(
		(state: RootState) => state.products.selected_product
	);

	// useEffect(() => {
	// 	dispatch(fetchPublicSizesList());
	// 	dispatch(fetchPublicProductDetails(id)).finally(() => setLoading(false));
	// }, [id]);

	if (loading) return <LoadingComp />;

	const initialValues = {
		productId: id,
		productImages: [
			{
				colorCode: "",
				name: "",
				mediaFiles: [] as File[],
				previewUrls: [] as string[],
				stocks: [{ sizeId: "", stock: "" }],
			},
		],
	};

	const validationSchema = Yup.object({
		productId: Yup.number().required(),
		productImages: Yup.array().of(
			Yup.object().shape({
				colorCode: Yup.string().required(),
				name: Yup.string().required(),
				mediaFiles: Yup.array()
					.min(1, "Upload at least one image")
					.required("Size is required"),
				stocks: Yup.array().of(
					Yup.object().shape({
						sizeId: Yup.string().required("Size is required"),
						stock: Yup.number().min(0).required("Stock is required"),
					})
				),
			})
		),
	});

	const handleSubmit = async (values: any) => {
		const formData = new FormData();
 
		formData.append(
			"data",
			JSON.stringify({
				productId: values.productId,
				productImages: values.productImages.map(
					({ mediaFiles, previewUrls, ...rest }:any) => rest
				),
			})
		);

		// Append all media files from all image groups
		values.productImages.forEach((group:any) => {
			group.mediaFiles.forEach((file:any) => {
				formData.append("files", file);
			});
		});

		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}
		const res = await fetch("/api/stock", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		if (res.ok) {
			router.push("/business/stock");
		} else {
			// setAppAlert({
			// 	type: "error",
			// 	message: data.message || "Failed to create product media",
			// });
		}	
		
	};

	return (
		<>
			<div className="max-lg:hidden">
				<Link
					href="/business/stock"
					className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
				>
					<ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
					Stock
				</Link>
			</div>

			<div className="mt-4 flex flex-wrap items-end justify-between gap-4">
				<div className="flex flex-wrap items-center gap-6">
					<div className="w-32 shrink-0">
						<img
							className="aspect-3/2 rounded-lg shadow-sm"
							src={product.images?.[0]?.url || "/placeholder.jpg"}
							alt={product.name}
						/>
					</div>
					<div>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
							<Heading>{product.name}</Heading>
							<Badge color={product.isPub ? "lime" : "zinc"}>
								{product.isPub ? "Published" : "Draft"}
							</Badge>
						</div>
						<div className="mt-2 text-sm text-zinc-500">
							ZMW {product.price - product.discount}
						</div>
					</div>
				</div>
			</div>

			<Subheading className="mt-12">Add Stock</Subheading>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ values, handleSubmit, setFieldValue }) => (
					<form
						onSubmit={handleSubmit}
						method="post"
						className="space-y-8 mt-6"
					>
						<FieldArray name="productImages">
							{({ push, remove }) => (
								<>
									{values.productImages.map((group, groupIndex) => (
										<div
											key={groupIndex}
											className="border p-4 rounded-lg space-y-6 bg-white shadow"
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
													{group.previewUrls.map((url, imgIndex) => (
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
													<div>
														<Subheading>Color Code</Subheading>
														<Field
															name={`productImages.${groupIndex}.colorCode`}
															type="color"
															as={Input}
														/>
														<ErrorMessage
															name={`productImages.${groupIndex}.colorCode`}
															component="div"
															className="text-red-500 text-sm"
														/>
													</div>
													<div>
														<Subheading>Color Name</Subheading>
														<Field
															name={`productImages.${groupIndex}.name`}
															as={Input}
														/>
														<ErrorMessage
															name={`productImages.${groupIndex}.name`}
															component="div"
															className="text-red-500 text-sm"
														/>
													</div>
												</div>

												{/* Stocks FieldArray */}
												<FieldArray name={`productImages.${groupIndex}.stocks`}>
													{({ push, remove }) => (
														<div className="space-y-4">
															{group.stocks.map((stock, stockIndex) => (
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
																			{size.map((s:any) => (
																				<option
																					key={s.id}
																					value={s.id}
																				>
																					{s.size}
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
															))}
															<Button
																type="button"
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
						<br />
						<Button
							type="submit"
							className="block"
						>
							Create New Product Media
						</Button>
					</form>
				)}
			</Formik>
		</>
	);
}

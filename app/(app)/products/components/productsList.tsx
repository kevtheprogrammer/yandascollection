"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchProducts } from "@/store/actions/productActions";
import { fetchCategory, fetchSizes } from "@/store/actions/productAttrAction";
import LoadingComp from "@/components/app/LoadingComp";
import { useSession } from "next-auth/react";
 
export default function ProductsList() {
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const { data: session } = useSession()

	// ✅ store multiple selections
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  	const [searchTerm, setSearchTerm] = useState("");

	const dispatch = useAppDispatch();

	// fetch categories & sizes only once
	useEffect(() => {
		dispatch(fetchCategory());
		dispatch(fetchSizes());
	}, [dispatch]);
 
	// fetch products whenever filters or search change
	useEffect(() => {
		const filter = {
		categoryIds: selectedCategories,
		sizes: selectedSizes,
		search: searchTerm,
		};
		dispatch(fetchProducts(filter)).then(() => setLoading(false));
	}, [dispatch, selectedCategories, selectedSizes, searchTerm]);


	const category = useAppSelector(
		(state: RootState) => state.products.category
	);
	const sizes = useAppSelector(
		(state: RootState) => state.products.product_sizes
	);
	const productListing = useAppSelector(
		(state: RootState) => state.products.products
	);

	// ✅ handle checkbox toggle for categories
	const handleCategoryChange = (id: string) => {
		setSelectedCategories((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
		);
	};

	// ✅ handle checkbox toggle for sizes
	const handleSizeChange = (id: string) => {
		setSelectedSizes((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
		);
	};

	if (loading) return <LoadingComp />;

	return (
		<div>
			{/* Mobile filter dialog */}
			<Dialog
				open={mobileFiltersOpen}
				onClose={setMobileFiltersOpen}
				className="relative z-40 lg:hidden"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
				/>
				<div className="fixed inset-0 z-40 flex">
					<DialogPanel
						transition
						className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
					>
						<div className="flex items-center justify-between px-4">
							<h2 className="text-lg font-medium text-gray-900">Filters</h2>
							<button
								type="button"
								onClick={() => setMobileFiltersOpen(false)}
								className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
							>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>

						{/* Categories */}
						<Disclosure
							as="div"
							className="border-b border-gray-200 px-4 py-6"
						>
							<h3 className="-mx-2 -my-3 flow-root">
								<DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
									<span className="font-medium text-gray-900">Categories</span>
									<span className="ml-6 flex items-center">
										<PlusIcon className="size-5 group-data-open:hidden" />
										<MinusIcon className="size-5 group-not-data-open:hidden" />
									</span>
								</DisclosureButton>
							</h3>
							<DisclosurePanel className="pt-6">
								<div className="space-y-4">
									{category?.map((option: any, idx: number) => (
										<div key={idx} className="flex gap-3">
											<input
												type="checkbox"
												checked={selectedCategories.includes(option.id)}
												onChange={() => handleCategoryChange(option.id)}
												id={`filter-cat-${idx}`}
												className="rounded border-gray-300 text-red-600 focus:ring-red-500"
											/>
											<label
												htmlFor={`filter-cat-${idx}`}
												className="text-sm text-gray-600"
											>
												{option?.name}
											</label>
										</div>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure>

						{/* Sizes */}
						{/* <Disclosure
							as="div"
							className="border-b border-gray-200 px-4 py-6"
						>
							<h3 className="-mx-2 -my-3 flow-root">
								<DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
									<span className="font-medium text-gray-900">Sizes</span>
									<span className="ml-6 flex items-center">
										<PlusIcon className="size-5 group-data-open:hidden" />
										<MinusIcon className="size-5 group-not-data-open:hidden" />
									</span>
								</DisclosureButton>
							</h3>
							<DisclosurePanel className="pt-6">
								<div className="space-y-4">
									{sizes?.map((option: any, idx: number) => (
										<div key={idx} className="flex gap-3">
											<input
												type="checkbox"
												checked={selectedSizes.includes(option.id)}
												onChange={() => handleSizeChange(option.id)}
												id={`filter-size-${idx}`}
												className="rounded border-gray-300 text-red-600 focus:ring-red-500"
											/>
											<label
												htmlFor={`filter-size-${idx}`}
												className="text-sm text-gray-600"
											>
												{option?.size} - {option?.range}
											</label>
										</div>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure> */}
					</DialogPanel>
				</div>
			</Dialog>

			{/* Main content */}
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex  items-baseline justify-between border-b border-gray-200 py-6 ">
					<h1 className="text-2xl hidden lg:block font-bold tracking-tight text-gray-900">
						Products
					</h1>

					{/* add search filter  */}
					<div className="relative flex items-center">
						<MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
						<input
						type="text"
						placeholder="Search products..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm"
						/>
					</div>
				</div>

				<section aria-labelledby="products-heading" className="pt-6 pb-24">
					<div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
						{/* Desktop Filters */}
						<div className="hidden lg:block">
							{/* Categories */}
							<Disclosure as="div" className="border-b border-gray-200 py-6">
								<h3 className="-my-3 flow-root">
									<DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
										<span className="font-medium text-gray-900">Categories</span>
										<span className="ml-6 flex items-center">
											<PlusIcon className="size-5 group-data-open:hidden" />
											<MinusIcon className="size-5 group-not-data-open:hidden" />
										</span>
									</DisclosureButton>
								</h3>
								<DisclosurePanel className="pt-6">
									<div className="space-y-4">
										{category?.map((option: any, idx: number) => (
											<div key={idx} className="flex gap-3">
												<input
													type="checkbox"
													checked={selectedCategories.includes(option.id)}
													onChange={() => handleCategoryChange(option.id)}
													id={`filter-cat-desk-${idx}`}
													className="rounded border-gray-300 text-red-600 focus:ring-red-500"
												/>
												<label
													htmlFor={`filter-cat-desk-${idx}`}
													className="text-sm text-gray-600"
												>
													{option?.name}
												</label>
											</div>
										))}
									</div>
								</DisclosurePanel>
							</Disclosure>

							{/* Sizes */}
							<Disclosure as="div" className="border-b border-gray-200 py-6">
								<h3 className="-my-3 flow-root">
									<DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
										<span className="font-medium text-gray-900">Sizes</span>
										<span className="ml-6 flex items-center">
											<PlusIcon className="size-5 group-data-open:hidden" />
											<MinusIcon className="size-5 group-not-data-open:hidden" />
										</span>
									</DisclosureButton>
								</h3>
								<DisclosurePanel className="pt-6">
									<div className="space-y-4">
										{sizes?.map((option: any, idx: number) => (
											<div key={idx} className="flex gap-3">
												<input
													type="checkbox"
													checked={selectedSizes.includes(option.id)}
													onChange={() => handleSizeChange(option.id)}
													id={`filter-size-desk-${idx}`}
													className="rounded border-gray-300 text-red-600 focus:ring-red-500"
												/>
												<label
													htmlFor={`filter-size-desk-${idx}`}
													className="text-sm text-gray-600"
												>
													{option?.size} - {option?.range}
												</label>
											</div>
										))}
									</div>
								</DisclosurePanel>
							</Disclosure>
						</div>

						{/* Products grid */}
						<div className="lg:col-span-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
							{productListing?.error && (
								<div className="text-red-500 text-xl">
									{productListing.error}
								</div>
							)}

							{productListing?.data?.length > 0 ? (
								productListing.data.map((product: any, idx: number) => (
									<a
										key={idx}
										href={`/products/${product.id}`}
										className="group text-sm"
									>
										<img
											alt={product?.name}
											src={product?.images?.media[0]?.url}
											className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
										/>
										<h3 className="mt-4 font-medium text-gray-900">
											{product?.name}
										</h3>
										<p className="text-gray-500 italic">
											{product?.category?.name}
										</p>
										<p className="mt-2 font-medium text-gray-900">
											K{product.price}
										</p>
									</a>
								))
							) : (
								<p className="text-gray-500">No products found.</p>
							)}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

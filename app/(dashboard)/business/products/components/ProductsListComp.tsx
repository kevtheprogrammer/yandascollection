"use client";

import LoadingComp from "@/components/app/LoadingComp";
import { Button } from "@/components/button";

import { Heading } from "@/components/heading";
import { Input, InputGroup } from "@/components/input";
import { Select } from "@/components/select";
import { TableCell, TableRow } from "@/components/table";
import { RootState } from "@/store";
import { fetchProducts } from "@/store/actions/productActions";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategory } from "@/store/actions/productAttrAction";

export default function ProductsListComp() {
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState("");

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchCategory());
	}, [dispatch]);

 
	useEffect(() => {
		const filter = {category}
		dispatch(fetchProducts(filter)).then(() => setLoading(false));
	}, [dispatch, category]);

	const prod: any = useAppSelector(
		(state: RootState) => state.products.products
	);
	const cat: any = useAppSelector(
		(state: RootState) => state.products.category
	);

	if (loading) return <LoadingComp />;

	return (
		<>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="max-sm:w-full sm:flex-1">
					<Heading>Products</Heading>
					<div className="mt-4 flex max-w-xl gap-4">
						<div className="flex-1">
							<InputGroup>
								<MagnifyingGlassIcon />
								<Input
									name="search"
									placeholder="Search products&hellip;"
								/>
							</InputGroup>
						</div>
						<div>
							<Select
								name="category"
								onChange={(e) => setCategory(e.target.value)}
							>
								<option value="">All Category</option>
								{cat?.map((c: any) => (
									<option
										value={c.id}
										key={c.id}
									>
										{c.name}
									</option>
								))}
							</Select>
						</div>
					</div>
				</div>
				<a
					href="/business/products/create"
					className="max-sm:w-full sm:w-auto"
				>
					<Button>Create Product</Button>
				</a>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{prod?.data?.length < 1 && (
					<TableRow className="h-24 text-start">
						<TableCell
							colSpan={3}
							className="text-lg text-pink-500 flex items-center flex-row gap-2"
						>
							<span>No products found</span> <NoSymbolIcon className="size-4" />
						</TableCell>
					</TableRow>
				)}
				{prod?.data?.map((product: any, index: number) => (
					<div
						key={product.id}
						className="group relative"
					>
						<img
							alt={product.thumb}
							src={product.thumb}
							className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
						/>
						<div className="mt-4 flex justify-between">
							<div>
								<h3 className="text-sm text-gray-700">
									<a href={`/business/products/${product.id}`}>
										<span
											aria-hidden="true"
											className="absolute inset-0"
										/>
										{product.name}
									</a>
								</h3>
							</div>
							<p className="text-sm font-medium text-gray-900">
								K{product.price}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

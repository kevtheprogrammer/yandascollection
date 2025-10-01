"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { RootState } from "@/store";
import { fetchOrders } from "@/store/actions/orderActions";

export default function OrderHistoryPage() {
	const dispatch = useAppDispatch();
	const orders = useAppSelector((state: RootState) => state.cart.order);
	// const

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	return (
		<div className="bg-white">
			<div className="py-16 sm:py-24">
				<div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
					<div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
							Order history
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Check the status of recent orders, manage returns, and discover
							similar products.
						</p>
					</div>
				</div>

				<div className="mt-16">
					<h2 className="sr-only">Recent orders</h2>
					<div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
						<div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
							{orders.map((order: any) => (
								<div
									key={order.id}
									className="border-t border-b border-gray-200 bg-white shadow-xs sm:rounded-lg sm:border"
								>
									<h3 className="sr-only">
										Order placed on{" "}
										<time dateTime={order?.createdAt}>{order?.createdAt}</time>
									</h3>

									<div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
										<dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-4 lg:col-span-2">
											<div>
												<dt className="font-medium text-gray-900">
													Order number
												</dt>
												<dd className="mt-1 text-gray-500">{order?.id}</dd>
											</div>
											<div className="hidden sm:block">
												<dt className="font-medium text-gray-900">
													Date placed
												</dt>
												<dd className="mt-1 text-gray-500">
													<time dateTime={order.createdAt}>
														{new Date(order.createdAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</time>
												</dd>
											</div>
											<div>
												<dt className="font-medium text-gray-900">
													Total amount
												</dt>
												<dd className="mt-1 font-medium text-gray-900 text-bold">
													ZMW {order.total}
												</dd>
											</div>

											<div>
												<dt className="font-medium text-gray-900">status</dt>
												<dd className="mt-1 font-medium text-gray-900 capitalize">
													{order.status === "PENDING" ? (
														<span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
															<svg
																viewBox="0 0 6 6"
																aria-hidden="true"
																className="size-1.5 fill-yellow-500"
															>
																<circle
																	r={3}
																	cx={3}
																	cy={3}
																/>
															</svg>
															{order?.status}
														</span>
													) : null}
													{order.status === "SHIPPED" ? (
														<span className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
															<svg
																viewBox="0 0 6 6"
																aria-hidden="true"
																className="size-1.5 fill-indigo-500"
															>
																<circle
																	r={3}
																	cx={3}
																	cy={3}
																/>
															</svg>
															{order?.status}
														</span>
													) : null}
													{order.status === "DELIVERED" ? (
														<span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
															<svg
																viewBox="0 0 6 6"
																aria-hidden="true"
																className="size-1.5 fill-green-500"
															>
																<circle
																	r={3}
																	cx={3}
																	cy={3}
																/>
															</svg>
															{order?.status}
														</span>
													) : null}
													{order.status === "RETURNED" ? (
														<span className="inline-flex items-center gap-x-1.5 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
															<svg
																viewBox="0 0 6 6"
																aria-hidden="true"
																className="size-1.5 fill-pink-500"
															>
																<circle
																	r={3}
																	cx={3}
																	cy={3}
																/>
															</svg>
															{order?.status}
														</span>
													) : null}
													{order.status === "CANCELLED" ? (
														<span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
															<svg
																viewBox="0 0 6 6"
																aria-hidden="true"
																className="size-1.5 fill-red-500"
															>
																<circle
																	r={3}
																	cx={3}
																	cy={3}
																/>
															</svg>
															{order?.status}
														</span>
													) : null}
												</dd>
											</div>
										</dl>

										<Menu
											as="div"
											className="relative flex justify-end lg:hidden"
										>
											<div className="flex items-center">
												<MenuButton className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
													<span className="sr-only">
														Options for order {order.number}
													</span>
													<EllipsisVerticalIcon
														aria-hidden="true"
														className="size-6"
													/>
												</MenuButton>
											</div>

											<MenuItems
												transition
												className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
											>
												<div className="py-1">
													<MenuItem>
														<a
															href={"#"}
															className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
														>
															Cancel Order
														</a>
													</MenuItem>
												</div>
											</MenuItems>
										</Menu>

										<div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
											<a
												href={`${order?.id}/payments`}
												className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
											>
												<span>Proceed to Payments</span>
											</a>
											<a
												href={`#`}
												className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
											>
												<span>Cancel Order</span>
											</a>
										</div>
									</div>

									{/* Products */}
									<h4 className="sr-only">Items</h4>
									<ul
										role="list"
										className="divide-y divide-gray-200"
									>
										{order.orderItems.map((product:any) => (
											<li
												key={product.id}
												className="p-4 sm:p-6"
											>
												<div className="flex items-center sm:items-start">
													<div className="size-20 shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:size-40">
														<img
															alt={product?.cartItem?.productImage.media[0].url}
															src={product?.cartItem?.productImage.media[0].url}
															className="size-full object-cover"
														/>
													</div>
													<div className="ml-6 flex-1 text-sm">
														<div className="font-medium text-gray-900 sm:flex sm:justify-between">
															<div className="capitalize text-lg">
																{product?.cartItem?.product?.name}
															</div>
															<div className="">
																<a
																	href={`/products/${product?.cartItem?.productId}`}
																	className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
																>
																	View product
																</a>
															</div>
														</div>
														<p className="mt-2 sm:mt-0 text-md capitalize">
															unit price: K{product?.cartItem?.product?.price}
														</p>
														<p className="hidden text-gray-500 sm:mt-2 sm:block">
															size: {product?.cartItem?.size.size} (
															{product?.cartItem?.size.range})
														</p>
														<p className="hidden text-gray-500 sm:mt-2 sm:block">
															quantity: {product?.cartItem?.quantity} units
														</p>
														<p className="hidden text-gray-500 sm:mt-2 sm:block">
															total Price: K
															{product?.cartItem?.quantity *
																product?.cartItem?.product?.price}
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
									<div>
										{order?.payment?.map((pay: any) => (
											<div className="px-5 ">
												<p>
												 -	Payment of K{pay.amount} with charge K
													{pay.charge} 
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div> 
	);
}

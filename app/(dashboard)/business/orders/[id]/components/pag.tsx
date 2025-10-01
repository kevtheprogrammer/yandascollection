"use client";
import { Badge } from "@/components/badge";
import {
	DescriptionDetails,
	DescriptionList,
	DescriptionTerm,
} from "@/components/description-list";
import { Divider } from "@/components/divider";
import { Heading, Subheading } from "@/components/heading";
import { Link } from "@/components/link";
import {
	BanknotesIcon,
	CalendarIcon,
	ChevronLeftIcon,
} from "@heroicons/react/16/solid";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { Select } from "@/components/select";
import { fetchOrderDetails, updateOrder } from "@/store/actions/orderActions";
import LoadingComp from "@/components/app/LoadingComp";

const statusConfig: Record<string, { label: string; color: "yellow" | "indigo" | "lime" | "pink" | "red" }> = {
	PENDING: { label: "Pending", color: "yellow" },
	SHIPPED: { label: "Shipped", color: "indigo" },
	DELIVERED: { label: "Delivered", color: "lime" },
	RETURNED: { label: "Returned", color: "pink" },
	CANCELLED: { label: "Cancelled", color: "red" },
};

export default function OrderDetailComp({ orderId }: { orderId: number }) {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<string | undefined>();
	const order = useAppSelector((state: RootState) => state.cart.selected_order);

	useEffect(() => {
		dispatch(fetchOrderDetails(orderId));
	}, [dispatch, orderId]);

	useEffect(() => {
		dispatch(updateOrder({ status: status }, orderId))
			.then(() => dispatch(fetchOrderDetails(orderId)))
			.finally(() => setLoading(false));
	}, [status]);

	if (loading) return <LoadingComp />;

	return (
		<>
			<div className="max-lg:hidden">
				<Link
					href="/business/orders"
					className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
				>
					<ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
					Orders
				</Link>
			</div>

			<div className="mt-4 lg:mt-8">
				<div className="flex items-center gap-4">
					<Heading>Order #{order?.id}</Heading>
					{/* Order header with badge */}
					<div className="flex items-center gap-4">
						<Heading>Order #{order?.id}</Heading>
						{order?.status && (
							<Badge color={statusConfig[order.status].color}>
								{statusConfig[order.status].label}
							</Badge>
						)}
					</div>
				</div>
				<div className="isolate mt-2.5 flex flex-wrap justify-between gap-x-6 gap-y-4">
					<div className="flex flex-wrap gap-x-10 gap-y-4 py-1.5">
						<span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white">
							<BanknotesIcon className="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" />
							<span>ZMW {order?.total}</span>
						</span>

						<span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white">
							<CalendarIcon className="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" />
							<span>
								{new Date(order?.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</span>
					</div>
					<div className="flex gap-4">
						<div>
							<Select
								name="status"
								onChange={(e) => {
									setLoading(true);
									setStatus(e.target.value);
								}}
								value={""}
							>
								{Object.entries(statusConfig).map(([value, { label }]) => (
									<option
										key={value}
										value={value}
									>
										{label}
									</option>
								))}
								{/* <option
									key={"PENDING"}
									value={"PENDING"}
								>
									Pending
								</option>
								<option
									key={"SHIPPED"}
									value={"SHIPPED"}
								>
									shipped
								</option>
								<option
									key={"DELIVERED"}
									value={"DELIVERED"}
								>
									delivered
								</option>
								<option
									key={"RETURNED"}
									value={"RETURNED"}
								>
									returned
								</option>
								<option
									key={"CANCELLED"}
									value={"CANCELLED"}
								>
									canceled
								</option> */}
							</Select>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-12">
				<Subheading>Products</Subheading>
				<Divider className="mt-4" />
				<div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-8 md:gap-y-0 lg:gap-x-8">
					{order?.orderItems?.map((product:any) => (
						<div
							key={product?.cartItem?.productId}
							className="group relative"
						>
							<div className="h-51 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-52 xl:h-32">
								<img
									alt={product?.cartItem?.productImage?.media[0].url}
									src={product?.cartItem?.productImage.media[0].url}
									className="size-full object-cover"
								/>
							</div>
							<h3 className="mt-4 text-sm dark:text-gray-500">
								<span className="absolute inset-0" />
								{product?.cartItem?.product?.name} x{" "}
								{product?.cartItem?.quantity}
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								{product?.cartItem?.size?.size} (
								{product?.cartItem?.size?.range})
							</p>
							<p className="mt-1 text-sm font-medium text-gray-900">
								{product?.cartItem?.product?.price}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="mt-12">
				<Subheading>Summary</Subheading>
				<Divider className="mt-4" />
				<DescriptionList>
					<DescriptionTerm>Customer</DescriptionTerm>
					<DescriptionDetails>
						{order?.firstName} {order?.lastName}
					</DescriptionDetails>
					<DescriptionTerm>Email</DescriptionTerm>
					<DescriptionDetails>{order?.email}</DescriptionDetails>
					<DescriptionTerm>Phone Number</DescriptionTerm>
					<DescriptionDetails>{order?.phone}</DescriptionDetails>
				</DescriptionList>
			</div>

			<div className="mt-12">
				<Subheading>Address</Subheading>
				<Divider className="mt-4" />
				<DescriptionList>
					<DescriptionTerm>City</DescriptionTerm>
					<DescriptionDetails>{order?.city}</DescriptionDetails>
					<DescriptionTerm>Province</DescriptionTerm>
					<DescriptionDetails>{order?.province}</DescriptionDetails>
					<DescriptionTerm>Country</DescriptionTerm>
					<DescriptionDetails>{order?.country}</DescriptionDetails>
					<DescriptionTerm>Address</DescriptionTerm>
					<DescriptionDetails>{order?.address}</DescriptionDetails>

					<DescriptionTerm>Postal Code</DescriptionTerm>
					<DescriptionDetails>{order?.postalAdd}</DescriptionDetails>
				</DescriptionList>
			</div>
		</>
	);
}

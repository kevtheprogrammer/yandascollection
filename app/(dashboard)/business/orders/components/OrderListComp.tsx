"use client";
import LoadingComp from "@/components/app/LoadingComp";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/table";
import { RootState } from "@/store";
import { NoSymbolIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrders } from "@/store/actions/orderActions";
import { Badge } from "@/components/badge";

const statusConfig: Record<string, { label: string; color: "zinc" | "indigo" | "cyan" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "sky" | "blue" | "violet" | "purple" | "fuchsia" | "pink" | "rose" }> = {
	PENDING: { label: "Pending", color: "yellow" },
	SHIPPED: { label: "Shipped", color: "indigo" },
	DELIVERED: { label: "Delivered", color: "lime" },
	RETURNED: { label: "Returned", color: "pink" },
	CANCELLED: { label: "Cancelled", color: "red" },
};

export default function OrderListComp() {
	const orders = useAppSelector((state: RootState) => state.cart.order);

	const [appLoading, setAppLoading] = useState(true);
	const distpatch = useAppDispatch();

	useEffect(() => {
		distpatch(fetchOrders()).then(() => setAppLoading(false));
	}, []);

	if (appLoading) return <LoadingComp />;

	return (
		<>
			<div className="flex items-end justify-between gap-4">
				<Heading>Orders</Heading>
				<Button className="-my-0.5">Create order</Button>
			</div>
			<Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
				<TableHead>
					<TableRow>
						<TableHeader>Order number</TableHeader>
						<TableHeader>Product</TableHeader>
						<TableHeader>Customer</TableHeader>
						<TableHeader>Purchase date</TableHeader>
						<TableHeader>Status</TableHeader>
						<TableHeader>Amount</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{orders?.length < 1 && (
						<TableRow className="h-24 text-start">
							<TableCell className="text-lg text-pink-500 flex items-center flex-row gap-2">
								<span>No orders found</span> <NoSymbolIcon className="size-4" />
							</TableCell>
						</TableRow>
					)}
					{orders?.map((order: any) => (
						<TableRow
							key={order.id}
							href={`orders/${order.id}`}
							title={`Order #${order.id}`}
						>
							<TableCell>{order?.id}</TableCell>
							<TableCell className="text-zinc-500">
								{order.orderItems.map((item:any) =>(
									<div>
										{item.cartItem.product.name} * {item.cartItem.quantity}
									</div>
								))}
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start gap-2">
									<div>{order?.email}</div>
									<div>
										{order?.firstName} {order?.lastName}
									</div>
									<div>{order?.phone}</div>
								</div>
							</TableCell>
							<TableCell>
								{order?.createdAt.slice(0, 10)}
								{" - "}
								{order?.createdAt.slice(11, 16)}
							</TableCell>
							<TableCell>
								{order?.status && (
									<Badge color={statusConfig[order.status].color}>
										{statusConfig[order.status].label}
									</Badge>
								)}
							</TableCell>
							<TableCell className="text-right">K{order?.total}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

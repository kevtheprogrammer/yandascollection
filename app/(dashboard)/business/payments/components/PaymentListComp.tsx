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
import { fetchPayments } from "@/store/actions/paymentsAction";
import { Badge } from "@/components/badge";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: "yellow" | "indigo" | "lime" | "pink" | "red" }> = {
	PENDING: { label: "Pending", color: "yellow" },
	SHIPPED: { label: "Shipped", color: "indigo" },
	DELIVERED: { label: "Delivered", color: "lime" },
	RETURNED: { label: "Returned", color: "pink" },
	CANCELLED: { label: "Cancelled", color: "red" },
};
export default function PaymentListComp() {
	const [appLoading, setAppLoading] = useState(true);
	const distpatch = useAppDispatch();

	useEffect(() => {
		distpatch(fetchPayments()).then(() => setAppLoading(false));
	}, [distpatch]);

	const payments = useAppSelector((state: RootState) => state.cart.payments);
	if (appLoading) return <LoadingComp />;

	return (
		<>
			<div className="flex items-end justify-between gap-4">
				<Heading>Payments</Heading>
				{/* <Button className="-my-0.5">Create order</Button> */}
			</div>
			<Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
				<TableHead>
					<TableRow>
						<TableHeader>Payment Id</TableHeader>
						<TableHeader>Order Id</TableHeader>
						<TableHeader>Customer</TableHeader>
						<TableHeader>Amount</TableHeader>
						<TableHeader>Charge</TableHeader>
						<TableHeader>Status</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{payments?.length < 1 && (
						<TableRow className="h-24 text-start">
							<TableCell className="text-lg text-pink-500 flex items-center flex-row gap-2">
								<span>No payments found</span>{" "}
								<NoSymbolIcon className="size-4" />
							</TableCell>
						</TableRow>
					)}
					{payments?.map((pay: any) => (
						<TableRow
							key={pay.id}
							href={pay.url}
							title={`Order #${pay.id}`}
						>
							<TableCell>{pay?.id}</TableCell>
							<TableCell> 
                <Link href={`orders/${pay?.order?.id}`}>
                order No. {pay?.order?.id} </Link>
              </TableCell>
							 
							<TableCell>
								{pay?.user?.email} - {pay?.user?.firstName}{" "}
								{pay?.user?.lastName}
							</TableCell>
							<TableCell className="text-right">K{pay?.amount}</TableCell>
							<TableCell className="text-right">K{pay?.charge}</TableCell>
							<TableCell>
								{pay?.status && (
									<Badge color={statusConfig[pay.status].color}>
										{statusConfig[pay.status].label}
									</Badge>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

import { AppDispatch } from "..";
import { ActionTypes } from "../constants/action-types";

// ############################# ORDER #############################

// Fetch all Order
export const fetchOrders =
	(options = {}) =>
	async (dispatch: AppDispatch) => {
		try {
			const query = new URLSearchParams(options).toString();
			const res = await fetch(`/api/orders?${query}`, {
				method: "GET",
			});

			const data = await res.json();

			dispatch({
				type: ActionTypes.SET_ORDER,
				payload: data || [],
			});
		} catch (error) {
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error,
			});
		}
	};

// Create a Recipe
export const createOrder =
	(values: any, router:any) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await res.json();

			if (!res.ok || data?.status !== "success") {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data,
				});
				return { success: false };
			}
			router.push(`/checkout/${data.id}/payments`)
			// return { success: true };
		} catch (error) {
			console.error("createOrder error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error,
			});
			return { success: false };
		}
	};

// Fetch Recipe Details
export const fetchOrderDetails = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/api/orders/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		dispatch({
			type: ActionTypes.SET_SELECTED_ORDER,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

// Update a Recipe
export const updateOrder =
	(values: any = {}, id: number) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch(`/api/orders/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await res.json();
			console.log("Update stock count response -------------:", data);
			if (!res.ok || data?.error) {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data?.error || "Failed to update recipe",
				});
			}
			dispatch(fetchOrders()); // Optionally re-fetch
		} catch (error: any) {
			console.error("updateRecipe error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error?.message || "Unexpected error",
			});
		}
	};

// Delete a Recipe
export const deleteOrder = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/business/order/api/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = null;
		if (res.status !== 204) {
			const contentType = res.headers.get("Content-Type") || "";
			if (contentType.includes("application/json")) {
				data = await res.json();
			}
		}
		 
	} catch (error) {
		console.error("deleteRecipe error:", error);
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

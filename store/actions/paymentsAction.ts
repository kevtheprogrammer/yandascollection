import { ActionTypes } from "../constants/action-types"; 
import { AppDispatch } from "..";

// ############################# PAYMENTS #############################

// Fetch all Payments
export const fetchPayments =
	(options = {}) =>
	async (dispatch: AppDispatch) => {
		try {
			const query = new URLSearchParams(options).toString();
			const res = await fetch(`/api/payments?${query}`, {
				method: "GET",
			});
			const data = await res.json();
			dispatch({
				type: ActionTypes.SET_PAYMENTS,
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
export const createPayments =
	(formData: FormData) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch("/api/payments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: formData,
			});

			const data = await res.json();

			if (!res.ok || data?.status !== "success") {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data,
				});
			}

		} catch (error) {
			console.error("createRecipe error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error,
			});
		}
	};

// Fetch Recipe Details
export const fetchPaymentsDetails = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/api/payments/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		dispatch({
			type: ActionTypes.SET_SELECTED_PAYMENTS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

 
// Update a Payments with FormData
export const updatePayments =
	(formData: FormData, id: any) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch(`/api/payments/${id}`, {
				method: "PATCH",
				body: formData, // Don't set headers, let browser handle
			});

			const data = await res.json();
			console.log("Update payments response -------------:", data);

			if (!res.ok || data?.error) {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data?.error || "Failed to update payments",
				});
				return;
			}

			dispatch(fetchPayments()); // Optionally re-fetch
		} catch (error: any) {
			console.error("updatePayments error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error?.message || "Unexpected error",
			});
		}
	};


// Delete a Recipe
export const deletePayments = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/api/payments/${id}`, {
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
		dispatch(fetchPayments());
	} catch (error) {
		console.error("deleteRecipe error:", error);
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

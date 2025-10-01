import { AppDispatch } from "..";
import { ActionTypes } from "../constants/action-types";

// ############################# PAYMENT #############################

// Fetch all Payment
// export const fetchPayments =
// 	(options = {}) =>
// 	async (dispatch: AppDispatch) => {
// 		try {
// 			const query = new URLSearchParams(options).toString();
// 			const res = await fetch(`/api/payments?${query}`, {
// 				method: "GET",
// 			});

// 			const data = await res.json();

// 			dispatch({
// 				type: ActionTypes.SET_PAYMENT,
// 				payload: data || [],
// 			});
// 		} catch (error) {
// 			dispatch({
// 				type: ActionTypes.SET_FETCH_ERROR,
// 				payload: error,
// 			});
// 		}
// 	};

// Create a Recipe
export const createPayment =
	(formData: FormData) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch("/api/payments", {
				method: "POST",
				// headers: { "Content-Type": "application/json", },
				body: formData,
			});

			const data = await res.json();

			if (!res.ok || data?.status !== "success") {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data,
				});
				return { success: false };
			}

			return { success: true };
		} catch (error) {
			console.error("createPayment error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error,
			});
			return { success: false };
		}
	};

 

// Update a Recipe
// export const updatePayment =
// 	(values: any = {}, id: number) =>
// 	async (dispatch: AppDispatch) => {
// 		try {
// 			const res = await fetch(`/business/payment/api/${id}`, {
// 				method: "PATCH",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(values),
// 			});

// 			const data = await res.json();
// 			console.log("Update stock count response -------------:", data);
// 			if (!res.ok || data?.error) {
// 				dispatch({
// 					type: ActionTypes.SET_FETCH_ERROR,
// 					payload: data?.error || "Failed to update recipe",
// 				});
// 			}
// 			dispatch(fetchPayment()); // Optionally re-fetch
// 		} catch (error: any) {
// 			console.error("updateRecipe error:", error);
// 			dispatch({
// 				type: ActionTypes.SET_FETCH_ERROR,
// 				payload: error?.message || "Unexpected error",
// 			});
// 		}
// 	};

// // Delete a Recipe
// export const deletePayment = (id: any) => async (dispatch: AppDispatch) => {
// 	try {
// 		const res = await fetch(`/business/payment/api/${id}`, {
// 			method: "DELETE",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});

// 		let data = null;
// 		if (res.status !== 204) {
// 			const contentType = res.headers.get("Content-Type") || "";
// 			if (contentType.includes("application/json")) {
// 				data = await res.json();
// 			}
// 		}
		 
// 	} catch (error) {
// 		console.error("deleteRecipe error:", error);
// 		dispatch({
// 			type: ActionTypes.SET_FETCH_ERROR,
// 			payload: error,
// 		});
// 	}
// };

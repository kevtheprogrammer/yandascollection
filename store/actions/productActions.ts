import { ActionTypes } from "../constants/action-types"; 
import { AppDispatch } from "..";

// ############################# PRODUCTS #############################

// Fetch all Products
export const fetchProducts =
	(options: Record<string, any> = {}) =>
	async (dispatch: AppDispatch) => {
		try {
			const params = new URLSearchParams();

			// Handle arrays properly (categoryId, size, etc.)
			Object.entries(options).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach((v) => params.append(key, String(v)));
				} else if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			});

			const res = await fetch(`/api/products?${params.toString()}`, {
				method: "GET",
			});

			if (!res.ok) throw new Error("Failed to fetch products");

			const data = await res.json();

			dispatch({
				type: ActionTypes.SET_PRODUCTS,
				payload: data || [],
			});
		} catch (error) {
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error instanceof Error ? error.message : error,
			});
		}
	};


// Create a Recipe
export const createProducts =
	(formData: FormData) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				// headers: {
				// 	// "Content-Type": "application/json",
				// },
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
export const fetchProduct = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/api/products/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		dispatch({
			type: ActionTypes.SET_SELECTED_PRODUCT,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

 
// Update a Product with FormData
export const updateProducts =
	(formData: FormData, id: any) =>
	async (dispatch: AppDispatch) => {
		try {
			const res = await fetch(`/api/products/${id}`, {
				method: "PATCH",
				body: formData, // Don't set headers, let browser handle
			});

			const data = await res.json();
			console.log("Update product response -------------:", data);

			if (!res.ok || data?.error) {
				dispatch({
					type: ActionTypes.SET_FETCH_ERROR,
					payload: data?.error || "Failed to update product",
				});
				return;
			}

			dispatch(fetchProducts()); // Optionally re-fetch
		} catch (error: any) {
			console.error("updateProducts error:", error);
			dispatch({
				type: ActionTypes.SET_FETCH_ERROR,
				payload: error?.message || "Unexpected error",
			});
		}
	};


// Delete a Recipe
export const deleteProducts = (id: any) => async (dispatch: AppDispatch) => {
	try {
		const res = await fetch(`/api/products/${id}`, {
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
		dispatch(fetchProducts());
	} catch (error) {
		console.error("deleteRecipe error:", error);
		dispatch({
			type: ActionTypes.SET_FETCH_ERROR,
			payload: error,
		});
	}
};

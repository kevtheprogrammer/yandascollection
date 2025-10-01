import { prisma } from "@/lib/prisma";
import { ActionTypes } from "../constants/action-types"
 
import category from "@/app/api/apisauce/category";
import { AppDispatch } from "..";
 
// ############################# CATEGORY #############################

// Fetch all Category
export const fetchCategory =
    (options = {}) =>
    async (dispatch: AppDispatch) => {
        try {
            const query = new URLSearchParams(options).toString(); 
            const res = await fetch(`/api/products/category?${query}`, {
                method: "GET",
            });
            
            const data = await res.json();

            dispatch({
                type: ActionTypes.SET_PRODUCT_CATEGORY,
                payload: data  || [],
            });
            
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_FETCH_ERROR,
                payload: error,
            });
        }
    };

// Create a Recipe
export const createCategory =
    (values: any = {}) =>
    async (dispatch: AppDispatch) => {
        try {
            const res = await fetch("/api/products/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok || data?.status !== "success") {
                dispatch({
                    type: ActionTypes.SET_FETCH_ERROR,
                    payload: data,
                });
        
            }
            

            dispatch(fetchCategory());
        } catch (error) {
            console.error("createRecipe error:", error);
            dispatch({
                type: ActionTypes.SET_FETCH_ERROR,
                payload: error,
            });
        }
    };

// Fetch Recipe Details
export const fetchProduct =
    (id: any) => async (dispatch: AppDispatch) => {
        try {
            const res = await fetch(`/api/products/category/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            dispatch({
                type: ActionTypes.SET_SELECTED_CATEGORY,
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
export const updateCategory =
    (values: any = {}, id: any) =>
    async (dispatch: AppDispatch) => {
        try {
            const res = await fetch(`/api/products/category/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (!res.ok || data?.error) {
                dispatch({
                    type: ActionTypes.SET_FETCH_ERROR,
                    payload: data?.error || "Failed to update recipe",
                });
                return;
            }

            dispatch(fetchCategory()); // Optionally re-fetch
        } catch (error: any) {
            console.error("updateRecipe error:", error);
            dispatch({
                type: ActionTypes.SET_FETCH_ERROR,
                payload: error?.message || "Unexpected error",
            });
        }
    };

// Delete a Recipe
export const deleteCategory = (id: any) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`/api/products/category/${id}`, {
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


        dispatch(fetchCategory());
    } catch (error) {
        console.error("deleteRecipe error:", error);
        dispatch({
            type: ActionTypes.SET_FETCH_ERROR,
            payload: error,
        });
    }
};



// ############################# SIZES #############################
// Fetch all Sizes
export const fetchSizes =
    (options = {}) =>
    async (dispatch: AppDispatch) => {
        try {
            const query = new URLSearchParams(options).toString(); 
            const res = await fetch(`/api/products/sizes?${query}`, {
                method: "GET",
            });
            
            const data = await res.json();

            dispatch({
                type: ActionTypes.SET_PRODUCT_SIZES,
                payload: data  || [],
            });
  
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_FETCH_ERROR,
                payload: error,
            });
        }
    };


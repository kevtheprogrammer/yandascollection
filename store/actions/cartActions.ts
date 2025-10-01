import mycart from "@/app/api/apisauce/cart";
import { ActionTypes } from "../constants/action-types";
import order from "@/app/api/apisauce/order";
import { AppDispatch } from "..";



// ############################# CART #############################

// Fetch all Products
export const fetchCart =
  (options = {}) =>
  async (dispatch: AppDispatch) => {
    try {
      const query = new URLSearchParams(options).toString();
      const res = await fetch(`/api/cart?${query}`, {
        method: "GET",
      });

      const data = await res.json();

      dispatch({
        type: ActionTypes.SET_CART,
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
export const createCart =
  (formData: FormData) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetch("/api/cart", {
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
export const fetchProduct = (id: any) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/cart/${id}`, {
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
export const updateCart =
  (formData: FormData, id: any) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
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

      dispatch(fetchCart()); // Optionally re-fetch
    } catch (error: any) {
      console.error("updateCart error:", error);
      dispatch({
        type: ActionTypes.SET_FETCH_ERROR,
        payload: error?.message || "Unexpected error",
      });
    }
  };


// Delete a Recipe
export const deleteCart = (id: any) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/cart/${id}`, {
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
    dispatch(fetchCart());
  } catch (error) {
    console.error("deleteRecipe error:", error);
    dispatch({
      type: ActionTypes.SET_FETCH_ERROR,
      payload: error,
    });
  }
};



// export const fetchPublicCart = (options = {}) => async (dispatch) => {
//   try {
//     const productsList = await mycart.getCart(options);
//     dispatch({
//       type: ActionTypes.SET_CART,
//       payload: productsList?.data
//     });
//   } catch (error) {
//     console.error("Error fetching product list:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'server error. Unable to fetch data from server',
//     });
//   }
// };

// export const updatePublicCart = (cartItemId: number, quantity: number, options = {}) => async (dispatch) => {
//   try {
//     const product = await mycart.updateCartItem(cartItemId, quantity, options);

//     dispatch({
//       type: ActionTypes.UPDATE_CART,
//       payload: { cartItemId, quantity }
//     });
//   } catch (error) {
//     console.error("Error fetching product list:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'server error. Unable to fetch data from server',
//     });
//   }
// };


// export const deletePublicCart = (cartItemId: number) => async (dispatch, getState) => {
//   try {
//     const res = await mycart.deleteCartItem(cartItemId);

//     // Get the current cart state
//     const cart = getState().cart.cart;

//     // Filter out the deleted item
//     const updatedItems = cart?.items?.filter(item => item.id !== cartItemId);

//     // Recalculate total
//     const updatedTotal = updatedItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

//     dispatch({
//       type: ActionTypes.DELETE_CARTITEM,
//       payload: {
//         cart: {
//           ...cart,
//           items: updatedItems
//         },
//         total: updatedTotal
//       }
//     });
//   } catch (error) {
//     console.error("Error deleting cart item: ====", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'Server error. Unable to delete cart item.',
//     });
//   }
// };


// // order 
// export const fetchPublicOrder = (options = {}) => async (dispatch) => {
//   try {
//     const res = await order.getOrder(options);
//     dispatch({
//       type: ActionTypes.SET_ORDER,
//       payload: res?.data
//     });
//   } catch (error) {
//     console.log("Error fetching product list:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'server error. Unable to fetch data from server',
//     });
//   }
// };


// // admin 
// export const fetchAdminOrder = (options = {}) => async (dispatch) => {
//   try {

//     const res = await fetch('http://localhost:3000/api/orders', {
//       method: 'GET',
//     });


//     if (!res.ok) {
//       throw new Error(`Server error: ${res.status}`);
//     }

//     const data = await res.json();

//     dispatch({
//       type: ActionTypes.SET_ORDER, // ❓ Consider renaming to SET_ORDERS if this is about orders, not cart
//       payload: data,
//     });
//   } catch (error) {
//     console.error("Error fetching order list:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'Server error. Unable to fetch data from server',
//     });
//   }
// };

// export const fetchAdminOrderDetails = (id, options = {}) => async (dispatch) => {
//   try {

//     const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
//       method: 'GET',
//     });


//     if (!res.ok) {
//       throw new Error(`Server error: ${res.status}`);
//     }

//     const data = await res.json();
//     console.log("data", data)
//     dispatch({
//       type: ActionTypes.SET_SELECTED_ORDER, // ❓ Consider renaming to SET_ORDERS if this is about orders, not cart
//       payload: data,
//     });
//   } catch (error) {
//     console.error("Error fetching order list:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'Server error. Unable to fetch data from server',
//     });
//   }
// };

// export const updateAdminOrderStatus = (orderId, status) => async (dispatch) => {
//   try {
//     const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ status }),
//     });

//     if (!res.ok) {
//       throw new Error(`Server error: ${res.status}`);
//     }

//     const data = await res.json();
//     console.log("data", data)
//     // dispatch({
//     //   type: ActionTypes.SET_SELECTED_ORDER,
//     //   payload: data,
//     // });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     dispatch({
//       type: ActionTypes.SET_FETCH_ERROR,
//       payload: error?.message || 'Server error. Unable to update order status.',
//     });
//   }
// };
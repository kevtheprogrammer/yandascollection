import { ActionTypes } from "../constants/action-types";

interface Action {
    type: string;
    payload?: any;
}

export interface UserState {
    cart: CartType | null;
    order: CartItemType[];
    payments: any | null;
    selcted_payments:any|null;
    selected_order: null ;
    shipping: number;
    tax: number;
    extra_charges: number;
    total: number;
}

const initialState: UserState = {
    cart: null,
    order: [],
    selected_order: null,
    payments:null,
    selcted_payments:null,
    shipping: 70,
    tax: 16,
    extra_charges: 0,
    total: 0,
};
 
 
export const cartReducer = (state = initialState,  action: Action) => {
    switch (action.type) {

        case ActionTypes.SET_CART:
            return { ...state, cart: action.payload, total: calculateTotal(action.payload.items) };

        case ActionTypes.SET_ORDER:
            return { ...state, order: action.payload };

        case ActionTypes.SET_SELECTED_ORDER:
            return { ...state, selected_order: action.payload };

        case ActionTypes.SET_PAYMENTS:
            return { ...state, payments: action.payload };

        case ActionTypes.SET_SELECTED_PAYMENTS:
            return { ...state, selected_payments: action.payload };

        case ActionTypes.UPDATE_CART:
            if (!state.cart) return state; // Ensure cart exists before updating
            const updatedCart = {
                ...state.cart,
                items: state.cart.items.map(item =>
                    item.id === action.payload.cartItemId ? { ...item, quantity: action.payload.quantity } : item
                ),
            };
            return { 
                ...state, 
                cart: updatedCart,
                total: calculateTotal(updatedCart.items),
            };
    
        case ActionTypes.DELETE_CARTITEM:
            if (!state.cart) return state; // Ensure cart exists before deleting
            const filteredItems = state.cart.items.filter(item => item.id !== action.payload.cartItemId);

            return {
                ...state,
                cart: { ...state.cart, items: filteredItems },
                total: calculateTotal(filteredItems),
            };
    

        default:
            return state
    }
}

const calculateTotal = (items: any) => {
    return items?.reduce((total: number, item: any) => total + item.quantity * item.product.price, 0);
};
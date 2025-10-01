import { ActionTypes } from "../constants/action-types";

export interface UserState {
    category: [];
    products: ProductAPIList[];
    selected_product: ProductDetailsAPI|null;
    selected_category: {};
    create_product: {};
    product_sizes: [];
    ServerError: string;
}
 

const initialState: UserState = {
    category: [],
    products: [],
    selected_product: null,
    selected_category: {},
    create_product: {},
    product_sizes: [],
    ServerError: '',
};

interface ProductAction {
    type: string;
    payload?: any;
}

export const productReducer = (state = initialState, action: ProductAction) => {
    const { type, payload } = action;
    switch (type) {

        case ActionTypes.SET_PRODUCT_CATEGORY:
            return { ...state, category: payload };

        case ActionTypes.SET_PRODUCT_SIZES:
            return { ...state, product_sizes: payload };

        case ActionTypes.SET_PRODUCTS:
            return { ...state, products: payload };

        case ActionTypes.SET_SELECTED_PRODUCT:
            return { ...state, selected_product: payload };

        case ActionTypes.SET_SELECTED_CATEGORY:
            return { ...state, selected_category: payload };
        
        case ActionTypes.SET_FETCH_ERROR:
            return { ...state, ServerError: payload };

        default:
            return state;
    }
}


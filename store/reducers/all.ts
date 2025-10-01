import { combineReducers } from "@reduxjs/toolkit";
import { accountReducer } from "./userReducer";
import { productReducer } from "./productsReducer";
import { cartReducer } from "./cartReducer";
import appReducer from "./appReducer";


const reducers = combineReducers({
   user: accountReducer,
   products: productReducer,
   cart: cartReducer,
   app: appReducer
});


export default reducers;
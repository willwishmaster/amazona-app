import Axios from "axios"
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "../constants/cartConstant";

export const addToCart = (productId, qty) => async(dispatch, getState) => {
    const {data} =  await Axios.get(`/api/products/${productId}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id,
            qty,
        },
    });
    //** Access to the cart Item in Redux Storage */
    //** This to make persistence the objects in the cart */
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId)=>(dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: productId
    });
    //** Updating the localstorage for the cart */ 
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems));
}
export const saveShippingAddress = (data)=>(dispatch)=>{
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });
    localStorage.setItem('shippingAddress',JSON.stringify(data));
}

export const savePaymentMethod = (data)=>(dispatch)=>{
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    });
}

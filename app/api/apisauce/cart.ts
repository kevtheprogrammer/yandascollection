import client from "../client";

const getCart = async (id: any, options = {}) => {
    return client.get(
        `/cart`,
        {
            ...options,
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
};

async function updateCartItem(cartItemId: number, quantity: number, options = {}) {
    return client.patch(`/cart`,
        { cartItemId, quantity},
        {
            ...options,
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
}


async function deleteCartItem(cartItemId: number) {
    return client.delete(`/cart/${cartItemId}`,
        {
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
}
 



export default {
    getCart, updateCartItem, deleteCartItem
};

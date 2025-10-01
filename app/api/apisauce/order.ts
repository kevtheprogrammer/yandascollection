import client from "../client";

const getOrder = async (id: any, options = {}) => {
    return client.get(
        `/order`,
        {
            ...options,
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
};

async function updateorder(data: any, options = {}) {
    return client.patch(`/order`,
        { data },
        {
            ...options,
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
}


async function cancelOrderCartItem(cartItemId: number) {
    return client.delete(`/order/${cartItemId}`,
        {
            headers: {
                "Accept": "Aplication/json"
            }
        }
    );
}
 
 
export default {
    getOrder, updateorder, cancelOrderCartItem
};

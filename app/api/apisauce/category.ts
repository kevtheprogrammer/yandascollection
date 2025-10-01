 
import client from "../client";



const getListing = async (options = {}) => {
    return client.get(
        `/products/category`,
        {
            ...options,
            headers:{
                "Accept":"Aplication/json"
            }
        }
    );
};


const getDetails = async (id:any, options = {}) => {
    return client.get(
        `/products/category/${id}`,
        {
            ...options,
            headers:{
                "Accept":"Aplication/json"
            }
        }
    );
};
 
export default { getListing, getDetails };

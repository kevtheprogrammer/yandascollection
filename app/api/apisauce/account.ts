import client from "../client"; 

const listUsers = async (options = {}) => {
    return client.get(
      `/users`,
      {
        ...options,  
        headers: {
          Accept: "application/json"
        }
      }
    );
  };
  
 

const getAccount = async (id: any, options = {}) => {
    return client.get(
        `/users/${id}`,
        {
            ...options,
            headers:{
                "Accept":"Aplication/json"
            }
        }
    );
}; 

export default { listUsers, getAccount }
import { create } from "apisauce";
const BASE_URL = process.env.NEXTAUTH_BACKEND_URL || "http://localhost:3000/api/public/";

const apiSause =  create({
	baseURL:   BASE_URL,
});

export default apiSause;
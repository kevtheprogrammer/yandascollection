import { prisma } from "@/lib/prisma"
import { ActionTypes } from "../constants/action-types"
import account from '@/app/api/apisauce/account'

export const fetchAccountProfile = ( userId:number, options={} ) => async (dispatch:any) => {
    const user = await account.getAccount( userId, options)
    dispatch({
        type: ActionTypes.SET_PROFILE,
        payload: user?.data
    }) 
} 

export const fetchUsers = (options = {}) => async (dispatch:any) => { 
    const userList = await account.listUsers(options); 
    dispatch ({
        type: ActionTypes.SET_USERS,
        payload: userList?.data
    }) 
}
 
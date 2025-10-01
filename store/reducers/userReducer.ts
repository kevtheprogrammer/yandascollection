import { ActionTypes } from "../constants/action-types";

export interface UserState {
    profile: UserType | null;
    users: UserListType[]; 
    selected_user: UserType | null;
} 

const initialState: UserState = {
    profile: null,
    users: [],
    selected_user: null,
};

interface Action {
    type: string;
    payload?: any;
}

export const accountReducer = (
    state = initialState,
    action: Action
) => {
    switch (action.type) { 
        case ActionTypes.SET_PROFILE:
            return { ...state, profile: action.payload }; 
        case ActionTypes.SET_USERS:
            return { ...state, users: action.payload }; 
        case ActionTypes.SET_SELECTED_USER:
            return { ...state, selected_user: action.payload }; 
        default:
            return state;
    } 
}

 
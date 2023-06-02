import { SET_USER } from "./action-types";

//This is action creator
export const setUser = user => {
    return {
        type : SET_USER,
        payload : { user } 
    }
}
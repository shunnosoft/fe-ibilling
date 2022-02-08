import apiLink from "../api/apiLink"
import { toast } from "react-toastify";

import { managerFetchFailure, managerFetchStart, managerFetchSuccess } from "./managerSlice"

//manager
export const getManger=async(dispatch,ispWonerId)=>{

    dispatch(managerFetchStart())
    try {
        const res =await apiLink.get(`/v1/ispOwner/manager/${ispWonerId}`) 
        dispatch(managerFetchSuccess(res.data))  
        
    } catch (error) {
        dispatch(managerFetchFailure()); 
        toast("Manager load bertho hoyeche"); 

        
    }

}
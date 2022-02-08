import apiLink from "../api/apiLink"
import { managerFetchFailure, managerFetchStart, managerFetchSuccess } from "./managerSlice"

//manager
export const getManger=async(dispatch,managerId)=>{

    dispatch(managerFetchStart())
    try {
        const res =await apiLink.get(`/v1/ispOwner/manager/${managerId}`) 
        dispatch(managerFetchSuccess(res.data))  
        
    } catch (error) {
        dispatch(managerFetchFailure())
        
    }

}
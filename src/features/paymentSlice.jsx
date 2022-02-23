import { createSlice } from "@reduxjs/toolkit";
 

const paymentSlice =createSlice({
    name:"payment",
    initialState:{
        balance:"", 
        allDeposit:[], 

        
    },
     reducers:{
        getTotalBalanceSuccess:(state,action) =>{
            state.balance=action.payload.balance
        } , 
        getDepositSuccess:(state,action) =>{
            state.allDeposit=action.payload
        }  
    } 

})

export const {getTotalBalanceSuccess , getDepositSuccess } =paymentSlice.actions
export default paymentSlice.reducer ;
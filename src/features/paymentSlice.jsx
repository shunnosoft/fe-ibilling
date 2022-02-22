import { createSlice } from "@reduxjs/toolkit";
 

const paymentSlice =createSlice({
    name:"payment",
    initialState:{
        balance:null, 
        allDeposit:[], 
        
    },
     reducers:{
        getTotalBalanceSuccess:(state,action) =>{
            state.balance=action.payload.balance
        } , 
        getDepositSuccess:(state,action) =>{
            state.allDeposit=action.payload
        } , 
        addDepositSuccess:(state,action) =>{
            state.allDeposit.push(action.payload)
        }
    } 

})

export const {getTotalBalanceSuccess , getDepositSuccess,addDepositSuccess} =paymentSlice.actions
export default paymentSlice.reducer ;
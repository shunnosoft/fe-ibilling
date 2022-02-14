import {  createSlice } from "@reduxjs/toolkit";
 

const initialState = {
   
  isFetching: false,
  currentUser: null,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.isFetching = true;
    },
    logInSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
     
    logOut:(state)=>{
      state.currentUser=null ; 
        
    }
  },
});

export const { logInStart, logInSuccess, loginFailure ,logOut} = authSlice.actions;

export default authSlice.reducer;
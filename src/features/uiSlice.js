import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
     alertModalShow:false, 
  },
  reducers: {
     showModal:(state)=>{
         state.alertModalShow=true
     }, 
     hideModal:(state) =>{
         state.alertModalShow=false
     }
  },
});

export const {showModal,hideModal} =
  uiSlice.actions;
export default uiSlice.reducer;

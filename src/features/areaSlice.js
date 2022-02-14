import { createSlice} from "@reduxjs/toolkit";


export const areaSlice = createSlice({
  name: "area",
  initialState: {
    area: [],
  },
  reducers: {
    FetchAreaSuccess: (state, action) => {
      console.log(action.payload)
      state.area = action.payload;
    },
    AddAreaSuccess: (state, action) => {
      state.area.push(action.payload);
    },
    EditAreaSuccess: (state, action) => {
      state.area[
        state.area.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    DeleteAreaSuccess: (state, action) => {
      state.area.splice(
        state.area.findIndex((item) => item.id === action.payload),
        1
      );
    },
clearArea:(state)=>{
state.area=[]
},
    AddSubAreaSuccess: (state, action) => {
    
      // state.area[0].subAreas.push(action.payload)
      state.area.find(item=>item.id===action.payload.area).subAreas.push(action.payload)
         
    },
    EditSubAreaSuccess: (state, action) => {
      state.area.find((item) => item.id === action.payload.area).subAreas[
        state.area
          .find((item) => item.id === action.payload.area)
          .subAreas.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    DeleteSubAreaSuccess: (state, action) => {
      state.area
        .find((item) => item.id === action.payload.areaId)
        .subAreas.splice(
          state.area
            .find((item) => item.id === action.payload.areaId)
            .subAreas.findIndex((item) => item.id === action.payload.subAreaId),
          1
        );
    },
  },
  
});

export const {
  FetchAreaSuccess,
  EditAreaSuccess,
  DeleteAreaSuccess,
  AddAreaSuccess,
  EditSubAreaSuccess,
  DeleteSubAreaSuccess,
  clearArea,
  AddSubAreaSuccess,
} = areaSlice.actions;
export default areaSlice.reducer;

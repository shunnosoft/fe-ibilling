import { createSlice } from "@reduxjs/toolkit";

export const areaSlice = createSlice({
  name: "area",
  initialState: {
    area: [],
    subArea: [],
  },
  reducers: {
    FetchAreaSuccess: (state, action) => {
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
    clearArea: (state) => {
      state.area = [];
    },
    AddSubAreaSuccess: (state, action) => {
      state.subArea.push(action.payload);
    },
    EditSubAreaSuccess: (state, action) => {
      state.subArea[
        state.subArea.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    DeleteSubAreaSuccess: (state, action) => {
      state.subArea.splice(
        state.subArea.findIndex((item) => item.id === action.payload.subAreaId),
        1
      );
    },
    getSubareas: (state, action) => {
      state.subArea = action.payload;
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
  getSubareas,
} = areaSlice.actions;
export default areaSlice.reducer;

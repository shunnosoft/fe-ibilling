import { createSlice } from "@reduxjs/toolkit";

export const areaSlice = createSlice({
  name: "area",
  initialState: {
    area: [],
    subArea: [],
    poleBox: [],
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

    AddPoleBoxSuccess: (state, action) => {
      state.poleBox.push(action.payload);
    },
    EditPoleBoxSuccess: (state, action) => {
      state.poleBox[
        state.poleBox.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    // DeletePoleBoxSuccess: (state, action) => {
    //   state.poleBox.splice(
    //     state.poleBox.findIndex((item) => item.id === action.payload.id),
    //     1
    //   );
    // },
    getPoleBoxSuccess: (state, action) => {
      state.poleBox = action.payload;
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
  AddPoleBoxSuccess,
  EditPoleBoxSuccess,
  getPoleBoxSuccess,
} = areaSlice.actions;
export default areaSlice.reducer;

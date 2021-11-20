import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../../api/apiLink'

export const fetchUserInfo = createAsyncThunk('usersInfo/fetchAsyncToken', async (loginInfo) => {
  const response = await apiLink({
    url: '/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginInfo,
    crossDomain: true,
    withCredentials: true,
    credentials: 'include',
  })
  return response.data
})

const initialState = {
  userInfo: {},
}
export const usersInfoSlice = createSlice({
  name: 'usersInfo',
  initialState,
  extraReducers: {
    [fetchUserInfo.pending]: () => {
      console.log('pending')
    },
    [fetchUserInfo.fulfilled]: (state, action) => {
      console.log('Fulfilled')
      state.userInfo = action.payload
    },
    [fetchUserInfo.rejected]: (state, action) => {
      console.log('Rejected')
      state.userInfo = action.payload
    },
  },
})

export const getUserInfo = (state) => state.usersInfo.userInfo
export default usersInfoSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../../api/apiLink'

// revieve async data from dispatch then -> return a promise to reducer
export const fetchAsyncUserData = createAsyncThunk('users/fetchAsyncUserData', async (userInfo) => {
  const response = await apiLink({
    url: '/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: userInfo,
  })
  return response.data
})

const initialState = {
  user: {},
}

export const userRegister = createSlice({
  name: 'users',
  initialState,
  reducers: {
    user: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: {
    // recieve promise from create async thunk -> send to state
    [fetchAsyncUserData.pending]: () => {
      console.log('Pending')
    },
    [fetchAsyncUserData.fulfilled]: (state, { payload }) => {
      console.log('Send Successfully!')
      return { ...state, user: payload }
    },
    [fetchAsyncUserData.rejected]: (state, payload) => {
      console.log('Rejected')
      return { ...state, user: payload }
    },
  },
})

export const { user } = userRegister.actions
export const getRegisterResponse = (state) => state.users.user
export default userRegister.reducer

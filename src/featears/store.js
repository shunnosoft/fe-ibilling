import { configureStore } from '@reduxjs/toolkit'
import userRegistration from './users/userRegister'
import userInfo from './users/userInfo'

export const store = configureStore({
  reducer: {
    users: userRegistration,
    usersInfo: userInfo,
  },
})

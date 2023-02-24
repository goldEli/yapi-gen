/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import { companyTeamsList } from './thunk'

export interface CounterState {
  teamsMembersList: any
  teamsList: any
}
const initialState: CounterState = {
  teamsMembersList: [],
  teamsList: [],
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTeamsMembersList: (state, action) => {
      state.teamsMembersList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(companyTeamsList.fulfilled, (state, action) => {
      state.teamsMembersList = [
        {
          title: '123',
        },
      ]
    })
  },
})

export const { setTeamsMembersList } = counterSlice.actions

export default counterSlice.reducer

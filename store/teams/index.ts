/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import { companyTeamsList, getMemberList, getDepartmentUserList } from './thunk'

export interface CounterState {
  membersList: any
  teamsList: any[]
  activeTeamId: string | number | null
  departmentUserList: any[]
  activeTeam: any
}

const initialState: CounterState = {
  membersList: null,
  teamsList: [],
  activeTeamId: null,
  departmentUserList: [],
  activeTeam: null,
}

export const counterSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeamsMembersList: (state, action) => {
      state.membersList = action.payload
    },
    setTeamsList: (state, action) => {
      state.teamsList = action.payload
    },
    setActiveTeam: (state, action) => {
      state.activeTeam = action.payload
      state.activeTeamId = action.payload?.id
    },
  },
  extraReducers(builder) {
    builder
      .addCase(companyTeamsList.fulfilled, (state, action) => {
        state.teamsList = action.payload.data
        state.teamsList[0].active = true
        state.activeTeam = state.teamsList[0]
        state.activeTeamId = state.teamsList[0]?.id
      })
      .addCase(getMemberList.fulfilled, (state, action) => {
        state.membersList = {
          list: action.payload.data?.list,
          pager: action.payload.data?.pager,
        }
      })
      .addCase(getDepartmentUserList.fulfilled, (state, action) => {
        state.departmentUserList = action.payload
      })
  },
})

export const { setTeamsMembersList, setTeamsList, setActiveTeam } =
  counterSlice.actions

export default counterSlice.reducer

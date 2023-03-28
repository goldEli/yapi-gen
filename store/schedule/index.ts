import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getScheduleList } from './schedule.thunk'

type SliceState = {
  // 默认日程时长
  defaultScheduleDuration: number
  // 最小日程时长
  minScheduleDuration: number
  // 日程列表
  scheduleList: Model.Schedule.Info[]
}

const initialState: SliceState = {
  // 默认日程时长
  defaultScheduleDuration: 30,
  // 最小日程时长
  minScheduleDuration: 15,
  scheduleList: [],
}

const slice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(state, action: PayloadAction<Model.Schedule.Info>) {
      state.scheduleList = state.scheduleList.map(item => {
        if (action.payload.id === item.id) {
          return action.payload
        }

        return item
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(getScheduleList.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
  },
})

const schedule = slice.reducer

export const { setSchedule } = slice.actions

export default schedule

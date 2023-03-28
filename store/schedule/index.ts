import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
  scheduleList: [
    {
      id: 1,
      title: '吃早饭',
      startTime: Date.parse('2023-3-23 4:00:00'),
      endTime: Date.parse('2023-3-23 5:00:00'),
      color: '#FF5C5E',
    },
    {
      id: 2,
      title: '做作业',
      startTime: Date.parse('2023-3-23 3:15:00'),
      endTime: Date.parse('2023-3-23 4:45:00'),
      color: '#A176FB',
    },
    {
      id: 3,
      title: '睡觉',
      startTime: Date.parse('2023-3-23 1:15:00'),
      endTime: Date.parse('2023-3-23 1:30:00'),
      color: '#00D2C5',
    },
  ],
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
})

const schedule = slice.reducer

export const { setSchedule } = slice.actions

export default schedule

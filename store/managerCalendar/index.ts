import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  // 默认日程时长
  defaultScheduleDuration: number
  // 最小日程时长
  minScheduleDuration: number
  // 日程列表
  scheduleList: Model.Calendar.Schedule[]
}

const initialState: SliceState = {
  calendarPanelType: 'day',
  // 默认日程时长
  defaultScheduleDuration: 30,
  // 最小日程时长
  minScheduleDuration: 15,
  scheduleList: [
    {
      id: '1',
      title: '吃早饭',
      startTime: '2023-3-23 4:15:00',
      endTime: '2023-3-23 5:15:00',
    },
    {
      id: '2',
      title: '做作业',
      startTime: '2023-3-23 2:15:00',
      endTime: '2023-3-23 2:45:00',
    },
    {
      id: '3',
      title: '睡觉',
      startTime: '2023-3-23 1:15:00',
      endTime: '2023-3-23 1:30:00',
    },
  ],
}

const slice = createSlice({
  name: 'managerCalendar',
  initialState,
  reducers: {
    setCalendarPanelType(
      state,
      action: PayloadAction<SliceState['calendarPanelType']>,
    ) {
      console.log(action.payload)
      state.calendarPanelType = action.payload
    },
    setScheduleList(state, action: PayloadAction<Model.Calendar.Schedule>) {
      state.scheduleList = state.scheduleList.map(item => {
        if (action.payload.id === item.id) {
          return action.payload
        }

        return item
      })
    },
  },
})

const managerCalendar = slice.reducer

export const { setCalendarPanelType, setScheduleList } = slice.actions

export default managerCalendar

import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { getScheduleListForCurrentDay } from './createScheduleVisualization.thunk'
interface State {
  // selectedDate: {
  //   startTime: number
  //   endTime: number
  // }
  scheduleList: Model.Schedule.Info[]
  // date: number
  currentDate: number
}

const initialState: Partial<State> = {
  // selectedDate: {
  //   startTime: dayjs('2023-03-30 16:30:00').valueOf(),
  //   endTime: dayjs('2023-03-30 17:15:00').valueOf(),
  // },
  currentDate: dayjs().valueOf(),
  scheduleList: [],
}

const slice = createSlice({
  name: 'createScheduleVisualization',
  initialState,
  reducers: {
    // setSelectedDate(state, action: PayloadAction<State['selectedDate']>) {
    //   state.selectedDate = action.payload
    //   state.currentDate = action.payload.startTime
    // },
    setCurrentDate(state, actions: PayloadAction<State['currentDate']>) {
      state.currentDate = actions.payload
    },
    setToday(state) {
      state.currentDate = dayjs().valueOf()
    },
    onPrevDay(state) {
      state.currentDate = dayjs(state.currentDate).add(-1, 'day').valueOf()
    },
    onNextDay(state) {
      state.currentDate = dayjs(state.currentDate).add(1, 'day').valueOf()
    },
  },
  extraReducers(builder) {
    builder.addCase(getScheduleListForCurrentDay.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
  },
})
const createScheduleVisualization = slice.reducer

export const { setToday, onPrevDay, onNextDay, setCurrentDate } = slice.actions

export default createScheduleVisualization

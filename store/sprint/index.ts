import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSprintList } from './sprint.thunk'

type SliceState = {
  guideVisible: Model.Sprint.Visible
  taskList?: Model.Sprint.Task[]
}

const initialState: SliceState = {
  guideVisible: false,
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setGuideVisible(state, action: PayloadAction<SliceState['guideVisible']>) {
      state.guideVisible = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getSprintList.fulfilled, (state, action) => {
      state.taskList = action.payload
    })
  },
})

const sprint = slice.reducer

export const { setGuideVisible } = slice.actions

export default sprint

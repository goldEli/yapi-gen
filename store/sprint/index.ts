import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSprintList } from './sprint.thunk'

type SliceState = {
  guideVisible: Model.Sprint.Visible
  taskList?: Model.Sprint.Task[]
  sprintDetailDrawer: {
    visible: boolean
    params?: any
  }
}

const initialState: SliceState = {
  guideVisible: false,
  sprintDetailDrawer: {
    visible: false,
    params: {},
  },
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setGuideVisible(state, action: PayloadAction<SliceState['guideVisible']>) {
      state.guideVisible = action.payload
    },
    setSprintDetailDrawer(
      state,
      action: PayloadAction<SliceState['sprintDetailDrawer']>,
    ) {
      state.sprintDetailDrawer = {
        ...state.sprintDetailDrawer,
        ...action.payload,
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getSprintList.fulfilled, (state, action) => {
      state.taskList = action.payload
    })
  },
})

const sprint = slice.reducer

export const { setGuideVisible, setSprintDetailDrawer } = slice.actions

export default sprint

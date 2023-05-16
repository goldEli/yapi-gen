import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSprintList } from './sprint.thunk'

type SliceState = {
  visible: boolean
  taskList?: Model.Sprint.Task[]
}

const initialState: SliceState = {
  visible: false,
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setVisible(state, action: PayloadAction<SliceState['visible']>) {
      state.visible = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getSprintList.fulfilled, (state, action) => {
      state.taskList = action.payload
    })
  },
})

const sprint = slice.reducer

export const { setVisible } = slice.actions

export default sprint

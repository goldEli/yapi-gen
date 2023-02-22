import { createSlice } from '@reduxjs/toolkit'
import { getProjectCover } from '@store/cover/thunks'

type SliceState = {
  createVisible: boolean
}

const slice = createSlice({
  name: 'createProject',
  initialState: {
    createVisible: false,
  } as SliceState,
  reducers: {
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(getProjectCover.fulfilled, (state, action) => {
      // console.log(action)
    })
  },
})

export const { changeCreateVisible } = slice.actions

export default slice.reducer

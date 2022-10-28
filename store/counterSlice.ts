/* eslint-disable no-duplicate-imports */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  list: Array<any>
  value: number
}

const initialState: CounterState = {
  list: [],
  value: 0,
}
const getMovieListApi = () => fetch(
  'https://pcw-api.iqiyi.com/search/recommend/list?channel_id=1&data_type=1&mode=24&page_id=1&ret_num=48',
).then(res => res.json())

export const getMovieData = createAsyncThunk(
  'counter/getMovieData',
  async value => {

    // console.log(value)

    const res = await getMovieListApi()
    return res
  },
)

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {

      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMovieData.pending, state => {

        // console.log('🚀 ~ 进行中！')
      })
      .addCase(getMovieData.fulfilled, (state, { payload }) => {

        // console.log('🚀 ~ fulfilled', payload)
        state.list = payload.data.list
      })
      .addCase(getMovieData.rejected, (state, err) => {

        // console.log('🚀 ~ rejected', err)
      })
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

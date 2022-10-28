/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { pusher } from '@/components/LongLinke'
import { useSelector, useDispatch } from '../../../store'
import {
  decrement,
  increment,
  incrementByAmount,
  getMovieData,
} from '../../../store/counterSlice'

const index = () => {
  const { value: count, list } = useSelector((state: any) => state.counter)
  const dispatch = useDispatch()
  const channel = pusher.subscribe('private-snowy-pine-462.39')

  channel.bind('App\\Events\\Myabeyance', (data: any) => {

    // console.log(data)

    alert(data)
    pusher.send_event('private-snowy-pine-462.39', { name: '我又给你发消息  ' })
  })
  channel.bind('pusher:subscription_succeeded', (members: any) => {

    // console.log(members)
    alert('successfully subscribed!')
  })

  const send = () => {
    pusher.send_event('private-snowy-pine-462.39', { name: '杨一' })
    dispatch(increment)
    dispatch(getMovieData())
  }

  // console.log(list)

  return (
    <>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(incrementByAmount(123))}
        >
          Increment
        </button>
        <button onClick={send}>{count}</button>
        <button
          aria-label="Decrement value"
          onClick={() => {
            setTimeout(() => {
              dispatch(decrement())
            }, 2000)
          }}
        >
          Decrement
        </button>
      </div>
      <ul>
        {list.map((item: any) => <li key={item.albumId}>{item.name}</li>)}
      </ul>
    </>
  )
}

export default index

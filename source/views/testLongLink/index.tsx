/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { pusher } from '@/components/LongLinke'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
} from '../../store/counterSlice'

const index = () => {
  const count = useSelector((state: any) => state.counter.value)
  const dispatch = useDispatch()
  const channel = pusher.subscribe('testmyabeyance')

  channel.bind('App\\Events\\Myabeyance', (data: any) => {

    // console.log(data)

    alert(data)
    pusher.send_event('testmyabeyance', { name: '杨一' })
  })
  channel.bind('pusher:subscription_succeeded', (members: any) => {

    // console.log(members)
    // alert('successfully subscribed!')
  })

  const send = () => {
    pusher.send_event('testmyabeyance', { name: '杨一' })
  }
  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(incrementByAmount(123))}
        >
          Increment
        </button>
        <span>{count}</span>
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
    </div>
  )
}

export default index

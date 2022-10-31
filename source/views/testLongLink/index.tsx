import useWebsocket from '@/tools/useWebsocket'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from '../../../store'
import {
  decrement,
  increment,
  incrementByAmount,
  getMovieData,
} from '../../../store/counterSlice'

const Index = () => {
  const [isLocalPage, setIsLocalPage] = useState(true)
  const { readyState, closeWebSocket, reconnect, sendMessage } = useWebsocket()
  const { value: count, list } = useSelector((state: any) => state.counter)
  const dispatch = useDispatch()

  const send = () => {
    dispatch(increment)
    dispatch(getMovieData())
  }

  // useEffect(() => {
  //   // 主动请求
  //   if (readyState.key === 1 && isLocalPage) {
  //     console.log(readyState, wsData, '----------readyState')
  //     // eslint-disable-next-line no-inline-comments
  //     sendMessage('hello websocket') // 发送信息
  //   }

  //   // 接受到socket数据， 进行业务逻辑处理
  //   if (Object.keys(wsData).length !== 0) {
  //     console.log(wsData)
  //   }

  //   // 如果是已关闭且是当前页面自动重连
  //   if (readyState.key === 3 && isLocalPage) {
  //     // reconnect()
  //   }

  //   // 不是当前页面 清空 webSocket 此处为优化代码使用的，不需要可以直接删除。
  //   if (!isLocalPage) {
  //     closeWebSocket()
  //   }
  // }, [wsData, readyState, isLocalPage])

  const checkIsLocalPage = () => {
    document.addEventListener('visibilitychange', () => {
      // 页面变为不可见时触发
      if (document.visibilityState === 'hidden') {
        setIsLocalPage(false)
      }

      // 页面变为可见时触发
      if (document.visibilityState === 'visible') {
        setIsLocalPage(true)
      }
    })
  }

  // console.log(list)
  useEffect(() => {
    checkIsLocalPage()
  })
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
        {list.map((item: any) => (
          <li key={item.albumId}>{item.name}</li>
        ))}
      </ul>
    </>
  )
}

export default Index

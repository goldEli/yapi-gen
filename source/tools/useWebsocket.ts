/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
import { onlySysNotice } from '@/services/sysNotice'
import { getLoginDetail, getTicket, loginOut } from '@/services/user'
import { useSelector } from '@store/index'
import { debounce, throttle } from 'lodash'
import { useState, useRef, useEffect } from 'react'

const useWebsocket = () => {
  const { loginInfo } = useSelector(store => store.user.loginInfo)
  const NoData = ['AH000', 'M9999']
  const ws = useRef<WebSocket | null>(null)
  // socket 数据
  const [wsData, setWsData] = useState<any>()

  //  socket 状态
  const [readyState, setReadyState] = useState<any>({
    key: 0,
    value: '正在连接中',
  })

  type TypeHeartCheck = {
    timeout: number
    timeoutObj: any
    reset(): TypeHeartCheck
    start(id: any): void
  }

  const heartCheck: TypeHeartCheck = {
    timeout: 1 * 10 * 1000,
    timeoutObj: null,
    reset() {
      clearInterval(this.timeoutObj)
      return this
    },
    start(id) {
      this.timeoutObj = setInterval(() => {
        const obj = JSON.stringify({
          to: [id],
          msgType: 'M9999',
          customType: '',
          source: 'web',
          msgIds: [],
          msgBody: { content: '1' },
          customData: {},
        })
        sendMessage(obj)
      }, this.timeout)
    },
  }
  const creatWebSocket = async (token: string, id: any) => {
    if (!token) {
      return
    }
    const stateArr = [
      { key: 0, value: '正在连接中' },
      { key: 1, value: '已经连接并且可以通讯' },
      { key: 2, value: '连接正在关闭' },
      { key: 3, value: '连接已关闭或者没有连接成功' },
    ]

    ws.current = new WebSocket(
      `${import.meta.env.__WEB_SOCKET_URL__}?token=${token}
        `,
      // 'ws://192.168.2.64:5008',
    )
    ws.current.onopen = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
      heartCheck.reset().start(id)
    }
    ws.current.onclose = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
    }
    ws.current.onerror = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
    }
    ws.current.onmessage = throttle(
      (e: any) => {
        const data = JSON.parse(e.data)
        if (data.msgType === 'AH001') {
          sessionStorage.removeItem('saveRouter')
          try {
            loginOut()
            setTimeout(() => {
              localStorage.removeItem('agileToken')
              localStorage.removeItem('quickCreateData')
              getTicket()
            }, 100)
          } catch (error) {
            //
          }
          return
        }
        if (NoData.includes(data.msgType)) {
          return
        }

        setWsData({
          key: Math.random() * 10000,
          data,
        })
      },
      2000,
      {
        trailing: false,
      },
    )
  }

  //  关闭 WebSocket
  const closeWebSocket = () => {
    ws.current?.close()
  }

  // 发送数据
  const sendMessage = (str: any) => {
    ws.current?.send(str)
  }

  // 重连
  const reconnect = async () => {
    const res = await getLoginDetail()

    ws.current = null
    creatWebSocket(res.data?.comAuth?.token, res?.data?.id)
  }

  useEffect(() => {
    if (readyState.key === 3) {
      reconnect()
    }
  }, [readyState])

  //    wsData （获得的 socket 数据）、readyState（当前 socket 状态）、closeWebSocket （关闭 socket）、reconnect（重连）

  return {
    wsData,
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
    creatWebSocket,
  }
}

export default useWebsocket

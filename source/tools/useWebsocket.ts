/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
import { useState, useRef, useEffect } from 'react'

const useWebsocket = () => {
  const ws = useRef<WebSocket | null>(null)

  // socket 数据
  // const [wsData, setMessage] = useState({})

  //  socket 状态
  const [readyState, setReadyState] = useState<any>({
    key: 0,
    value: '正在连接中',
  })

  type TypeHeartCheck = {
    timeout: number
    timeoutObj: any
    reset(): TypeHeartCheck
    start(): void
  }

  const heartCheck: TypeHeartCheck = {
    timeout: 2000,
    timeoutObj: null,
    reset() {
      clearInterval(this.timeoutObj)
      return this
    },
    start() {
      this.timeoutObj = setInterval(() => {
        sendMessage('HeartBeat')
      }, this.timeout)
    },
  }
  const creatWebSocket = () => {
    const stateArr = [
      { key: 0, value: '正在连接中' },
      { key: 1, value: '已经连接并且可以通讯' },
      { key: 2, value: '连接正在关闭' },
      { key: 3, value: '连接已关闭或者没有连接成功' },
    ]

    ws.current = new WebSocket(import.meta.env.__WEB_SOCKET_URL__)

    ws.current.onopen = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
      heartCheck.reset().start()
    }
    ws.current.onclose = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
    }
    ws.current.onerror = () => {
      setReadyState(stateArr[ws.current?.readyState ?? 0])
    }
    ws.current.onmessage = (e: any) => {
      //  const { data, type } = (...JSON.parse(e.data)) || {};
      // switch (
      //   type // type 是跟后端约定的
      // ) {
      //   case '101':
      //     setMessage({ ...JSON.parse(e.data) },review: data); //根据自身情况进行修改
      //     break;
      //   case '102':
      //     setMessage({ ...JSON.parse(e.data) },pipelineResults: data);//根据自身情况进行修改
      //     break;
      //   default:
      //     setMessage({ ...JSON.parse(e.data), ...data });//根据自身情况进行修改
      //     break;
      // }
    }
  }

  const webSocketInit = () => {
    if (!ws.current || ws.current.readyState === 3) {
      creatWebSocket()
    }
  }

  //  关闭 WebSocket
  const closeWebSocket = () => {
    ws.current?.close()
  }

  // 发送数据
  const sendMessage = (str: string) => {
    ws.current?.send(str)
  }

  // 重连
  const reconnect = () => {
    closeWebSocket()
    ws.current = null
    creatWebSocket()
  }

  useEffect(() => {
    webSocketInit()
    return () => {
      ws.current?.close()
    }
  }, [ws])

  //    wsData （获得的 socket 数据）、readyState（当前 socket 状态）、closeWebSocket （关闭 socket）、reconnect（重连）

  return {
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
  }
}

export default useWebsocket

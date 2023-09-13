// 错误边界 -- 用于构建新版本后白屏问题

import * as React from 'react'
import DeleteConfirm from './DeleteConfirm'

interface PropsType {
  children: React.ReactNode
}

interface StateType {
  error?: null | Error
  errorInfo?: null | React.ErrorInfo
  isShowModal?: any
  languageList?: any[]
  hasError: false
}

export class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      isShowModal: true,
      hasError: false,
      languageList: [
        { key: 'zh', title: '版本更新提示', text: '版本更新，请刷新重试！' },
        {
          key: 'en',
          title: 'Version update prompt',
          text: 'Version update, please refresh and try again!',
        },
      ],
    }
  }

  // static getDerivedStateFromError() {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true }
  // }

  //捕获抛出异常
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    //传递异常信息
    this.setState({
      error,
      errorInfo,
    })
    //可以将异常信息抛出给日志系统等等
    // logErrorToMyService(error, info.componentStack)
  }

  render() {
    const language = localStorage.getItem('language') || 'zh'

    // 确认事件
    const onConfirm = () => {
      this.setState({
        isShowModal: false,
      })
      location.reload()
    }

    //如果捕获找不到文件异常，弹窗提示
    if (
      this.state.error?.message.includes(
        'Failed to fetch dynamically imported module',
      )
    ) {
      return (
        <DeleteConfirm
          title={
            this.state.languageList?.filter((i: any) => i.key === language)[0]
              .title
          }
          text={
            this.state.languageList?.filter((i: any) => i.key === language)[0]
              .text
          }
          isVisible={this.state.isShowModal}
          onConfirm={onConfirm}
          notCancel
        />
      )
    }
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>{this.state.error.message}</h1>
          <div>{this.state.error.stack}</div>
        </div>
      )
    }
    return this.props.children
  }
}

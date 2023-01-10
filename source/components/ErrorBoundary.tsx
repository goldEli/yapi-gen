import * as React from 'react'
import log from '@jihe/secure-log'
import DeleteConfirm from './DeleteConfirm'

interface PropsType {
  children: React.ReactNode
}

interface StateType {
  error?: null | Error
  errorInfo?: null | React.ErrorInfo
  isShowModal?: any
}

export class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      isShowModal: true,
    }
  }

  //捕获抛出异常
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log.print('错误捕捉', errorInfo)
    //传递异常信息
    this.setState({
      error,
      errorInfo,
    })
    //可以将异常信息抛出给日志系统等等
    //do something....
  }

  render() {
    // 关闭弹窗
    const onClose = () => {
      this.setState({
        isShowModal: false,
      })
    }

    // 确认事件
    const onConfirm = () => {
      this.setState({
        isShowModal: false,
      })
      location.reload()
      localStorage.clear()
    }

    //如果捕获到异常，渲染降级UI
    if (this.state.errorInfo) {
      return (
        <DeleteConfirm
          text="有新的版本更新，请刷新！"
          isVisible={this.state.isShowModal}
          onChangeVisible={onClose}
          onConfirm={onConfirm}
        />
      )
    }
    return this.props.children
  }
}

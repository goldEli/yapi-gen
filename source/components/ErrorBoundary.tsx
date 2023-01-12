import * as React from 'react'
import log from '@jihe/secure-log'
import DeleteConfirm from './DeleteConfirm'

interface PropsType {
  children: React.ReactNode
}

interface StateType {
  error?: null | Error[]
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
    //传递异常信息
    this.setState({
      error: error as unknown as Error[],
      errorInfo,
    })
    //可以将异常信息抛出给日志系统等等
  }

  render() {
    const language = localStorage.getItem('language')

    // 确认事件
    const onConfirm = () => {
      this.setState({
        isShowModal: false,
      })
      location.reload()
    }

    //如果捕获找不到文件异常，弹窗提示
    if (
      this.state.error?.find(v =>
        v.message.includes('Failed to fetch dynamically imported module'),
      )
    ) {
      return (
        <DeleteConfirm
          title={language === 'zh' ? '版本更新提示' : 'Version update prompt'}
          text={
            language === 'zh'
              ? '版本更新，请刷新重试！'
              : 'Version update, please refresh and try again!'
          }
          isVisible={this.state.isShowModal}
          onConfirm={onConfirm}
          notCancel
        />
      )
    }
    return this.props.children
  }
}

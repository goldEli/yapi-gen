import * as React from 'react'
import log from '@jihe/secure-log'

interface PropsType {
  children: React.ReactNode
}

interface StateType {
  error?: null | Error
  errorInfo?: null | React.ErrorInfo
}

export class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
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
    //如果捕获到异常，渲染降级UI
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

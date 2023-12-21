import React from 'react'
import styles from './style.module.css'
import Icon from '../../assets/icons'
import { Button } from 'antd'

interface Props {
  url?: string
}

const ViewFail = (props: Props) => {
  const onDownload = () => window.open(props.url)

  return (
    <div className={styles.error_div}>
      <Icon className={styles.warning_icon} type="warning" />
      <h1 className={styles.title}>预览失败</h1>
      <p className={styles.sub_title}>
        暂不支持预览，我们将持续优化，敬请期待 ！
      </p>
      <Button type="primary" onClick={onDownload}>
        下载
      </Button>
    </div>
  )
}

export default ViewFail

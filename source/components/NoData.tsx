// 暂无数据

/* eslint-disable react/jsx-no-leaked-render */
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import noData from '/noData.png'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  padding: 16,
  div: {
    color: '#323233',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 24,
  },
})

interface Props {
  // 其他的文字，例：需求设置的状态定义列表
  subText?: any
  // 有操作的
  children?: any
}

const NoData = (props: Props) => {
  const [t] = useTranslation()
  return (
    <Wrap>
      <img src={noData} style={{ width: 240 }} alt="" />
      {!props?.subText && !props?.children && (
        <div>{t('components.noData')}</div>
      )}
      {props?.subText && (
        <span style={{ color: '#969799', fontSize: 14, marginTop: 24 }}>
          {props?.subText}
        </span>
      )}
      {props?.children}
    </Wrap>
  )
}

export default NoData

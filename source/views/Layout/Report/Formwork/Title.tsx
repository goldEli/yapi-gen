import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useState } from 'react'

const Text = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  font-family: SiYuanMedium;
  margin-left: 24px;

  span:nth-child(2) {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    color: var(--neutral-n3);
    margin-left: 8px;
  }
`
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  padding-right: 16px;

  &:hover {
    cursor: pointer;
  }
`
interface Props {
  // 顶部标题
  headerTitle: string
  // icon是否展开
  onChange(value: boolean): void
  // 标题描述
  msg?: string
}
const Title = (props: Props) => {
  const [infoIcon, setInfoIcon] = useState(false)
  return (
    <TitleStyle
      onClick={() => {
        setInfoIcon(!infoIcon)
        props.onChange(infoIcon)
      }}
    >
      {/* <CommonIconFont
        type={infoIcon ? 'right-icon' : 'down-icon'}
        size={14}
        color="var(--neutral-n3)"
      /> */}
      <Text>
        <span>{props.headerTitle}</span>
        <span>{props.msg}</span>
      </Text>
    </TitleStyle>
  )
}
export default Title

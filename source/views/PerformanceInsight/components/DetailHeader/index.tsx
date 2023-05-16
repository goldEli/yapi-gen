import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import { useState } from 'react'
import {
  HeaderStyle,
  BackIcon,
  ChangeIconGroup,
  UpWrap,
  DownWrap,
} from '../style'
const DetailHeader = (props: { ids: number[] }) => {
  const [currentIndex, setCurrentIndex] = useState(4)
  const onCancel = () => {
    // 获取当前需求的下标， 用作上一下一切换
    //  setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
  }
  return (
    <HeaderStyle>
      <Space size={16}>
        <BackIcon onClick={onCancel}>
          <CommonIconFont type="right-02" size={20} color="var(--neutral-n2)" />
        </BackIcon>
      </Space>
      <Space size={16}>
        <ChangeIconGroup>
          {currentIndex > 0 && (
            <UpWrap
              // onClick={onUpDemand}
              id="upIcon"
              isOnly={
                props.ids?.length === 0 ||
                currentIndex === props.ids?.length - 1
              }
            >
              <CommonIconFont
                type="up"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </UpWrap>
          )}
          {!(
            props.ids?.length === 0 || currentIndex === props.ids?.length - 1
          ) && (
            <DownWrap
              //   onClick={onDownDemand}
              id="downIcon"
              isOnly={currentIndex <= 0}
            >
              <CommonIconFont
                type="down"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </DownWrap>
          )}
        </ChangeIconGroup>
      </Space>
    </HeaderStyle>
  )
}
export default DetailHeader

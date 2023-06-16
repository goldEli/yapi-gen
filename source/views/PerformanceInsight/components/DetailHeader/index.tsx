import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import { useEffect, useState } from 'react'
import {
  HeaderStyle,
  BackIcon,
  ChangeIconGroup,
  UpWrap,
  DownWrap,
} from '../style'
interface Header {
  ids: number[]
  infoId: number
  onCancel: () => void
  onPageNum: (id: number) => void
}
const DetailHeader = (props: Header) => {
  const [currentIndex, setCurrentIndex] = useState(4)
  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = props.ids[currentIndex - 1]
    if (!currentIndex) return
    props.onPageNum(newIndex)
  }
  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = props.ids[currentIndex + 1]
    if (currentIndex === props.ids?.length - 1) return
    props.onPageNum(newIndex)
  }
  useEffect(() => {
    // 根据当前获取当前id的下标， 用作上一下一切换
    setCurrentIndex((props.ids || []).findIndex((i: any) => i === props.infoId))
  }, [props.infoId])
  return (
    <HeaderStyle>
      <Space size={16}>
        <BackIcon onClick={props.onCancel}>
          <CommonIconFont type="right-02" size={20} color="var(--neutral-n2)" />
        </BackIcon>
      </Space>
      <Space size={16}>
        <ChangeIconGroup>
          {currentIndex > 0 && (
            <UpWrap
              onClick={onUpDemand}
              id="upIcon"
              isOnly={
                props.ids?.length === 0 || currentIndex === props.ids?.length
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
              onClick={onDownDemand}
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

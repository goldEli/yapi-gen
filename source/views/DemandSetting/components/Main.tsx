import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useState } from 'react'
import TabsDragging from './TabsDragging'
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 20px 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const Main = () => {
  const [infoIcon, setInfoIcon] = useState(true)
  const [moreIcon, setMoreIcon] = useState(false)
  const [list, setList] = useState<any>(() =>
    [1, 2, 3, 4, 5].map(v => ({
      key: v,
      children: `Item ${v}`,
    })),
  )
  const onChangeDragging = (item: any) => {
    setList(
      list.map((el: any) => ({
        ...el,
        active: el.children === item ? true : false,
      })),
    )
  }
  return (
    <div style={{ flex: 1 }}>
      <>
        <TitleStyle onClick={() => setInfoIcon(!infoIcon)}>
          <CommonIconFont
            type={infoIcon ? 'down-icon' : 'right-icon'}
            size={14}
            color="var(--neutral-n3)"
          />
          <span>基本信息</span>
        </TitleStyle>
        {infoIcon && (
          <TabsDragging
            onChange={(item: any) => onChangeDragging(item)}
            list={list}
            setList={setList}
          />
        )}
      </>
      <>
        <TitleStyle onClick={() => setMoreIcon(!moreIcon)}>
          <CommonIconFont
            type={moreIcon ? 'down-icon' : 'right-icon'}
            size={14}
            color="var(--neutral-n3)"
          />
          <span>更多折叠</span>
        </TitleStyle>
        {moreIcon && (
          <TabsDragging
            onChange={(item: any) => onChangeDragging(item)}
            list={list}
            setList={setList}
          />
        )}
      </>
    </div>
  )
}
export default Main

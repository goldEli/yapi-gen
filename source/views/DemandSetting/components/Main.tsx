import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import { useDispatch } from 'react-redux'
import { useSelector } from '@store/index'

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
  const { getCategoryConfigDataList } = useSelector(store => store.category)
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
          list={getCategoryConfigDataList?.isFoldF}
          setList={setList}
        />
      )}
      {getCategoryConfigDataList?.isFoldT?.length >= 1 && (
        <TitleStyle onClick={() => setMoreIcon(!moreIcon)}>
          <CommonIconFont
            type={moreIcon ? 'down-icon' : 'right-icon'}
            size={14}
            color="var(--neutral-n3)"
          />
          <span>更多折叠</span>
        </TitleStyle>
      )}
      {getCategoryConfigDataList?.isFoldT?.length >= 1 && moreIcon && (
        <TabsDragging
          onChange={(item: any) => onChangeDragging(item)}
          list={getCategoryConfigDataList?.isFoldT}
          setList={setList}
        />
      )}
    </div>
  )
}
export default Main

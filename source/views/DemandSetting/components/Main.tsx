import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import { useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 20px 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`

const Main = (props: any) => {
  const [infoIcon, setInfoIcon] = useState(true)
  const [moreIcon, setMoreIcon] = useState(false)
  const { getCategoryConfigDataList } = useSelector(store => store.category)
  const [getCategoryConfigT, setGetCategoryConfigT] = useState<any>()
  const [getCategoryConfigF, setGetCategoryConfigF] = useState<any>()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delItem, setDelItem] = useState<any>()
  useEffect(() => {
    setGetCategoryConfigT(getCategoryConfigDataList?.isFoldT)
    setGetCategoryConfigF(getCategoryConfigDataList?.isFoldF)
  }, [getCategoryConfigDataList])
  //  移动后跟新的数据
  const onMove = (state: number, data: any) => {
    if (state === 1) {
      setGetCategoryConfigF(data)
    } else {
      setGetCategoryConfigT(data)
    }
    props.onIsOperate(true)
  }
  // 删除
  const onDelete = (state: any, child: any) => {
    setDelItem({ state, child })
    setIsVisible(true)
  }
  const delConfig = () => {
    const { state, child } = delItem
    if (state === 1) {
      setGetCategoryConfigF(
        getCategoryConfigF.filter((item: any) => item.id !== child.id),
      )
    } else {
      setGetCategoryConfigT(
        getCategoryConfigT.filter((item: any) => item.id !== child.id),
      )
    }
    setIsVisible(false)
    props.onIsOperate(true)
  }
  // 必填
  const onChangeChecked = (state: any, val: boolean, child: any) => {
    const checked = val ? 1 : 2
    if (state === 1) {
      setGetCategoryConfigF(
        getCategoryConfigF?.map((el: any) => ({
          ...el,
          isRequired: el.id === child.id ? checked : el.isRequired,
        })),
      )
    } else {
      setGetCategoryConfigT(
        getCategoryConfigT?.map((el: any) => ({
          ...el,
          isRequired: el.id === child.id ? checked : el.isRequired,
        })),
      )
    }
    props.onIsOperate(true)
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
          onMove={(data: any) => onMove(1, data)}
          list={getCategoryConfigF}
          onChangeChecked={(val: boolean, child: any) =>
            onChangeChecked(1, val, child)
          }
          onDelete={(child: any) => onDelete(1, child)}
          setList={setGetCategoryConfigF}
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
          onMove={(data: any) => onMove(2, data)}
          list={getCategoryConfigT}
          onDelete={(child: any) => onDelete(2, child)}
          onChangeChecked={(val: boolean, child: any) =>
            onChangeChecked(1, val, child)
          }
          setList={setGetCategoryConfigT}
        />
      )}
      <DeleteConfirm
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(false)}
        onConfirm={() => delConfig()}
      />
    </div>
  )
}
export default Main

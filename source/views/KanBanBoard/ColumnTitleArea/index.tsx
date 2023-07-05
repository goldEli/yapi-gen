/**
 * kanban 列title区域
 */
import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import CommonIconFont from '@/components/CommonIconFont'
import { getMessage } from '@/components/Message'

interface ColumnTitleAreaProps {}
const ColumnTitle = styled.span`
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const ColumnTitleAreaBox = styled.div`
  display: flex;
  gap: 16px;
  background: var(--neutral-white-d2);
  position: sticky;
  top: 0px;
  z-index: 20;
`

const MaxText = styled.div`
  display: flex;
  align-items: center;
  color: var(--function-warning);
  font-size: 12px;
  margin-left: 8px;
  span {
    margin-left: 4px;
  }
  svg {
    font-size: 16px;
  }
`

const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  // debugger
  const { kanbanConfig, kanbanInfoByGroup } = useSelector(store => store.kanBan)

  return (
    <ColumnTitleAreaBox>
      {kanbanConfig?.columns?.map(item => {
        // const num = kanbanInfoByGroup?.reduce?.((res, group) => {
        //   const len =
        //     group.columns?.find(column => column.id === item.id)?.stories
        //       .length ?? 0
        //   return len + res
        // }, 0)
        let storyData = kanbanInfoByGroup?.reduce?.((res: any[], group) => {
          const storiesIds = group.columns
            ?.find(column => column.id === item.id)
            ?.stories.map(item => item.id) ?? [0]
          res.push(storiesIds)
          return res
        }, [])
        storyData = [...new Set(storyData.flat())]
        const num = storyData.length
        return (
          <ColumnTitle key={item.id}>
            {`${item.name}（${num}）`}
            {num > item.max_num && (
              <MaxText>
                <CommonIconFont type="warning-02" />
                <span>已超过最大数</span>
              </MaxText>
            )}
          </ColumnTitle>
        )
      })}
    </ColumnTitleAreaBox>
  )
}

export default ColumnTitleArea

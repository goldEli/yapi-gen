/**
 * kanban 列title区域
 */
import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import CommonIconFont from '@/components/CommonIconFont'
import { getMessage } from '@/components/Message'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

interface ColumnTitleAreaProps {}
const ColumnTitle = styled.span`
  width: 302px;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 24px;
  background: var(--neutral-n9);
  margin-bottom: 16px;
  .name {
    max-width: 52%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
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
  background: var(--function-warning);
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
  color: var(--neutral-white-d1);
`

const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  const [t] = useTranslation()
  const { kanbanConfig, kanbanInfoByGroup } = useSelector(store => store.kanBan)

  const refBox = useRef<HTMLDivElement>(null)
  const ColumnTitleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      if (!refBox.current) {
        return
      }
      const eleAttr = [...refBox.current?.children].map(item => {
        return {
          number: Number(item.getAttribute('data-num')),
          max_num: Number(item.getAttribute('data-max_num')),
        }
      })
      console.log('eleAttr--', eleAttr)
      if (
        eleAttr.some(item => {
          if (!item.number || !item.max_num) {
            return false
          }
          return item.number > item.max_num
        })
      ) {
        getMessage({ type: 'warning', msg: t('other.cardMax') })
      }
    }, 500)
  }, [ColumnTitleRef.current])
  return (
    <ColumnTitleAreaBox ref={refBox}>
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
          <ColumnTitle
            key={item.id}
            ref={ColumnTitleRef}
            data-num={num}
            data-max_num={item.max_num}
          >
            <Tooltip title={item.name}>
              <div className="name">{item.name}</div>
            </Tooltip>
            （{num}）
            {num > item.max_num && (
              <Tooltip title={t('other.maxEd')}>
                <MaxText>
                  {t('maximum')}：{item.max_num}
                </MaxText>
              </Tooltip>
            )}
          </ColumnTitle>
        )
      })}
    </ColumnTitleAreaBox>
  )
}

export default ColumnTitleArea

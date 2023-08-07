/* eslint-disable no-undefined */
import styled from '@emotion/styled'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonUserAvatar from '../CommonUserAvatar'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const RecordItem = styled.div<{ isDrawer?: boolean }>`
  padding: ${props => (props.isDrawer ? 0 : 16)}px;
  margin-bottom: ${props => (props.isDrawer ? 24 : 0)}px;
  border-bottom: ${props =>
    props.isDrawer ? 'none' : '1px solid var(--neutral-n6-d1)'};
  display: flex;
  align-items: flex-start;
`

const ItemAvatar = styled.div`
  width: 24px;
  margin-right: 12px;
`

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 14px;
    div {
      font-family: SiYuanMedium;
      margin-right: 16px;
      color: var(--neutral-n1-d1);
    }
    span {
      color: var(--neutral-n2);
    }
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  font-size: 12px;
  color: var(--neutral-n3);
`

interface ScheduleRecordProps {
  // 1是需求，2是缺陷，3是事务
  type: 1 | 2 | 3
  // 详情id
  detailId: number
  // 项目id
  projectId: number
  //  是否是浮层
  isDrawer?: boolean
}

const mock = [
  {
    avatar: '',
    name: '漳卅',
    position: 'UI设计',
    processStart: '18',
    processEnd: '50',
    date: '2022-06-20 15：30',
    time: '5',
    info: '哈就撒娇好噶计划的嘎时间',
    id: 0,
  },
  {
    avatar: '',
    name: '漳卅',
    position: 'UI设计',
    processStart: '18',
    processEnd: '50',
    date: '2022-06-20 15：30',
    time: '5',
    info: '哈就撒娇好噶计划的嘎时间',
    id: 1,
  },
]

const ScheduleRecord = (props: ScheduleRecordProps) => {
  const [t] = useTranslation()
  const [listData, setListData] = useState({
    list: undefined,
  })
  return (
    <Wrap>
      {mock.map((i: any) => (
        <RecordItem key={i.id} isDrawer={props.isDrawer}>
          <ItemAvatar>
            <CommonUserAvatar avatar={i.avatar} />
          </ItemAvatar>
          <ItemContent>
            <div className="title">
              <div>
                {i.name}（{i.position}）
              </div>
              <span>
                更新了进度{i.processStart}% - {i.processEnd}%
              </span>
            </div>
            <InfoRow>达成日期：{i.date}</InfoRow>
            <InfoRow>工时花费：本次{i.time}h</InfoRow>
            <InfoRow>更新说明：{i.info}</InfoRow>
          </ItemContent>
        </RecordItem>
      ))}
    </Wrap>
  )
}

export default ScheduleRecord

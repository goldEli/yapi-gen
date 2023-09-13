/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

// 公用严重程度弹窗

import { Popover } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import { getPriOrStu } from '@/services/mine'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { SeverityWrap } from '../StyleCommon'

const Wrap = styled.div`
  height: 32px;
  min-width: 120px;
  box-sizing: border-box;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  cursor: pointer;
  &:hover {
    background-color: var(--hover-d2);
    color: var(--neutral-n1-d1);
  }
`
const Contain = styled.div`
  padding: 10px 0;
  min-width: 120px;
  display: flex;
  flex-direction: column;
`

interface SeverityContentProps {
  record?: any
  onHide(): void
  onTap?(id: any): void
  onCurrentDetail?(item: any): void
  // 用于判断当前是否是所有项目， 是则调用就接口获取下拉值
  projectId?: any
}

const SeverityContent = (props: SeverityContentProps) => {
  const { projectInfoValues } = useSelector(store => store.project)

  const { record, onHide, onTap } = props
  const { project_id: pid, id: storyID } = record
  const [showData, setShowData] = useState<any>([])

  const init = async () => {
    if (props.projectId === 0) {
      const res = await getPriOrStu({
        projectId: pid,
        type: 'severity',
      })
      setShowData(res.data)
    } else {
      setShowData(
        projectInfoValues
          ?.filter((i: any) => i.key === 'severity')[0]
          ?.children?.filter((k: any) => k.id !== -1),
      )
    }
  }

  useEffect(() => {
    init()
  }, [record])

  const changeState = (value: any) => {
    const data = {
      severity: value,
      projectId: pid,
      id: storyID,
    }
    onTap?.(data)
    props.onCurrentDetail?.(showData.filter((i: any) => i.id === value)[0])
    onHide()
  }

  return (
    <Contain>
      {showData.map((item: any) => (
        <Wrap onClick={() => changeState(item.id)} key={item.id}>
          <SeverityWrap style={{ background: item?.color }}>
            {item.content}
          </SeverityWrap>
        </Wrap>
      ))}
    </Contain>
  )
}

interface Props {
  isShow?: boolean
  onChangeSeverity?(item: any): void
  record: any
  isCanOperation?: boolean
  projectId?: any
  onCurrentDetail?(item: any): void
  children?: ReactNode
}

const ChangeSeverityPopover = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)

  // 修改严重程度
  const onChangeSeverity = (item: any) => {
    props.onChangeSeverity?.(item)
    setPopoverVisible(false)
  }

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      placement="bottomLeft"
      trigger="click"
      destroyTooltipOnHide
      getPopupContainer={n => (props.isShow ? n : document.body)}
      content={
        props?.isCanOperation && (
          <SeverityContent
            onTap={onChangeSeverity}
            onHide={() => setPopoverVisible(false)}
            record={props?.record}
            projectId={props?.projectId}
            onCurrentDetail={props?.onCurrentDetail}
          />
        )
      }
    >
      {props.children && <>{props.children}</>}

      {!props.children && (
        <SeverityWrap
          style={{
            background: props.record.severity?.color,
            width: 'max-content',
            cursor: props.isCanOperation ? 'pointer' : 'initial',
          }}
        >
          {props.record.severity?.content ?? '--'}
        </SeverityWrap>
      )}
    </Popover>
  )
}

export default ChangeSeverityPopover

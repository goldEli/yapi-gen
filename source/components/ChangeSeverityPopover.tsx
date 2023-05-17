/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

// 公用严重程度弹窗

import { Popover } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import { LevelContent } from './Level'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { SeverityWrap } from './StyleCommon'

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
  const [showData, setShowData] = useState<any>([
    { id: 0, content: '一般', content_txt: '一般', color: '#FF5C5E' },
    { id: 1, content: '严重', content_txt: '严重', color: '#FF5C5E' },
  ])

  const init = async () => {
    if (props.projectId === 0) {
      //   const res = await getPriOrStu({
      //     projectId: pid,
      //     type: 'priority',
      //   })
      //   setShowData(res.data)
    } else {
      //   setShowData(
      //     projectInfoValues
      //       ?.filter((i: any) => i.key === 'priority')[0]
      //       ?.children?.filter((k: any) => k.id !== -1),
      //   )
    }
  }

  useEffect(() => {
    init()
  }, [record])

  const changeState = (value: any) => {
    const data = {
      priorityId: value,
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
          <SeverityWrap style={{ background: item.color }}>
            {item.content_txt}
          </SeverityWrap>
        </Wrap>
      ))}
    </Contain>
  )
}

interface Props {
  isShow?: boolean
  children: ReactNode
  onChangeSeverity?(item: any): void
  record: any
  isCanOperation?: boolean
  projectId?: any
  onCurrentDetail?(item: any): void
}

const ChangeSeverityPopover = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)

  const onChangePriority = (item: any) => {
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
            onTap={onChangePriority}
            onHide={() => setPopoverVisible(false)}
            record={props?.record}
            projectId={props?.projectId}
            onCurrentDetail={props?.onCurrentDetail}
          />
        )
      }
    >
      {props.children}
    </Popover>
  )
}

export default ChangeSeverityPopover

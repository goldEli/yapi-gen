// 公用切换优先级

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import { getPriOrStu } from '@/services/mine'
import { useSelector } from '@store/index'

const flexCss = css`
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

type LevelProps = {
  record?: any
  onHide(): void
  onTap?(id: any): void
  onCurrentDetail?(item: any): void
  // 用于判断当前是否是所有项目， 是则调用就接口获取下拉值
  projectId?: any
}

export const LevelContent = (props: LevelProps) => {
  const { projectInfoValues } = useSelector(store => store.project)

  const { record, onHide, onTap } = props
  const { project_id: pid, id: storyID } = record
  const [showData, setShowData] = useState<any>([])

  const init = async () => {
    console.log(props.projectId, '0')
    if (props.projectId === 0) {
      const res = await getPriOrStu({
        projectId: pid,
        type: 'priority',
      })
      setShowData(res.data)
    } else {
      setShowData(
        projectInfoValues
          ?.filter((i: any) => i.key === 'priority')[0]
          ?.children?.filter((k: any) => k.id !== -1),
      )
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
        <div
          onClick={() => changeState(item.id)}
          className={flexCss}
          key={item.id}
        >
          <IconFont
            type={item?.icon}
            style={{
              fontSize: 20,
              marginRight: '10px',
              color: item.color,
            }}
          />
          <span>{item.content_txt}</span>
        </div>
      ))}
    </Contain>
  )
}

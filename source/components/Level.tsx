import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import { useModel } from '@/models'

const flexCss = css`
  height: 32px;
  width: 120px;
  box-sizing: border-box;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f0f4fa;
    color: #2877ff;
  }
`
const Contain = styled.div`
  padding: 10px 0;
  width: 120px;
  /* height: 136px; */
  display: flex;
  flex-direction: column;
`

export const level = [
  {
    id: 1,
    name: '极高',
    icon: (
      <IconFont
        type="extremely-high"
        style={{ color: '#ff5c5e', fontSize: 20 }}
      />
    ),
  },
  {
    id: 2,
    name: '高',
    icon: <IconFont type="high" style={{ color: '#fa9746', fontSize: 20 }} />,
  },
  {
    id: 3,
    name: '中',
    icon: <IconFont type="middle" style={{ color: '#2877ff', fontSize: 20 }} />,
  },
  {
    id: 4,
    name: '低',
    icon: <IconFont type="low" style={{ color: '#43ba9a', fontSize: 20 }} />,
  },
  {
    id: 5,
    name: '极低',
    icon: (
      <IconFont
        type="extremely-low"
        style={{ color: '#bbbdbf', fontSize: 20 }}
      />
    ),
  },
]

type LevelProps = {
  record?: any
  onHide(): void
  onTap?(id: any): void
  onCurrentDetail?(item: any): void
}

export const LevelContent = (props: LevelProps) => {
  const { getPriOrStu } = useModel('mine')
  const { record, onHide, onTap } = props
  const { project_id: pid, id: storyID } = record
  const [showData, setShowData] = useState<any>([])

  const init = async () => {
    const res = await getPriOrStu({
      projectId: pid,
      type: 'priority',
    })
    setShowData(res.data)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            type={item.icon}
            style={{
              fontSize: 20,
              marginRight: '10px',
              color: item.color,
            }}
          />
          <span>{item.content}</span>
        </div>
      ))}
    </Contain>
  )
}

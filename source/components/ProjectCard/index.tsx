// 项目卡片 children传入右上操作

import { Progress, Tooltip } from 'antd'
import React from 'react'
import CustomDropdown from '../CustomDropdown'
import IconFont from '../IconFont'
import {
  ProjectCard,
  Image,
  CardRight,
  TransformWrap,
  ShowWrap,
  ProgressWrap,
  CardRightFirst,
  CardRightSecond,
  HoverIcon,
  EndTag,
} from './style'

type Props = {
  type: string
  num: string
  text: string
  children?: React.ReactNode
}

const TextOfIcon = (props: Props) => (
  <Tooltip placement="bottom" title={props.text}>
    <div>
      <IconFont
        style={{
          color: 'var(--neutral-n4)',
        }}
        type={props.type}
      />
      <span
        style={{
          marginLeft: '5px',
          color: 'var(--neutral-n4)',
        }}
      >
        {props.num}
      </span>
    </div>
  </Tooltip>
)
const index = (props: any) => {
  const arr = [
    {
      type: 'my',
      num: '12',
      text: '项目人数',
    },
    {
      type: 'project',
      num: '12',
      text: '项目人数',
    },
    {
      type: 'm1y',
      num: '12',
      text: '项目人数',
    },
  ]

  return (
    <ProjectCard>
      <Image
        src={
          props.img ?? 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        }
      />

      <CardRight>
        <Tooltip
          arrowPointAtCenter
          autoAdjustOverflow={false}
          placement="top"
          title=" 跑酷跑酷美术项目跑酷美术项目跑酷美术项目跑酷美术项目美术项目"
        >
          <CardRightFirst>
            跑酷跑酷美术项目跑酷美术项目跑酷美术项目跑酷美术项目美术项目
          </CardRightFirst>
        </Tooltip>

        <CardRightSecond>负责人：王富贵</CardRightSecond>
        <CardRightSecond>键：DXKJ</CardRightSecond>
        <TransformWrap>
          <ProgressWrap>
            <Progress
              size="small"
              strokeColor="var(--function-success)"
              strokeWidth={4}
              percent={30}
            />
          </ProgressWrap>

          <ShowWrap>
            {arr.map((i: any) => (
              <TextOfIcon
                key={i.type}
                type={i.type}
                text={i.text}
                num={i.num}
              />
            ))}
          </ShowWrap>
        </TransformWrap>
      </CardRight>
      {props.children}

      <EndTag>End</EndTag>
    </ProjectCard>
  )
}

export default index

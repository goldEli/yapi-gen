// 项目卡片 children传入右上操作

import { changeCreateVisible } from '@store/create-propject'
import { useDispatch } from '@store/index'
import { Dropdown, MenuProps, Progress, Tooltip } from 'antd'
import React from 'react'
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
const Index = (props: any) => {
  const arr = [
    {
      type: 'my',
      num: '1',
      text: '项目人数',
    },
    {
      type: '1',
      num: '1',
      text: '项目人数',
    },
    {
      type: '1',
      num: '1',
      text: '项目人数',
    },
  ]

  const items: any = [
    {
      key: 'edit',
      label: <span>编辑</span>,
    },
    {
      key: 'over',
      label: <span>结束</span>,
    },
    {
      key: 'del',
      label: <span>删除</span>,
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
          title="1"
        >
          <CardRightFirst>项目名称XXX</CardRightFirst>
        </Tooltip>

        <CardRightSecond>负责人：XXX</CardRightSecond>
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
        </TransformWrap>
      </CardRight>

      <EndTag>End</EndTag>
    </ProjectCard>
  )
}

export default Index

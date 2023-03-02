// 项目卡片 children传入右上操作

import { changeCreateVisible, editProject } from '@store/create-propject'
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
  const dispatch = useDispatch()
  const arr = [
    {
      type: 'user-alone',
      num: props.item.memberCount,
      text: '项目人数',
    },
    {
      type: 'demand',
      num: props.item.iterateCount,
      text: '需求数',
    },
    {
      type: 'interation',
      num: props.item.storyCount,
      text: '迭代数',
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
  const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case 'edit':
        dispatch(editProject({ visible: true, id: props.item.id }))
        break
      case 'over':
        props.onChangeOperation('end', props.item)
        break
      case 'del':
        props.onChangeOperation('delete', props.item)
        break

      default:
        break
    }
  }
  return (
    <ProjectCard>
      <Image
        src={
          props.item.cover ??
          'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        }
      />

      <CardRight>
        <Tooltip
          arrowPointAtCenter
          autoAdjustOverflow={false}
          placement="top"
          title={props.item.name}
        >
          <CardRightFirst>{props.item.name}</CardRightFirst>
        </Tooltip>

        <CardRightSecond>负责人：{props.item.leaderName}</CardRightSecond>
        <CardRightSecond>键：{props.item.prefix}</CardRightSecond>
        <TransformWrap>
          <ProgressWrap>
            <Progress
              size="small"
              strokeColor="var(--function-success)"
              strokeWidth={4}
              percent={Math.trunc(Number(props.item.progress) * 100)}
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
      <Dropdown
        trigger={['hover']}
        menu={{
          items,
          onClick,
        }}
        placement="bottomRight"
        getPopupContainer={(i: any) => i.parentNode}
      >
        <HoverIcon>
          <IconFont
            style={{
              color: 'var(--neutral-n3)',
            }}
            type="more"
          />
        </HoverIcon>
      </Dropdown>
      {props.item.status === 2 && <EndTag>End</EndTag>}
    </ProjectCard>
  )
}

export default Index

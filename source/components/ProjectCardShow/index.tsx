// 项目卡片 children传入右上操作

import { changeCreateVisible } from '@store/create-propject'
import { useDispatch } from '@store/index'
import { Dropdown, MenuProps, Progress, Tooltip } from 'antd'
import { t } from 'i18next'
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
          <CardRightFirst>
            {props.names ?? t('project_name_xxx')}
          </CardRightFirst>
        </Tooltip>

        <CardRightSecond>
          {t('functionary')}
          {props.user ?? 'XXX'}
        </CardRightSecond>
        <CardRightSecond>
          {t('keyM')}
          {props.prefix ?? 'DXKJ'}
        </CardRightSecond>
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

      {/* <EndTag>End</EndTag> */}
    </ProjectCard>
  )
}

export default Index

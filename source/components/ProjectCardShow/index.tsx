// 项目卡片 children传入右上操作

import { Progress, Tooltip } from 'antd'
import { t } from 'i18next'
import IconFont from '../IconFont'
import {
  ProjectCard,
  Image,
  CardRight,
  TransformWrap,
  ProgressWrap,
  CardRightFirst,
  CardRightSecond,
} from './style'

type Props = {
  type: string
  num: string
  text: string
}

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
          title={props.names ?? t('project_name_xxx')}
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
    </ProjectCard>
  )
}

export default Index

/* eslint-disable no-constant-binary-expression */
// 项目卡片 children传入右上操作

import { Progress, Tooltip } from 'antd'
import { t } from 'i18next'
import {
  ProjectCard,
  Image,
  CardRight,
  TransformWrap,
  ProgressWrap,
  CardRightFirst,
  CardRightSecond,
} from './style'
import { useTranslation } from 'react-i18next'

type Props = {
  img: string
  names: string
  user: string
  projectType: number
}

const Index = (props: Props) => {
  const [t] = useTranslation()
  return (
    <ProjectCard>
      <Image src={props.img} />
      <CardRight>
        <Tooltip
          arrowPointAtCenter
          autoAdjustOverflow={false}
          placement="top"
          title={props.names ? props.names : (t('project_name_xxx') as string)}
        >
          <CardRightFirst>
            <span className="boxType" style={{background:props.projectType ===1 ? 'linear-gradient(225deg, #8dd2f6 0%, #6688ff 100%)' :'linear-gradient(225deg, #FFA29C 0%, #F6856C 100%)'}}>{props.projectType ===1 ? t('iteration') : t('sprint2')}</span>
            <span>
              {props.names ? props.names : (t('project_name_xxx') as string)}
            </span>
          </CardRightFirst>
        </Tooltip>

        <CardRightSecond>
          {t('functionary') as string}
          {props.user ? props.user : 'XXX'}
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

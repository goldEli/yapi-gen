// 项目卡片 children传入右上操作

import { editProject } from '@store/create-propject'
import { useDispatch, useSelector } from '@store/index'
import { Dropdown, MenuProps, Progress, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
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
  HoverDiv,
} from './style'

type Props = {
  type: string
  num: string
  text: string
}

const TextOfIcon = (props: Props) => (
  <Tooltip placement="bottom" title={props.text}>
    <HoverDiv>
      <IconFont
        style={{
          color: 'inherit',
        }}
        type={props.type}
      />
      <span
        style={{
          marginLeft: '5px',
          color: 'inherit',
        }}
      >
        {props.num}
      </span>
    </HoverDiv>
  </Tooltip>
)
const Index = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const isDel2 = (
    userInfo.company_permissions?.map((i: any) => i.identity) || []
  ).includes('b/project/delete')
  const isEdit2 = (
    userInfo.company_permissions?.map((i: any) => i.identity) || []
  ).includes('b/project/update')
  const arr = [
    {
      type: 'user-alone',
      num: props.item.memberCount,
      text: t('project.projectCount'),
    },
    {
      type: 'demand',
      num: props.item.storyCount,
      text: t('project.demandCount'),
    },
    {
      type: 'interation-2',
      num: props.item.iterateCount,
      text: t('project.iterateCount'),
    },
  ]

  const getItems = () => {
    const isDel = (
      userInfo.company_permissions?.map((i: any) => i.identity) || []
    ).includes('b/project/delete')
    const isEdit = (
      userInfo.company_permissions?.map((i: any) => i.identity) || []
    ).includes('b/project/update')

    const items: any = [
      {
        key: 'edit',
        label: <span>{t('common.edit')}</span>,
        isHave: isEdit,
      },
      {
        key: 'over',
        label: (
          <span>
            {props.item.status === 1 ? t('common.stop') : t('common.open')}
          </span>
        ),
        isHave: isEdit,
      },
      {
        key: 'del',
        label: <span>{t('common.del')}</span>,
        isHave: isDel,
      },
    ]

    return items.filter((i: any) => i.isHave)
  }

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

        <CardRightSecond>
          {t('functionary')}
          {props.item.leaderName}
        </CardRightSecond>
        <CardRightSecond>
          {t('keyM')}
          {props.item.prefix}
        </CardRightSecond>
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
      {(isDel2 || isEdit2) && (
        <Dropdown
          trigger={['hover']}
          menu={{
            items: getItems(),

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
      )}

      {props.item.status === 2 && <EndTag>End</EndTag>}
    </ProjectCard>
  )
}

export default Index

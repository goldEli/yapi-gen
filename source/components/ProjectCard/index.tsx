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
  Tags,
} from './style'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'

type Props = {
  type: string
  num: string
  text: string
}

const TextOfIcon = (props: any) => (
  <div
    onClick={(e: any) => {
      e.stopPropagation()
      props.changeRouter()
    }}
  >
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
  </div>
)
const Index = (props: any) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
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
      type: props.item.projectType === 1 ? 'demand' : 'timer',
      num: props.item.storyCount,
      text:
        props.item.projectType === 1
          ? t('other.demandNumber')
          : t('other.springNumber'),
    },
    {
      type: props.item.projectType === 1 ? 'interation-2' : 'book-open',
      num: props.item.iterateCount,
      text:
        props.item.projectType === 1
          ? t('other.iterationNumber')
          : t('other.affairsNumber'),
    },
  ]

  // const getItems = () => {
  //   const isDel = (
  //     userInfo.company_permissions?.map((i: any) => i.identity) || []
  //   ).includes('b/project/delete')

  //   const isEdit = (
  //     userInfo.company_permissions?.map((i: any) => i.identity) || []
  //   ).includes('b/project/update')

  //   const items: any = [
  //     {
  //       key: 'over',
  //       label: <span>{props.item.status === 1 ? t('pause') : t('start')}</span>,
  //       isHave: isRolePermission,
  //     },
  //     {
  //       key: 'close',
  //       label: <span>{t('closure')}</span>,
  //       isHave: isRolePermission || [4, 2].includes(props.item.status),
  //     },
  //     {
  //       key: 'edit',
  //       label: <span>{t('common.edit')}</span>,
  //       isHave: props.item.team_id === 0 ? isEdit : props.item.isTeam,
  //     },
  //     {
  //       key: 'del',
  //       label: <span>{t('common.del')}</span>,
  //       isHave: isDel,
  //     },
  //   ]

  //   return items.filter((i: any) => i.isHave)
  // }

  const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case 'edit':
        dispatch(editProject({ visible: true, id: props.item.id }))
        break
      case 'over':
        props.onChangeOperation('', props.item)
        break
      case 'del':
        props.onChangeOperation('delete', props.item)
        break

      default:
        props.onChangeOperation('close', props.item)
        break
    }
  }
  const onChangeRouter = (type: string) => {
    if (type === 'user-alone') {
      const params = encryptPhp(
        JSON.stringify({
          type: props.item.projectType === 2 ? 'ProjectMember' : 1,
          id: props.item.id,
          pageIdx: 'member',
        }),
      )
      let url = '/ProjectDetail/Member'
      navigate(`${url}?data=${params}`)
    } else if (type === 'demand') {
      if (props.item.projectType === 1) {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Demand?data=${params}`)
      } else {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Affair?data=${params}`)
      }
    } else if (type === 'interation-2') {
      if (props.item.projectType === 1) {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Iteration?data=${params}`)
      } else {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Sprint?data=${params}`)
      }
    } else if (type === 'timer') {
      const params = encryptPhp(
        JSON.stringify({ id: props.item.id, type: 'iteration' }),
      )
      navigate(`/ProjectDetail/Sprint?data=${params}`)
    } else if (type === 'book-open') {
      if (props.item.projectType === 1) {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Demand?data=${params}`)
      } else {
        const params = encryptPhp(
          JSON.stringify({ id: props.item.id, type: 'iteration' }),
        )
        navigate(`/ProjectDetail/Affair?data=${params}`)
      }
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
          <CardRightFirst>
            {props.item.projectType === 1 ? (
              <Tags type={1}> {t('iteration')}</Tags>
            ) : (
              <Tags type={2}> {t('sprint2')}</Tags>
            )}

            {props.item.name}
          </CardRightFirst>
        </Tooltip>

        <CardRightSecond>
          {t('functionary')}
          {props.item?.leaderName}
        </CardRightSecond>
        <CardRightSecond>
          {t('serial_number')}：{props.item.prefix}
        </CardRightSecond>
        <TransformWrap>
          <ProgressWrap>
            <Progress
              size="small"
              strokeColor="var(--function-success)"
              strokeWidth={4}
              percent={Number(props.item.progress)}
            />
          </ProgressWrap>

          <ShowWrap>
            {arr.map((i: any) => (
              <TextOfIcon
                changeRouter={() => onChangeRouter(i.type)}
                key={i.type}
                type={i.type}
                text={i.text}
                num={i.num}
              />
            ))}
          </ShowWrap>
        </TransformWrap>
      </CardRight>

      {props.item.status === 2 && <EndTag>End</EndTag>}
    </ProjectCard>
  )
}

export default Index

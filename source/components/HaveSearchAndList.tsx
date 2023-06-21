// 包含搜素和下拉列表的组件

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
import styled from '@emotion/styled'
import { Popover, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'
import NoData from './NoData'
import { getParentList, getProjectList } from '@/services/project'
import { useSelector } from '@store/index'
import { addInfoDemand, getDemandList } from '@/services/demand'
import InputSearch from './InputSearch'
import { getMessage } from './Message'
import { addInfoAffairs } from '@/services/affairs'

const PopoverWrap = styled(Popover)<{ isRight?: any }>({}, ({ isRight }) => ({
  '.ant-popover-placement-bottom': {
    left: isRight ? '10px!important' : 0,
  },
  '.ant-popover-content': {
    maxWidth: 240,
  },
}))

const DemandWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const MaxWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 200,
  overflow: 'auto',
  maxWidth: 236,
})

const IconfontWrap = styled(IconFont)({
  fontSize: 16,
  margin: '0 8px',
})

const DemandItem = styled.div<{ isActive?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    cursor: 'pointer',
    paddingLeft: 16,
    wordBreak: 'break-all',
    '&:hover': {
      background: 'var(--neutral-n6-d1)',
      color: 'var(--neutral-n1-d1)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--primary-d2)' : 'var(--neutral-n2',
    fontWeight: isActive ? 500 : 400,
  }),
)

const ProjectNameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  padding: '0 8px',
  cursor: 'pointer',
  borderRadius: 6,
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  fontFamily: 'SiYuanMedium',
  '.text': {
    maxWidth: 240,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '&:hover': {
    background: 'var(--neutral-n6-d1)',
  },
})

interface DemandProps {
  tap?(item: any): void
  projectId?: any
  // 是否是操作父需求
  isOperationParent?: boolean
  placeholder: string
  detail: any
}

const ChooseItems = (props: DemandProps) => {
  const [dataList, setDataList] = useState<any>([])
  const [projectList, setProjectList] = useState<any>([])
  const inputRefDom = useRef<HTMLInputElement>(null)

  const getList = async () => {
    const result = await getParentList({
      projectId: props.projectId,
      id: props.detail?.id,
      categoryId: props.detail.categoryId ?? props.detail.category,
    })
    setDataList(result)
  }

  const getProjectData = async () => {
    const result = await getProjectList({ all: true, isPublic: 1 })
    setProjectList(result)
  }

  useEffect(() => {
    if (props.isOperationParent) {
      getList()
    } else {
      getProjectData()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [])

  const [value, setValue] = useState('')
  return (
    <DemandWrap>
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <InputSearch
          placeholder={props.placeholder}
          width={210}
          autoFocus
          onChangeSearch={setValue}
          ref={inputRefDom as any}
        />
      </div>
      {props?.isOperationParent && (
        <MaxWrap>
          {dataList
            ?.filter((item: any) => item.value !== props.detail?.id)
            ?.filter((k: any) => String(k.label).includes(value))
            ?.map((i: any) => (
              <DemandItem
                onClick={() => props.tap?.(i)}
                isActive={i.value === props.detail?.id.parentId}
                key={i.value}
              >
                {i.label}
                {i.value === props.detail?.id.parentId && (
                  <IconfontWrap type="check" />
                )}
              </DemandItem>
            ))}
          {dataList
            ?.filter((item: any) => item.value !== props.detail?.id?.id)
            ?.filter((k: any) => String(k.label).includes(value))?.length <=
            0 && <NoData size="mini" />}
        </MaxWrap>
      )}
      {!props.isOperationParent && (
        <MaxWrap>
          {projectList.list
            ?.filter((k: any) => String(k.name).includes(value))
            ?.map((i: any) => (
              <DemandItem
                onClick={() => props.tap?.(i)}
                isActive={i.id === props.projectId}
                key={i.id}
              >
                {i.name}
                {i.id === props.projectId && <IconfontWrap type="check" />}
              </DemandItem>
            ))}

          {projectList.list?.filter((k: any) => String(k.name).includes(value))
            ?.length <= 0 && <NoData size="mini" />}
        </MaxWrap>
      )}
    </DemandWrap>
  )
}

interface Props {
  // 是否要靠右加间距
  isRight?: any
  // 触发popover的内容
  addWrap?: any
  // 是否隐藏
  isHidden?: boolean
  // 项目id
  projectId?: any
  // 需求Id
  demandId?: any
  // 是否是操作父需求
  isOperationParent?: boolean
  // 输入框文本
  placeholder: string
  //单独区分项目切换
  isProjectChange?: boolean
  onUpdate(): void
  detail: any
}

const HaveSearchAndList = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [isOpen, setIsOpen] = useState(false)
  const [hoverState, setHoverState] = useState(false)

  const onVisibleOpenChange = (visible: any) => {
    setIsOpen(visible)
  }

  // 需求详情添加父需求
  const onChangeParent = async (item: any) => {
    if (projectInfo.projectType === 1) {
      await addInfoDemand({
        projectId: props?.projectId,
        demandId: props?.demandId,
        type: 'parent',
        targetId: [item.value],
      })
    } else {
      await addInfoAffairs({
        projectId: props.projectId,
        sprintId: props.demandId,
        type: 'parent',
        targetId: [item.value],
      })
    }
    getMessage({ msg: t('common.addSuccess'), type: 'success' })
    props.onUpdate()
  }

  const onChange = async (item: any) => {
    if (props.isOperationParent) {
      onChangeParent(item)
    } else {
      //
    }
    setIsOpen(false)
  }

  return (
    <PopoverWrap
      overlayStyle={{ height: '20px' }}
      visible={isOpen}
      placement="bottomRight"
      trigger="click"
      onVisibleChange={onVisibleOpenChange}
      content={
        isOpen && (
          <ChooseItems
            tap={onChange}
            projectId={props?.projectId}
            isOperationParent={props?.isOperationParent}
            placeholder={props.placeholder}
            detail={props.detail}
          />
        )
      }
      getPopupContainer={node => node}
      isRight={props?.isRight}
    >
      <div hidden={props.isHidden} onClick={() => setIsOpen(!isOpen)}>
        {props?.isProjectChange && (
          <ProjectNameWrap
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
          >
            <Tooltip open={!isOpen && hoverState} title={projectInfo?.name}>
              <span className="text">{projectInfo?.name}</span>
            </Tooltip>
            <IconFont type="down" style={{ fontSize: 20, marginLeft: 8 }} />
          </ProjectNameWrap>
        )}
        {!props.isProjectChange && props?.addWrap}
      </div>
    </PopoverWrap>
  )
}

export default HaveSearchAndList

// 包含搜素和下拉列表的组件

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
import { useModel } from '@/models'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { message, Popover, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CommonInput from './CommonInput'
import IconFont from './IconFont'
import NoData from './NoData'
import { getProjectList } from '@/services/project'

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
      background: '#F4F5F5',
      color: '#323233',
    },
  },
  ({ isActive }) => ({
    color: isActive ? '#2877FF' : '#646566',
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
  color: '#323233',
  fontSize: 14,
  fontWeight: 500,
  '.text': {
    maxWidth: 240,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '&:hover': {
    background: '#F4F5F5',
  },
})

interface DemandProps {
  tap?(item: any): void
  projectId?: any
  // 是否是操作父需求
  isOperationParent?: boolean
  placeholder: string
}

const ChooseItems = (props: DemandProps) => {
  const { getDemandList, demandInfo } = useModel('demand')
  const [dataList, setDataList] = useState<any>([])
  const [projectList, setProjectList] = useState<any>([])
  const inputRefDom = useRef<HTMLInputElement>(null)

  const getList = async () => {
    const result = await getDemandList({
      projectId: props.projectId,
      all: true,
    })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setDataList(arr)
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
        <CommonInput
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
            ?.filter((item: any) => item.value !== demandInfo?.id)
            ?.filter((k: any) => String(k.label).includes(value))
            ?.map((i: any) => (
              <DemandItem
                onClick={() => props.tap?.(i)}
                isActive={i.value === demandInfo.parentId}
                key={i.value}
              >
                {i.label}
                {i.value === demandInfo.parentId && (
                  <IconfontWrap type="check" />
                )}
              </DemandItem>
            ))}
          {dataList
            ?.filter((item: any) => item.value !== demandInfo?.id)
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
}

const HaveSearchAndList = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { addInfoDemand, getDemandInfo } = useModel('demand')
  const { setIsChangeProject, projectInfo } = useModel('project')
  const [hoverState, setHoverState] = useState(false)
  const onVisibleOpenChange = (visible: any) => {
    setIsOpen(visible)
  }

  // 需求详情添加父需求
  const onChangeParent = async (item: any) => {
    try {
      await addInfoDemand({
        projectId: props?.projectId,
        demandId: props?.demandId,
        type: 'parent',
        targetId: [item.value],
      })
      message.success(t('common.addSuccess'))
      getDemandInfo({ projectId: props?.projectId, id: props?.demandId })
    } catch (error) {
      //
    }
  }

  const onChange = async (item: any) => {
    if (props.isOperationParent) {
      onChangeParent(item)
    } else {
      const beforeUrl = String(window.location.href)
        .split('/Detail/')[1]
        .split('?data')[0]
      const params = encryptPhp(JSON.stringify({ id: item.id }))
      navigate(`/Detail/${beforeUrl}?data=${params}`)
      setIsChangeProject(item.id)
      message.success(t('version2.changeProjectSuccess'))
    }
    setIsOpen(false)
  }

  return (
    <PopoverWrap
      visible={isOpen}
      placement="bottom"
      trigger="click"
      onVisibleChange={onVisibleOpenChange}
      content={
        isOpen && (
          <ChooseItems
            tap={onChange}
            projectId={props?.projectId}
            isOperationParent={props?.isOperationParent}
            placeholder={props.placeholder}
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

/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'
import TagComponent from '../../components/TagComponent'
import DemandStatus from '../../components/DemandStatus'
import ParentDemand from '../../components/ParentDemand'
import UploadAttach from '../../components/UploadAttach'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { message, Progress, Tooltip, TreeSelect } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNestedChildren, getParamsData, getTypeComponent } from '@/tools'
import { SliderWrap, HiddenText } from '@/components/StyleCommon'
import Viewer from 'react-viewer'
import { getTreeList } from '@/services/project/tree'

const WrapLeft = styled.div({
  width: 'calc(100% - 472px)',
  overflow: 'auto',
  paddingBottom: 24,
})

const TextWrapEditor = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '20%',
    cursor: 'pointer',
  },
  p: {
    marginBottom: '0px!important',
  },
})

const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  position: 'relative',
})

const Label = styled.div({
  color: '#646566',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 120,
  height: 32,
  lineHeight: '32px',
})

const TextWrap = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '20%',
  },
})

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 6,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
        ? '1px dashed #969799'
        : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed #2877ff' : '',
      '.anticon': {
        svg: {
          color: '#2877ff',
        },
      },
      div: {
        color: '#2877ff',
      },
    },
  }),
)

const DownPriority = styled.div<{ isShow?: boolean; isMargin?: boolean }>(
  {
    '.icon': {
      marginLeft: 8,
      visibility: 'hidden',
      fontSize: 16,
      color: '#2877ff',
    },
  },
  ({ isShow, isMargin }) => ({
    marginLeft: isMargin ? 8 : 0,
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
      },
    },
  }),
)

const ProgressWrap = styled(Progress)({
  '.ant-progress-status-exception .ant-progress-bg': {
    backgroundColor: '#ff5c5e',
    height: '2px !important',
  },
  '.ant-progress-status-exception .ant-progress-text': {
    color: '#ff5c5e',
  },
  '.ant-progress-success-bg .ant-progress-bg': {
    backgroundColor: '#2877ff',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-bg': {
    backgroundColor: '#43ba9a',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-text': {
    color: '#43ba9a',
  },
  '.ant-progress-inner': {
    height: '2px !important',
    minWidth: 200,
  },
  '.ant-progress-small.ant-progress-line,.ant-progress-small.ant-progress-line .ant-progress-text .anticon':
    {
      fontSize: 10,
    },
})

interface Props {
  text: any
  keyText: any
  type: string
  value: any
  defaultText?: any
  isCustom?: boolean
}

const QuickEdit = (props: Props) => {
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<any>(null)
  const { updateTableParams, demandInfo, getDemandInfo } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
  }, [isShowControl])

  const onChange = async (newValue: string) => {
    const obj: any = {
      projectId,
      id: demandInfo?.id,
    }
    if (props?.isCustom) {
      obj.otherParams = {
        custom_field: { [props?.keyText]: newValue },
      }
    } else {
      obj.otherParams = { [props?.keyText]: newValue }
    }
    try {
      await updateTableParams(obj)
      getDemandInfo({ projectId, id: demandInfo?.id })
      setIsShowControl(false)
    } catch (error) {

      //
    }
  }

  const onBlur = (val: any) => {
    if (val) {
      onChange(val)
    } else {
      setIsShowControl(false)
    }
  }

  return (
    <>
      {isShowControl ? (
        <>
          {getTypeComponent(
            {
              attr: props?.type,
              value: props?.value,
            },
            props?.defaultText,
            inputRef,
            onBlur,
            onChange,
            true,
          )}
        </>
      )
        : <span onMouseEnter={() => setIsShowControl(true)}>{props?.text}</span>
      }
    </>
  )
}

const WrapLeftBox = (props: { onUpdate?(): void }) => {
  const [t] = useTranslation()
  const {
    demandInfo,
    updatePriority,
    isShowProgress,
    percentShow,
    percentVal,
    uploadStatus,
    getDemandInfo,
    updateTableParams,
  } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { projectInfo, getFieldList, fieldList } = useModel('project')
  const [schedule, setSchedule] = useState(demandInfo?.schedule)
  const [tagList, setTagList] = useState<any>([])
  const [classTreeData, setClassTreeData] = useState<any>([])
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const textWrapEditor = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId, priorityId: item.priorityId, projectId })
      message.success(t('common.prioritySuccess'))
      props.onUpdate?.()
    } catch (error) {

      //
    }
  }

  const onGetViewPicture = (e: any) => {
    if (e.path[0].nodeName === 'IMG') {
      const params: any = {}
      const oPics = textWrapEditor?.current?.getElementsByTagName('img')
      params.imageArray = []
      if (oPics) {
        for (const element of oPics) {
          params.imageArray.push({ src: element.src })
        }
        for (let i = 0; i < oPics.length; i++) {
          if (e.path[0].src === params.imageArray[i].url) {
            params.index = i
          }
        }
      }
      setIsVisible(true)
      setPictureList(params)
    }
  }

  const getFieldData = async () => {
    await getFieldList({ projectId })
  }

  const getTreeData = async () => {
    const classTree = await getTreeList({ id: projectId, isTree: 1 })
    setClassTreeData([
      ...[
        {
          title: '未分类',
          key: 0,
          value: 0,
          children: [],
        },
      ],
      ...getNestedChildren(classTree, 0),
    ])
  }

  useEffect(() => {
    getFieldData()
    getTreeData()
    textWrapEditor?.current?.addEventListener('click', e => onGetViewPicture(e))
    return textWrapEditor?.current?.removeEventListener('click', e => onGetViewPicture(e))
  }, [])

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [demandInfo])

  const onChangeSchedule = async () => {
    const obj = {
      projectId,
      id: demandInfo?.id,
      otherParams: { schedule },
    }
    try {
      await updateTableParams(obj)
      getDemandInfo({ projectId, id: demandInfo?.id })
    } catch (error) {

      //
    }
  }

  const Children = (item: any) => {
    return (
      <ProgressWrap
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none' }}
      />
    )
  }

  return (
    <WrapLeft>
      {isVisible ? (
        <Viewer
          zIndex={99}
          visible={isVisible}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setIsVisible(false)}
        />
      ) : null}

      <InfoItem>
        <Label>{t('project.demandStatus')}</Label>
        <DemandStatus />
      </InfoItem>
      <InfoItem>
        <Label>需求进度</Label>
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          onMouseUp={onChangeSchedule}
        >
          <SliderWrap
            style={{ width: 320 }}
            value={schedule}
            tipFormatter={(value: any) => `${value}%`}
            onChange={value => setSchedule(value)}
          />
          <span style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}>
            {schedule}%
          </span>
        </div>
      </InfoItem>
      <InfoItem>
        <Label>{t('mine.demandInfo')}</Label>
        {demandInfo?.info ? (
          <TextWrapEditor
            ref={textWrapEditor}
            dangerouslySetInnerHTML={{ __html: demandInfo?.info }}
          />
        )
          : <TextWrap>--</TextWrap>
        }
      </InfoItem>
      <InfoItem>
        <Label>{t('common.dealName')}</Label>
        <TextWrap>
          {demandInfo?.user?.length
            ? demandInfo?.user?.map((i: any) => i.user.name).join('、')
            : '--'}
        </TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.createName')}</Label>
        <TextWrap>{demandInfo?.userName || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.createTime')}</Label>
        <TextWrap>{demandInfo?.createdTime || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.finishTime')}</Label>
        <TextWrap>{demandInfo?.finishTime || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.parentDemand')}</Label>
        <ParentDemand
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>{t('common.add23')}</div>
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem>
        <Label>{t('common.tag')}</Label>
        <TagComponent
          defaultList={tagList}
          canAdd
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem
        hidden={
          !projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length
        }
      >
        <Label>{t('common.attachment')}</Label>
        <UploadAttach
          defaultList={demandInfo?.attachment?.map((i: any) => ({
            path: i.attachment.path,
            id: i.id,
          }))}
          canUpdate
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>{t('common.add23')}</div>
            </AddWrap>
          }
          child={isShowProgress ? null : <Children />}
        />
      </InfoItem>
      <InfoItem>
        <Label>{t('common.iterate')}</Label>
        <TextWrap>{demandInfo?.iterateName}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>需求分类</Label>
        <TextWrap>
          <QuickEdit
            text={demandInfo?.className ? demandInfo?.className : '未分类'}
            keyText="class_id"
            type="treeSelect"
            defaultText={demandInfo?.class}
            value={classTreeData}
          />
        </TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.priority')}</Label>
        <Popconfirm
          content={({ onHide }: { onHide(): void }) => {
            return isCanEdit ? (
              <LevelContent
                onTap={item => onChangeState(item)}
                onHide={onHide}
                record={{
                  id: demandId,
                  project_id: projectId,
                }}
              />
            ) : null
          }}
        >
          <div
            style={{
              cursor: isCanEdit ? 'pointer' : 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconFont
              style={{ fontSize: 16, color: demandInfo?.priority?.color }}
              type={demandInfo?.priority?.icon}
            />
            <DownPriority isShow={isCanEdit} isMargin>
              <span>{demandInfo?.priority?.content_txt || '--'}</span>
              <IconFont className="icon" type="down-icon" />
            </DownPriority>
          </div>
        </Popconfirm>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.start')}</Label>
        <TextWrap>{demandInfo?.expectedStart || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.end')}</Label>
        <TextWrap>{demandInfo?.expectedEnd || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.copySend')}</Label>
        <TextWrap>
          {demandInfo?.copySend?.length
            ? demandInfo?.copySend?.map((i: any) => i.copysend?.name).join('、')
            : '--'}
        </TextWrap>
      </InfoItem>
      {fieldList?.list?.map((i: any) => (
        <InfoItem key={i.content}>
          <Label>
            <Tooltip title={i.name} placement="topLeft">
              <HiddenText width={80}>{i.name}</HiddenText>
            </Tooltip>
          </Label>
          <TextWrap>
            <QuickEdit
              text={
                Array.isArray(demandInfo?.customField?.[i.content]?.value)
                  ? demandInfo?.customField?.[i.content]?.value.join('、')
                  : demandInfo?.customField?.[i.content]?.value || '--'
              }
              keyText={i.content}
              type={i.type?.attr}
              defaultText={demandInfo?.customField?.[i.content]?.value}
              value={i.type?.value}
              isCustom
            />
          </TextWrap>
        </InfoItem>
      ))}
    </WrapLeft>
  )
}

export default WrapLeftBox

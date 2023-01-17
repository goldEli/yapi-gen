// 需求详情-右侧

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-lines */
/* eslint-disable react/no-danger */
import { message } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { OmitText } from '@star-yun/ui'
import Viewer from 'react-viewer'
import { bytesToSize, getParamsData } from '@/tools'
import {
  AddWrap,
  HiddenText,
  IconFontWrapEdit,
  CanOperation,
  SliderWrap,
} from '@/components/StyleCommon'
import ParentDemand from '../../components/ParentDemand'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'
import TableQuickEdit from '@/components/TableQuickEdit'
import EditComment from '@/components/EditComment'
import { useDispatch, useSelector } from '../../../../../../../store'
import {
  BigWrap,
  BlueCss,
  fileIconMap,
  First,
  Gred,
  GredParent,
  RedCss,
  Second,
} from '../../components/UploadAttach'
import { imgs } from '@/views/Information/components/LookDay'
import { delCommonAt } from '@/services/user'
import PubSub from 'pubsub-js'
import EditorInfoReview from '@/components/EditorInfoReview'
import { storyConfigField } from '@/services/project'
import { getDemandInfo } from '@/services/project/demand'
import { setDemandInfo, setIsRefreshComment } from '@store/demand'

const WrapRight = styled.div({
  width: '100%',
  minWidth: '370px',
  overflowY: 'auto',
  height: '100%',
  padding: '16px 10px 10px 24px',
  position: 'relative',
})

const TitleWrap = styled.div<{ activeTabs?: any }>(
  {
    height: 24,
    borderRadius: 4,
    margin: '8px 0 24px 0',
    display: 'flex',
    width: 'fit-content',
    div: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 400,
      height: 24,
      width: 'fit-content',
      cursor: 'pointer',
    },
  },
  ({ activeTabs }) => ({
    '.leftWrap': {
      color: activeTabs === 1 ? '#2877ff' : '#969799',
      border: activeTabs === 1 ? '1px solid #2877ff' : '1px solid #D5D6D9',
      borderRadius: '4px 0 0 4px',
      borderRight: activeTabs === 1 ? '' : 'none',
    },
    '.rightWrap': {
      color: activeTabs === 2 ? '#2877ff' : '#969799',
      border: activeTabs === 2 ? '1px solid #2877ff' : '1px solid #D5D6D9',
      borderLeft: activeTabs === 2 ? '' : 'none',
      borderRadius: '0 4px 4px 0',
    },
  }),
)

const BasicWrap = styled.div({
  color: '#323233',
  fontWeight: 'bold',
  fontSize: 14,
})

const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  position: 'relative',
})

const Label = styled.div({
  color: '#969799',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 110,
  height: 32,
  lineHeight: '32px',
})

const ContentWrap = styled.div<{ notHover?: any }>(
  {
    color: '#323233',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)
const HovDiv = styled.div`
  visibility: hidden;
  position: absolute;
  right: 0px;
`
const MyDiv = styled.div`
  position: relative;
`

const CommentItem = styled.div<{ isShow?: boolean }>`
  .ar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 12px;
  }

  display: flex;
  justify-content: flex-start;
  margin-top: 24;
  margin-bottom: 24 !important;
  margin-right: 12;
  &:hover ${HovDiv} {
    visibility: visible;
  }
`
const Card = styled.div`
  flex: 1;
  position: relative;
  min-width: 290px;
  min-height: 60px;
  background: #ffffff;
  box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.04);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  margin: 0 16px 16px 10px;
  box-sizing: border-box;
  padding: 8px 12px;
  &:hover {
    box-shadow: 0px 0px 7px 2px rgba(40, 119, 255, 20%);
    ${Second} {
      visibility: visible;
      opacity: 1;
    }
  }
`
const TextWrap = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '.textTop': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    '.name': {
      color: 'black',
      fontSize: 14,
      marginRight: 12,
    },
    '.anticon': {
      color: '#969799',
      fontSize: 16,
      position: 'absolute',
      right: 0,
      top: 3,
      display: 'none',
    },
  },
  '.common': {
    fontSize: 12,
    color: '#969799',
    whiteSpace: 'nowrap',
  },
  '.statusText': {
    width: 'calc(100% - 120px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.content': {
    color: '#646566',
    fontSize: 12,
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    paddingRight: 30,
    flexWrap: 'wrap',
    wordBreak: 'break-all',
    img: {
      display: 'block',
      height: 100,
      objectFit: 'contain',
    },
    table: {
      'td,th': {
        height: '20px',
        border: '1px solid black',
      },
    },
  },
})

const ButtonWrap = styled.div({
  width: '92%',
  background: 'white',
  paddingBottom: 7,
})

export const TextareaWrap = styled.div({
  marginTop: 67,
  textAlign: 'right',
  marginBottom: 20,
  position: 'relative',
  paddingRight: 20,
  overflow: 'hidden',
  '.ant-input': {
    padding: '8px 8px 40px 8px',
  },
  '.ant-input:focus,.ant-input:active': {
    boxShadow: 'none',
  },
  [ButtonWrap.toString()]: {
    position: 'absolute',
    right: 28,
    bottom: 1,
  },
})

const SetHead = styled.div({
  width: 24,
  height: 24,
  borderRadius: 24,
  background: '#A4ACF5',
  color: 'white',
  fontSize: 14,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
  overflow: 'hidden',
})

const NewWrapRight = (props: { onUpdate?(): void }) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [activeTabs, setActiveTabs] = useState(1)
  const [fieldList, setFieldList] = useState<any>({
    list: undefined,
  })
  const {
    getCommentList,
    addComment,
    deleteComment,
    updatePriority,
    updateTableParams,
  } = useModel('demand')
  const { userInfo } = useSelector((store: { user: any }) => store.user)
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  const { isRefreshComment } = useSelector(
    (store: { demand: any }) => store.demand,
  )
  const { demandInfo } = useSelector((store: { demand: any }) => store.demand)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const dispatch = useDispatch()

  // 判断当前登录的人是否有编辑评论的权限
  const isComment =
    projectInfo?.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/comment',
    ).length > 0
  const [schedule, setSchedule] = useState(demandInfo?.schedule)
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const getList = async () => {
    const result = await getCommentList({
      projectId,
      demandId,
      page: 1,
      pageSize: 999,
    })
    setDataList(result)
    setTimeout(() => {
      dispatch(setIsRefreshComment(false))
    }, 100)
  }

  const getFieldData = async () => {
    const result = await storyConfigField({ projectId })
    setFieldList(result)
  }

  useEffect(() => {
    getFieldData()
    getList()
  }, [])

  useEffect(() => {
    if (isRefreshComment) {
      getList()
    }
  }, [isRefreshComment])

  const onChangeTabs = (val: any) => {
    setActiveTabs(val)
    if (val === 2) {
      getList()
    }
  }
  // 删除附件
  const onTapRemove = async (attid: any, id: any) => {
    await delCommonAt({
      project_id: projectId,
      comment_id: attid,
      att_id: id,
    })
    message.success(t('common.deleteSuccess'))
    getList()
  }
  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId, priorityId: item.priorityId, projectId })
      message.success(t('common.prioritySuccess'))
      props.onUpdate?.()
    } catch (error) {
      //
    }
  }
  const downloadIamge = (src: string, name1: string) => {
    let urls = ''
    urls = `${src}?t=${new Date().getTime()}`
    fetch(urls).then(response => {
      response.blob().then(myBlob => {
        const href = URL.createObjectURL(myBlob)
        const a = document.createElement('a')
        a.href = href
        a.download = name1
        a.click()
      })
    })
  }
  const onDownload = (url: string, name1: string) => {
    downloadIamge(url, name1)
  }
  const onDeleteComment = (item: any) => {
    setIsVisible(true)
    setIsDeleteId(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteComment({ projectId, id: isDeleteId })
      message.success(t('common.deleteSuccess'))
      setIsDeleteId(0)
      setIsVisible(false)
      getList()
    } catch (error) {
      //
    }
  }
  const onChangeSchedule = async () => {
    if (
      demandInfo?.user?.map((i: any) => i.user.id)?.includes(userInfo?.id) &&
      demandInfo.status.is_start !== 1 &&
      demandInfo.status.is_end !== 1
    ) {
      const obj = {
        projectId,
        id: demandInfo?.id,
        otherParams: { schedule },
      }
      try {
        await updateTableParams(obj)
        const result = await getDemandInfo({ projectId, id: demandInfo?.id })
        dispatch(setDemandInfo(result))
      } catch (error) {
        //
      }
    }
  }
  const editClose = () => {
    setVisibleEdit(false)
  }

  const onAddConfirm = async (params: any) => {
    try {
      await addComment({
        projectId,
        demandId,
        content: params.content,
        attachment: params.attachment,
      })
      message.success(t('project.replaySuccess'))
      getList()
      editClose()
    } catch (error) {
      //
    }
  }

  // 返回文本
  const getText = (attr: any, text: any) => {
    if (['user_select_checkbox', 'user_select'].includes(attr)) {
      return text?.true_value || '--'
    }
    return (
      (Array.isArray(text?.value) ? text?.value?.join(';') : text?.value) ||
      '--'
    )
  }
  const onReview = (item: any, attachList: any) => {
    setPictureList({
      imageArray: attachList
        ?.filter((j: any) => imgs.includes(j.attachment.ext))
        ?.map((k: any, index: any) => ({
          src: k.attachment.path,
          index,
        })),
      index: attachList
        ?.filter((j: any) => imgs.includes(j.attachment.ext))
        ?.findIndex((i: any) => i.attachment.path === item.path),
    })
    setPreviewOpen(true)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {demandInfo?.isExamine ? (
        <IconFont
          type="review"
          style={{
            fontSize: 64,
            position: 'absolute',
            top: -42,
            left: -37,
            zIndex: 1,
          }}
        />
      ) : null}
      <WrapRight>
        <DeleteConfirm
          text={t('mark.cd')}
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          onConfirm={onDeleteConfirm}
        />
        <TitleWrap activeTabs={activeTabs}>
          <div className="leftWrap" onClick={() => onChangeTabs(1)}>
            {t('newlyAdd.basicInfo')}
          </div>
          <div className="rightWrap" onClick={() => onChangeTabs(2)}>
            {t('common.comment')}{' '}
            {dataList?.list?.length > 99
              ? `${dataList?.list?.length}+`
              : dataList?.list?.length}
          </div>
        </TitleWrap>
        {activeTabs === 1 && <BasicWrap>{t('newlyAdd.basicInfo')}</BasicWrap>}
        {activeTabs === 1 && (
          <div style={{ maxHeight: 'calc(100% - 100px)' }}>
            <InfoItem>
              <Label>
                <OmitText
                  width={100}
                  tipProps={{
                    placement: 'topLeft',
                    getPopupContainer: node => node,
                  }}
                >
                  {t('newlyAdd.demandProgress')}
                </OmitText>
              </Label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '15px',
                  width: '100%',
                }}
                onMouseUp={onChangeSchedule}
              >
                <SliderWrap
                  isDisabled={
                    demandInfo?.user
                      ?.map((i: any) => i.user.id)
                      ?.includes(userInfo?.id) &&
                    demandInfo.status.is_start !== 1
                      ? demandInfo.status.is_end !== 1
                      : null
                  }
                  style={{ width: '70%', maxWidth: 200 }}
                  value={schedule}
                  tipFormatter={(value: any) => `${value}%`}
                  onChange={value => setSchedule(value)}
                  tooltipVisible={false}
                  disabled={
                    !(
                      demandInfo?.user
                        ?.map((i: any) => i.user.id)
                        ?.includes(userInfo?.id) &&
                      demandInfo.status.is_start !== 1 &&
                      demandInfo.status.is_end !== 1
                    )
                  }
                />
                <span
                  style={{ color: '#646566', marginLeft: 16, fontSize: 14 }}
                >
                  {schedule}%
                </span>
              </div>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.dealName')}</Label>
              <ContentWrap>
                <TableQuickEdit
                  item={demandInfo}
                  isInfo
                  keyText="users"
                  type="fixed_select"
                  defaultText={
                    demandInfo?.user?.length
                      ? demandInfo?.user?.map((i: any) => i.user.id)
                      : []
                  }
                >
                  {demandInfo?.user?.length
                    ? demandInfo?.user?.map((i: any) => i.user.name).join(';')
                    : '--'}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.createName')}</Label>
              <ContentWrap notHover>{demandInfo?.userName || '--'}</ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.createTime')}</Label>
              <ContentWrap notHover>
                {demandInfo?.createdTime || '--'}
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.finishTime')}</Label>
              <ContentWrap notHover>
                {demandInfo?.finishTime || '--'}
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.parentDemand')}</Label>
              <div style={{ paddingLeft: 4 }}>
                <ParentDemand
                  isRight
                  addWrap={
                    <AddWrap>
                      <IconFont type="plus" />
                      <div>{t('common.add23')}</div>
                    </AddWrap>
                  }
                />
              </div>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.iterate')}</Label>
              <ContentWrap>
                <TableQuickEdit
                  item={demandInfo}
                  isInfo
                  keyText="iterate_id"
                  type="fixed_radio"
                  defaultText={
                    demandInfo?.iterateName === '--'
                      ? ''
                      : demandInfo?.iterateName
                  }
                >
                  {demandInfo?.iterateName === '--'
                    ? '--'
                    : demandInfo?.iterateName}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>
                <OmitText
                  width={100}
                  tipProps={{
                    placement: 'topLeft',
                    getPopupContainer: node => node,
                  }}
                >
                  {t('newlyAdd.demandClass')}
                </OmitText>
              </Label>

              <ContentWrap>
                <TableQuickEdit
                  item={demandInfo}
                  isInfo
                  keyText="class_id"
                  type="treeSelect"
                  defaultText={demandInfo?.class}
                >
                  {demandInfo?.className
                    ? demandInfo?.className
                    : t('newlyAdd.unclassified')}
                </TableQuickEdit>
              </ContentWrap>
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
                  <CanOperation isCanEdit={isCanEdit}>
                    <IconFont
                      style={{
                        fontSize: 20,
                        color: demandInfo?.priority?.color,
                        marginRight: 4,
                      }}
                      type={demandInfo?.priority?.icon}
                    />
                    <span>{demandInfo?.priority?.content_txt || '--'}</span>
                    {isCanEdit ? <IconFontWrapEdit type="down-icon" /> : null}
                  </CanOperation>
                </div>
              </Popconfirm>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.start')}</Label>
              <ContentWrap>
                <TableQuickEdit
                  item={demandInfo}
                  isInfo
                  keyText="expected_start_at"
                  type="date"
                  defaultText={demandInfo?.expectedStart || ''}
                  value={['date']}
                >
                  {demandInfo?.expectedStart || '--'}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.end')}</Label>
              <ContentWrap>
                <TableQuickEdit
                  isInfo
                  item={demandInfo}
                  keyText="expected_end_at"
                  type="date"
                  defaultText={demandInfo?.expectedEnd || ''}
                  value={['date']}
                >
                  {demandInfo?.expectedEnd || '--'}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
            <InfoItem>
              <Label>{t('common.copySend')}</Label>
              <ContentWrap>
                <TableQuickEdit
                  item={demandInfo}
                  isInfo
                  keyText="copysend"
                  type="fixed_select"
                  defaultText={
                    demandInfo?.copySend?.length
                      ? demandInfo?.copySend?.map((i: any) => i.copysend.id)
                      : []
                  }
                >
                  {demandInfo?.copySend?.length
                    ? demandInfo?.copySend
                        ?.map((i: any) => i.copysend.name)
                        .join(';')
                    : '--'}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
            {fieldList?.list?.map((i: any) => (
              <InfoItem key={i.content}>
                <Label>
                  <OmitText
                    width={80}
                    tipProps={{
                      placement: 'topLeft',
                      getPopupContainer: node => node,
                    }}
                  >
                    {i.name}
                  </OmitText>
                </Label>
                <ContentWrap>
                  <TableQuickEdit
                    item={demandInfo}
                    isInfo
                    keyText={i.content}
                    type={i.type?.attr}
                    defaultText={demandInfo?.customField?.[i.content]?.value}
                    isCustom
                    remarks={i?.remarks}
                  >
                    {getText(
                      i.type?.attr,
                      demandInfo?.customField?.[i.content],
                    )}
                  </TableQuickEdit>
                </ContentWrap>
              </InfoItem>
            ))}
            <div
              style={{
                height: '10px',
              }}
            />
          </div>
        )}
        {activeTabs !== 1 && (
          <div
            style={{
              height: 'calc(100% - 80px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#323233',
                }}
              >
                {t('new_p1.a1')}
              </span>
              <AddWrap
                onClick={() => {
                  setVisibleEdit(true)
                }}
                style={{
                  marginRight: '30px',
                }}
                hasColor
              >
                <IconFont type="plus" />
                <div
                  style={{
                    color: '#2877ff',
                  }}
                >
                  {t('new_p1.a2')}
                </div>
              </AddWrap>
            </div>

            {!!dataList?.list &&
              (dataList?.list?.length > 0 ? (
                <div>
                  {dataList?.list?.map((item: any) => (
                    <CommentItem style={{ marginBottom: '24px' }} key={item.id}>
                      <div>
                        {item.avatar ? (
                          <img className="ar" src={item.avatar} alt="" />
                        ) : (
                          <SetHead>
                            {String(
                              item.name?.trim().slice(0, 1),
                            ).toLocaleUpperCase()}
                          </SetHead>
                        )}
                      </div>

                      <TextWrap>
                        <MyDiv>
                          <HovDiv>
                            {isComment && userInfo?.id === item.userId ? (
                              <IconFont
                                type="close"
                                onClick={() => onDeleteComment(item)}
                              />
                            ) : null}
                          </HovDiv>

                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span
                              style={{
                                marginRight: '12px',
                              }}
                              className="name"
                            >
                              <HiddenText>
                                <OmitText
                                  width={100}
                                  tipProps={{
                                    getPopupContainer: node => node,
                                  }}
                                >
                                  {item.name}
                                </OmitText>
                              </HiddenText>
                            </span>
                            <span className="common">
                              <HiddenText>
                                <OmitText
                                  width={150}
                                  tipProps={{
                                    getPopupContainer: node => node,
                                  }}
                                >
                                  {item.statusContent}
                                </OmitText>
                              </HiddenText>
                            </span>
                          </div>
                        </MyDiv>
                        <div className="common" style={{ paddingRight: 30 }}>
                          {item.createdTime}
                        </div>
                        <EditorInfoReview info={item.content} />

                        <div
                          style={{
                            minWidth: '300px',
                            marginTop: '8px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                          }}
                        >
                          {item.attachment.map((i: any) => {
                            return (
                              <Card
                                style={{
                                  margin: 0,
                                }}
                                key={i.id}
                              >
                                <BigWrap
                                  style={{
                                    display: 'flex',
                                  }}
                                >
                                  <GredParent
                                    style={{
                                      marginRight: '8px',
                                      position: 'relative',
                                    }}
                                  >
                                    {imgs.includes(i.attachment.ext) && (
                                      <img
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '4px',
                                        }}
                                        src={i.attachment.path}
                                        alt=""
                                      />
                                    )}
                                    {!imgs.includes(i.attachment.ext) && (
                                      <IconFont
                                        style={{
                                          fontSize: 40,
                                          color: 'white',
                                          borderRadius: '8px',
                                        }}
                                        type={
                                          fileIconMap[i.attachment.ext] ||
                                          'colorunknown'
                                        }
                                      />
                                    )}
                                    {imgs.includes(i.attachment.ext) && (
                                      <Gred
                                        onClick={() => {
                                          onReview(
                                            i.attachment,
                                            item.attachment,
                                          )
                                        }}
                                      >
                                        <IconFont
                                          style={{
                                            fontSize: 18,
                                            color: 'white',
                                          }}
                                          type="zoomin"
                                        />
                                      </Gred>
                                    )}
                                    {previewOpen ? (
                                      <Viewer
                                        zIndex={99999}
                                        visible={previewOpen}
                                        images={pictureList?.imageArray}
                                        activeIndex={pictureList?.index}
                                        onClose={() => setPreviewOpen(false)}
                                      />
                                    ) : null}
                                  </GredParent>
                                  <div>
                                    <div
                                      style={{
                                        width: '100%',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                        color: '#646566',
                                        lineHeight: '22px',
                                        wordBreak: 'break-all',
                                      }}
                                    >
                                      {i.attachment.name}
                                    </div>
                                    <First
                                      style={{
                                        height: '20px',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        color: '#969799',
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <span>
                                        {bytesToSize(i?.attachment.size) ?? ''}
                                      </span>
                                      <span
                                        style={{
                                          margin: '0 6px 0 6px',
                                        }}
                                      >
                                        ·
                                      </span>
                                      <span
                                        style={{
                                          marginRight: '12px',
                                        }}
                                      >
                                        {i.user_name}
                                      </span>
                                      <span>{i.created_at}</span>
                                    </First>
                                    <Second
                                      style={{
                                        height: '20px',
                                      }}
                                    >
                                      <BlueCss
                                        onClick={() =>
                                          onDownload(
                                            i.attachment.path,
                                            i.attachment.name,
                                          )
                                        }
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          color: '#2877ff',
                                        }}
                                      >
                                        {t('p2.download') as unknown as string}
                                      </BlueCss>
                                      {isComment &&
                                      userInfo?.id === item.userId ? (
                                        <RedCss
                                          onClick={() =>
                                            onTapRemove(item.id, i.id)
                                          }
                                        >
                                          {t('p2.delete')}
                                        </RedCss>
                                      ) : null}
                                    </Second>
                                  </div>
                                </BigWrap>
                              </Card>
                            )
                          })}
                        </div>
                      </TextWrap>
                    </CommentItem>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: ' flex',
                    height: '100%',
                    alignItems: 'center',
                  }}
                >
                  <NoData />
                </div>
              ))}
          </div>
        )}
        {isComment && activeTabs === 2 ? (
          <EditComment
            visibleEdit={visibleEdit}
            editClose={editClose}
            editConfirm={onAddConfirm}
          />
        ) : null}
      </WrapRight>
    </div>
  )
}

export default NewWrapRight

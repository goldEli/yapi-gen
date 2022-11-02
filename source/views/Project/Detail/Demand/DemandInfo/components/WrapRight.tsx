/* eslint-disable max-lines */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import { Input, Button, message } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { OmitText } from '@star-yun/ui'
import { getParamsData, getNestedChildren } from '@/tools'
import { getTreeList } from '@/services/project/tree'
import {
  AddWrap,
  HiddenText,
  IconFontWrapEdit,
  CanOperation,
} from '@/components/StyleCommon'
import ParentDemand from '../../components/ParentDemand'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'
import TableQuickEdit from '@/components/TableQuickEdit'

const WrapRight = styled.div({
  width: '424px',
  height: '100%',
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
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)

const CommentItem = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 24,
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 12,
    },
  },
  ({ isShow }) => ({
    '&: hover': {
      '.anticon': {
        display: isShow ? 'block!important' : 'none',
      },
    },
  }),
)

const TextWrap = styled.div({
  width: 'calc(100% - 48px)',
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
  },
  '.content': {
    color: '#646566',
    fontSize: 12,
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    paddingRight: 30,
  },
})

const TextareaWrap = styled.div({
  marginTop: 67,
  height: 179,
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  padding: 16,
  textAlign: 'right',
  marginBottom: 20,
  '.ant-input': {
    border: 'none',
    padding: 0,
  },
  '.ant-input:focus,.ant-input:active': {
    border: 'none',
    boxShadow: 'none',
  },
})

const SetHead = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  font-size: 14px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 1px solid #f0f2fd;
  color: white;
  margin-right: 8px;
  margin-top: 24;
`

const NewWrapRight = (props: { onUpdate?(): void }) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [addValue, setAddValue] = useState('')
  const [activeTabs, setActiveTabs] = useState(1)
  const [classTreeData, setClassTreeData] = useState<any>([])
  const {
    getCommentList,
    addComment,
    deleteComment,
    isRefreshComment,
    setIsRefreshComment,
    demandInfo,
    updatePriority,
  } = useModel('demand')
  const { userInfo } = useModel('user')
  const { projectInfo, fieldList, getFieldList, memberList } =
    useModel('project')
  const { selectIterate } = useModel('iterate')
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const isComment = !projectInfo?.projectPermissions?.filter(
    (i: any) => i.identity === 'b/story/comment',
  ).length

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
      setIsRefreshComment(false)
    }, 100)
  }

  const getFieldData = async () => {
    await getFieldList({ projectId })
  }

  const getTreeData = async () => {
    const classTree = await getTreeList({ id: projectId, isTree: 1 })
    setClassTreeData([
      ...[
        {
          title: t('newlyAdd.unclassified'),
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

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId, priorityId: item.priorityId, projectId })
      message.success(t('common.prioritySuccess'))
      props.onUpdate?.()
    } catch (error) {
      //
    }
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

  const onAddComment = async (content: string) => {
    if (content?.trim().length) {
      try {
        await addComment({ projectId, demandId, content: content?.trim() })
        message.success(t('project.replaySuccess'))
        setAddValue('')
        getList()
      } catch (error) {
        //
      }
    }
  }

  const onPressEnter = (e: any) => {
    onAddComment(e.target.value)
  }

  return (
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
      {activeTabs === 1 ? (
        <div style={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }}>
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
                value={memberList?.map((i: any) => ({
                  label: i.name,
                  value: i.id,
                }))}
              >
                {demandInfo?.user?.length
                  ? demandInfo?.user?.map((i: any) => i.user.name).join('、')
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
            <ContentWrap notHover>{demandInfo?.finishTime || '--'}</ContentWrap>
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
                value={selectIterate?.list
                  ?.filter((k: any) => k.status === 1)
                  ?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
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
                value={classTreeData}
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
                  {isCanEdit && <IconFontWrapEdit type="down-icon" />}
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
                value={memberList?.map((i: any) => ({
                  label: i.name,
                  value: i.id,
                }))}
              >
                {demandInfo?.copySend?.length
                  ? demandInfo?.copySend
                      ?.map((i: any) => i.copysend.name)
                      .join('、')
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
                  value={i.type?.value}
                  isCustom
                  remarks={i.remarks}
                >
                  {Array.isArray(demandInfo?.customField?.[i.content]?.value)
                    ? demandInfo?.customField?.[i.content]?.value?.length > 0
                      ? demandInfo?.customField?.[i.content]?.value.join('、')
                      : '--'
                    : demandInfo?.customField?.[i.content]?.value || '--'}
                </TableQuickEdit>
              </ContentWrap>
            </InfoItem>
          ))}
        </div>
      ) : (
        <div
          style={{
            maxHeight: `calc(100% - ${isComment ? 80 : 320}px)`,
            overflow: 'auto',
          }}
        >
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <div>
                {dataList?.list?.map((item: any) => (
                  <CommentItem
                    key={item.id}
                    isShow={item.userId === userInfo.id}
                  >
                    {item.avatar ? (
                      <img src={item.avatar} alt="" />
                    ) : (
                      <SetHead>
                        {String(
                          item.name?.trim().slice(0, 1),
                        ).toLocaleUpperCase()}
                      </SetHead>
                    )}
                    <TextWrap>
                      <div className="textTop">
                        {isComment ? null : (
                          <IconFont
                            type="close"
                            onClick={() => onDeleteComment(item)}
                          />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="name">
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
                                width={108}
                                tipProps={{
                                  getPopupContainer: node => node,
                                }}
                              >
                                {item.statusContent}
                              </OmitText>
                            </HiddenText>
                          </span>
                        </div>
                        <div className="common" style={{ paddingRight: 30 }}>
                          {item.createdTime}
                        </div>
                      </div>
                      <div className="content">{item.content}</div>
                    </TextWrap>
                  </CommentItem>
                ))}
              </div>
            ) : (
              <NoData />
            ))}
        </div>
      )}
      {!isComment && activeTabs === 2 && (
        <TextareaWrap>
          <Input.TextArea
            placeholder={t('mark.editCom')}
            autoSize={{ minRows: 5, maxRows: 5 }}
            value={addValue}
            onChange={(e: any) => setAddValue(e.target.value)}
            onPressEnter={onPressEnter}
          />
          <Button type="primary" onClick={() => onAddComment(addValue)}>
            {t('project.replay')}
          </Button>
        </TextareaWrap>
      )}
    </WrapRight>
  )
}

export default NewWrapRight

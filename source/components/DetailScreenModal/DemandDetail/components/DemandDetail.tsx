/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InfoItem, Label, TextWrap, WrapLeft } from '../style'
import { Editor, EditorRef } from 'ifunuikit'
import DemandTag from '@/components/TagComponent/DemandTag'
import { AddWrap, TextWrapEdit, canEditHover } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'
import DeleteConfirm from '@/components/DeleteConfirm'
import DemandStatus from './DemandStatus'
import {
  addComment,
  addInfoDemand,
  deleteInfoDemand,
  getDemandInfo,
  updateDemandEditor,
} from '@/services/demand'
import { setDemandInfo } from '@store/demand'
import { getMessage } from '@/components/Message'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import ScheduleRecord from '@/components/ScheduleRecord'
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getIdsForAt, removeNull } from '@/tools'
import { getDemandCommentList } from '@store/demand/demand.thunk'

const DemandDetail = () => {
  const dId = useRef<any>()
  const commentDom: any = createRef()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const LeftDom = useRef<HTMLInputElement>(null)
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<any>()
  const { projectInfo, isDetailScreenModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { params, visible } = isDetailScreenModal
  const { demandInfo } = useSelector(store => store.demand)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()
  const [tagList, setTagList] = useState<any>([])
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }

    await addInfoDemand({
      projectId: params.id,
      demandId: dId.current,
      type: 'attachment',
      targetId: [obj],
    })
    const result = await getDemandInfo({
      projectId: params.id,
      id: dId.current,
    })
    dispatch(setDemandInfo(result))
    onBottom?.()
  }

  const onUpdate = async () => {
    const result = await getDemandInfo({
      projectId: params.id,
      id: demandInfo.id,
    })
    dispatch(setDemandInfo(result))
  }

  const onDeleteInfoAttach = async (file: any) => {
    setIsDelVisible(true)
    setFiles(file)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteInfoDemand({
        projectId: params.id,
        demandId: demandInfo.id,
        type: 'attachment',
        targetId: files,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      onUpdate()
      onBottom?.()
    } catch (error) {
      //
    }

    setIsDelVisible(false)
  }

  // 富文本失焦
  const onBlurEditor = async () => {
    setIsEditInfo(false)
    if (editorRef2.current === demandInfo.info) return
    const params = {
      info: editorRef2.current,
      projectId: projectInfo.id,
      id: demandInfo.id,
      name: demandInfo.name,
    }
    await updateDemandEditor(params)
    onUpdate()
  }

  // 提交评论
  const onConfirmComment = async (value: any) => {
    await addComment({
      projectId: projectInfo.id,
      demandId: demandInfo.id,
      content: value.info,
      attachment: value.attachment,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    dispatch(
      getDemandCommentList({
        projectId: projectInfo.id,
        demandId: demandInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
    commentDom.current.cancel()
  }

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
    setEditInfo(demandInfo.info || '')
    dId.current = demandInfo?.id
  }, [demandInfo])
  return (
    <WrapLeft ref={LeftDom}>
      <div
        style={{
          backgroundColor: '#f5f5f7',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px 12px',
        }}
      >
        <InfoItem
          style={{
            marginTop: '0px',
          }}
        >
          <Label>{t('mine.demandInfo')}</Label>
          {(isEditInfo || editInfo) && (
            <div className={params?.employeeCurrentId ? '' : canEditHover}>
              <Editor
                upload={uploadFile}
                color="transparent"
                value={editInfo}
                getSuggestions={() => []}
                readonly={params?.employeeCurrentId ? true : !isEditInfo}
                ref={editorRef}
                onReadonlyClick={() => {
                  setIsEditInfo(true)
                  setTimeout(() => {
                    editorRef.current?.focus()
                  }, 10)
                }}
                onChange={(value: string) => {
                  editorRef2.current = value
                }}
                onBlur={() => onBlurEditor()}
              />
            </div>
          )}
          {!isEditInfo && !editInfo && (
            <TextWrapEdit
              style={{
                width: '100%',
                cursor: params?.employeeCurrentId ? 'default' : '',
              }}
              onClick={e => {
                e.stopPropagation()
                if (params?.employeeCurrentId) {
                  return
                }
                setIsEditInfo(true)
                setTimeout(() => {
                  editorRef.current?.focus()
                }, 10)
              }}
            >
              <span>--</span>
            </TextWrapEdit>
          )}
        </InfoItem>
        <InfoItem>
          <Label>{t('scheduleRecord')}</Label>
          <ScheduleRecord
            detailId={demandInfo.id}
            projectId={demandInfo.projectId}
            noBorder
            isBug={demandInfo?.is_bug === 1}
            userId={params?.employeeCurrentId}
            isPreview={!!params?.employeeCurrentId}
          />
        </InfoItem>

        <InfoItem>
          <Label>{t('common.attachment')}</Label>
          <div>
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length > 0 && (
              <UploadAttach
                onBottom={onBottom}
                defaultList={demandInfo?.attachment?.map((i: any) => ({
                  url: i.attachment.path,
                  id: i.id,
                  size: i.attachment.size,
                  time: i.created_at,
                  name: i.attachment.name,
                  suffix: i.attachment.ext,
                  username: i.user_name ?? '--',
                }))}
                canUpdate
                onC
                del={onDeleteInfoAttach}
                add={onAddInfoAttach}
                addWrap={
                  params?.employeeCurrentId ? (
                    <span />
                  ) : (
                    <CommonButton type="primaryText" icon="plus">
                      {t('addAttachments')}
                    </CommonButton>
                  )
                }
              />
            )}
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length <= 0 && <span>--</span>}
          </div>
        </InfoItem>
        <InfoItem>
          <Label>{t('common.tag')}</Label>
          <DemandTag
            isPreview={(params?.employeeCurrentId || 0) > 0}
            defaultList={tagList}
            canAdd
            detail={demandInfo}
            isInfoPage
            addWrap={
              params?.employeeCurrentId ? (
                <span />
              ) : (
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              )
            }
          />
        </InfoItem>
        <DeleteConfirm
          text={t('p2.del')}
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        />
        {demandInfo.id && !params?.employeeCurrentId && (
          <InfoItem>
            <Label>{t('new_p1.a3')}</Label>
            <DemandStatus
              pid={params.id}
              sid={demandInfo.id}
              visible={visible}
            />
          </InfoItem>
        )}
        <InfoItem>
          <DemandComment detail={demandInfo} isOpenInfo />
        </InfoItem>
      </div>
      <CommentFooter
        onRef={commentDom}
        placeholder={t('postComment')}
        personList={removeNull(projectInfoValues, 'user_name')?.map(
          (k: any) => ({
            label: k.content,
            id: k.id,
          }),
        )}
        padding="no"
        onConfirm={onConfirmComment}
        style={{ marginLeft: 15, padding: '0', width: 'calc(100% - 36px)' }}
        maxHeight="60vh"
        hasAvatar
        isEmployee={location.pathname?.includes('/EmployeeProfile')}
      />
    </WrapLeft>
  )
}

export default DemandDetail

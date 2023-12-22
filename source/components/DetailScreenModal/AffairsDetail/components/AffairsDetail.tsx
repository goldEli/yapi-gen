import { InfoItem, Label, TargetWrap } from '../style'
import Editor, { EditorRef } from '@/components/ifunuikit/components/editor'
import SprintTag from '@/components/TagComponent/SprintTag'
import CommonButton from '@/components/CommonButton'
import {
  AddWrap,
  CloseWrap,
  TextWrapEdit,
  canEditHover,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  createRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import {
  addInfoAffairs,
  deleteInfoAffairs,
  updateEditor,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import { CommonIconFont } from '@/components/CommonIconFont'
import { BetweenBox } from '@/components/SprintDetailDrawer/style'
import { Tooltip } from 'antd'
import ScheduleRecord from '@/components/ScheduleRecord'

interface AffairsDetailProps {
  affairsInfo: Model.Affairs.AffairsInfo
  onUpdate?(value?: boolean): void
  isInfoPage?: boolean
  onRef?: any
  isPreview?: boolean
  // 用于获取进度日志中当前处理人的日志
  userId?: number
}

const AffairsDetail = (props: AffairsDetailProps) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const LeftDom = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<any>()
  const uploadRef: any = createRef()
  //   当前删除的附件数据
  const [tagList, setTagList] = useState<any>([])
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const { projectInfo } = useSelector(store => store.project)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const dId = useRef<any>()
  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onUpdate = (value?: boolean) => {
    if (props.isInfoPage) {
      dispatch(
        getAffairsInfo({ projectId: projectInfo.id, sprintId: dId.current }),
      )
    } else {
      props.onUpdate?.(value)
    }
  }

  //   添加附件
  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }
    await addInfoAffairs({
      projectId: projectInfo.id,
      sprintId: dId.current,
      type: 'attachment',
      targetId: [obj],
    })
    onUpdate()
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoAffairs({
      projectId: projectInfo.id,
      sprintId: props.affairsInfo.id,
      type: 'attachment',
      targetId,
    })
    onUpdate()
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
  }

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    open({
      title: t('deleteConfirmation'),
      text: t('p2.del'),
      onConfirm: () => {
        onDeleteConfirm(file)
        return Promise.resolve()
      },
    })
  }

  // 富文本失焦
  const onBlurEditor = async () => {
    setIsEditInfo(false)
    if (editorRef2.current === props.affairsInfo.info) return
    const params = {
      info: editorRef2.current,
      projectId: projectInfo.id,
      id: props.affairsInfo.id,
      name: props.affairsInfo.name,
    }
    await updateEditor(params)
    onUpdate()
  }

  useImperativeHandle(props.onRef, () => {
    return {
      handleUpload,
    }
  })

  const handleUpload = () => {
    uploadRef.current.handleUpload()
  }

  useEffect(() => {
    setTagList(
      props.affairsInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
    setEditInfo(props.affairsInfo.info || '')
    dId.current = props.affairsInfo.id
  }, [props.affairsInfo])

  return (
    <>
      <DeleteConfirmModal />

      <div
        style={{
          backgroundColor: '#f5f5f7',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: `0px ${props?.isInfoPage ? '12px' : '0px'}`,
        }}
      >
        <InfoItem
          className="info_item_tab"
          id="sprint-info"
          style={{
            marginTop: '12px',
            padding: '8px 24px',
            borderRadius: props?.isInfoPage ? 6 : 0,
          }}
          isInfoPage={props?.isInfoPage}
        >
          <Label>{t('describe')}</Label>
          {(isEditInfo || editInfo) && (
            <div className={props.isPreview ? '' : canEditHover}>
              <Editor
                upload={uploadFile}
                color="transparent"
                value={editInfo}
                getSuggestions={() => []}
                readonly={props.isPreview ? true : !isEditInfo}
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
                cursor: props?.isPreview ? 'default' : '',
              }}
              onClick={e => {
                e.stopPropagation()
                if (props.isPreview) {
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
        <InfoItem
          style={{
            borderRadius: props?.isInfoPage ? 6 : 0,
            padding: '16px 24px',
          }}
          id="schedule"
          className="info_item_tab"
          isInfoPage={props?.isInfoPage}
        >
          <Label>{t('scheduleRecord')}</Label>
          <ScheduleRecord
            isPreview={props?.isPreview}
            detailId={props?.affairsInfo.id ?? 0}
            projectId={projectInfo.id}
            noBorder
            isBug={props?.affairsInfo?.is_bug === 1}
            userId={props?.userId}
          />
        </InfoItem>
        <InfoItem
          id="sprint-attachment"
          className="info_item_tab"
          isInfoPage={props?.isInfoPage}
          style={{
            borderRadius: props?.isInfoPage ? 6 : 0,
            padding: '16px 24px',
          }}
        >
          <BetweenBox>
            <Label>{t('common.attachment')}</Label>
            {!props?.isPreview && (
              <Tooltip title={t('addAttachments')}>
                <CloseWrap width={32} height={32}>
                  <CommonIconFont
                    type="plus"
                    size={20}
                    color="var(--neutral-n2)"
                    onClick={handleUpload}
                  />
                </CloseWrap>
              </Tooltip>
            )}
          </BetweenBox>
          <div>
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length > 0 && (
              <UploadAttach
                multiple
                ref={uploadRef}
                onBottom={onBottom}
                defaultList={props.affairsInfo?.attachment?.map((i: any) => ({
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
                isIteration={props?.isPreview}
                del={onDeleteInfoAttach}
                add={onAddInfoAttach}
              />
            )}
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length <= 0 && <span>--</span>}
          </div>
        </InfoItem>
        <InfoItem
          id="sprint-tag"
          className="info_item_tab"
          isInfoPage={props?.isInfoPage}
          style={{
            borderRadius: props?.isInfoPage ? 6 : 0,
            padding: '16px 24px',
          }}
        >
          <Label>{t('common.tag')}</Label>
          <SprintTag
            isPreview={props?.isPreview}
            defaultList={tagList}
            canAdd
            onUpdate={() => onUpdate()}
            detail={props.affairsInfo}
            addWrap={
              props?.isPreview ? (
                <span />
              ) : (
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              )
            }
          />
        </InfoItem>
      </div>
    </>
  )
}
export default AffairsDetail

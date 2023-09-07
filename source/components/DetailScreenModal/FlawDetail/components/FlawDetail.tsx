import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { Editor, EditorRef } from '@xyfe/uikit'
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { getFlawInfo } from '@store/flaw/flaw.thunk'
import { addInfoFlaw, deleteInfoFlaw, updateFlawEditor } from '@/services/flaw'
import { getMessage } from '@/components/Message'
import { FlawInfoInfoItem, FlawInfoLabel, Label, LabelWrap } from '../style'
import {
  AddWrap,
  CloseWrap,
  TextWrapEdit,
  canEditHover,
} from '@/components/StyleCommon'
import FlawTag from '@/components/TagComponent/FlawTag'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'
import CommonButton from '@/components/CommonButton'
import ScheduleRecord from '@/components/ScheduleRecord'

interface FlawDetailProps {
  flawInfo: Model.Flaw.FlawInfo
  isInfoPage?: boolean
  onUpdate?(value?: boolean): void
  isPreview?: boolean
}

const FlawDetail = (props: FlawDetailProps, ref: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<any>()
  const dId = useRef<any>()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { projectInfo } = useSelector(store => store.project)
  const [tagList, setTagList] = useState<any>([])
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const uploadRef = useRef<any>()
  const onUpdate = (value?: boolean) => {
    if (props.isInfoPage) {
      dispatch(getFlawInfo({ projectId: projectInfo.id, id: dId.current }))
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
    await addInfoFlaw({
      projectId: projectInfo.id,
      id: dId.current,
      type: 'attachment',
      targetId: [obj],
    })
    onUpdate()
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoFlaw({
      projectId: projectInfo.id,
      id: props.flawInfo.id,
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

    if (editorRef2.current === props.flawInfo.info) return
    const params = {
      info: editorRef2.current,
      projectId: projectInfo.id,
      id: props.flawInfo.id,
      name: props.flawInfo.name,
    }
    await updateFlawEditor(params)
    onUpdate()
  }

  useEffect(() => {
    setTagList(
      props.flawInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
    setEditInfo(props.flawInfo.info)
    dId.current = props.flawInfo.id
  }, [props.flawInfo])
  const handleUpload = () => {
    uploadRef.current?.handleUpload()
  }
  useImperativeHandle(ref, () => {
    return {
      handleUpload,
    }
  })
  return (
    <>
      <DeleteConfirmModal />
      <FlawInfoInfoItem
        style={{
          marginTop: '0px',
        }}
        activeState
        id="tab_desc"
        className="info_item_tab"
      >
        <FlawInfoLabel>{t('describe')}</FlawInfoLabel>
        {isEditInfo || editInfo ? (
          <div className={canEditHover}>
            <Editor
              value={editInfo}
              color="transparent"
              getSuggestions={() => []}
              readonly={!isEditInfo}
              ref={editorRef}
              onReadonlyClick={() => {
                if (props.isPreview) {
                  return
                }
                setIsEditInfo(true)
                setTimeout(() => {
                  editorRef.current?.focus()
                }, 10)
              }}
              onChange={(value: string) => (editorRef2.current = value)}
              onBlur={() => onBlurEditor()}
            />
          </div>
        ) : null}
        {!isEditInfo && !editInfo && (
          <TextWrapEdit
            onClick={() => {
              if (props.isPreview) {
                return
              }
              setIsEditInfo(true)
              setTimeout(() => {
                editorRef.current?.focus()
              }, 10)
            }}
          >
            <span className={canEditHover}>--</span>
          </TextWrapEdit>
        )}
      </FlawInfoInfoItem>
      <FlawInfoInfoItem id="tab_log" className="info_item_tab">
        <FlawInfoLabel>{t('scheduleRecord')}</FlawInfoLabel>
        <ScheduleRecord
          detailId={props?.flawInfo.id ?? 0}
          projectId={projectInfo.id ?? 0}
          noBorder
          isBug={props?.flawInfo?.is_bug === 1}
          isPreview={props?.isPreview}
        />
      </FlawInfoInfoItem>
      <FlawInfoInfoItem
        activeState
        id="tab_attachment"
        className="info_item_tab"
        style={{ marginBottom: 16 }}
      >
        {/* <FlawInfoLabel>{t('common.attachment')}</FlawInfoLabel> */}
        <LabelWrap>
          <Label>{t('common.attachment')}</Label>
          {props.isInfoPage || props?.isPreview ? null : (
            <Tooltip title={t('addAttachments')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont
                  type="plus"
                  size={20}
                  color="var(--neutral-n2)"
                  onClick={() => {
                    handleUpload()
                  }}
                />
              </CloseWrap>
            </Tooltip>
          )}
        </LabelWrap>
        <div>
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length > 0 && (
            <UploadAttach
              multiple
              defaultList={props.flawInfo?.attachment?.map((i: any) => ({
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
              isBug
              ref={uploadRef}
              isIteration={props?.isPreview}
              addWrap={
                props.isInfoPage ? (
                  <CommonButton type="primaryText" icon="plus">
                    {t('addAttachments')}
                  </CommonButton>
                ) : null
              }
            />
          )}
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length <= 0 && <span>--</span>}
        </div>
      </FlawInfoInfoItem>
      <FlawInfoInfoItem id="tab_tag" className="info_item_tab">
        <FlawInfoLabel>{t('common.tag')}</FlawInfoLabel>
        <FlawTag
          isPreview={props?.isPreview}
          defaultList={tagList}
          canAdd
          onUpdate={onUpdate}
          detail={props.flawInfo}
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
      </FlawInfoInfoItem>
    </>
  )
}

export default forwardRef(FlawDetail)

import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { Editor, EditorRef } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { getFlawInfo } from '@store/flaw/flaw.thunk'
import { addInfoFlaw, deleteInfoFlaw, updateFlawEditor } from '@/services/flaw'
import { getMessage } from '@/components/Message'
import { FlawInfoInfoItem, FlawInfoLabel, Label, LabelWrap } from '../style'
import { AddWrap, CloseWrap, TextWrapEdit } from '@/components/StyleCommon'
import FlawTag from '@/components/TagComponent/FlawTag'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'

interface FlawDetailProps {
  flawInfo: Model.Flaw.FlawInfo
  isInfoPage?: boolean
  onUpdate?(value?: boolean): void
}

const FlawDetail = (props: FlawDetailProps) => {
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
    onUpdate(true)
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoFlaw({
      projectId: projectInfo.id,
      id: props.flawInfo.id,
      type: 'attachment',
      targetId,
    })
    onUpdate(true)
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
    onUpdate(true)
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

  return (
    <>
      <DeleteConfirmModal />
      <FlawInfoInfoItem
        style={{
          marginTop: '0px',
        }}
        activeState
        id="tab_desc"
      >
        <FlawInfoLabel>{t('describe')}</FlawInfoLabel>
        {isEditInfo || editInfo ? (
          <Editor
            value={editInfo}
            getSuggestions={() => []}
            readonly={!isEditInfo}
            ref={editorRef}
            onReadonlyClick={() => {
              setIsEditInfo(true)
              setTimeout(() => {
                editorRef.current?.focus()
              }, 10)
            }}
            onChange={(value: string) => (editorRef2.current = value)}
            onBlur={() => onBlurEditor()}
          />
        ) : null}
        {!isEditInfo && !editInfo && (
          <TextWrapEdit
            onClick={() => {
              setIsEditInfo(true)
              setTimeout(() => {
                editorRef.current?.focus()
              }, 10)
            }}
          >
            --
          </TextWrapEdit>
        )}
      </FlawInfoInfoItem>
      <FlawInfoInfoItem id="tab_tag">
        <FlawInfoLabel>{t('common.tag')}</FlawInfoLabel>
        <FlawTag
          defaultList={tagList}
          canAdd
          onUpdate={onUpdate}
          detail={props.flawInfo}
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </FlawInfoInfoItem>
      <FlawInfoInfoItem activeState id="tab_attachment">
        {/* <FlawInfoLabel>{t('common.attachment')}</FlawInfoLabel> */}
        <LabelWrap>
          <Label>{t('common.attachment')}</Label>
          <CloseWrap width={24} height={24}>
            <CommonIconFont
              type="plus"
              size={18}
              color="var(--neutral-n2)"
              onClick={() => {
                uploadRef.current?.handleUpload()
              }}
            />
          </CloseWrap>
        </LabelWrap>
        <div>
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length > 0 && (
            <UploadAttach
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
            />
          )}
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length <= 0 && <span>--</span>}
        </div>
      </FlawInfoInfoItem>
    </>
  )
}

export default FlawDetail

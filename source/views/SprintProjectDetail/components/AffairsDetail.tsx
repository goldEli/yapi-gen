import { InfoItem, Label, TextWrap } from '../style'
import { Editor, EditorRef } from '@xyfe/uikit'
import SprintTag from '@/components/TagComponent/SprintTag'
import CommonButton from '@/components/CommonButton'
import { AddWrap, TextWrapEdit } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import { useEffect, useRef, useState } from 'react'
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

interface AffairsDetailProps {
  affairsInfo: Model.Affairs.AffairsInfo
  onUpdate?(value?: boolean): void
  isInfoPage?: boolean
}

const AffairsDetail = (props: AffairsDetailProps) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const LeftDom = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
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
    onUpdate(true)
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoAffairs({
      projectId: projectInfo.id,
      sprintId: props.affairsInfo.id,
      type: 'attachment',
      targetId,
    })
    onUpdate(true)
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
  }

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    open({
      title: '删除确认',
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

    if (editInfo === props.affairsInfo.info) return
    const params = {
      info: editInfo,
      projectId: projectInfo.id,
      id: props.affairsInfo.id,
      name: props.affairsInfo.name,
    }
    await updateEditor(params)
    onUpdate(true)
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
      <InfoItem
        className="info_item_tab"
        id="sprint-info"
        style={{
          marginTop: '0px',
        }}
      >
        <Label>描述</Label>
        {(isEditInfo || editInfo) && (
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
            onChange={(value: string) => setEditInfo(value)}
            onBlur={onBlurEditor}
          />
        )}
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
      </InfoItem>
      <InfoItem id="sprint-attachment" className="info_item_tab">
        <Label>{t('common.attachment')}</Label>
        <div>
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length > 0 && (
            <UploadAttach
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
              del={onDeleteInfoAttach}
              add={onAddInfoAttach}
              addWrap={
                <CommonButton type="primaryText" icon="plus">
                  添加附件
                </CommonButton>
              }
            />
          )}
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length <= 0 && <span>--</span>}
        </div>
      </InfoItem>
      <InfoItem id="sprint-tag" className="info_item_tab">
        <Label>{t('common.tag')}</Label>
        <SprintTag
          defaultList={tagList}
          canAdd
          onUpdate={onUpdate}
          detail={props.affairsInfo}
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </InfoItem>
    </>
  )
}
export default AffairsDetail

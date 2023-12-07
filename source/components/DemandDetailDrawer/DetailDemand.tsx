/* eslint-disable react/jsx-no-leaked-render */
// 需求详情右侧弹窗-详细信息

/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  addInfoDemand,
  deleteInfoDemand,
  updateDemandEditor,
} from '@/services/demand'
import { useSelector } from '@store/index'
import { Tooltip, message } from 'antd'
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '../DeleteConfirm'
import IconFont from '../IconFont'
import { AddWrap, CloseWrap, TextWrapEdit, canEditHover } from '../StyleCommon'
import UploadAttach from '../UploadAttach'
import { ContentItem, Label, LabelWrap } from './style'
import { Editor, EditorRef } from 'ifunuikit'
import { getMessage } from '../Message'
import CommonIconFont from '../CommonIconFont'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'
import DemandTag from '../TagComponent/DemandTag'
import ScheduleRecord from '../ScheduleRecord'

interface DetailDemand {
  detail: any
  onUpdate?(value?: boolean): void
  isPreview?: boolean
  // 用于获取进度日志中当前处理人的日志
  userId?: number
}

const DetailDemand = (props: DetailDemand, ref: any) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<any>()
  const uploadRef = useRef<any>()
  const info = useRef<any>({})
  const onDeleteInfoAttach = async (file: any) => {
    setIsDelVisible(true)
    setFiles(file)
  }

  const onAddInfoAttach = async (data: any, id: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }

    await addInfoDemand({
      projectId: projectInfo?.id,
      demandId: info.current?.id,
      type: 'attachment',
      targetId: [obj],
    })
    props.onUpdate?.()
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteInfoDemand({
        projectId: projectInfo?.id,
        demandId: info.current?.id,
        type: 'attachment',
        targetId: files,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      props.onUpdate?.()
    } catch (error) {
      //
    }

    setIsDelVisible(false)
  }

  // 富文本失焦
  const onBlurEditor = async () => {
    setIsEditInfo(false)

    if (editorRef2.current === props.detail.info) return
    const params = {
      info: editorRef2.current,
      projectId: projectInfo.id,
      id: props.detail.id,
      name: props.detail.name,
    }
    await updateDemandEditor(params)
    props.onUpdate?.()
  }
  const handleUpload = () => {
    uploadRef.current?.handleUpload()
  }
  useEffect(() => {
    setEditInfo(props.detail.info)
    info.current = props.detail
  }, [JSON.stringify(props.detail)])

  useImperativeHandle(ref, () => {
    return {
      handleUpload,
    }
  })

  return (
    <>
      <DeleteConfirm
        text={t('p2.del')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
      <ContentItem
        style={{
          backgroundColor: 'white',
          marginBottom: 12,
          padding: '12px 24px',
        }}
        id="tab_desc"
        className="info_item_tab"
      >
        <Label>{t('requirement_description')}</Label>
        {(isEditInfo || editInfo) && (
          <div className={canEditHover}>
            <Editor
              upload={uploadFile}
              color="transparent"
              value={editInfo}
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
              onChange={(value: string) => {
                setEditInfo(value)
                editorRef2.current = value
              }}
              onBlur={() => onBlurEditor()}
            />
          </div>
        )}
        {!isEditInfo && !editInfo && (
          <TextWrapEdit
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
            <span className={canEditHover}>--</span>
          </TextWrapEdit>
        )}
      </ContentItem>
      <ContentItem
        style={{
          backgroundColor: 'white',
          marginBottom: 12,
          padding: '12px 24px',
        }}
      >
        <div id="tab_log" className="info_item_tab">
          <LabelWrap>
            <Label>{t('scheduleRecord')}</Label>
          </LabelWrap>
          <ScheduleRecord
            isPreview={props?.isPreview}
            detailId={props.detail.id}
            projectId={projectInfo.id}
            noBorder
            isBug={props.detail?.is_bug === 1}
            userId={props?.userId}
          />
        </div>
      </ContentItem>
      <ContentItem
        style={{
          backgroundColor: 'white',
          marginBottom: 12,
          padding: '12px 24px',
        }}
        id="tab_attachment"
        className="info_item_tab"
      >
        <LabelWrap>
          <Label>{t('common.attachment')}</Label>
          {!props?.isPreview && (
            <Tooltip title={t('addAttachments')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont
                  type="plus"
                  size={20}
                  color="var(--neutral-n2)"
                  onClick={() => {
                    uploadRef.current?.handleUpload()
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
              // onlyView
              multiple
              defaultList={props.detail?.attachment?.map((i: any) => ({
                url: i.attachment.path,
                id: i.id,
                size: i.attachment.size,
                time: i.created_at,
                name: i.attachment.name,
                suffix: i.attachment.ext,
                username: i.user_name ?? '--',
              }))}
              canUpdate
              isIteration={props?.isPreview}
              onC
              del={onDeleteInfoAttach}
              add={onAddInfoAttach}
              ref={uploadRef}
            />
          )}
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length <= 0 && <span>--</span>}
        </div>
      </ContentItem>
      <ContentItem
        style={{
          backgroundColor: 'white',
          marginBottom: 12,
          padding: '12px 24px',
        }}
        id="tab_tag"
        className="info_item_tab"
      >
        <Label>{t('label')}</Label>
        <DemandTag
          defaultList={props.detail?.tag?.map((i: any) => ({
            id: i.id,
            color: i.tag?.color,
            name: i.tag?.content,
          }))}
          isPreview={props?.isPreview}
          canAdd
          detail={props.detail}
          onUpdate={props.onUpdate}
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
      </ContentItem>
    </>
  )
}

export default forwardRef(DetailDemand)

// 需求详情右侧弹窗-详细信息

/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  addInfoDemand,
  deleteInfoDemand,
  updateDemandEditor,
} from '@/services/demand'
import { useSelector } from '@store/index'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '../DeleteConfirm'
import IconFont from '../IconFont'
import { AddWrap, TextWrapEdit } from '../StyleCommon'
import UploadAttach from '../UploadAttach'
import { ContentItem, Label } from './style'
import DrawerTagComponent from './DrawerTagComponent'
import { Editor, EditorRef } from '@xyfe/uikit'
import { getMessage } from '../Message'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'

interface DetailDemand {
  detail: any
  onUpdate(value?: boolean): void
}

const DetailDemand = (props: DetailDemand) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<any>()
  const onDeleteInfoAttach = async (file: any) => {
    setIsDelVisible(true)
    setFiles(file)
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
      projectId: props.detail.projectId,
      demandId: props.detail.id,
      type: 'attachment',
      targetId: [obj],
    })
    props.onUpdate(true)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteInfoDemand({
        projectId: props.detail.projectId,
        demandId: props.detail.id,
        type: 'attachment',
        targetId: files,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      props.onUpdate(true)
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
    props.onUpdate()
  }

  useEffect(() => {
    setEditInfo(props.detail.info)
  }, [props.detail])

  return (
    <>
      <DeleteConfirm
        text={t('p2.del')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
      <ContentItem>
        <Label>{t('requirement_description')}</Label>
        {(isEditInfo || editInfo) && (
          <Editor
            upload={uploadFile}
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
            onChange={(value: string) => {
              setEditInfo(value)
              editorRef2.current = value
            }}
            onBlur={() => onBlurEditor()}
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
      </ContentItem>
      <ContentItem>
        <Label>{t('label')}</Label>
        <DrawerTagComponent
          demandDetail={props.detail}
          onUpdate={props.onUpdate}
        />
      </ContentItem>
      <ContentItem style={{ marginBottom: 0 }}>
        <Label>{t('common.attachment')}</Label>
        <div>
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length > 0 && (
            <UploadAttach
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
              onC
              del={onDeleteInfoAttach}
              add={onAddInfoAttach}
              addWrap={
                <AddWrap
                  hasColor
                  style={{
                    marginBottom: '10px',
                    color: 'var(--primary-d1)',
                  }}
                >
                  <IconFont
                    style={{
                      color: 'var(--primary-d1)',
                    }}
                    type="plus"
                  />
                  <div>{t('p2.addAdjunct')}</div>
                </AddWrap>
              }
            />
          )}
          {projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length <= 0 && <span>--</span>}
        </div>
      </ContentItem>
    </>
  )
}

export default DetailDemand

// 需求详情右侧弹窗-详细信息

/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import { useSelector } from '@store/index'
import { message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Editor } from '@xyfe/uikit'
import { getMessage } from '@/components/Message'
import { ContentItem, Label } from '../style'
import DrawerTagComponent from '@/components/DemandDetailDrawer/DrawerTagComponent'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'
import { addInfoSprint, deleteInfoSprint } from '@/services/sprint'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

interface DetailDemand {
  detail: any
  onUpdate(): void
}

const SprintDetail = (props: DetailDemand) => {
  const [t] = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { projectInfo } = useSelector(store => store.project)

  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }
    await addInfoSprint({
      projectId: props.detail.projectId,
      sprintId: props.detail.id,
      type: 'attachment',
      targetId: [obj],
    })
    props.onUpdate()
  }

  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoSprint({
      projectId: props.detail.projectId,
      sprintId: props.detail.id,
      type: 'attachment',
      targetId,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    props.onUpdate()
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

  return (
    <>
      <DeleteConfirmModal />
      <ContentItem>
        <Label>{t('requirement_description')}</Label>
        {props.detail.info ? (
          <Editor
            value={props.detail.info}
            getSuggestions={() => []}
            readonly
          />
        ) : (
          '--'
        )}
      </ContentItem>
      <ContentItem id="sprint-tag">
        <Label>{t('label')}</Label>
        <DrawerTagComponent
          demandDetail={props.detail}
          onUpdate={props.onUpdate}
        />
      </ContentItem>
      <ContentItem style={{ marginBottom: 0 }} id="sprint-attachment">
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
      </ContentItem>
    </>
  )
}

export default SprintDetail

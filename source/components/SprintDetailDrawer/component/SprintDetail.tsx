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

interface DetailDemand {
  detail: any
  onUpdate(): void
}

const SprintDetail = (props: DetailDemand) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()

  const onDeleteInfoAttach = async (file: any) => {
    setIsDelVisible(true)
    setFiles(file)
  }

  const onAddInfoAttach = async (data: any) => {
    // const obj = {
    //   url: data.data.url,
    //   name: data.data.files.name,
    //   size: data.data.files.size,
    //   ext: data.data.files.suffix,
    //   ctime: data.data.files.time,
    // }
    // try {
    //   await addInfoDemand({
    //     projectId: props.detail.projectId,
    //     demandId: props.detail.id,
    //     type: 'attachment',
    //     targetId: [obj],
    //   })
    //   props.onUpdate()
    // } catch (error) {
    //   //
    // }
  }

  const onDeleteConfirm = async () => {
    // try {
    //   await deleteInfoDemand({
    //     projectId: props.detail.projectId,
    //     demandId: props.detail.id,
    //     type: 'attachment',
    //     targetId: files,
    //   })
    //   getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    //   props.onUpdate()
    // } catch (error) {
    //   //
    // }
    // setIsDelVisible(false)
  }

  return (
    <>
      {/* <DeleteConfirm
        text={t('p2.del')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      /> */}
      <ContentItem>
        <Label>{t('requirement_description')}</Label>
        {props.detail.info ? (
          <Editor
            value={props.detail.info}
            getSuggestions={() => []}
            readonly
          />
        ) : (
          // <div dangerouslySetInnerHTML={{ __html: props.detail.info }} />
          '--'
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

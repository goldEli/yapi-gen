import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import {
  FlawInfoInfoItem,
  FlawInfoLabel,
  FlawInfoLeft,
  FlawInfoTextWrap,
  FlawInfoWrap,
} from '../style'
import { Editor } from '@xyfe/uikit'
import FlawTag from '@/components/TagComponent/FlawTag'
import { useTranslation } from 'react-i18next'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'
import { addInfoFlaw, deleteInfoFlaw } from '@/services/flaw'
import { getMessage } from '@/components/Message'

interface FlawDetailProps {
  flawInfo: Model.Flaw.FlawInfo
  onUpdate(): void
}
const FlawDetail = (props: FlawDetailProps) => {
  const [t] = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { projectInfo } = useSelector(store => store.project)
  const [tagList, setTagList] = useState<any>([])

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
      id: props.flawInfo.id,
      type: 'attachment',
      targetId: [obj],
    })
    props.onUpdate()
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoFlaw({
      projectId: projectInfo.id,
      id: props.flawInfo.id,
      type: 'attachment',
      targetId,
    })
    props.onUpdate()
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

  useEffect(() => {
    setTagList(
      props.flawInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [props.flawInfo])

  return (
    <>
      <DeleteConfirmModal />
      <FlawInfoInfoItem
        style={{
          marginTop: '0px',
        }}
        activeState
      >
        <FlawInfoLabel>描述</FlawInfoLabel>
        {props.flawInfo?.info ? (
          <Editor
            value={props.flawInfo?.info}
            getSuggestions={() => []}
            readonly
          />
        ) : (
          <FlawInfoTextWrap>--</FlawInfoTextWrap>
        )}
      </FlawInfoInfoItem>
      <FlawInfoInfoItem>
        <FlawInfoLabel>{t('common.tag')}</FlawInfoLabel>
        <FlawTag
          defaultList={tagList}
          canAdd
          onUpdate={props.onUpdate}
          detail={props.flawInfo}
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </FlawInfoInfoItem>
      <FlawInfoInfoItem activeState>
        <FlawInfoLabel>{t('common.attachment')}</FlawInfoLabel>
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
      </FlawInfoInfoItem>
    </>
  )
}

export default FlawDetail

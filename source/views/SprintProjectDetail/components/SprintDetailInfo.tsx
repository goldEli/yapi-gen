import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import { useRef, useState } from 'react'
import { DetailInfoWrap, InfoItem, Label, TextWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { Editor } from '@xyfe/uikit'
import TagComponent from '@/components/TagComponent'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CommonButton from '@/components/CommonButton'
import ChildSprint from './ChildSprint'
import LinkSprint from './LinkSprint'
import ActivitySprint from './ActivitySprint'
import CommonComment from '@/components/CommonComment'

const SprintDetailInfo = () => {
  const [t] = useTranslation()
  const LeftDom = useRef<HTMLDivElement>(null)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  //   当前删除的附件数据
  const [files, setFiles] = useState()
  const [tagList, setTagList] = useState<any>([])
  const demandInfo = {
    info: '12112',
    attachment: [],
  }

  //   添加附件
  const onAddInfoAttach = async (data: any) => {
    //
  }

  //   确认删除附件事件
  const onDeleteConfirm = async () => {}

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    // setFiles(file)
    open({
      title: '确认删除',
      text: t('p2.del'),
      onConfirm() {
        return onDeleteConfirm()
      },
    })
  }

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  // 提交评论
  const onConfirmComment = (value: any) => {
    console.log(value)
  }

  return (
    <DragMoveContainer
      max="65vw"
      min="30vw"
      width="65vw"
      height="calc(100vh - 236px)"
    >
      <DeleteConfirmModal />
      <DetailInfoWrap ref={LeftDom}>
        <InfoItem
          style={{
            marginTop: '0px',
          }}
        >
          <Label>{t('mine.demandInfo')}</Label>
          {demandInfo?.info ? (
            <Editor
              value={demandInfo?.info}
              getSuggestions={() => []}
              readonly
            />
          ) : (
            // <div dangerouslySetInnerHTML={{ __html: demandInfo?.info }} />
            <TextWrap>--</TextWrap>
          )}
        </InfoItem>
        <InfoItem>
          <Label>{t('common.attachment')}</Label>
          <div>
            {/* {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length > 0 && ( */}
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
                <CommonButton type="primaryText" icon="plus">
                  添加附件
                </CommonButton>
              }
            />
            {/* )} */}
            {/* {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length <= 0 && <span>--</span>} */}
          </div>
        </InfoItem>
        <InfoItem>
          <Label>{t('common.tag')}</Label>
          <TagComponent
            defaultList={tagList}
            canAdd
            addWrap={
              <AddWrap hasDash>
                <IconFont type="plus" />
              </AddWrap>
            }
          />
        </InfoItem>
        <ChildSprint />
        <LinkSprint />
        <ActivitySprint />
      </DetailInfoWrap>
      <CommonComment
        placeholder="发表评论（按M快捷键发表评论）"
        personList={[]}
        onConfirm={onConfirmComment}
        style={{ padding: '0 24px', width: 'calc(100% - 24px)' }}
        maxHeight="60vh"
      />
    </DragMoveContainer>
  )
}

export default SprintDetailInfo

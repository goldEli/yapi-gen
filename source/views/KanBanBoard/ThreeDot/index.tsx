import React from 'react'
import styled from '@emotion/styled'
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { deleteStory } from '@store/kanBan/kanBan.thunk'
import {
  onCopyLink,
  onCopyName,
} from '@/components/TableDropdownMenu/CommonDropdownMenu'
import { getIsPermission, getProjectIdByUrl } from '@/tools'
import { setAddWorkItemModal } from '@store/project'
import useI18n from '@/hooks/useI18n'

interface ThreeDotProps {
  story: Model.KanBan.Story
}
//   //  点击复制链接
//   const onCopy = () => {
//     let text: any = ''
//     let beforeUrl: any
//     beforeUrl = `${window.origin}${import.meta.env.__URL_HASH__}`
//     props.selectRows?.forEach((element: any) => {
//       const params = encryptPhp(
//         JSON.stringify({ type: 'info', id: projectId, demandId: element.id }),
//       )
//       const url = `ProjectManagement/Demand?data=${params}`
//       text += `【${element.name}】 ${beforeUrl}${url} \n`
//     })
//     copyLink(text, t('version2.copyLinkSuccess'), t('version2.copyLinkError'))
//   }

const Item = styled.div`
  width: 100%;
`
// function copyTextToClipboard(text: string) {
//   navigator.clipboard
//     .writeText(text)
//     .then(() => {
//       getMessage({
//         msg: '复制成功！',
//         type: 'success',
//       })
//     })
//     .catch(error => {
//       console.error('Error copying text: ', error)
//     })
// }
const ThreeDot: React.FC<ThreeDotProps> = props => {
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  //   const copyTitle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     e.stopPropagation()
  //     copyTextToClipboard(props.story.name)
  //   }
  //   const copyNo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     e.stopPropagation()
  //     copyTextToClipboard(props.story.id + '')
  //   }
  const { projectInfo } = useSelector(store => store.project)
  const { t } = useI18n()

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )
  const onDel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    open({
      title: t('confirm_deletion'),
      text: t('are_you_sure_to_delete_this_requirement?'),
      onConfirm: () => {
        dispatch(
          deleteStory({
            id: props.story.id,
          }),
        )
        return Promise.resolve()
      },
    })
  }

  const items = [
    {
      key: '1',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            dispatch(
              setAddWorkItemModal({
                visible: true,
                params: {
                  type: props.story?.project_category?.work_type,
                  editId: props.story.id,
                  projectId: getProjectIdByUrl(),
                  title: t('editorial_affairs'),
                },
              }),
            )
          }}
        >
          {t('edit')}
        </Item>
      ),
    },
    {
      key: '2',
      label: <Item onClick={onDel}>{t('delete')}</Item>,
    },
    {
      key: '3',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            onCopyLink({
              t,
              project_id: getProjectIdByUrl(),
              id: props.story.id,
            })
          }}
        >
          {t('copy_number')}
        </Item>
      ),
    },
    {
      key: '4',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            onCopyName(props.story.name, t)
          }}
        >
          {t('copy_title')}
        </Item>
      ),
    },
  ].filter(item => {
    if (item.key === '2') {
      return hasDel
    }
    return true
  })
  return (
    <>
      <Dropdown
        trigger={['hover']}
        menu={{
          items,
        }}
        placement="bottomRight"
        getPopupContainer={(i: any) => i.parentNode}
      >
        <HoverIcon>
          <IconFont
            style={{
              color: 'var(--neutral-n3)',
              fontSize: 16,
            }}
            type="more"
          />
        </HoverIcon>
      </Dropdown>
      <DeleteConfirmModal />
    </>
  )
}

export default ThreeDot

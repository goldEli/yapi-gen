import React from 'react'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'
import { getMessage } from '@/components/Message'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch } from '@store/index'
import { deleteStory } from '@store/kanBan/kanBan.thunk'
import {
  onCopyLink,
  onCopyName,
} from '@/components/TableDropdownMenu/CommonDropdownMenu'
import { getParamsValueByKey } from '@/tools'

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
function copyTextToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      getMessage({
        msg: '复制成功！',
        type: 'success',
      })
    })
    .catch(error => {
      console.error('Error copying text: ', error)
    })
}
const ThreeDot: React.FC<ThreeDotProps> = props => {
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  const copyTitle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    copyTextToClipboard(props.story.name)
  }
  const copyNo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    copyTextToClipboard(props.story.id + '')
  }
  const onDel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    open({
      title: '删除确认',
      text: '确认删除该需求吗？',
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
  return (
    <>
      <Dropdown
        trigger={['hover']}
        menu={{
          items: [
            {
              key: '1',
              label: <Item>编辑</Item>,
            },
            {
              key: '2',
              label: <Item onClick={onDel}>删除</Item>,
            },
            {
              key: '3',
              label: (
                <Item
                  onClick={e => {
                    e.stopPropagation()
                    onCopyName(props.story.name)
                  }}
                >
                  复制编号
                </Item>
              ),
            },
            {
              key: '4',
              label: (
                <Item
                  onClick={e => {
                    e.stopPropagation()
                    onCopyLink({
                      project_id: getParamsValueByKey('id'),
                      id: props.story.id,
                    })
                  }}
                >
                  复制标题
                </Item>
              ),
            },
          ],
        }}
        placement="bottomRight"
        getPopupContainer={(i: any) => i.parentNode}
      >
        <HoverIcon>
          <IconFont
            style={{
              color: 'var(--neutral-n3)',
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

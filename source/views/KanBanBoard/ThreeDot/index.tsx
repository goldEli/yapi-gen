import React from 'react'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'
import { getMessage } from '@/components/Message'

interface ThreeDotProps {
  story: Model.KanBan.Story
}

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
  const copyTitle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    copyTextToClipboard(props.story.name)
  }
  const copyNo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    copyTextToClipboard(props.story.id + '')
  }
  return (
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
            label: <Item>删除</Item>,
          },
          {
            key: '3',
            label: <Item onClick={copyNo}>复制编号</Item>,
          },
          {
            key: '4',
            label: <Item onClick={copyTitle}>复制标题</Item>,
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
  )
}

export default ThreeDot

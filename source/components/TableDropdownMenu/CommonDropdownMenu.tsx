/* eslint-disable @typescript-eslint/naming-convention */

// 我的所有项目 -- 公共菜单

import { copyLink, getIsPermission } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useTranslation } from 'react-i18next'

const MenuWrap = styled(Menu)`
  border-radius: 6px;
  padding: 4px 0;
  li {
    height: 32px !important;
    line-height: 32px !important;
    margin: 0 !important;
    color: var(--neutral-n2) !important;
    background: var(---neutral-white-d3) !important;
  }
  li:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3) !important;
  }
`

interface Props {
  record: any
  onDeleteChange(row: any): void
  // 是否是所有项目
  isAllProject?: boolean
}

export const CommonDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )

  // 复制需求id
  const onCopyName = () => {
    copyLink(`${props.record.name}`, '复制成功！', '复制失败！')
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: props.record.project_id,
        demandId: props.record.id,
      }),
    )
    const url = `/ProjectManagement/Demand?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(text, '复制成功！', '复制失败！')
  }

  let menuItems = [
    {
      key: '2',
      label: (
        <div onClick={() => props.onDeleteChange(props.record)}>
          {t('common.del')}
        </div>
      ),
    },
    {
      key: '5',
      label: <div onClick={onCopyName}>复制标题</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>复制链接</div>,
    },
  ]

  //   是否是所有项目，区分权限
  if (!props.isAllProject) {
    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }
  }

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

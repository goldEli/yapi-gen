/* eslint-disable @typescript-eslint/naming-convention */

// 缺陷下拉菜单

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
  onEditChange(row: any): void
  onDeleteChange(row: any): void
  // 是否是所有项目
  isAllProject?: boolean
}

export const DefectDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/delete',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/update',
  )

  // 复制需求id
  const onCopyId = () => {
    copyLink(`${props?.record.storyPrefixKey}`, '复制成功！', '复制失败！')
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        demandId: props.record.id,
      }),
    )
    const url = `/ProjectManagement/DemandDetail?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${props?.record.storyPrefixKey}】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  let menuItems = [
    {
      key: '1',
      label: (
        <div onClick={() => props.onEditChange(props.record)}>
          {t('common.edit')}
        </div>
      ),
    },
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
      label: <div onClick={onCopyId}>复制编号</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>复制链接</div>,
    },
  ]

  if (!props.isAllProject) {
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }
    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }
  }

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

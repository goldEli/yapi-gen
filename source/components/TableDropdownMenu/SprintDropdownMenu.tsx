/* eslint-disable @typescript-eslint/naming-convention */

// 事务列表下拉菜单

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
  onCreateChild(row: any): void
  // 是否是所有项目
  isAllProject?: boolean
}

export const SprintDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/save' : 'b/transaction/save',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${props?.record.storyPrefixKey}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        detailId: props.record.id,
        specialType: 1,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/ProjectDetail/Affair?data=${params}`
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
        <div onClick={() => props.onCreateChild(props.record)}>
          {t('addChildAffairs')}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => props.onDeleteChange(props.record)}>
          {t('sprint.delTransaction')}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => props.onEditChange(props.record)}>
          {t('editorial_affairs')}
        </div>
      ),
    },
    {
      key: '5',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
  ]

  if (!props.isAllProject) {
    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }
    if (hasCreate) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }
  }

  if (![3, 4, 5].includes(props.record.work_type)) {
    menuItems = menuItems.filter((i: any) => i.key !== '1')
  }

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

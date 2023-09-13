/* eslint-disable @typescript-eslint/naming-convention */

// 需求下拉操作菜单

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
  onAddComment?(): void
  haveComment?: boolean
  // 是否是所有项目
  isAllProject?: boolean
}

export const DemandOperationDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)

  const hasCreate = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/save',
  )
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${props?.record.storyPrefixKey}`,
      t('copy_requirement_number_successfully'),
      t('copy_requirement_number_failed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    let params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        detailId: props.record.id,
        isOpenScreenDetail: true,
        specialType: props.record.project_type === 2 ? 1 : 3,
      }),
    )
    if (props.record.project_type === 2) {
      const url = `/SprintProjectManagement/Affair?data=${params}`
      text += ` ${beforeUrl}${url} \n`
      copyLink(
        `【${props?.record.storyPrefixKey}】${text}`,
        t('common.copySuccess'),
        t('common.copyFail'),
      )
      return
    }
    const url = `/ProjectManagement/Demand?data=${params}`
    text += ` ${beforeUrl}${url} \n`
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
      key: '3',
      label: (
        <div onClick={() => props.onCreateChild(props.record)}>
          {t('add_sub_requirements')}
        </div>
      ),
    },
    {
      key: '4',
      label: <div onClick={props.onAddComment}>{t('add_a_comment')}</div>,
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

  //   是否是所有项目，区分权限
  if (!props.isAllProject) {
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }
    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }
    if (hasCreate) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }
    if (isEnd) {
      menuItems = menuItems.filter((i: any) => !['1', '2', '3'].includes(i.key))
    }
  }

  if (!props.haveComment) {
    menuItems = menuItems.filter((i: any) => i.key !== '4')
  }

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

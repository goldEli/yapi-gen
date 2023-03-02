/* eslint-disable @typescript-eslint/naming-convention */

// 需求下拉操作菜单

import { copyLink, getIsPermission } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useTranslation } from 'react-i18next'

interface Props {
  record: any
  onEditChange(row: any): void
  onDeleteChange(row: any): void
  onCreateChild(row: any): void
  haveComment?: boolean
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

  // 复制需求id
  const onCopyId = () => {
    copyLink(props.record.id, '复制需求ID成功！', '复制需求ID失败！')
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
    text += `【${props.record.name}】 ${beforeUrl}${url} \n`
    copyLink(text, '复制需求链接成功！', '复制需求链接失败！')
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
        <div onClick={() => props.onCreateChild(props.record)}>添加子需求</div>
      ),
    },
    {
      key: '4',
      label: <div>添加评论</div>,
    },
    {
      key: '5',
      label: <div onClick={onCopyId}>复制需求ID</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>复制标题链接</div>,
    },
  ]
  if (hasEdit) {
    menuItems = menuItems.filter((i: any) => i.key !== '1')
  }
  if (hasDel) {
    menuItems = menuItems.filter((i: any) => i.key !== '2')
  }
  if (hasCreate) {
    menuItems = menuItems.filter((i: any) => i.key !== '3')
  }
  if (!props.haveComment) {
    menuItems = menuItems.filter((i: any) => i.key !== '4')
  }

  return <Menu style={{ minWidth: 56 }} items={menuItems} />
}

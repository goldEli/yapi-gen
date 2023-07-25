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
  .ant-dropdown-menu-item.ant-dropdown-menu-item-disabled:hover,
  .ant-dropdown-menu-item.ant-dropdown-menu-submenu-title-disabled:hover,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-item-disabled:hover,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-submenu-title-disabled:hover {
    background: transparent !important;
    cursor: inherit;
  }
  .ant-dropdown-menu-item.ant-dropdown-menu-item-disabled,
  .ant-dropdown-menu-item.ant-dropdown-menu-submenu-title-disabled,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-item-disabled,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-submenu-title-disabled {
    background: transparent !important;
    cursor: inherit;
  }
`
const RemoveItemWrap = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`
const MenuItemWrap = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
`

interface Props {
  record: any
  onDeleteChange(row: any): void
  onEditItem(row: any): void
  onRemoveSprintItem(
    iterate_id: number,
    story_id: number,
    to_iterate_id: number,
    needFresh: boolean,
  ): void
}

export const SprintDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { rightSprintList } = useSelector(state => state.sprint)
  const { projectInfo } = useSelector(store => store.project)

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/delete',
  )

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2
  const groupId = props?.record?.id?.split('_')?.[0]
  const id = props?.record?.id?.split('_')?.[1]

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any = ''
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        detailId: id,
        isOpenScreenDetail: true,
        specialType: 1,
      }),
    )
    const url = `/SprintProjectManagement/Affair?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${props.record.story_prefix_key}】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  let menuItems = [
    {
      key: '1',
      label: <MenuItemWrap onClick={onCopyLink}>{t('copy_Link')}</MenuItemWrap>,
    },
    {
      key: '2',
      label: (
        <MenuItemWrap onClick={() => props.onEditItem(props.record)}>
          {t('sprint.editTransaction')}
        </MenuItemWrap>
      ),
    },
    {
      key: '3',
      label: (
        <MenuItemWrap onClick={() => props.onDeleteChange(props.record)}>
          {t('sprint.delTransaction')}
        </MenuItemWrap>
      ),
    },
    {
      key: '4',
      disabled: true,
      label: <RemoveItemWrap>{t('sprint.moveToSprint')}</RemoveItemWrap>,
    },
  ].concat(
    rightSprintList
      .filter(
        k =>
          k.id !== 0 &&
          (k.status === 1 || k.status === 4) &&
          k.id !== Number(groupId),
      )
      .map(k => ({
        key: k.id,
        label: (
          <MenuItemWrap
            key={k.id}
            onClick={() =>
              props.onRemoveSprintItem(Number(groupId), Number(id), k.id, true)
            }
          >
            {k.name}
          </MenuItemWrap>
        ),
      })),
  )

  if (hasDel) {
    menuItems = menuItems.filter((i: any) => i.key !== '3')
  }
  if (hasEdit) {
    menuItems = menuItems.filter((i: any) => i.key !== '2')
  }

  if (isEnd) {
    menuItems = menuItems.filter((i: any) => !['2', '3'].includes(i.key))
  }

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

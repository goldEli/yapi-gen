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
const RemoveItemWrap = styled.div`
  font-size: 12px;
  font-family: MiSans-Regular, MiSans;
  color: var(--neutral-n3);
`
const MenuItemWrap = styled.div`
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
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
    projectInfo.projectType === 1 ? 'b/story/update' : 'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )
  const groupId = props?.record?.id?.split('_')?.[0]
  const id = props?.record?.id?.split('_')?.[1]

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
      }),
    )
    const url = `/SprintProjectManagement/Sprint?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
  }

  let menuItems = [
    {
      key: '1',
      label: <MenuItemWrap onClick={onCopyLink}>复制链接</MenuItemWrap>,
    },
    {
      key: '2',
      label: (
        <MenuItemWrap onClick={() => props.onEditItem(props.record)}>
          编辑事务
        </MenuItemWrap>
      ),
    },
    {
      key: '3',
      label: (
        <MenuItemWrap onClick={() => props.onDeleteChange(props.record)}>
          删除事务
        </MenuItemWrap>
      ),
    },
    {
      key: '4',
      disabled: true,
      label: <RemoveItemWrap>移至冲刺</RemoveItemWrap>,
    },
  ].concat(
    rightSprintList
      .filter(k => k.id !== -1 && k.status === 1 && k.id !== Number(groupId))
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

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

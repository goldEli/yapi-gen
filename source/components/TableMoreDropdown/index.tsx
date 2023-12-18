// 更多的点点、列表每列的操作图标，加宽hover区域

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import CommonIconFont from '../CommonIconFont'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import { copyLink, getIsPermission } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'

const DropdownWrap = styled(Dropdown)({
  cursor: 'pointer',
  svg: {
    color: 'var(--auxiliary-b1)',
  },
  '.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title': {
    textAlign: 'left',
  },
})
interface Props {
  isMoreVisible?: any
  // 是否是我的模块-所有项目
  isAllProject?: boolean
  onChangeVisible?(visible: any): void
  record?: any
  // 是否有评论菜单
  haveComment?: boolean
  onEditChange?(row: any): void
  onCreateChild?(row: any): void
  onClickBatch?(e: any, row: any): void
  // 是否展示批量菜单使用
  selectedRowKeys?: any
  // 是否是关联关系列表
  isRelation?: boolean
  // 冲刺移动
  onRemoveSprintItem?(
    iterate_id: number,
    story_id: number,
    to_iterate_id: number,
    needFresh: boolean,
  ): void
  // 冲刺的其他菜单
  rightSprintList?: any
}

const TableMoreDropdown = (props: Props) => {
  const [t] = useTranslation()
  const { selectedRowKeys, onClickBatch } = props
  const { projectInfo } = useSelector(store => store.project)
  let resultMenu: any

  // project_type ===1 为事务，project_type===1&& is_bug === 1 为缺陷，反之则为需求
  const idx =
    props?.record?.project_type === 2
      ? 2
      : props?.record?.project_type === 1 && props?.record?.is_bug === 1
      ? 1
      : 0

  // 0-需求，1-缺陷，2-事务 type: update编辑，save创建
  const onComputedPermission = (type: string) => {
    const urls = ['b/story', 'b/flaw', 'b/transaction']
    return props?.isAllProject
      ? !Object.values(props.record?.project?.permissions)?.includes(
          `${urls[idx]}/${type}`,
        )
      : getIsPermission(projectInfo?.projectPermissions, `${urls[idx]}/${type}`)
  }

  // 是否可以创建子任务
  const hasCreate = onComputedPermission('save')

  // 是否可以编辑任务
  const hasEdit = onComputedPermission('update')

  // 复制需求id
  const onCopyId = () => {
    props.onChangeVisible?.(false)
    copyLink(
      `${props?.record.storyPrefixKey ?? props?.record.story_prefix_key}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    props.onChangeVisible?.(false)

    let text: any = ''
    let beforeUrl: any
    const key = ['Demand', 'Defect', 'Affair']
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        detailId: props.record.id,
        specialType:
          props?.record?.project_type === 2
            ? 1
            : props?.record?.project_type === 1 && props?.record?.is_bug === 1
            ? 2
            : 3,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/ProjectDetail/${key[idx]}?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${
        props?.record.storyPrefixKey ?? props?.record.story_prefix_key
      }】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  // 事务菜单
  const menuItemsAffairs = [
    {
      key: '1',
      label: (
        <div onClick={() => props.onCreateChild?.(props.record)}>
          {t('addChildAffairs')}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => props.onEditChange?.(props.record)}>
          {t('editorial_affairs')}
        </div>
      ),
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
    {
      key: '5',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
  ]

  // 缺陷菜单
  const menuItemsDefect = [
    {
      key: '2',
      label: (
        <div onClick={() => props.onEditChange?.(props.record)}>
          {t('editorialDefect')}
        </div>
      ),
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
    {
      key: '5',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
  ]

  // 需求菜单
  const menuItemsDemand = [
    {
      key: '1',
      label: (
        <div onClick={() => props.onCreateChild?.(props.record)}>
          {t('add_sub_requirements')}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => props.onEditChange?.(props.record)}>
          {t('requirementsForEditing')}
        </div>
      ),
    },
    {
      key: '4',
      label: <div>{t('add_a_comment')}</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
    {
      key: '5',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
  ]

  // 批量菜单
  const batchItems = [
    {
      key: '0',
      disabled: true,
      label: (
        <div>
          {t('version2.checked', {
            count: selectedRowKeys?.map((i: any) => i.id)?.length,
          })}
        </div>
      ),
    },
    {
      key: '1',
      label: (
        <div onClick={e => onClickBatch?.(e, 'edit')}>
          {t('version2.batchEdit')}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={e => onClickBatch?.(e, 'delete')}>
          {t('version2.batchDelete')}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={e => onClickBatch?.(e, 'copy')}>
          {t('version2.batchCopyLink')}
        </div>
      ),
    },
  ]

  // 冲刺的菜单
  const sprintItems = [
    {
      key: '1',
      label: <div onClick={onCopyLink}>{t('copy_Link')}</div>,
    },
    {
      key: '2',
      label: (
        <div onClick={() => props.onEditChange?.(props.record)}>
          {t('sprint.editTransaction')}
        </div>
      ),
    },
    {
      key: '4',
      disabled: true,
      label: <div>{t('sprint.moveToSprint')}</div>,
    },
  ].concat(
    props?.rightSprintList?.map((k: any) => ({
      key: k.id,
      label: (
        <div
          key={k.id}
          onClick={() =>
            props.onRemoveSprintItem?.(
              Number(props?.record?.id?.split('_')?.[0]),
              Number(props?.record?.id?.split('_')?.[1]),
              k.id,
              true,
            )
          }
        >
          {k.name}
        </div>
      ),
    })),
  )

  // 计算菜单权限
  const onComputedItems = () => {
    let menuItems: any =
      idx === 2
        ? menuItemsAffairs
        : idx === 1
        ? menuItemsDefect
        : menuItemsDemand
    if (hasCreate) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    // 冲刺项目并且不是长故事和标准事务、缺陷类型的不能创建
    if (![3, 4, 5].includes(props.record.work_type) && idx === 2) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (!props.haveComment && !idx) {
      menuItems = menuItems.filter((i: any) => i.key !== '4')
    }

    return menuItems
  }

  if (selectedRowKeys?.map((i: any) => i.id).includes(props.record.id)) {
    resultMenu = batchItems
  } else if (props.isRelation) {
    resultMenu = menuItemsDefect.filter((i: any) => i.key !== '2')
  } else if (props.rightSprintList) {
    resultMenu = sprintItems
  } else {
    resultMenu = onComputedItems()
  }

  return (
    <DropdownWrap
      destroyPopupOnHide
      open={props.isMoreVisible}
      menu={{
        items: resultMenu,
      }}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => document.body}
      onOpenChange={visible => props.onChangeVisible?.(visible)}
    >
      <div>
        <CommonIconFont type="more-01" size={16} />
      </div>
    </DropdownWrap>
  )
}

export default TableMoreDropdown

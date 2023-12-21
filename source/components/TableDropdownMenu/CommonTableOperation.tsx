import { Tooltip } from 'antd'
import { useState } from 'react'
import { TableActionItem, TableActionWrap } from '../StyleCommon'
import CommonProgress from '../CommonProgress'
import { useSelector } from '@store/index'
import { getIsPermission } from '@/tools'
import { useTranslation } from 'react-i18next'
import TableMoreDropdown from '../TableMoreDropdown'

interface MoreWrapProps {
  record: any
  onEditChange?(row: any): void
  onCreateChild?(row: any): void
  // 批量点击
  onClickBatch?(e: any, row: any): void
  // 是否显示批量菜单使用
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
  // 删除
  onDeleteChange?(row: any): void
}

const MoreWrap = (props: MoreWrapProps) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false)

  // 编辑
  const onEditChange = (record: any) => {
    setIsMoreVisible(false)
    props.onEditChange?.(record)
  }

  // 创建
  const onCreateChild = (record: any) => {
    setIsMoreVisible(false)
    props.onCreateChild?.(record)
  }

  // 批量
  const onClickBatch = (e: any, row: any) => {
    setIsMoreVisible(false)
    props.onClickBatch?.(e, row)
  }

  // 移动
  const onRemoveSprintItem = (
    iterate_id: number,
    story_id: number,
    to_iterate_id: number,
    needFresh: boolean,
  ) => {
    setIsMoreVisible(false)
    props.onRemoveSprintItem?.(iterate_id, story_id, to_iterate_id, needFresh)
  }
  // 删除事件
  const onDeleteChange = (record: any) => {
    props.onDeleteChange?.(record)
  }
  return (
    <TableMoreDropdown
      isMoreVisible={isMoreVisible}
      onChangeVisible={setIsMoreVisible}
      selectedRowKeys={props?.selectedRowKeys}
      record={props?.record}
      isRelation={props?.isRelation}
      onEditChange={onEditChange}
      onCreateChild={onCreateChild}
      onClickBatch={onClickBatch}
      onRemoveSprintItem={onRemoveSprintItem}
      onDeleteChange={onDeleteChange}
      rightSprintList={props?.rightSprintList}
    />
  )
}

interface CommonOperationProps {
  record: any
  onEditChange?(row: any): void
  onCreateChild?(row: any): void
  onDeleteChange?(row: any): void
  init?(): void
  // 批量点击
  onClickBatch?(e: any, row: any): void
  // 是否显示批量菜单使用
  selectedRowKeys?: any
  // 是否是关联列表
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

const CommonTableOperation = (props: CommonOperationProps) => {
  const [t] = useTranslation()
  const {
    record,
    selectedRowKeys,
    isRelation,
    rightSprintList,
    onEditChange,
    onCreateChild,
    onDeleteChange,
    onClickBatch,
    init,
    onRemoveSprintItem,
  } = props
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)

  // 计算进度和删除是否有权限
  const onComputedPermission = (record: any, type: string) => {
    const urls = ['b/story', 'b/flaw', 'b/transaction']
    const idx =
      record?.project_type === 2
        ? 2
        : record?.project_type === 1 && record?.is_bug === 1
        ? 1
        : 0
    // id存在则是具体项目下
    return getIsPermission(
      projectInfo?.projectPermissions,
      `${urls[idx]}/${type}`,
    )
  }

  // 是否有更新进度的权限
  const hasUpdateProgress =
    !onComputedPermission(record, 'update') &&
    (record?.usersInfo ?? record?.handlers)?.length > 0 &&
    (record?.usersInfo ?? record?.handlers)
      ?.map((i: any) => i.id)
      ?.includes(userInfo?.id)

  return (
    <TableActionWrap>
      {!isRelation && (
        <Tooltip title={hasUpdateProgress ? null : t('updateProgressToast')}>
          <TableActionItem isDisable={!hasUpdateProgress}>
            <CommonProgress
              isTableOperation
              isTable={false}
              id={
                String(record.id).includes('_')
                  ? record?.id?.split('_')?.[1]
                  : record.id
              }
              type={
                record?.project_type === 2
                  ? 'transaction'
                  : record?.project_type === 1 && record?.is_bug === 1
                  ? 'flaw'
                  : 'demand'
              }
              hasEdit={!hasUpdateProgress}
              project_id={record?.project_id as any}
              onConfirm={init}
            />
          </TableActionItem>
        </Tooltip>
      )}
      <Tooltip
        title={
          onComputedPermission(record, 'delete') ? t('deleteTableToast') : null
        }
      >
        <TableActionItem
          isDisable={onComputedPermission(record, 'delete')}
          onClick={() => onDeleteChange?.(record)}
        >
          {t('common.del')}
        </TableActionItem>
      </Tooltip>

      <TableActionItem>
        <MoreWrap
          isRelation={isRelation}
          selectedRowKeys={selectedRowKeys}
          record={record}
          onEditChange={onEditChange}
          onCreateChild={onCreateChild}
          onClickBatch={onClickBatch}
          onRemoveSprintItem={onRemoveSprintItem}
          onDeleteChange={onDeleteChange}
          rightSprintList={rightSprintList}
        />
      </TableActionItem>
    </TableActionWrap>
  )
}

export default CommonTableOperation

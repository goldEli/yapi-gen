/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
import { CancelText, InfoItem, Label, LabelWrap, LinkWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import {
  CloseWrap,
  PriorityWrapTable,
  TableBorder,
} from '@/components/StyleCommon'
import { useEffect, useState, useImperativeHandle } from 'react'
import { Checkbox, Space, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import {
  setAddWorkItemModal,
  setIsChangeDetailAffairs,
  setIsUpdateAddWorkItem,
} from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import {
  addAffairsChild,
  affairsChildDragSort,
  deleteAffairs,
  getAffairsChildList,
  getAffairsSelectChildren,
  getAffairsSelectChildrenRecent,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import MultipleAvatar from '@/components/MultipleAvatar'
import PaginationBox from '@/components/TablePagination'
import NoData from '@/components/NoData'
import RelationDropdownMenu from '@/components/TableDropdownMenu/RelationDropdownMenu'
import MoreDropdown from '@/components/MoreDropdown'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import DetailsChildProgress from '@/components/DetailsChildProgress'
import CommonProgress from '@/components/CommonProgress'

interface SelectItem {
  label: string
  value: number
}

const ChildSprint = (
  props: {
    detail: Model.Affairs.AffairsInfo
    onUpdate?(value?: boolean): void
    isInfoPage?: boolean
    onRef?: any
    isPreview?: boolean
  },
  ref: any,
) => {
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const dispatch = useDispatch()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { projectInfo, isChangeDetailAffairs, isUpdateAddWorkItem } =
    useSelector(store => store.project)
  const [pageParams, setPageParams] = useState({ page: 1, pagesize: 30 })
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
  const [dataSource, setDataSource] = useState<any>({
    list: undefined,
  })

  const onUpdate = () => {
    if (props.isInfoPage) {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    } else {
      props.onUpdate?.()
    }
  }

  // 跳转详情页面
  const onToDetail = (record: any) => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        detailId: record?.id,
        specialType: 1,
        isOpenScreenDetail: true,
      }),
    )
    const url = `ProjectDetail/Affair?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  // 获取子事务列表
  const getList = async (page: { page: number; pagesize: number }) => {
    const response = await getAffairsChildList({
      projectId: projectInfo.id,
      id: props.detail.id,
      ...page,
    })
    setDataSource({
      ...response,
      list: response.list.map((i: any) => ({ ...i, index: i.id })),
    })
    dispatch(setIsChangeDetailAffairs(false))
  }

  // 获取搜索下拉事务列表
  const getSelectList = async (value: string) => {
    const response = await getAffairsSelectChildren({
      projectId: projectInfo.id,
      id: props.detail.id,
      keywords: value,
    })
    setSelectList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 获取最近下拉事务列表
  const getSelectRecentList = async () => {
    const response = await getAffairsSelectChildrenRecent({
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    setRecentList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  //   取消搜索
  const onCancelSearch = () => {
    setSearchValue('')
    setIsSearch(false)
  }

  // 下拉搜索
  const onSearch = (value: string) => {
    setSearchValue(value)
    getSelectList(value)
  }

  // 点击下拉的事务 -- 添加
  const onChangeSelect = async (value: any) => {
    await addAffairsChild({
      projectId: projectInfo.id,
      id: props.detail.id,
      childId: value,
    })
    getMessage({ type: 'success', msg: t('addedSuccessfully') })
    onCancelSearch()
    onUpdate()
  }

  // 删除子事务确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteAffairs({ projectId: projectInfo.id, id: item.id })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    onUpdate()
  }

  // 删除关联任务
  const onDeleteChange = (item: any) => {
    const checked = [4, 5].includes(item.work_type)
      ? [4, 5].includes(item.work_type)
      : isDeleteCheck
    setIsShowMore(false)
    open({
      title: t('deleteConfirmation'),
      text: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: 8 }}>
            {t(
              'youWillPermanentlyDeleteAndItsWhichCannotBeRecoveredAfterPleaseOperateWith',
              { key: item.story_prefix_key },
            )}
          </span>
          {item.work_type !== 6 && (
            <Checkbox
              disabled={[4, 5].includes(item.work_type)}
              checked={checked}
              onChange={e => setIsDeleteCheck(e.target.checked)}
            >
              {t('deleteAllSubtransactionsUnderThisTransactionAtTheSameTime')}
            </Checkbox>
          )}
        </div>
      ),

      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  const columns = [
    {
      title: '',
      dataIndex: 'story_prefix_key',
      render: (text: string, record: any) => (
        <LinkWrap>
          <span className="content" onClick={() => onToDetail(record)}>
            {text}
          </span>
        </LinkWrap>
      ),
    },
    {
      title: '',
      dataIndex: 'project_category',
      render: (text: any, record: Model.Affairs.AffairsInfo) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tooltip
            placement="top"
            getPopupContainer={node => node}
            title={text.name}
          >
            <img
              src={text.attachment_path}
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
          </Tooltip>
          <LinkWrap>
            <span
              className="content"
              style={{ maxWidth: '400px' }}
              onClick={() => onToDetail(record)}
            >
              {record.name}
            </span>
          </LinkWrap>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'story_config_priority',
      render: (text: any, record: any) => {
        return (
          <PriorityWrapTable isShow={false}>
            {text?.icon && (
              <IconFont
                className="priorityIcon"
                type={text?.icon}
                style={{
                  fontSize: 20,
                  color: text?.color,
                }}
              />
            )}
            <span style={{ marginLeft: '5px' }}>
              {!text?.icon && <span>--</span>}
              <IconFont className="icon" type="down-icon" />
            </span>
          </PriorityWrapTable>
        )
      },
    },
    {
      title: '',
      dataIndex: 'handlers',
      render: (text: any) => (
        <>
          {text?.length > 0 && <MultipleAvatar max={3} list={text ?? []} />}
          {text?.length <= 0 && '--'}
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'category_status',
      render: (text: any) => (
        <StateTag
          name={text.status_name}
          state={
            text?.is_start === 1 && text?.is_end === 2
              ? 1
              : text?.is_end === 1 && text?.is_start === 2
              ? 2
              : text?.is_start === 2 && text?.is_end === 2
              ? 3
              : 0
          }
        />
      ),
    },
    {
      title: '',
      dataIndex: 'schedule',
      render: (text: any, record: any) => {
        return (
          <div>
            <CommonProgress
              isTable
              percent={Number(text)}
              id={record.id}
              project_id={record?.project_id}
            />
          </div>
        )
      },
    },
  ]

  const operationList = [
    {
      width: 40,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              isMoreVisible={isShowMore}
              hasChild
              menu={
                <RelationDropdownMenu
                  onDeleteChange={onDeleteChange}
                  record={record}
                  type={1}
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
  ]

  // 创建子事务
  const onCreateChild = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          ...props.detail,
          type:
            props.detail.work_type === 3
              ? 8
              : [4, 5].includes(props.detail.work_type)
              ? 6
              : undefined,
          title: t('createSubtransaction'),
          isCreateAffairsChild: true,
          parentId: props.detail.id,
          parentList: [{ value: props.detail.id, label: props.detail.name }],
        },
      }),
    )
  }

  // 点击搜素获取下拉数据列表
  const onClickSearch = () => {
    setIsSearch(true)
    getSelectRecentList()
  }

  // 表格拖拽排序
  const onChangeData = async (
    data: { list: Model.Affairs.AffairsInfo[] },
    idx: number,
  ) => {
    setDataSource({
      ...dataSource,
      list: data.list,
    })

    await affairsChildDragSort({
      project_id: projectInfo.id,
      id: props.detail.id,
      page_size: pageParams.pagesize,
      page: pageParams.page,
      position: idx,
      child_id: data.list[idx].id,
    })
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageParams({ page, pagesize: size })
    getList({ page, pagesize: size })
  }

  useEffect(() => {
    if (projectInfo.id && props.detail.id) {
      // 获取子事务列表
      getList(pageParams)
    }
  }, [props.detail, projectInfo])

  useEffect(() => {
    if (isChangeDetailAffairs) {
      // 获取子事务列表
      getList(pageParams)
    }
  }, [isChangeDetailAffairs])
  useImperativeHandle(props.onRef, () => {
    return {
      onCreateChild: onCreateChild,
    }
  })
  return (
    <InfoItem
      style={{
        padding: '16px 24px',
        marginTop: '12px',
        borderRadius: props?.isInfoPage ? 6 : 0,
      }}
      id="sprint-childSprint"
      className="info_item_tab"
      isInfoPage={props?.isInfoPage}
    >
      <DeleteConfirmModal />
      <LabelWrap>
        <Label>{t('subtransaction')}</Label>
        {props?.isPreview ? null : (
          <Space size={12}>
            {!isSearch && (
              <Tooltip title={t('searchForSubtransactions')}>
                <CloseWrap width={32} height={32} onClick={onClickSearch}>
                  <CommonIconFont
                    size={20}
                    type="search"
                    color="var(--neutral-n2)"
                  />
                </CloseWrap>
              </Tooltip>
            )}
            {isSearch && (
              <Space size={16}>
                <CustomSelect
                  placeholder={t('search_for_transaction_name_or_number')}
                  getPopupContainer={(node: any) => node}
                  style={{ width: 184 }}
                  onSearch={onSearch}
                  options={searchValue ? selectList : recentList}
                  showSearch
                  showArrow
                  optionFilterProp="label"
                  onChange={onChangeSelect}
                  allowClear
                  autoFocus
                />
                <CancelText onClick={onCancelSearch}>
                  {t('common.cancel')}
                </CancelText>
              </Space>
            )}
            <Tooltip title={t('addSubtransaction')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont
                  type="plus"
                  size={20}
                  color="var(--neutral-n2)"
                  onClick={onCreateChild}
                />
              </CloseWrap>
            </Tooltip>
          </Space>
        )}
      </LabelWrap>

      <div>
        {dataSource.total > 0 && (
          <>
            <DetailsChildProgress details={props.detail} />

            <TableBorder style={{ marginTop: 8 }}>
              <DragTable
                columns={columns}
                dataSource={dataSource}
                onChangeData={onChangeData}
                showHeader={false}
                hasOperation={operationList}
                hasHandle
              />
            </TableBorder>
          </>
        )}
        {dataSource.total <= 0 && <NoData />}
        {dataSource.total > 30 && (
          <PaginationBox
            total={dataSource?.total}
            currentPage={dataSource?.currentPage}
            pageSize={dataSource?.pageSize}
            onChange={onChangePage}
          />
        )}
      </div>
    </InfoItem>
  )
}

export default ChildSprint

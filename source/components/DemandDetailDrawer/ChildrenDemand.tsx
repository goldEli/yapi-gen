/* eslint-disable no-undefined */
import {
  getDemandList,
  getChildrenRecent,
  getChildrenSearch,
  addChild,
  sortChild,
} from '@/services/demand'
import { useDispatch, useSelector } from '@store/index'
import { Space, Table } from 'antd'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import NoData from '../NoData'
import StateTag from '../StateTag'
import { CloseWrap, LinkWrap, PriorityWrap, TableBorder } from '../StyleCommon'
import { CancelText, Label, LabelWrap } from './style'
import { setAddWorkItemModal, setIsUpdateAddWorkItem } from '@store/project'
import MultipleAvatar from '../MultipleAvatar'
import { encryptPhp } from '@/tools/cryptoPhp'
import CommonIconFont from '../CommonIconFont'
import CustomSelect from '../CustomSelect'
import DetailsChildProgress from '../DetailsChildProgress'
import DragTable from '../DragTable'
import MoreDropdown from '../MoreDropdown'
import RelationDropdownMenu from '../TableDropdownMenu/RelationDropdownMenu'
import CommonProgress from '../CommonProgress'
import { getMessage } from '../Message'
import PaginationBox from '../TablePagination'
interface Props {
  detail?: any
  isOpen?: boolean
}
interface SelectItem {
  label: string
  value: number
}

const ChildrenDemand = (props: Props, ref: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isUpdateAddWorkItem, projectInfo } = useSelector(
    store => store.project,
  )
  const [dataList, setDataList] = useState<any>({
    list: undefined,
    page: {},
  })
  const [isSearch, setIsSearch] = useState(false)
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [pageObj, setPageObj] = useState({ page: 1, pageSize: 10 })
  // 跳转详情页面
  const onToDetail = (record: any) => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        detailId: record?.id,
        specialType: 3,
        isOpenScreenDetail: true,
      }),
    )
    const url = `ProjectManagement/Demand?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  const columnsChild = [
    {
      title: '',
      dataIndex: 'storyPrefixKey',
      render: (text: string, record: any) => {
        return (
          <LinkWrap>
            <span className="content" onClick={() => onToDetail(record)}>
              {text}
            </span>
          </LinkWrap>
        )
      },
    },
    {
      title: '',
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <LinkWrap>
            <span className="content" onClick={() => onToDetail(record)}>
              {text}
            </span>
          </LinkWrap>
        )
      },
    },
    {
      title: '',
      dataIndex: 'priority',
      render: (text: any) => {
        return (
          <PriorityWrap notEdit>
            <IconFont
              className="priorityIcon"
              type={text?.icon}
              style={{
                fontSize: 20,
                color: text?.color,
              }}
            />
            <span>{text?.content_txt || '--'}</span>
          </PriorityWrap>
        )
      },
    },

    {
      title: '',
      dataIndex: 'dealName',
      render: (text: any, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={record.usersInfo?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
        )
      },
    },
    {
      title: '',
      dataIndex: 'status',
      render: (text: any, record: any) => {
        return (
          <StateTag
            name={text.status.content}
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
        )
      },
    },
    {
      title: '',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <div>
            <CommonProgress
              project_id={record.project_id}
              isTable
              percent={Number(text)}
              id={record.id}
            />
          </div>
        )
      },
    },
  ]

  const getList = async () => {
    const result = await getDemandList({
      projectId: props.detail.projectId,
      all: false,
      parentId: props.detail.id,
      page: pageObj.page,
      pageSize: pageObj.pageSize,
      orderKey: 'sort',
    })
    setDataList({
      list: result?.list?.map((item: { id: any }) => ({
        ...item,
        index: item.id,
      })),
      page: {
        total: result.total,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      },
    })
  }
  const operationList = [
    {
      width: 40,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              isMoreVisible={true}
              hasChild
              menu={
                <RelationDropdownMenu
                  onDeleteChange={() => {}}
                  record={record}
                  type={1}
                />
              }
              onChangeVisible={() => {}}
            />
          </div>
        )
      },
    },
  ]
  const onCreateChild = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          isChild: true,
          parentId: props.detail.id,
          projectId: props.detail.projectId,
          categoryId: props.detail.categoryId ?? props.detail.category,
          type: props.detail.work_type,
          title: t('createSubrequirements'),
        },
      }),
    )
  }
  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, pageSize: size })
    getList()
  }
  // 下拉搜索
  const onSearch = (value: string) => {
    setSearchValue(value)
    getSelectSearchList(value)
  }
  // 点击下拉的事务 -- 添加
  const onChangeSelect = async (value: any) => {
    await addChild({
      project_id: props.detail.projectId,
      id: props.detail.id,
      child_id: value,
    })
    getMessage({ type: 'success', msg: t('addedSuccessfully') })
    onCancelSearch()
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }
  // 获取最近下拉需求列表
  const getSelectRecentList = async () => {
    const params = {
      project_id: props.detail.projectId,
      id: props.detail.id,
    }
    const res = await getChildrenRecent(params)
    setRecentList(
      res.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }
  // 获取最近搜索需求列表
  const getSelectSearchList = async (keywords = '') => {
    const params = {
      project_id: props.detail.projectId,
      id: props.detail.id,
      keywords,
    }
    const res = await getChildrenSearch(params)
    setSelectList(
      res.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }
  // 点击搜素获取下拉数据列表
  const onClickSearch = () => {
    setIsSearch(true)
    getSelectRecentList()
  }
  //   取消搜索
  const onCancelSearch = () => {
    setSearchValue('')
    setIsSearch(false)
  }
  // 表格拖拽排序
  const onChangeData = async (data: any) => {
    setDataList({
      ...dataList,
      list: data.list,
    })
    await sortChild({
      project_id: projectInfo.id,
      parent_id: props.detail.id,
      children_ids: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
      page: pageObj.page,
      pagesize: pageObj.pageSize,
    })
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }
  useImperativeHandle(ref, () => {
    return {
      onCreateChild,
    }
  })
  useEffect(() => {
    if (props.detail?.id || isUpdateAddWorkItem) {
      getList()
    }
  }, [props.detail, isUpdateAddWorkItem])

  return (
    <div
      id="tab_demand"
      className="info_item_tab"
      style={{ marginTop: '28px' }}
    >
      {/* <Label>{t('subrequirements')}</Label> */}
      <LabelWrap>
        <Label>{t('subrequirements')}</Label>
        <Space size={12}>
          {!isSearch && (
            <CloseWrap width={24} height={24} onClick={onClickSearch}>
              <CommonIconFont
                size={18}
                type="search"
                color="var(--neutral-n2)"
              />
            </CloseWrap>
          )}
          {isSearch ? (
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
          ) : null}
          {!isEnd && (
            <CloseWrap width={24} height={24}>
              <CommonIconFont
                type="plus"
                size={18}
                color="var(--neutral-n2)"
                onClick={onCreateChild}
              />
            </CloseWrap>
          )}
        </Space>
      </LabelWrap>
      {/* {!isEnd && (
        <CommonButton
          onClick={onCreateChild}
          type="primaryText"
          iconPlacement="left"
          icon="plus"
        >
          {t('create_sub_requirements')}
        </CommonButton>
      )} */}
      <DetailsChildProgress details={props.detail}></DetailsChildProgress>
      {dataList?.list?.length > 0 ? (
        <TableBorder style={{ marginTop: '8px' }}>
          <DragTable
            showHeader={false}
            columns={columnsChild}
            dataSource={dataList}
            onChangeData={onChangeData}
            hasOperation={operationList}
          />
        </TableBorder>
      ) : null}
      {dataList?.page?.total <= 0 && <NoData />}
      {dataList?.page?.total > 10 && (
        <PaginationBox
          total={dataList?.page?.total}
          currentPage={dataList?.page?.currentPage}
          pageSize={dataList?.page?.pageSize}
          onChange={onChangePage}
        />
      )}
    </div>
  )
}

export default forwardRef(ChildrenDemand)

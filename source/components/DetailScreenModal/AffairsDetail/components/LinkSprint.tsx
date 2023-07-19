/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import { InfoItem, Label, SubLabel } from '../style'
import { useEffect, useState } from 'react'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import CommonModal from '@/components/CommonModal'
import { Form, Select, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import MoreOptions from '@/components/MoreOptions'
import styled from '@emotion/styled'
import MultipleAvatar from '@/components/MultipleAvatar'
import { useSelector } from '@store/index'
import {
  addAffairsRelation,
  affairsRelationDragSort,
  deleteAffairsRelation,
  getAffairsRelationStoriesList,
  getAffairsSelectRelationRecent,
  getAffairsSelectRelationSearch,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import PaginationBox from '@/components/TablePagination'
import MoreDropdown from '@/components/MoreDropdown'
import RelationDropdownMenu from '@/components/TableDropdownMenu/RelationDropdownMenu'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { PriorityWrapTable } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const FormWrap = styled(Form)`
  padding: 0 24px;
  height: 160px;
`
const LinkWrap = styled.div`
  display: flex;
  align-items: center;
  .content {
    cursor: pointer;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:hover {
      color: var(--primary-d2);
    }
  }
`

interface SelectItem {
  label: string
  value: number
}

const LinkSprint = (props: { detail: Model.Affairs.AffairsInfo }) => {
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { projectInfo } = useSelector(store => store.project)
  const [pageParams, setPageParams] = useState({ page: 1, pagesize: 20 })
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
  const [allDataSource, setAllDataSource] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  //根据搜索框的值来放的数据
  const [options, setOptions] = useState<any>([])
  const [resultData, setResultData] = useState<
    {
      label: string
      value: number
      list: Model.Affairs.AffairsInfo[]
    }[]
  >([])

  // 跳转详情页面
  const onToDetail = (record: any) => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectId,
        sprintId: record.id,
        newOpen: true,
      }),
    )
    const url = `SprintProjectManagement/SprintProjectDetail?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
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
            <span className="content" onClick={() => onToDetail(record)}>
              {record.name}
            </span>
          </LinkWrap>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'story_config_priority',
      render: (text: any) => (
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
      ),
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
  ]

  // 删除关联确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteAffairsRelation({
      project_id: projectInfo.id,
      id: props.detail.id,
      relation_id: item.id,
      type: item.relation_type,
    })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    getRelationStoriesList(pageParams)
  }

  // 删除关联工作项
  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    open({
      title: t('deleteConfirmation'),
      text: t('are_you_sure_to_delete_the_linked_transaction'),
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
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
              isMoreVisible={isShowMore}
              hasChild
              menu={
                <RelationDropdownMenu
                  onDeleteChange={onDeleteChange}
                  record={record}
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
  ]

  // 类型列表
  const typeList = [
    { label: t('associate'), value: 1, list: [] },
    { label: t('front'), value: 2, list: [] },
    { label: t('rear'), value: 3, list: [] },
    { label: t('block'), value: 4, list: [] },
    { label: t('blocked'), value: 5, list: [] },
  ]

  // 获取关联事务列表
  const getRelationStoriesList = async (page: {
    page: number
    pagesize: number
  }) => {
    const response = await getAffairsRelationStoriesList({
      projectId: projectInfo.id,
      id: props.detail.id,
      ...page,
    })
    setAllDataSource(response)
    const newArr = JSON.parse(JSON.stringify(typeList))
    newArr.forEach((element: any) => {
      response.list.forEach((i: any) => {
        if (i.relation_type === element.value) {
          element.list.push({ ...i, index: i.id })
        }
      })
    })
    setResultData(newArr)
  }

  // 获取关联事务下拉列表
  const getSelectRelationSearch = async (value: string) => {
    const response = await getAffairsSelectRelationSearch({
      projectId: projectInfo.id,
      id: props.detail.id,
      searchValue: value,
    })
    setOptions(
      response.map((i: any) => ({
        label: i.story_prefix_key,
        labelName: i.name,
        value: i.id,
        id: i.id,
        cover: i?.project_category?.attachment_path,
      })),
    )
  }

  // 获取最近关联事务下拉列表
  const getSelectRelationRecent = async () => {
    const response = await getAffairsSelectRelationRecent({
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    setOptions(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.story_prefix_key,
        labelName: i.name,
        value: i.id,
        id: i.id,
        cover: i.project_category.attachment_path,
      })),
    )
  }

  // 点击添加链接事务弹窗
  const onClickOpen = () => {
    setIsVisible(true)
    getSelectRelationRecent()
  }

  const onSearch = (value: string) => {
    setSearchValue(value)
    getSelectRelationSearch(value)
  }

  // 关闭链接事务弹窗
  const onClose = () => {
    setSearchValue('')
    setIsVisible(false)
    setSelectList([])
    setRecentList([])
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await addAffairsRelation({
      ...values,
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    getMessage({ type: 'success', msg: t('addedSuccessfully') })
    getRelationStoriesList(pageParams)
    onClose()
  }

  // // 点击切换页码
  // const onChangePage = (page: number, size: number) => {
  //   setPageParams({ page, pagesize: size })
  //   getRelationStoriesList({ page, pagesize: size })
  // }

  // 改变顺序
  const onChangeData = async (
    item: any,
    data: { list: Model.Affairs.AffairsInfo[] },
  ) => {
    setResultData(
      resultData.map((i: any) => ({
        ...i,
        list: item.value === i.value ? data.list : i.list,
      })),
    )
    await affairsRelationDragSort({
      projectId: projectInfo.id,
      id: props.detail.id,
      relationIds: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
      type: item.value,
    })
  }

  useEffect(() => {
    if (projectInfo.id && props.detail.id) {
      // 获取链接事务列表
      getRelationStoriesList(pageParams)
    }
  }, [props.detail, projectInfo])
  const onSelect = (value: any) => {
    form.setFieldsValue({
      relationId: value,
    })
  }
  useEffect(() => {
    if (isVisible && !searchValue) {
      getSelectRelationRecent()
    }
  }, [searchValue, isVisible])
  return (
    <InfoItem id="sprint-linkSprint" className="info_item_tab">
      <DeleteConfirmModal />
      <CommonModal
        isVisible={isVisible}
        title={t('linkAffairs')}
        onClose={onClose}
        confirmText={t('link')}
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form}>
          <Form.Item
            label={t('linkType')}
            name="type"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder={t('pleaseChooseTheType')}
              getPopupContainer={(node: any) => node}
              options={typeList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label={t('affairs1')}
            name="relationId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder={t('searchAffairs')}
              onSearch={onSearch}
              getPopupContainer={(node: any) => node}
              showArrow
              optionFilterProp="label"
              allowClear
              showSearch
              onSelect={onSelect}
            >
              {options?.map((i: any) => {
                return (
                  <Select.Option value={i.id} key={i.id} label={i.label}>
                    <MoreOptions
                      type="project"
                      labelName={i.labelName}
                      name={i.label}
                      img={i?.cover}
                    />
                  </Select.Option>
                )
              })}
            </CustomSelect>
          </Form.Item>
        </FormWrap>
      </CommonModal>
      <Label>{t('linkAffairs')}</Label>
      <div>
        <CommonButton type="primaryText" icon="plus" onClick={onClickOpen}>
          {t('createLinkAffairs')}
        </CommonButton>
        {resultData.map((i: any) => (
          <>
            {i.list.length > 0 && (
              <div key={i.value}>
                <SubLabel>{i.label}</SubLabel>
                <DragTable
                  columns={columns}
                  dataSource={{ list: i.list }}
                  onChangeData={arr => onChangeData(i, arr)}
                  showHeader={false}
                  hasOperation={operationList}
                />
              </div>
            )}
          </>
        ))}
        {allDataSource.list?.length <= 0 && <NoData />}
        {/* {allDataSource.list?.length > 20 && (
          <PaginationBox
            total={allDataSource?.total}
            currentPage={allDataSource?.currentPage}
            pageSize={allDataSource?.pageSize}
            onChange={onChangePage}
          />
        )} */}
      </div>
    </InfoItem>
  )
}

export default LinkSprint

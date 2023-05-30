/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import { InfoItem, InfoItemWrap, Label, SubLabel } from '../style'
import { useEffect, useState } from 'react'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import CommonModal from '@/components/CommonModal'
import { Form, Select, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import MultipleAvatar from '@/components/MultipleAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector } from '@store/index'
import {
  addAffairsRelation,
  affairsRelationDragSort,
  getAffairsRelationStoriesList,
  getAffairsSelectRelationRecent,
  getAffairsSelectRelationSearch,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import PaginationBox from '@/components/TablePagination'

const FormWrap = styled(Form)`
  padding: 0 24px;
  height: 160px;
`

interface SelectItem {
  label: string
  value: number
}

const LinkSprint = () => {
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfo } = useSelector(store => store.project)
  const [pageParams, setPageParams] = useState({ page: 1, pagesize: 20 })
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
  const [allDataSource, setAllDataSource] = useState<any>({
    list: undefined,
  })
  const [resultData, setResultData] = useState<
    {
      label: string
      value: number
      list: Model.Affairs.AffairsInfo[]
    }[]
  >([])

  const columns = [
    {
      title: '',
      dataIndex: 'story_prefix_key',
      render: (text: string) => <div>{text}</div>,
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

          {record.name}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'story_config_priority',
      render: (text: any) => <CommonIconFont type={text.icon} />,
    },
    {
      title: '',
      dataIndex: 'handlers',
      render: (text: any) => <div>12</div>,
      // <MultipleAvatar max={3} list={text?.handlers} />
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

  // 类型列表
  const typeList = [
    { label: '关联', value: 1, list: [] },
    { label: '前置', value: 2, list: [] },
    { label: '后置', value: 3, list: [] },
    { label: '阻塞', value: 4, list: [] },
    { label: '被阻塞', value: 5, list: [] },
    { label: '克隆', value: 6, list: [] },
  ]

  // 获取关联事务列表
  const getRelationStoriesList = async (page: {
    page: number
    pagesize: number
  }) => {
    // const response = await getAffairsRelationStoriesList({
    //   projectId: projectInfo.id,
    //   id: affairsInfo.id,
    //   ...page,
    // })
    // setAllDataSource(response)
    const response = [
      {
        id: 1003010,
        name: '需求测试',
        category_status_id: 1821,
        category_id: 571,
        schedule: 0,
        priority: 9537,
        created_at: '2023-03-22 18:07:39',
        story_prefix_key: 'CSXM（JXL）-2',
        children_count: 0,
        category_status: {
          id: 1821,
          category_id: 571,
          status_id: 9540,
          is_start: 1,
          is_end: 2,
          status_name: '规划中',
          color: '#FA9746',
        },
        project_category: {
          id: 571,
          name: '测试需求类别（jx）',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
        },
        story_config_priority: {
          id: 9537,
          name: '中',
          content: '中',
          color: '#2877FF',
          icon: 'middle',
          identity: 'priority',
          content_txt: '中',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
        ],
        pivot: {
          type: 2,
          sort: 1,
        },
      },
      {
        id: 10032010,
        name: '需求测试1111',
        category_status_id: 1821,
        category_id: 571,
        schedule: 0,
        priority: 9537,
        created_at: '2023-03-22 18:07:39',
        story_prefix_key: 'CSXM（JXL）-2',
        children_count: 0,
        category_status: {
          id: 1821,
          category_id: 571,
          status_id: 9540,
          is_start: 1,
          is_end: 2,
          status_name: '规划中',
          color: '#FA9746',
        },
        project_category: {
          id: 571,
          name: '测试需求类别（jx）',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
        },
        story_config_priority: {
          id: 9537,
          name: '中',
          content: '中',
          color: '#2877FF',
          icon: 'middle',
          identity: 'priority',
          content_txt: '中',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
        ],
        pivot: {
          type: 2,
          sort: 1,
        },
      },
      {
        id: 10030120,
        name: '需求测试2222',
        category_status_id: 1821,
        category_id: 571,
        schedule: 0,
        priority: 9537,
        created_at: '2023-03-22 18:07:39',
        story_prefix_key: 'CSXM（JXL）-2',
        children_count: 0,
        category_status: {
          id: 1821,
          category_id: 571,
          status_id: 9540,
          is_start: 1,
          is_end: 2,
          status_name: '规划中',
          color: '#FA9746',
        },
        project_category: {
          id: 571,
          name: '测试需求类别（jx）',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
        },
        story_config_priority: {
          id: 9537,
          name: '中',
          content: '中',
          color: '#2877FF',
          icon: 'middle',
          identity: 'priority',
          content_txt: '中',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
        ],
        pivot: {
          type: 1,
          sort: 1,
        },
      },
    ]
    const newArr = JSON.parse(JSON.stringify(typeList))
    console.log(newArr)
    newArr.forEach((element: any) => {
      response.forEach((i: any) => {
        if (i.pivot?.type === element.value) {
          element.list.push({ ...i, index: i.id })
        }
      })
    })
    setResultData(newArr)
  }

  // 获取关联事务下拉列表
  const getSelectRelationSearch = async () => {
    const response = await getAffairsSelectRelationSearch({
      projectId: projectInfo.id,
      id: affairsInfo.id,
    })
    setSelectList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 获取最近关联事务下拉列表
  const getSelectRelationRecent = async () => {
    const response = await getAffairsSelectRelationRecent({
      projectId: projectInfo.id,
      id: affairsInfo.id,
    })
    setRecentList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 点击添加链接事务弹窗
  const onClickOpen = () => {
    setIsVisible(true)
    getSelectRelationSearch()
    getSelectRelationRecent()
  }

  // 关闭链接事务弹窗
  const onClose = () => {
    setIsVisible(false)
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await addAffairsRelation({
      ...values,
      projectId: projectInfo.id,
      id: affairsInfo.id,
    })
    getMessage({ type: 'success', msg: '添加成功' })
    getRelationStoriesList(pageParams)
    onClose()
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageParams({ page, pagesize: size })
    getRelationStoriesList({ page, pagesize: size })
  }

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
      id: affairsInfo.id,
      relationIds: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
      type: item.value,
    })
  }

  useEffect(() => {
    if (projectInfo.id && affairsInfo.id) {
      // 获取链接事务列表
      getRelationStoriesList(pageParams)
    }
  }, [affairsInfo, projectInfo])

  return (
    <InfoItem id="sprint-linkSprint" className="info_item_tab">
      <CommonModal
        isVisible={isVisible}
        title="链接事务"
        onClose={onClose}
        confirmText="链接"
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form}>
          <Form.Item
            label="链接类型"
            name="type"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择类型"
              getPopupContainer={(node: any) => node}
              options={typeList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="事务"
            name="relationId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择事务"
              getPopupContainer={(node: any) => node}
              showArrow
              optionFilterProp="label"
              allowClear
              showSearch
              onSearch={setSearchValue}
              options={searchValue ? selectList : recentList}
            />
          </Form.Item>
        </FormWrap>
      </CommonModal>
      <Label>链接事务</Label>
      <InfoItemWrap>
        <CommonButton type="primaryText" icon="plus" onClick={onClickOpen}>
          创建链接的事务
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
                />
              </div>
            )}
          </>
        ))}

        {allDataSource.total > 20 && (
          <PaginationBox
            total={allDataSource?.total}
            currentPage={allDataSource?.currentPage}
            pageSize={allDataSource?.pageSize}
            onChange={onChangePage}
          />
        )}
      </InfoItemWrap>
    </InfoItem>
  )
}

export default LinkSprint

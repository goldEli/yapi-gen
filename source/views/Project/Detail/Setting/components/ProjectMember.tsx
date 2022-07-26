/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import SearchComponent from '@/components/SearchComponent'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState, useEffect } from 'react'
import { Menu, Dropdown, Pagination, message, Select, Form } from 'antd'
import AddMember from '@/views/Project/components/AddMember'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const Header = styled.div({
  minHeight: 64,
  background: 'white',
  padding: '0 24px',
})

const HeaderTop = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Content = styled.div({
  padding: 16,
})

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const FilterWrap = styled(Form)({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
})

const SearchWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'white',
  padding: '0 24px',
  flexWrap: 'wrap',
})

const SelectWrapBedeck = styled.div`
  height: 32px;
  margin-right: 16px;
  position: relative;
  height: 32px;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  align-items: center;
  border-radius: 6px;
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-picker {
    border: none;
  }
`

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 200px;
    border: none !important;
    outline: none !important;
  }
`

const ProjectMember = () => {
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [memberList, setMemberList] = useState<any>([])
  const [jobList, setJobList] = useState<any>([])
  const { getProjectMember, deleteMember, projectPermission }
    = useModel('project')
  const { getPositionSelectList } = useModel('staff')
  const projectId = searchParams.get('id')
  const [form] = Form.useForm()

  const getList = async () => {
    const values = await form.getFieldsValue()
    const result = await getProjectMember({
      projectId,
      orderKey: 'created_at',
      order: 'desc',
      ...values,
    })
    setMemberList(result)
  }

  const getJobList = async () => {
    const result = await getPositionSelectList()
    const arr = result.data?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setJobList(arr)
  }

  useEffect(() => {
    getList()
    getJobList()
  }, [])

  const onChangePage = (page: number) => {
    form.setFieldsValue({ page })
    getList()
  }

  const onShowSizeChange = (_current: number, size: number) => {
    form.setFieldsValue({
      pageSize: size,
      page: 1,
    })
    getList()
  }

  const onOperationMember = (item: any, type: string) => {
    setOperationItem(item)
    if (type === 'del') {
      setIsDelete(true)
    } else {
      setIsAddVisible(true)
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteMember({ projectId, userId: operationItem.id })
      message.success('删除成功')
      setIsDelete(false)
      setOperationItem({})
    } catch (error) {

      //
    }
  }

  const onReset = () => {
    form.resetFields()
    getList()
  }

  const onValuesChange = () => {
    getList()
  }

  const onChangeSearch = (val: string) => {
    form.setFieldsValue({ searchValue: val })
    getList()
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label:
            <div onClick={() => onOperationMember(item, 'edit')}>编辑</div>
          ,
        },
        {
          key: '2',
          label: <div onClick={() => onOperationMember(item, 'del')}>移除</div>,
        },
      ]}
    />
  )

  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown
              overlay={() => menu(record)}
              trigger={['hover']}
              placement="bottom"
              getPopupContainer={node => node}
            >
              <RowIconFont type="more" />
            </Dropdown>
            <img
              src={record.avatar}
              style={{
                marginLeft: 32,
                width: 32,
                height: 32,
                borderRadius: '50%',
              }}
            />
            <span style={{ marginLeft: 12, color: '#323233', fontSize: 14 }}>
              {text}
            </span>
          </div>
        )
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (text: number) => {
        return <span>{text === 1 ? '男' : '女'}</span>
      },
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '职位',
      dataIndex: 'positionName',
    },
    {
      title: '项目权限',
      dataIndex: 'roleName',
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
    },
  ]

  return (
    <Wrap>
      <DeleteConfirm
        text="确认要删除当前成员？"
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <AddMember
        value={isAddVisible}
        onChangeValue={() => setIsAddVisible(!isAddVisible)}
        details={operationItem}
      />
      <Header>
        <HeaderTop>
          <SearchComponent
            onChangeVisible={() => setIsAddVisible(!isAddVisible)}
            text="添加成员"
            placeholder="输入昵称姓名"
            onChangeSearch={onChangeSearch}
          />
          <IconFont
            style={{ fontSize: 20, color: '#969799', cursor: 'pointer' }}
            type="filter"
            onClick={() => setIsVisible(!isVisible)}
          />
        </HeaderTop>
        <FilterWrap
          hidden={isVisible}
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{
            pageSize: 10,
            page: 1,
          }}
        >
          <SearchWrap>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '12px' }}>职位</span>
              <Form.Item name="page" />
              <Form.Item name="pageSize" />
              <Form.Item name="searchValue" />
              <Form.Item name="jobIds" noStyle>
                <SelectWrap
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="所有"
                  showSearch
                  options={jobList}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '12px' }}>权限组</span>
              <Form.Item name="userGroupIds" noStyle>
                <SelectWrap
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="所有"
                  showSearch
                  options={projectPermission}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <div
              style={{ color: '#2877FF', fontSize: 12, cursor: 'pointer' }}
              onClick={onReset}
            >
              清除条件
            </div>
          </SearchWrap>
        </FilterWrap>
      </Header>
      <Content>
        <TableBox
          rowKey="id"
          columns={columns}
          dataSource={memberList?.list}
          pagination={false}
          scroll={{ x: 'max-content' }}
          showSorterTooltip={false}
        />
        <PaginationWrap>
          <Pagination
            defaultCurrent={1}
            current={memberList?.currentPage}
            showSizeChanger
            showQuickJumper
            total={memberList?.total}
            showTotal={total => `Total ${total} items`}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
            hideOnSinglePage
          />
        </PaginationWrap>
      </Content>
    </Wrap>
  )
}

export default ProjectMember

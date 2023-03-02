/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-empty */
import styled from '@emotion/styled'
import HeaderSearch from './HeaderSearch'
import Table from './Table'
import Pagination from '@/components/TablePagination'
import CommonModal from '@/components/CommonModal'
import { useState, useEffect } from 'react'
import { Form, Select, message } from 'antd'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useDispatch, useSelector } from '@store/index'
import { getMemberList } from '@store/teams/thunk'
import * as services from '@/services'
import AddMemberCommonModal from './CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'

const RightWrap = styled.div`
  width: 100%;
  padding: 0 24px;
  height: 100%;
  position: relative;
  background-color: var(--neutral-white-d1);
`
const PaginationBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 24px;
`
const TableBox = styled.div`
  width: 100%;
  height: calc(100% - 64px - 72px);
  overflow-y: scroll;
`
const FormStyle = styled(Form)`
  & .ant-form-item {
    min-height: 62px !important;
    display: flex;
    flex-direction: column;
  }
  & .ant-form-item-row {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  & .ant-form-item-label {
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n1-d1);
    margin-bottom: 8px;
  }
  & .ant-form-item-label > label,
  .ant-select-selection-item {
    color: var(--neutral-n1-d1);
  }
  & .ant-picker,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector,
  .ant-input,
  .ant-input-number {
    border: 1px solid var(--neutral-n6-d1) !important;
    background-color: var(--neutral-white-d4) !important;
  }
  & .ant-select-item-option-content,
  .ant-select-item,
  .ant-select-item-option,
  .rc-virtual-list-holder-inner,
  .ant-select-dropdown {
    background-color: var(--neutral-white-d4) !important;
  }
`
const TitleStyle = styled.div`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: var(--neutral-n2);
`
const SelectStyle = styled(Select)`
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid var(--neutral-n6-d1) !important;
    background-color: var(--neutral-white-d4) !important;
  }
`
const PersonStyle = styled.div`
  width: 100%;
  padding: 24px;
`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`
const LeftItem = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n2);
`
const RightItem = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
`
const RightItemIcon = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  background: #feb2a1;
  border-radius: 50px 50px 50px 50px;
  color: var(--neutral-white-d1);
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
`
const RightTable = () => {
  const dispatch = useDispatch()
  const { membersList, activeTeamId } = useSelector(s => s.teams)
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [editForm, setEditForm] = useState<any>()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const [type, setType] = useState('')
  const [activeMember, setActiveMember] = useState<any>(null)
  const [searchVal, setSearchVal] = useState('')
  const [pageObj, setPageObj] = useState<any>({ page: 1, pageSize: 20 })
  const [addMemberVisible, setAddMemberVisible] = useState(false)
  const options = [
    {
      value: '123',
      label: '132',
    },
    {
      value: '123',
      label: '132',
    },
  ]
  const onFetchMemberList = async (pageObjVal?: any, orderVal?: any) => {
    const param = {
      order: orderVal?.value,
      orderkey: orderVal?.key,
      pagesize: pageObjVal?.size || 20,
      page: pageObjVal?.page || 1,
      search: {
        team_id: activeTeamId,
        keyword: searchVal || '',
      },
    }
    await dispatch(getMemberList(param))
  }

  useEffect(() => {
    if (activeTeamId) {
      onFetchMemberList()
    }
  }, [activeTeamId, searchVal])
  const onChangePage = (page: number, pageSize: number) => {
    setPageObj({ page, pageSize })
    onFetchMemberList({
      page,
      pageSize,
    })
  }
  // const onTableChange = () => {}

  const onDelConfirm = async () => {
    if (activeMember?.team_is_admin === 1) {
      message.warning('团队管理员不能被移除')
      setDelIsVisible(false)
      return
    }
    try {
      await services.setting.deleteMemberList({
        id: activeMember?.team_id,
        user_id: activeMember?.user_id,
      })
      setDelIsVisible(false)
      onFetchMemberList()
    } catch (error) {}
  }

  const onAddConfirm = async (list: any[]) => {
    try {
      await services.setting.teamsMember({
        id: activeTeamId,
        user_ids: list.map(i => i.id),
      })
      setAddMemberVisible(false)
      onFetchMemberList()
    } catch (error) {}
  }

  const teamGetForm = (row?: any) => {
    return (
      <div style={{ margin: '0 24px' }}>
        <TitleStyle>设置【张三】在团队中的角色</TitleStyle>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <Form.Item
            label="团队角色"
            name="username"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <SelectStyle
              getPopupContainer={node => node}
              placeholder="请输入团队名称"
              style={{ width: '100%' }}
              options={options}
              suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
            />
          </Form.Item>
        </FormStyle>
      </div>
    )
  }

  const personalData = (row: any) => {
    return (
      <PersonStyle>
        <Row>
          <LeftItem>头像</LeftItem>
          <CommonUserAvatar avatar={row.avatar} size="small" />
        </Row>
        <Row>
          <LeftItem>手机号</LeftItem>
          <RightItem>{row.phone}</RightItem>
        </Row>
        <Row>
          <LeftItem>登录邮箱</LeftItem>
          <RightItem>{row.email}</RightItem>
        </Row>
        <Row>
          <LeftItem>昵称</LeftItem>
          <RightItem>{row.nickname}</RightItem>
        </Row>
        <Row>
          <LeftItem>姓名</LeftItem>
          <RightItem>{row.name}</RightItem>
        </Row>
        <Row>
          <LeftItem>性别</LeftItem>
          <RightItem>{row.gender}</RightItem>
        </Row>
        <Row>
          <LeftItem>所属部门</LeftItem>
          <RightItem>{row.department_name}</RightItem>
        </Row>
        <Row>
          <LeftItem>职位</LeftItem>
          <RightItem>{row.position_name}</RightItem>
        </Row>
        <Row>
          <LeftItem>所在团队</LeftItem>
          <RightItem>{row.teams?.map((i: any) => i.name)?.join()}</RightItem>
        </Row>
        <Row className="row">
          <LeftItem>权限组</LeftItem>
          <RightItem>
            {row.team_is_admin === 1 ? '团队管理' : '团队成员'}
          </RightItem>
        </Row>
      </PersonStyle>
    )
  }
  return (
    <RightWrap>
      <HeaderSearch
        onSetSearchVal={setSearchVal}
        onShowAddMemberModal={() => setAddMemberVisible(true)}
      />
      <TableBox>
        <Table
          onEditRow={(row: any, state: string) => {
            setActiveMember(row)
            setIsVisible(true),
              setType(state),
              setEditForm(
                state === 'detail' ? personalData(row) : teamGetForm(row),
              )
          }}
          onDelRow={(row: any) => {
            setActiveMember(row)
            setDelIsVisible(true)
          }}
          dataSource={membersList?.list}
          // onChange={onTableChange}
        />
      </TableBox>
      <PaginationBox>
        <Pagination
          total={membersList?.pager?.total}
          pageSize={membersList?.pager?.pagesize}
          currentPage={membersList?.pager?.page}
          onChange={onChangePage}
        />
      </PaginationBox>
      <CommonModal
        title={type === 'detail' ? '个人资料' : '编辑成员'}
        isVisible={isVisible}
        children={editForm}
        hasFooter={type === 'detail'}
        onClose={() => setIsVisible(false)}
      />

      <DeleteConfirm
        title="移除确认"
        text="确认移除该成员？"
        isVisible={delIsVisible}
        onConfirm={onDelConfirm}
        onChangeVisible={() => setDelIsVisible(false)}
      />

      <AddMemberCommonModal
        title="添加成员"
        isVisible={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        onConfirm={onAddConfirm}
      />
    </RightWrap>
  )
}

export default RightTable

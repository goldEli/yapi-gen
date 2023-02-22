import styled from '@emotion/styled'
import HeaderSearch from './HeaderSearch'
import Table from './Table'
import Pagination from '@/components/TablePagination'
import CommonModal from '@/components/CommonModal'
import { useState } from 'react'
import { Form, Select } from 'antd'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
const RightWrap = styled.div`
  width: 100%;
  padding: 0 24px;
  height: 100%;
  position: relative;
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
  & .ant-form-item-label > label {
    color: var(--neutral-n1-d1);
  }
`
const TitleStyle = styled.div`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: var(--neutral-n2);
`
const RightTable = () => {
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [editForm, setEditForm] = useState<any>()
  const [delIsVisible, setDelIsVisible] = useState(false)
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
  const teamGetForm = (row?: any) => {
    return (
      <>
        <TitleStyle>设置【张三】在团队中的角色</TitleStyle>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <Form.Item
            label="团队角色"
            name="username"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Select
              placeholder="请输入团队名称"
              style={{ width: '100%' }}
              options={options}
              suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
            />
          </Form.Item>
        </FormStyle>
      </>
    )
  }
  return (
    <RightWrap>
      <HeaderSearch />
      <TableBox>
        <Table
          onEditRow={(row: any) => {
            setIsVisible(true), setEditForm(teamGetForm(row))
          }}
          onDelRow={(row: any) => {
            setDelIsVisible(true)
          }}
        />
      </TableBox>
      <PaginationBox>
        <Pagination
          total={100}
          pageSize={20}
          onChange={(page: number, pageSize: number) => 123}
        />
      </PaginationBox>
      <CommonModal
        title={'编辑成员'}
        isVisible={isVisible}
        children={editForm}
        onClose={() => setIsVisible(false)}
      />
      <DeleteConfirm
        title="移除确认"
        text="确认移除该成员？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        onChangeVisible={() => setDelIsVisible(false)}
      ></DeleteConfirm>
    </RightWrap>
  )
}
export default RightTable

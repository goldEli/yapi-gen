/* eslint-disable react/jsx-handler-names */
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ShowWrap } from '@/components/StyleCommon'
import Sort from '@/components/Sort'

const flexCss = css`
  display: flex;
  align-items: center;
`

const SetHead = styled.div`
  margin-left: 32px;
  margin-right: 12px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid rgba(40, 119, 255, 1);
  color: white;
`

export const useDynamicColumns = (state: any) => {
  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={state.updateOrderkey}
        nowKey={state.orderKey}
        order={state.order}
      >
        {props.children}
      </Sort>
    )
  }
  return [
    {
      width: 200,
      align: 'center',
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => {
        const menu = (
          <Menu
            items={[
              {
                key: '1',
                label: (
                  <span
                    onClick={() => state.controlStaffPersonalVisible(record)}
                  >
                    配置权限
                  </span>
                ),
              },
            ]}
          />
        )
        return (
          <div className={flexCss}>
            <ShowWrap>
              <Dropdown overlay={menu} placement="bottomLeft">
                <IconFont
                  type="more
              "
                  style={{ color: 'rgba(40, 119, 255, 1)', fontSize: 20 }}
                />
              </Dropdown>
            </ShowWrap>
            <SetHead>{text}</SetHead>
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div onClick={() => state.showModal2(record)}>
            {text === 2 ? '男' : '女'}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="email">邮箱</NewSort>,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: <NewSort fixedKey="phone">手机</NewSort>,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '部门',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: '职位',
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: '权限组',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '项目数',
      dataIndex: 'project_num',
      key: 'project_num',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ]
}

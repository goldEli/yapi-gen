/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-handler-names */
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ShowWrap } from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

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
  background: #a4acf5;
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid white;
  color: white;
`

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { userInfo } = useModel('user')
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
              <div
                hidden={getIsPermission(
                  userInfo?.company_permissions,
                  'b/user/update',
                )}
              >
                <Dropdown overlay={menu} placement="bottomLeft">
                  <IconFont
                    type="more
              "
                    style={{ color: 'rgba(40, 119, 255, 1)', fontSize: 20 }}
                  />
                </Dropdown>
              </div>
            </ShowWrap>
            {record.avatar ? (
              <img
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  marginLeft: 32,
                }}
                src={record.avatar}
                alt=""
              />
            ) : (
              <SetHead>
                {String(text.substring(0, 1)).toLocaleUpperCase()}
              </SetHead>
            )}
            <span>{record.nickname}</span>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">真实姓名</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: <NewSort fixedKey="gender">性别</NewSort>,
      dataIndex: 'gender',
      key: 'gender',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div onClick={() => state.showModal2(record)}>
            {text === 1 ? '男' : '女'}
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
      title: <NewSort fixedKey="department_name">部门</NewSort>,
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: <NewSort fixedKey="position_name">职位</NewSort>,
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: <NewSort fixedKey="role_name">权限组</NewSort>,
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: <NewSort fixedKey="project_num">状态</NewSort>,
      dataIndex: 'status',
      key: 'status',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div onClick={() => state.showModal2(record)}>
            {text === 1 ? '在职' : '离职'}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="project_num">项目数</NewSort>,
      dataIndex: 'project_num',
      key: 'project_num',
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ]
}

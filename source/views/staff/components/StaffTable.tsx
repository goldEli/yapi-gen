/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable max-len */
import { Button, Dropdown, Menu } from 'antd'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import Pop from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ShowWrap } from '@/components/StyleCommon'

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
        return <div onClick={() => state.showModal2(record)}>{text}</div>
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: any, record: any) => (
        <Pop
          content={({ onHide }: { onHide(): void }) => {
            return (
              <ShapeContent
                tap={() => {

                  //
                }}
                hide={onHide}
                record={record}
              />
            )
          }}
          record={record}
        >
          123
        </Pop>
      ),
    },
    {
      title: '手机',
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
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => (
        <Pop
          content={({ onHide }: { onHide(): void }) => <LevelContent onTap={() => {}} onHide={onHide} record={record} />
          }
          record={record}
        >
          <Button>321</Button>
        </Pop>
      ),
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

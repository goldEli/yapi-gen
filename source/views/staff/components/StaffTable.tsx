// 公司成员列表

/* eslint-disable react/jsx-handler-names */
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { HiddenText } from '@/components/StyleCommon'

const flexCss = css`
  display: flex;
  align-items: center;
`

const SetHead = styled.div`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 14px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid white;
  color: white;
`

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
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
      width: 140,
      title: t('common.nickname'),
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: any, record: any) => {
        return (
          <div className={flexCss}>
            {record.avatar ? (
              <img
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: 8,
                }}
                src={record.avatar}
                alt=""
              />
            ) : (
              <SetHead style={{ marginRight: 8 }}>
                {String(record.name?.trim().slice(0, 1)).toLocaleUpperCase()}
              </SetHead>
            )}
            <HiddenText>
              <OmitText
                width={100}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text}
              </OmitText>
            </HiddenText>
          </div>
        )
      },
    },
    {
      width: 200,
      title: <NewSort fixedKey="name">{t('project.realName')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: <NewSort fixedKey="gender">{t('common.sex')}</NewSort>,
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div onClick={() => state.showModal2(record)}>
            {text === 1 ? t('common.male') : t('common.female')}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="email">{t('common.email')}</NewSort>,
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="phone">{t('common.phone')}</NewSort>,
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="department_name">{t('common.department')}</NewSort>
      ),
      dataIndex: 'department_name',
      key: 'department_name',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="position_name">{t('common.job')}</NewSort>,
      dataIndex: 'position_name',
      key: 'position_name',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="role_name">{t('common.permissionGroup')}</NewSort>
      ),
      dataIndex: 'role_name',
      key: 'role_name',
      width: 170,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div onClick={() => state.showModal2(record)}>
            {text === 1 ? t('common.job1') : t('common.job2')}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="project_num">{t('staff.projectCount')}</NewSort>
      ),
      dataIndex: 'project_num',
      key: 'project_num',
      width: 135,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]
}

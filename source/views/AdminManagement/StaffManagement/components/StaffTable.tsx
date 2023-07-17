// 公司成员列表

/* eslint-disable react/jsx-handler-names */
import { css } from '@emotion/css'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import { Tag } from '@/components/StyleCommon'
import CommonUserAvatar from '@/components/CommonUserAvatar'
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
      title: <NewSort fixedKey="name">{t('common.name')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (text: any, record: any) => {
        console.log(record, 'record')
        console.log(record.handover_status)
        return (
          <div style={{ width: '100%', display: 'flex' }}>
            <CommonUserAvatar
              avatar={record.avatar}
              size="small"
              name={record.name}
            />
            {record.handover_status}
            {record.nickname && `(${record.nickname}) `}
            {record.handover_status === 2 && <Tag>{t('quitAndHandover')}</Tag>}
          </div>
        )
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => state.showModal2(record)}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 8,
                background: text === 2 ? 'var(--neutral-n5)' : '#43ba9a',
              }}
            />
            {text === 1 ? t('common.job1') : t('common.job2')}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="handover_status">{t('between_jobs')}</NewSort>,
      dataIndex: 'handover_status',
      key: 'handover_status',
      width: 120,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => state.showModal2(record)}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                marginRight: 8,
                borderRadius: '50%',
                background: text === 1 ? 'var(--neutral-n5)' : '#A176FB',
              }}
            />
            {text === 1 ? t('normal') : t('handed_over')}
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
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]
}

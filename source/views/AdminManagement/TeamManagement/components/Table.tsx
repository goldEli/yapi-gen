import styled from '@emotion/styled'
import { GENDER_MAP } from '@/constants'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { t } from 'i18next'
import Sort from '@/components/Sort'
import { useState } from 'react'

const OperationWrap = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--primary-d2);
  span {
    margin-right: 16px;
  }
  span:hover {
    cursor: pointer;
  }
`
const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}
const Table = (props: any) => {
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    props.onUpdateOrderKey(key, val === 2 ? 'desc' : 'asc')
  }
  const columns: any = [
    {
      title: (
        <NewSort
          nowKey={order.key}
          order={order.value}
          fixedKey="name"
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.name')}
        </NewSort>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 230,
      render: (text: any, record: any) => {
        return (
          <div style={{ width: '100%', display: 'flex' }}>
            <CommonUserAvatar
              avatar={record.avatar}
              size="small"
              name={record.name}
            />
            {record.nickname && `(${record.nickname}) `}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
          fixedKey="department_name"
        >
          {' '}
          {t('department')}
        </NewSort>
      ),
      width: 160,
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: (
        <NewSort
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
          fixedKey="position_name"
        >
          {' '}
          {t('position')}
        </NewSort>
      ),
      width: 160,
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: (
        <NewSort
          onUpdateOrderKey={onUpdateOrderKey}
          nowKey={order.key}
          order={order.value}
          fixedKey="gender"
        >
          {t('project.gender0')}
        </NewSort>
      ),
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (text: any) => GENDER_MAP[text],
    },
    {
      title: (
        <NewSort
          nowKey={order.key}
          order={order.value}
          fixedKey="email"
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {' '}
          {t('mailbox')}
        </NewSort>
      ),
      width: 160,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: (
        <NewSort
          fixedKey="phone"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {' '}
          {t('cell_phone_number')}
        </NewSort>
      ),
      width: 160,
      dataIndex: 'phone',
      key: 'phone',
    },

    {
      title: (
        <NewSort
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
          fixedKey="team_is_admin"
        >
          {' '}
          {t('team_role')}
        </NewSort>
      ),
      dataIndex: 'team_is_admin',
      key: 'team_is_admin',
      render: (text: any) =>
        text === 1 ? t('team_management') : t('team_members'),
    },
    {
      title: t('newlyAdd.operation'),
      width: 220,
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <OperationWrap>
          <span onClick={() => props.onEditRow(record, 'edit')}>
            {t('common.edit') as string}
          </span>
          <span onClick={() => props.onDelRow(record)}>
            {t('shift_out') as string}
          </span>
          <span onClick={() => props.onEditRow(record, 'detail')}>
            {t('common.info') as string}
          </span>
        </OperationWrap>
      ),
    },
  ]
  return (
    <ResizeTable
      isSpinning={false}
      dataWrapNormalHeight="100%"
      col={columns}
      dataSource={props.dataSource}
      noData={<NoData />}
    />
  )
}
export default Table

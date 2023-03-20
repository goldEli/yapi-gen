import styled from '@emotion/styled'
import { GENDER_MAP } from '@/constants'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { t } from 'i18next'

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
const Table = (props: any) => {
  const columns: any = [
    {
      title: t('nickname') as string,
      dataIndex: 'nickname',
      key: 'nickname',
      width: 160,
      render: (text: string, record: any) => (
        <CommonUserAvatar avatar={record.avatar} size="small" name={text} />
      ),
    },
    {
      title: t('project.realName') as string,
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: t('project.gender0') as string,
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (text: any) => GENDER_MAP[text],
    },
    {
      title: t('mailbox'),
      width: 160,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('cell_phone_number'),
      width: 160,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('department'),
      width: 160,
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: t('position'),
      width: 160,
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: t('team_role'),
      dataIndex: 'team_is_admin',
      key: 'team_is_admin',
      render: (text: any) =>
        text === 1 ? t('team_management') : t('team_members'),
    },
    {
      title: t('newlyAdd.operation'),
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

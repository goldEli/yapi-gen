import CommonModal from '@/components/CommonModal'
import { Table } from 'antd'
import { TableRow, TextTable } from '../Style'
import { getStaffListApi } from '@/services/staff'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PropsType {
  title: string
  isVisible: boolean
  onConfirm: () => void
  onClose: () => void
  personData: Array<{
    name: string
    id?: number
  }>
}

const WacthExportPerson = (props: PropsType) => {
  const [t] = useTranslation()
  const [data, setData] = useState()
  console.log(props.personData)
  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => {
        return <TextTable>{text}</TextTable>
      },
    },
    {
      title: <span>{t('common.sex')}</span>,
      dataIndex: 'gender',
      key: 'gender',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return <div>{text === 1 ? t('common.male') : t('common.female')}</div>
      },
    },
    {
      title: t('common.department'),
      dataIndex: 'department_name',
      key: 'addredepartment_namess',
      render: (text: string) => {
        return <TextTable>{text}</TextTable>
      },
    },
    {
      title: t('common.job'),
      dataIndex: 'position_name',
      key: 'position_name',
      render: (text: string) => {
        return <TextTable>{text}</TextTable>
      },
    },
    {
      title: t('common.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('mailbox'),
      dataIndex: 'email',
      key: 'email',
    },
  ]
  useEffect(() => {
    props.isVisible && getDatalist()
  }, [props.isVisible])
  const getDatalist = async () => {
    const res = await getStaffListApi({
      all: 1,
      project_id: '',
      id: props.personData,
    })
    console.log(res.list)
    setData(res.list)
  }
  return (
    <CommonModal
      width={784}
      isVisible={props.isVisible}
      title={props.title}
      onClose={() => props.onClose()}
      onConfirm={() => props.onConfirm()}
    >
      <TableRow>
        <Table pagination={false} dataSource={data} columns={columns} />
      </TableRow>
    </CommonModal>
  )
}
export default WacthExportPerson

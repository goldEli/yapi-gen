/* eslint-disable no-undefined */
import { getDemandList } from '@/services/demand'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import { useDispatch } from '@store/index'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import NoData from '../NoData'
import { Label } from './style'

interface Props {
  detail?: any
  isOpen?: boolean
}

const ChildrenDemand = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  const columnsChild = [
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return <div>21212</div>
      },
    },
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return <div>21212</div>
      },
    },
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return <div>21212</div>
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 190,
      render: (text: any, record: any) => {
        return <div>3333</div>
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      width: 150,
      render: (text: any) => {
        return <span>{text?.join(';') || '--'}</span>
      },
    },
  ]

  const getList = async () => {
    const result = await getDemandList({
      projectId: props.detail.projectId,
      all: true,
      parentId: props.detail.id,
    })
    setDataList({ list: result })
  }

  const onCreateChild = () => {
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        isChild: true,
        parentId: props.detail.id,
        projectId: props.detail.projectId,
      }),
    )
  }

  useEffect(() => {
    if (props.isOpen) {
      getList()
    }
  }, [props.isOpen])

  return (
    <div>
      <Label>子需求</Label>
      <CommonButton
        onClick={onCreateChild}
        type="primaryText"
        iconPlacement="left"
        icon="plus"
      >
        创建子需求
      </CommonButton>
      {!!dataList?.list &&
        (dataList?.list?.length > 0 ? (
          <Table
            rowKey="id"
            showHeader={false}
            pagination={false}
            columns={columnsChild}
            dataSource={dataList?.list}
            scroll={{ x: 'max-content', y: 259 }}
            tableLayout="auto"
            style={{ borderRadius: 4, overflow: 'hidden' }}
          />
        ) : (
          <NoData />
        ))}
    </div>
  )
}

export default ChildrenDemand

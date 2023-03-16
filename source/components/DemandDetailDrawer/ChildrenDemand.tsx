/* eslint-disable no-undefined */
import { getDemandList } from '@/services/demand'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import NoData from '../NoData'
import StateTag from '../StateTag'
import { PriorityWrap } from '../StyleCommon'
import { Label } from './style'

interface Props {
  detail?: any
  isOpen?: boolean
}

const ChildrenDemand = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isUpdateDemand } = useSelector(store => store.demand)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  const columnsChild = [
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <div>
            {props.detail.projectPrefix}-{props.detail.prefixKey}
          </div>
        )
      },
    },
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return <div>{record.name}</div>
      },
    },
    {
      title: t('common.priority'),
      dataIndex: 'priority',
      render: (text: any, record: any) => {
        return (
          <PriorityWrap notEdit>
            <IconFont
              className="priorityIcon"
              type={text?.icon}
              style={{
                fontSize: 20,
                color: text?.color,
              }}
            />
            <span>{text?.content_txt || '--'}</span>
          </PriorityWrap>
        )
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      render: (text: any, record: any) => {
        return (
          <StateTag
            name={record.name}
            state={
              text?.is_start === 1 && text?.is_end === 2
                ? 1
                : text?.is_end === 1 && text?.is_start === 2
                ? 2
                : text?.is_start === 2 && text?.is_end === 2
                ? 3
                : 0
            }
          />
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
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
        categoryId: props.detail.categoryId ?? props.detail.category,
      }),
    )
  }

  useEffect(() => {
    if (props.isOpen || isUpdateDemand) {
      getList()
    }
  }, [props.isOpen, isUpdateDemand])

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

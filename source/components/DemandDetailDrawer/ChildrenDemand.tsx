/* eslint-disable no-undefined */
import { getDemandList } from '@/services/demand'
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
import { setAddWorkItemModal } from '@store/project'
import MultipleAvatar from '../MultipleAvatar'

interface Props {
  detail?: any
  isOpen?: boolean
}

const ChildrenDemand = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isUpdateAddWorkItem } = useSelector(store => store.project)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  const columnsChild = [
    {
      title: t('common.demandName'),
      dataIndex: 'storyPrefixKey',
      render: (text: string) => {
        return <div>{text}</div>
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
      render: (text: any) => {
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
            name={text.status.content}
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
      render: (text: any, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={record.usersInfo?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
        )
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
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          isChild: true,
          parentId: props.detail.id,
          projectId: props.detail.projectId,
          categoryId: props.detail.categoryId ?? props.detail.category,
          type: props.detail.work_type,
          title: t('createSubrequirements'),
        },
      }),
    )
  }

  useEffect(() => {
    if (props.isOpen || isUpdateAddWorkItem) {
      getList()
    }
  }, [props.isOpen, isUpdateAddWorkItem])

  return (
    <div>
      <Label>{t('subrequirements')}</Label>
      <CommonButton
        onClick={onCreateChild}
        type="primaryText"
        iconPlacement="left"
        icon="plus"
      >
        {t('create_sub_requirements')}
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

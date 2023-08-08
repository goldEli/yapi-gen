/* eslint-disable no-undefined */
import { getDemandList } from '@/services/demand'
import { useDispatch, useSelector } from '@store/index'
import { Space, Table } from 'antd'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import NoData from '../NoData'
import StateTag from '../StateTag'
import { CloseWrap, LinkWrap, PriorityWrap, TableBorder } from '../StyleCommon'
import { CancelText, Label, LabelWrap } from './style'
import { setAddWorkItemModal } from '@store/project'
import MultipleAvatar from '../MultipleAvatar'
import { encryptPhp } from '@/tools/cryptoPhp'
import CommonIconFont from '../CommonIconFont'
import CustomSelect from '../CustomSelect'
import DetailsChildProgress from '../DetailsChildProgress'
import CommonProgress from '../CommonProgress'
interface Props {
  detail?: any
  isOpen?: boolean
}

const ChildrenDemand = (props: Props, ref: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isUpdateAddWorkItem, projectInfo } = useSelector(
    store => store.project,
  )
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [isSearch, setIsSearch] = useState(false)
  // 跳转详情页面
  const onToDetail = (record: any) => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        detailId: record?.id,
        specialType: 3,
        isOpenScreenDetail: true,
      }),
    )
    const url = `ProjectManagement/Demand?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  const columnsChild = [
    {
      title: t('common.demandName'),
      dataIndex: 'storyPrefixKey',
      render: (text: string, record: any) => {
        return (
          <LinkWrap>
            <span className="content" onClick={() => onToDetail(record)}>
              {text}
            </span>
          </LinkWrap>
        )
      },
    },
    {
      title: t('common.demandName'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <LinkWrap>
            <span className="content" onClick={() => onToDetail(record)}>
              {text}
            </span>
          </LinkWrap>
        )
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
    {
      title: '',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <div>
            <CommonProgress isTable percent={Number(text)} id={record.id} />
          </div>
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
  useImperativeHandle(ref, () => {
    return {
      onCreateChild,
    }
  })
  useEffect(() => {
    if (props.detail?.id || isUpdateAddWorkItem) {
      console.log(111, props.detail)
      getList()
    }
  }, [props.detail, isUpdateAddWorkItem])

  return (
    <div id="tab_demand" className="info_item_tab">
      {/* <Label>{t('subrequirements')}</Label> */}
      <LabelWrap>
        <Label>{t('subrequirements')}</Label>
        <Space size={12}>
          {!isSearch && (
            <CloseWrap width={24} height={24}>
              <CommonIconFont
                size={18}
                type="search"
                color="var(--neutral-n2)"
              />
            </CloseWrap>
          )}
          {isSearch ? (
            <Space size={16}>
              <CustomSelect
                placeholder={t('search_for_transaction_name_or_number')}
                getPopupContainer={(node: any) => node}
                style={{ width: 184 }}
                onSearch={() => {}}
                options={[]}
                showSearch
                showArrow
                optionFilterProp="label"
                onChange={() => {}}
                allowClear
                autoFocus
              />
              <CancelText onClick={() => {}}>{t('common.cancel')}</CancelText>
            </Space>
          ) : null}
          {!isEnd && (
            <CloseWrap width={24} height={24}>
              <CommonIconFont
                type="plus"
                size={18}
                color="var(--neutral-n2)"
                onClick={onCreateChild}
              />
            </CloseWrap>
          )}
        </Space>
      </LabelWrap>
      {/* {!isEnd && (
        <CommonButton
          onClick={onCreateChild}
          type="primaryText"
          iconPlacement="left"
          icon="plus"
        >
          {t('create_sub_requirements')}
        </CommonButton>
      )} */}
      <DetailsChildProgress details={props.detail}></DetailsChildProgress>
      {!!dataList?.list &&
        (dataList?.list?.length > 0 ? (
          <TableBorder style={{ marginTop: '8px' }}>
            <Table
              rowKey="id"
              showHeader={false}
              pagination={false}
              columns={columnsChild}
              dataSource={dataList?.list}
              tableLayout="auto"
              style={{ borderRadius: 4, overflow: 'hidden' }}
            />
          </TableBorder>
        ) : (
          <NoData />
        ))}
    </div>
  )
}

export default forwardRef(ChildrenDemand)

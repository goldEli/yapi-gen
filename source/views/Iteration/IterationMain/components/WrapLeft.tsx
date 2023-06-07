/* eslint-disable camelcase */
/* eslint-disable require-unicode-regexp */
// 迭代主页左侧模块

/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IterationCard from './IterationCard'
import IconFont from '@/components/IconFont'
import {
  Space,
  Divider,
  Popover,
  Form,
  Input,
  message,
  Spin,
  Tooltip,
  Checkbox,
} from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import moment from 'moment'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import RangePicker from '@/components/RangePicker'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfoValues } from '@store/project'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
  setIsRefreshList,
} from '@store/iterate'
import {
  deleteIterate,
  getIterateList,
  updateIterateStatus,
} from '@/services/iterate'
import CommonButton from '@/components/CommonButton'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { getMessage } from '@/components/Message'
import Complete from '@/components/IterationStatus/Complete'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 348,
    borderRight: '1px solid var(--neutral-n6-d1)',
    padding: '0px 24px 0px 24px',
    background: 'white',
    height: '100%',
    '.ant-space-item': {
      display: 'flex',
    },
  },
  ({ isShowLeft }) => ({
    display: isShowLeft ? 'block' : 'none',
  }),
)

const TopWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'white',
})

const IconWrap = styled(IconFont)<{ isActive: any }>(
  {
    fontSize: 20,
    color: 'var(--neutral-n3)',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 6,
    '&: hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)',
    background: isActive ? 'var(--hover-d3)' : 'white',
  }),
)

const SortItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    cursor: 'pointer',
    margin: '4px 0',
    padding: '0 16px',
    '.icon': {
      marginLeft: 24,
    },
    '&:hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--primary-d2)!important' : 'var(--neutral-n2)',
  }),
)

const CardGroups = styled.div({
  height: 'calc(100% - 60px)',
  width: '100%',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    width: 0,
  },
})

interface Props {
  isShowLeft: boolean
  onChangeVisible(): void
  onCurrentDetail(item: any): void
  isUpdateList?: boolean
  onIsUpdateList?(val: boolean): void
  onChangeOperation?(val: any): void
  currentDetail?: any
  updateState?: boolean
}

const WrapLeft = (props: Props) => {
  const [t] = useTranslation()
  const sortList = [
    { name: t('project.createAsc'), type: 'asc', key: 'created_at' },
    { name: t('project.createDesc'), type: 'desc', key: 'created_at' },
    { name: t('project.startAsc'), type: 'asc', key: 'start_at' },
    { name: t('project.startDesc'), type: 'desc', key: 'start_at' },
    { name: t('project.endAsc'), type: 'asc', key: 'end_at' },
    { name: t('project.endDesc'), type: 'desc', key: 'end_at' },
    { name: t('project.titleAsc'), type: 'asc', key: 'name' },
    { name: t('project.titleDesc'), type: 'desc', key: 'name' },
  ]

  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [isSort, setIsSort] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [currentSort, setCurrentSort] = useState(sortList[1])
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const { isRefreshList, isUpdateList } = useSelector(store => store.iterate)
  const [isSpinning, setIsSpinning] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isCompleteVisible, setIsCompleteVisible] = useState(false)
  const [editCompleteId, setEditCompleteId] = useState(0)

  const hasAdd = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/store',
  )
  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/get',
  )

  // isUpdateProjectInfoValues：是否需要更新项目下拉数据
  const getList = async (obj?: any, isUpdateProjectInfoValues?: boolean) => {
    setIsSpinning(true)
    const values = form.getFieldsValue()
    if (values.startTime) {
      values.startTime = [
        moment(values.startTime[0]).format('YYYY-MM-DD'),
        moment(values.startTime[1]).format('YYYY-MM-DD'),
      ]
    }

    if (values.endTime) {
      values.endTime = [
        moment(values.endTime[0]).format('YYYY-MM-DD'),
        moment(values.endTime[1]).format('YYYY-MM-DD'),
      ]
    }

    const params = {
      projectId,
      order: currentSort.type,
      orderKey: currentSort.key,
      ...values,
    }
    const result = await getIterateList(params)
    setDataList(result)
    setIsSpinning(false)
    props.onIsUpdateList?.(false)
    dispatch(setIsRefreshList(false))
    if (obj || !props.currentDetail?.id) {
      props.onCurrentDetail(result?.list[0])
    } else {
      const current = props.currentDetail?.id
      props.onCurrentDetail(
        result?.list?.filter((k: any) => k.id === current)[0],
      )
    }
    // 如果需要更新项目下拉数据
    if (isUpdateProjectInfoValues) {
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      const recombinationIteration = result?.list?.map((k: any) => ({
        id: k.id,
        status: k.status,
        content: k.name,
        content_txt: k.name,
      }))
      const newValues = beforeValues?.map((i: any) =>
        i.key === 'iterate_name'
          ? { ...i, children: [...[i.children[0]], ...recombinationIteration] }
          : i,
      )
      dispatch(setProjectInfoValues(newValues))
    }
  }

  useEffect(() => {
    getList()
  }, [currentSort])

  useEffect(() => {
    if (isRefreshList || isRefresh) {
      getList()
    }
  }, [isRefreshList, isRefresh])

  useEffect(() => {
    if (isUpdateList || props.updateState) {
      getList(null, true)
    }
  }, [isUpdateList, props.updateState])

  const options = [
    { label: t('common.opening1'), value: 1 },
    { label: t('common.finished'), value: 2 },
    { label: t('common.Closed'), value: 3 },
  ]

  const onConfirmFilter = () => {
    getList()
    setIsFilter(false)
  }

  const onReset = () => {
    form.resetFields()
    getList()
    setIsFilter(false)
  }

  const onClose = () => {
    setIsFilter(false)
  }

  const onChangeSort = (item: any) => {
    setIsSort(false)
    setCurrentSort(item)
  }

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      startTime: _values,
    })
  }

  const onChangePickerEnd = (_values: any) => {
    form.setFieldsValue({
      endTime: _values,
    })
  }

  const sortContent = (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 100 }}>
      {sortList.map(i => (
        <SortItem
          isActive={currentSort.name === i.name}
          key={`${i.type}_${i.key}`}
          onClick={() => onChangeSort(i)}
        >
          {i.name}
          <IconFont
            className="icon"
            type={currentSort.name === i.name ? 'check' : ''}
          />
        </SortItem>
      ))}
    </div>
  )

  const filterContent = (
    <div className="filterContent">
      <Form form={form} style={{ width: 270, padding: 16 }} layout="vertical">
        <Form.Item
          getValueFromEvent={event => {
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
          label={t('common.title')}
          name="name"
        >
          <Input autoComplete="off" placeholder={t('project.pleaseTitle')} />
        </Form.Item>
        <Form.Item label={t('common.startTime')} name="startTime">
          <RangePicker onChange={(_values: any) => onChangePicker(_values)} />
        </Form.Item>
        <Form.Item label={t('common.endTime')} name="endTime">
          <RangePicker
            onChange={(_values: any) => onChangePickerEnd(_values)}
          />
        </Form.Item>
        <Form.Item label={t('common.status')} name="status">
          <Checkbox.Group options={options} />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
            onClick={onReset}
          >
            {t('common.clear1')}
          </div>
          <Space size={16}>
            <CommonButton type="light" onClick={onClose}>
              {t('common.cancel')}
            </CommonButton>
            <CommonButton type="primary" onClick={onConfirmFilter}>
              {t('common.search2')}
            </CommonButton>
          </Space>
        </div>
      </Form>
    </div>
  )

  const onChangeEdit = (e: any, item: any) => {
    e.stopPropagation()
    props.onChangeOperation?.(item)
    props.onChangeVisible()
  }

  const onCompleteIteration = useCallback((id: number) => {
    setIsCompleteVisible(true)
    setEditCompleteId(id)
  }, [])

  const onChangeStatus = async (value: any, e: any, item: any) => {
    e.stopPropagation()
    if (value !== item?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: item?.id,
          status: value,
        })
        getMessage({ msg: t('common.editS') as string, type: 'success' })
        getList(null, true)
      } catch (error) {
        //
      }
    }
  }

  const onChangeDelete = (e: any, item: any) => {
    e.stopPropagation()
    setIsDeleteId(item.id)
    setIsVisible(true)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteIterate({
        projectId,
        id: isDeleteId,
      })
      setIsVisible(false)
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      getList({}, true)
    } catch (error) {
      //
    }
  }

  const onClickInfo = (item: any) => {
    props.onChangeOperation?.(item)
    const params = encryptPhp(
      JSON.stringify({ id: projectId, iterateId: item.id }),
    )
    navigate(`/ProjectManagement/IterationDetail?data=${params}`)
  }

  const onClickItem = (item: any) => {
    props.onCurrentDetail(item)
  }

  const onChangeClick = () => {
    dispatch(setIsCreateIterationVisible(true))
    dispatch(setCreateIterationParams({ projectId }))
  }

  const onVisibleChange = (visible: any) => {
    setIsFilter(visible)
  }

  return (
    <Left isShowLeft={props.isShowLeft}>
      <DeleteConfirm
        text={t('project.confirmDelCurrentIterate')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <TopWrap>
        {hasAdd || projectInfo?.status !== 1 ? (
          <div />
        ) : (
          <CommonButton type="primary" icon="plus" onClick={onChangeClick}>
            {t('common.createIterate')}
          </CommonButton>
        )}
        <Space size={8}>
          <Popover
            visible={isSort}
            trigger="click"
            placement="bottom"
            content={sortContent}
            getPopupContainer={node => node}
            onVisibleChange={(visible: boolean) => setIsSort(visible)}
          >
            <Tooltip title={t('common.sort')}>
              <IconWrap type="sort" isActive={isSort} />
            </Tooltip>
          </Popover>
          {hasFilter ? null : (
            <Divider style={{ margin: 0, height: 20 }} type="vertical" />
          )}
          {hasFilter ? null : (
            <Popover
              trigger="click"
              placement="bottomRight"
              content={filterContent}
              getPopupContainer={node => node}
              visible={isFilter}
              onVisibleChange={onVisibleChange}
            >
              <Tooltip title={t('common.search')}>
                <IconWrap type="filter" isActive={isFilter} />
              </Tooltip>
            </Popover>
          )}
        </Space>
      </TopWrap>
      <CardGroups>
        <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <div>
                {dataList.list?.map((item: any) => (
                  <IterationCard
                    key={item.id}
                    item={item}
                    onClickInfo={() => onClickInfo(item)}
                    onClickItem={() => onClickItem(item)}
                    isActive={item.id === props.currentDetail?.id}
                    onChangeEdit={onChangeEdit}
                    onChangeDelete={onChangeDelete}
                    onChangeStatus={(value: any, e: any) =>
                      onChangeStatus(value, e, item)
                    }
                    onCompleteIteration={(id: any) => {
                      onCompleteIteration(id)
                    }}
                  />
                ))}
              </div>
            ) : (
              <NoData
                subText={hasAdd ? '' : t('version2.noDataCreateIteration')}
                haveFilter={
                  Object.values(form.getFieldsValue())?.filter((i: any) => i)
                    ?.length > 0
                }
              >
                {!hasAdd && (
                  <CommonButton
                    type="light"
                    onClick={onChangeClick}
                    style={{ marginTop: 24 }}
                  >
                    {t('common.createIterate')}
                  </CommonButton>
                )}
              </NoData>
            ))}
        </Spin>
      </CardGroups>
      <Complete
        iterationId={editCompleteId}
        isVisible={isCompleteVisible}
        title="完成迭代"
        onClose={() => {
          setIsCompleteVisible(false)
        }}
      />
    </Left>
  )
}

export default WrapLeft

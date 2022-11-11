// 迭代主页左侧模块

/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import AddButton from '@/components/AddButton'
import IterationCard from '@/components/IterationCard'
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
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import moment from 'moment'
import { getIsPermission, getParamsData, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import RangePicker from '@/components/RangePicker'
import { encryptPhp } from '@/tools/cryptoPhp'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 300,
    borderRight: '1px solid #EBEDF0',
    padding: '0px 16px 10px',
    background: 'white',
    height: 'calc(100vh - 64px)',
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
  height: 52,
  background: 'white',
  marginBottom: 8,
})

const IconWrap = styled(IconFont)({
  fontSize: 20,
  color: '#969799',
  cursor: 'pointer',
  '&: hover': {
    color: '#2877ff',
  },
})

const SortItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
    margin: '4px 0',
    padding: '0 16px',
    '&:hover': {
      color: '#2877ff',
      background: '#F0F4FA',
    },
  },
  ({ isActive }) => ({
    color: isActive ? '#2877ff' : '#646566',
    background: isActive ? '#F0F4FA' : 'white',
  }),
)

const CardGroups = styled.div({
  height: 'calc(100% - 52px)',
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
  const {
    getIterateList,
    updateIterateStatus,
    deleteIterate,
    setIsRefreshList,
    isRefreshList,
    isUpdateList,
  } = useModel('iterate')
  const { projectInfo } = useModel('project')
  const [isSpinning, setIsSpinning] = useState(false)
  const hasAdd = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/store',
  )
  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/get',
  )

  const getList = async (obj?: any) => {
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
    setIsRefreshList(false)
    if (obj || !props.currentDetail?.id) {
      props.onCurrentDetail(result?.list[0])
    } else {
      const current = props.currentDetail?.id
      props.onCurrentDetail(
        result?.list?.filter((k: any) => k.id === current)[0],
      )
    }
  }

  useEffect(() => {
    getList()
  }, [currentSort])

  useEffect(() => {
    if (isRefreshList) {
      getList()
    }
  }, [isRefreshList])

  useEffect(() => {
    if (isUpdateList || props.updateState) {
      getList()
    }
  }, [isUpdateList, props.updateState])

  const options = [
    { label: '已开启', value: 1 },
    { label: '已完成', value: 2 },
    { label: '已关闭', value: 3 },
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
        </SortItem>
      ))}
    </div>
  )

  const filterContent = (
    <div className="filterContent">
      <Form form={form} style={{ width: 270, padding: 16 }} layout="vertical">
        <Form.Item label={t('common.title')} name="name">
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
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={onReset}
          >
            {t('common.clear1')}
          </div>
          <Space size={16}>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={onConfirmFilter}>
              {t('common.search2')}
            </Button>
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

  const onChangeStatus = async (value: any, e: any, item: any) => {
    e.stopPropagation()
    if (value !== item?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: item?.id,
          status: value,
        })
        message.success(t('common.editS'))
        getList()
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
      message.success(t('common.deleteSuccess'))
      getList({})
    } catch (error) {
      //
    }
  }

  const onClickInfo = (item: any) => {
    props.onChangeOperation?.(item)

    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, iterateId: item.id }),
    )
    openDetail(`/Detail/Iteration?data=${params}`)
  }

  const onClickItem = (item: any) => {
    props.onCurrentDetail(item)
  }

  const onChangeClick = () => {
    props.onChangeOperation?.({})
    setTimeout(() => {
      props.onChangeVisible()
    }, 100)
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
        {hasAdd ? (
          <div />
        ) : (
          <AddButton
            text={t('common.createIterate')}
            onChangeClick={onChangeClick}
          />
        )}
        <Space size={20}>
          <Popover
            visible={isSort}
            trigger="click"
            placement="bottom"
            content={sortContent}
            getPopupContainer={node => node}
            onVisibleChange={(visible: boolean) => setIsSort(visible)}
          >
            <Tooltip title={t('common.sort')}>
              <IconWrap type="sort" />
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
                <IconWrap type="filter" />
              </Tooltip>
            </Popover>
          )}
        </Space>
      </TopWrap>
      <CardGroups>
        <Spin spinning={isSpinning}>
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
                  />
                ))}
              </div>
            ) : (
              <NoData />
            ))}
        </Spin>
      </CardGroups>
    </Left>
  )
}

export default WrapLeft

/* eslint-disable multiline-ternary */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable complexity */
import AddButton from '@/components/AddButton'
import IterationCard from '@/components/IterationCard'
import IconFont from '@/components/IconFont'
import {
  Space,
  Divider,
  Popover,
  Form,
  Input,
  DatePicker,
  Menu,
  message,
  Radio,
  Spin,
} from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import moment from 'moment'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 300,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRight: '1px solid #EBEDF0',
    padding: '0px 16px 10px',
    background: 'white',
    zIndex: 1,
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

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
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
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 4,
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
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [isSort, setIsSort] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [currentSort, setCurrentSort] = useState(sortList[1])
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const {
    getIterateList,
    updateIterateStatus,
    deleteIterate,
    setIsRefreshList,
    isRefreshList,
  } = useModel('iterate')
  const { projectInfo } = useModel('project')
  const [isSpinning, setIsSpinning] = useState(false)
  const hasAdd = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/store',
  )
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/del',
  )
  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )
  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/get',
  )

  const getList = async () => {
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
    if (!isRefreshList) {
      props.onCurrentDetail(result?.list[0])
    }
    props.onIsUpdateList?.(false)
    setIsRefreshList(false)
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
    if (props.isUpdateList) {
      getList()
    }
  }, [props.isUpdateList])

  const options = [
    { label: t('common.open'), value: 1 },
    { label: t('common.stop'), value: 2 },
  ]

  const onConfirmFilter = () => {
    getList()
  }

  const onReset = () => {
    form.resetFields()
  }

  const onClose = () => {
    form.resetFields()
    setIsFilter(false)
  }

  const onChangeSort = (item: any) => {
    setIsSort(false)
    setCurrentSort(item)
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
      <Form form={form} style={{ width: 260, padding: 24 }} layout="vertical">
        <Form.Item label={t('common.title')} name="name">
          <Input placeholder={t('project.pleaseTitle')} />
        </Form.Item>
        <Form.Item label={t('common.startTime')} name="startTime">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label={t('common.endTime')} name="endTime">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label={t('common.status')} name="status">
          <Radio.Group options={options} />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div onClick={onReset}>{t('common.clear1')}</div>
          <Space size={16}>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={onConfirmFilter}>
              {t('common.filter')}
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

  const onChangeEnd = async (e: any, item: any) => {
    e.stopPropagation()
    try {
      await updateIterateStatus({
        projectId,
        id: item.id,
        status: item.status !== 1,
      })
      message.success(t('mark.change'))
      getList()
    } catch (error) {

      //
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
      getList()
    } catch (error) {

      //
    }
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label:
          <div onClick={e => onChangeEdit(e, item)}>{t('common.edit')}</div>
        ,
      },
      {
        key: '2',
        label: (
          <div onClick={e => onChangeEnd(e, item)}>
            {item.status === 1 ? t('common.close') : t('common.open')}
          </div>
        ),
      },
      {
        key: '3',
        label:
          <div onClick={e => onChangeDelete(e, item)}>{t('common.del')} </div>
        ,
      },
    ]
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasChangeStatus) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '3')
    }

    return <Menu items={menuItems} />
  }

  const onClickInfo = (item: any) => {
    props.onChangeOperation?.(item)
    navigate(`/Detail/Iteration?type=info&id=${projectId}&iterateId=${item.id}`)
  }

  const onClickItem = (item: any) => {
    props.onCurrentDetail(item)
  }

  const onChangeClick = () => {
    props.onChangeVisible()
    props.onChangeOperation?.({})
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
        {hasAdd ? null : (
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
            <IconWrap type="sort" />
          </Popover>
          {hasFilter ? null
            : <Divider style={{ margin: 0, height: 20 }} type="vertical" />
          }

          {hasFilter ? null : (
            <Popover
              trigger="click"
              placement="bottomRight"
              content={filterContent}
              getPopupContainer={node => node}
              visible={isFilter}
              onVisibleChange={onVisibleChange}
            >
              <IconWrap onClick={() => setIsFilter(true)} type="filter" />
            </Popover>
          )}
        </Space>
      </TopWrap>
      <CardGroups>
        <Spin spinning={isSpinning}>
          {!!dataList?.list
            && (dataList?.list?.length > 0 ? (
              <div>
                {dataList.list?.map((item: any) => (
                  <IterationCard
                    menu={menu(item)}
                    key={item.id}
                    item={item}
                    onClickInfo={() => onClickInfo(item)}
                    onClickItem={() => onClickItem(item)}
                    isActive={item.id === props.currentDetail?.id}
                  />
                ))}
              </div>
            )
              : <NoData />
            )}
        </Spin>
      </CardGroups>
    </Left>
  )
}

export default WrapLeft

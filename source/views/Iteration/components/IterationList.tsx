/* eslint-disable no-undefined */
/* eslint-disable require-unicode-regexp */
import CommonButton from '@/components/CommonButton'
import {
  CardGroups,
  CardWrap,
  DetailWrap,
  IconWrap,
  InfoContent,
  IterationListBox,
  SortItem,
  StatusBox,
  TimeWrap,
  TitleWrap,
  ToDetailBox,
  TopWrap,
} from '../style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { getIsPermission, getProjectIdByUrl } from '@/tools'
import {
  Checkbox,
  Divider,
  Form,
  Input,
  Menu,
  Popover,
  Progress,
  Space,
  Spin,
  Tooltip,
} from 'antd'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import RangePicker from '@/components/RangePicker'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
} from '@store/iterate'
import NoData from '@/components/NoData'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import MoreDropdown from '@/components/MoreDropdown'
import IterationStatus from '@/components/IterationStatus'
import CommonIconFont from '@/components/CommonIconFont'
import moment from 'moment'
import {
  deleteIterate,
  getIterateList,
  updateIterateStatus,
} from '@/services/iterate'
import { setProjectInfoValues } from '@store/project'
import { getIterateInfo } from '@store/iterate/iterate.thunk'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getMessage } from '@/components/Message'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'

interface IterationListProps {
  // 是否展开左侧
  isShowLeft: boolean
  onUpdate(): void
  onCompleteIteration(id: number): void
}

const IterationList = (props: IterationListProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
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
  const options = [
    { label: t('common.opening1'), value: 1 },
    { label: t('common.finished'), value: 2 },
    { label: t('common.Closed'), value: 3 },
  ]

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const { iterateInfo, isUpdateList } = useSelector(store => store.iterate)
  const { isRefresh } = useSelector(store => store.user)
  //   是否排序
  const [isSort, setIsSort] = useState(false)
  //   是否筛选
  const [isFilter, setIsFilter] = useState(false)
  //   当前的排序
  const [currentSort, setCurrentSort] = useState(sortList[1])
  //   卡片上的操作
  const [isVisible, setIsVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [operationId, setOperationId] = useState(0)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  const hasAdd = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/store',
  )
  const hasFilter = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/get',
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

  // isUpdateProjectInfoValues：是否需要更新项目下拉数据
  const getList = async (
    isUpdateProjectInfoValues?: boolean,
    isDeleteId?: number,
  ) => {
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
      projectId: getProjectIdByUrl(),
      order: currentSort.type,
      orderKey: currentSort.key,
      ...values,
    }
    const result = await getIterateList(params)
    setDataList(result)
    setIsSpinning(false)

    // 如果删除id是当前选中的 或当前筛选没有当前选中的，则更新列表第一个
    if (
      isDeleteId === iterateInfo.id ||
      result.list.filter((i: any) => i.id === iterateInfo.id)?.length <= 0
    ) {
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: result?.list[0].id,
        }),
      )
    }

    // 当前操作的id跟当前展示的id一致则更新详情或者没有迭代id
    if (operationId === iterateInfo.id || !iterateInfo.id) {
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: iterateInfo.id ?? result?.list[0].id,
        }),
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

  //   开始时间
  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      startTime: _values,
    })
  }

  //   结束时间
  const onChangePickerEnd = (_values: any) => {
    form.setFieldsValue({
      endTime: _values,
    })
  }

  //   修改排序
  const onChangeSort = (item: any) => {
    setIsSort(false)
    setCurrentSort(item)
  }

  //   搜索确认事件
  const onConfirmFilter = () => {
    getList()
    setIsFilter(false)
  }

  //    重置
  const onReset = () => {
    form.resetFields()
    getList()
    setIsFilter(false)
  }

  //   关闭
  const onClose = () => {
    setIsFilter(false)
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

  //   创建迭代
  const onChangeClick = () => {
    dispatch(setIsCreateIterationVisible(true))
    dispatch(setCreateIterationParams({ projectId: getProjectIdByUrl() }))
  }

  //   删除迭代确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteIterate({
      projectId: getProjectIdByUrl(),
      id: item.id,
    })
    setIsVisible(false)
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    getList(true, item.id)
  }

  //   点击卡片上的操作
  const onClickMenu = (e: any, type: any, item: any) => {
    e.stopPropagation()
    setIsVisible(false)
    if (type === 'edit') {
      setOperationId(item.id)
      dispatch(setIsCreateIterationVisible(true))
      dispatch(
        setCreateIterationParams({
          ...item,
          ...{ projectId: projectInfo?.id },
        }),
      )
    } else if (type === 'del') {
      open({
        title: '删除确认',
        text: '确认删除该迭代？',
        onConfirm() {
          onDeleteConfirm(item)
          return Promise.resolve()
        },
      })
    }
  }

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMenu(e, 'edit', item)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMenu(e, 'del', item)}>
            {t('common.del')}{' '}
          </div>
        ),
      },
    ]
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  //   跳转迭代详情
  const onClickInfo = (item: any) => {
    console.log(item)
    const params = encryptPhp(
      JSON.stringify({ id: getProjectIdByUrl(), iterateId: item.id }),
    )
    navigate(`/ProjectManagement/IterationDetail?data=${params}`)
  }

  //   改变状态
  const onChangeStatus = async (item: any, val: number, e: any) => {
    e.stopPropagation()
    if (val !== item?.status) {
      setOperationId(item?.id)
      await updateIterateStatus({
        projectId: getProjectIdByUrl(),
        id: item?.id,
        status: val,
      })
      getMessage({ msg: t('common.editS') as string, type: 'success' })
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      // 修改迭代状态更新到项目下拉数据中
      const newValues = beforeValues?.map((i: any) =>
        i.key === 'iterate_name'
          ? {
              ...i,
              children: i.children?.map((v: any) => ({
                ...v,
                status: v.id === iterateInfo?.id ? val : v.status,
              })),
            }
          : i,
      )
      setOperationId(item.id)
      dispatch(setProjectInfoValues(newValues))
      // Todo 这里改的不对劲，数据有延迟
      setTimeout(() => {
        getList(true)
      }, 2000)
    }
  }

  //   点击获取迭代详情
  const onClickItem = (item: any) => {
    dispatch(getIterateInfo({ projectId: getProjectIdByUrl(), id: item.id }))
  }

  useEffect(() => {
    if (isRefresh || isUpdateList) {
      setOperationId(0)
      getList()
    }
  }, [isRefresh, isUpdateList])

  useEffect(() => {
    getList()
  }, [currentSort])

  return (
    <IterationListBox isShowLeft={props.isShowLeft}>
      <DeleteConfirmModal />
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
              onVisibleChange={setIsFilter}
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
                  <CardWrap
                    key={item.id}
                    onClick={() => onClickItem(item)}
                    active={iterateInfo.id === item.id}
                  >
                    <InfoContent>
                      <TitleWrap>
                        <span className="name">{item.name}</span>
                        {!(hasDel && hasEdit && hasChangeStatus) && (
                          <MoreDropdown
                            isMoreVisible={isVisible}
                            menu={menu(item)}
                            onChangeVisible={setIsVisible}
                          />
                        )}
                      </TitleWrap>
                      <ToDetailBox>
                        <TimeWrap>
                          {item.createdTime}-{item.endTime}
                        </TimeWrap>
                        <DetailWrap
                          className="info"
                          onClick={() => onClickInfo(item)}
                        >
                          <span>{t('common.info')}</span>
                          <CommonIconFont type="right" size={12} />
                        </DetailWrap>
                      </ToDetailBox>
                      <StatusBox>
                        <IterationStatus
                          iterateInfo={item}
                          hasChangeStatus={hasChangeStatus}
                          onChangeStatus={(val, e) =>
                            onChangeStatus(item, val, e)
                          }
                          onCompleteIteration={(id: number) => {
                            props?.onCompleteIteration?.(id)
                          }}
                        />
                        <div style={{ width: '45%' }}>
                          <Progress
                            strokeColor="#43BA9A"
                            style={{ color: '#43BA9A' }}
                            width={48}
                            type="line"
                            percent={Math.trunc(
                              (item.finishCount / item.storyCount) * 100,
                            )}
                            format={percent =>
                              percent === 100 ? '100%' : `${percent}%`
                            }
                            strokeWidth={4}
                          />
                        </div>
                      </StatusBox>
                    </InfoContent>
                  </CardWrap>
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
    </IterationListBox>
  )
}
export default IterationList

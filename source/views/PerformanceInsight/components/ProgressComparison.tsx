/* eslint-disable max-lines */
/* eslint-disable react/jsx-handler-names */
// 全局迭代和冲刺的工作进展对比
import HeaderAll from './HeaderAll'
import { PersonText, TitleCss, Col, Line, TableStyle } from '../Header/Style'
import { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import WorkItem from './WorkItem'
import SelectPersonnel from './SelectPersonnel'
import { setVisiblePerson, setVisibleWork } from '@store/performanceInsight'
import { useDispatch, useSelector } from '@store/index'
import {
  defectExport,
  efficiencyMemberDefectList,
  efficiencyMemberWorkList,
  getExport,
  historyDefectList,
  historyWorkList,
  memberBugList,
  plugSelectionUserInfo,
  workContrastList,
} from '@/services/efficiency'
import { RowText } from './style'
import { getTimeStr, getTitleTips, NewSort } from './Date'
import ExportSuccess from '@/components/ExportSuccess'
import { getMessage } from '@/components/Message'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { copyView } from '@/services/kanban'
import { setListActiveId } from '@store/global'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import ResizeTable from '@/components/ResizeTable'

interface Props {
  // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局 //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
  type: string
  title: string
  viewType: number
  // 代表是全局还是冲刺迭代
  homeType: string
  headerParmas: Models.Efficiency.HeaderParmas
  // projectDataList: Array<{ name: string; id: number }>
  projectId: number | string
}
const ProgressComparison = (props: Props) => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState<
    Array<{
      title: string | ReactElement
      dataIndex: string
    }>
  >([])
  const [orderObj, setOrderObj] = useState<{ orderkey: string; order: string }>(
    {
      order: '',
      orderkey: '',
    },
  )
  const [work, setWork] = useState<Array<Model.Sprint.WorkListItem>>([])
  const [tableList, setTableList] = useState<
    Array<Model.Sprint.WorkDataListItem>
  >([])
  const [tableList1, setTableList1] = useState<
    Array<Model.Sprint.BugDataListItem>
  >([])
  const [userInfo, setUserInfo] = useState<Model.Sprint.UserInfo2>({
    id: 0,
    name: '',
    avatar: '',
    email: '',
    departments: [{ id: 0, name: '' }],
    position: { id: 0, name: '' },
  })
  const [status, setStatus] = useState<Array<Model.Sprint.StatusInfo1> | []>([])
  const { visiblePerson, visibleWork } = useSelector(
    store => store.performanceInsight,
  )
  const isRefresh = useSelector(store => store.user.isRefresh)
  const [selectProjectIds, setSelectProjectIds] = useState<any>(
    props.headerParmas?.projectIds,
  )
  const [memberWorkList, setMemberWorkList] =
    useState<API.Sprint.EfficiencyMemberWorkList.Result>()
  const [statusType, setStatusType] = useState('')
  const [ids, setIds] = useState<number[]>([])
  const [historyWorkObj, setHistoryWorkObj] =
    useState<API.Efficiency.HistoryWorkList.Result>()
  const [tableBeforeAndAfter, setTableBeforeAndAfter] = useState('')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [loading, setLoading] = useState(false)
  const [extra, setExtra] = useState<any>({})
  const [t] = useTranslation()
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrderObj({ order: val, orderkey: key })
    props.type === 'Progress_iteration' ||
    props.type === 'Progress_sprint' ||
    props.type === 'Progress_all'
      ? getWorkContrastList(
          extra?.project_ids ? [extra?.project_ids] : [],
          extra,
          {
            orderkey: key,
            order: val === 2 ? 'desc' : 'asc',
          },
        )
      : getMemberBugList(
          extra?.project_ids ? [extra?.project_ids] : [],
          extra,
          {
            orderkey: key,
            order: val === 2 ? 'desc' : 'asc',
          },
        )
  }

  // 根据id查视图
  const copyViewById = async () => {
    // copy视图给被分享的用户的视图列表 copy失败就是条件不满足
    await copyView({ id: paramsData?.valueId })
  }
  useEffect(() => {
    if (paramsData?.valueId) {
      copyViewById()
    }
  }, [paramsData?.valueId])

  const [isVisibleSuccess, setIsVisibleSuccess] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  useEffect(() => {
    // 进展工作对比迭代和冲刺的
    const columns1 = [
      {
        dataIndex: 'userName',
        title: t('performance.user'),
        render: (text: string, record: any) => {
          return (
            <RowText
              onClick={(event: any) => {
                event.stopPropagation()
                dispatch(setListActiveId(record?.id ?? 0))
                dispatch(setVisiblePerson(false))
                dispatch(setVisibleWork(true))
                getDatail(record)
              }}
            >
              {text}
            </RowText>
          )
        },
      },
      {
        title: t('performance.organize'),
        dataIndex: 'departmentName',
      },
      {
        title: t('performance.position'),
        dataIndex: 'positionName',
        render: (text: string) => {
          return <RowText>{text ? text : '--'}</RowText>
        },
      },
      {
        dataIndex: 'completion_rate',
        title: (
          <NewSort
            fixedKey="completion_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.completionRate')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string) => {
          return <span>{text}%</span>
        },
      },
      {
        dataIndex: 'new',
        title: (
          <NewSort
            fixedKey="new"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.addWorkItem')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'new')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="completed"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.completedWorkItem')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'completed',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'completed')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="work_stock"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.workItemInventory')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'work_stock',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'work_stock')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: t('performance.in'),
        dataIndex: 'work_progress',
      },
      {
        dataIndex: 'repeat_rate',
        title: (
          <NewSort
            fixedKey="repeat_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.workRepetitionRate'),
              t('performance.numberOfFailedApprovalsTotalNumberOfApprovals'),
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'repeat_rate')}>
              {text}%
            </RowText>
          )
        },
      },
      {
        dataIndex: 'risk',
        title: (
          <NewSort
            fixedKey="risk"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.stockRisk'),
              t('performance.workItemsNotCompletedForMoreThanDays'),
              'right',
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'risk')}>
              {text}
            </RowText>
          )
        },
      },
    ]
    // 进展工作对比全局的
    const columns2 = [
      {
        dataIndex: 'userName',
        title: t('performance.user'),
        render: (text: string, record: any) => {
          return (
            <RowText
              onClick={(event: any) => {
                dispatch(setVisibleWork(true))
                dispatch(setVisiblePerson(false))
                event.stopPropagation()
                dispatch(setListActiveId(record?.id ?? 0))
                getDatail(record)
              }}
            >
              {text}
            </RowText>
          )
        },
      },
      {
        title: t('performance.organize'),
        dataIndex: 'departmentName',
      },
      {
        title: t('performance.position'),
        dataIndex: 'positionName',
        render: (text: string) => {
          return <RowText>{text ? text : '--'}</RowText>
        },
      },
      {
        dataIndex: 'completion_rate',
        title: (
          <NewSort
            fixedKey="completion_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.currentCompletionRate')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string) => {
          return <span>{text}%</span>
        },
      },
      {
        dataIndex: 'new',
        title: (
          <NewSort
            fixedKey="new"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.currentlyNewWorkItem')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'new')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="completed"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.currentlyCompletedWorkItems')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'completed',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'completed')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="work_stock"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.totalWorkItemInventory')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'work_stock',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'work_stock')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: t('performance.in'),
        dataIndex: 'work_progress',
      },
      {
        dataIndex: 'repeat_rate',
        title: (
          <NewSort
            fixedKey="repeat_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.totalJobRepetitionRate'),
              t('performance.numberOfFailedApprovalsTotalNumberOfApprovals'),
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'repeat_rate')}>
              {text}%
            </RowText>
          )
        },
      },
      {
        dataIndex: 'risk',
        title: (
          <NewSort
            fixedKey="risk"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.stockRisk'),
              t('performance.workItemsNotCompletedForMoreThanDays'),
              'right',
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'risk')}>
              {text}
            </RowText>
          )
        },
      },
    ]
    // 缺陷迭代和冲刺的全局
    const columns3 = [
      {
        dataIndex: 'userName',
        title: t('performance.user'),
        render: (text: string, record: any) => {
          return (
            <RowText
              onClick={(event: any) => {
                event.stopPropagation()
                dispatch(setListActiveId(record?.id ?? 0))
                dispatch(setVisiblePerson(false))
                dispatch(setVisibleWork(true))
                getDatail(record)
              }}
            >
              {text}
            </RowText>
          )
        },
      },
      {
        title: t('performance.organize'),
        dataIndex: 'departmentName',
      },
      {
        title: t('performance.position'),
        dataIndex: 'positionName',
        render: (text: string) => {
          return <RowText>{text ? text : '--'}</RowText>
        },
      },
      {
        dataIndex: 'completion_rate',
        title: (
          <NewSort
            fixedKey="completion_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.defectRepairRate'),
              t('performance.defectsRepairedInTheCurrentDefectsInThe'),
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string) => {
          return <span>{text}%</span>
        },
      },
      {
        title: (
          <NewSort
            fixedKey="not_fixed"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.toBeFixed')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'not_fixed',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'not_fixed')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="fixing"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.repairing')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'fixing',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'fixing')}>
              {text}
            </RowText>
          )
        },
      },
      {
        title: (
          <NewSort
            fixedKey="fixed"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.completed')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'fixed',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'fixed')}>
              {text}
            </RowText>
          )
        },
      },
      {
        dataIndex: 'repeat_open',
        title: (
          <NewSort
            fixedKey="repeat_open"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={t('performance.bugReopening')}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string) => {
          return <RowText>{text}</RowText>
        },
      },
      {
        title: (
          <NewSort
            fixedKey="repeat_open_rate"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.defectRate'),
              t('performance.defectsReopenedInTheCurrentDefectsInTheCurrent'),
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        dataIndex: 'repeat_open_rate',
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'repeat_open')}>
              {text}%
            </RowText>
          )
        },
      },
      {
        dataIndex: 'risk_stock_count',
        title: (
          <NewSort
            fixedKey="risk_stock_count"
            nowKey={orderObj.orderkey}
            order={orderObj.order}
            title={getTitleTips(
              t('performance.riskStockRisk'),
              t('performance.defectsNotFixedInTheCurrentPeriod'),
              'right',
            )}
            onUpdateOrderKey={onUpdateOrderKey}
          ></NewSort>
        ),
        render: (text: string, record: any) => {
          return (
            <RowText onClick={e => openDetail(e, record, 'risk')}>
              {text}
            </RowText>
          )
        },
      },
    ]
    // 进展对比 Progress_iteration-迭代 Progress_sprint 冲刺 Progress_all 全局
    // 缺陷 Defect_iteration-迭代 Defect_iteration 冲刺 Defect_all 全局
    switch (props.type) {
      case 'Progress_iteration':
        setColumns(columns1)
        break
      case 'Progress_sprint':
        setColumns(columns1)
        break
      case 'Progress_all':
        setColumns(columns2)
        break
      case 'Defect_iteration':
        setColumns(columns3)
        break
      case 'Defect_sprint':
        setColumns(columns3)
        break
      case 'Defect_all':
        setColumns(columns3)
        break
    }
  }, [props.type, selectProjectIds, isRefresh])
  useEffect(() => {
    onSearchData(props.headerParmas?.projectIds || [])
  }, [isRefresh])
  // 数据明细和进展对比查询数据的
  const onSearchData = (extras?: any) => {
    if (Array.isArray(extras)) {
      return
    }
    setExtra(extras)
    setSelectProjectIds(extras?.project_ids ?? [])
    // 进展对比
    if (props.type.includes('Progress')) {
      setLoading(true)
      getWorkContrastList(
        extras?.project_ids ? [extras?.project_ids] : [],
        extras,
      )
    } else {
      // 缺陷分析
      setLoading(true)
      getMemberBugList(extras?.project_ids ? [extras?.project_ids] : [], extras)
    }
  }
  // 导出
  const onGetExportApi = async (option: number[]) => {
    setLoading(true)
    try {
      let result: any = null
      // 1.任务导出
      if (
        ['Progress_iteration', 'Progress_sprint', 'Progress_all'].includes(
          props?.type,
        )
      ) {
        result = await getExport({
          project_ids:
            option?.length >= 1 ? option?.join(',') : String(props.projectId),
          user_ids: props?.headerParmas?.users?.join(','),
          period_time: getTimeStr(props.headerParmas?.time)
            ? getTimeStr(props.headerParmas?.time)
            : '',
          start_time: getTimeStr(props.headerParmas?.time)
            ? ''
            : props.headerParmas?.time?.time?.[0],
          end_time: getTimeStr(props.headerParmas?.time)
            ? ''
            : props.headerParmas?.time?.time?.[1],
          iterate_ids: props?.headerParmas?.iterate_ids?.join(','),
        })
      } else if (
        ['Defect_iteration', 'Defect_sprint', 'Defect_all'].includes(
          props?.type,
        )
      ) {
        result = await defectExport({
          project_ids:
            option?.length >= 1 ? option?.join(',') : String(props.projectId),
          user_ids: props?.headerParmas?.users?.join(','),
          period_time: getTimeStr(props.headerParmas?.time)
            ? getTimeStr(props.headerParmas?.time)
            : '',
          start_time: getTimeStr(props.headerParmas?.time)
            ? ''
            : props.headerParmas?.time?.time?.[0],
          end_time: getTimeStr(props.headerParmas?.time)
            ? ''
            : props.headerParmas?.time?.time?.[1],
          iterate_ids: props?.headerParmas?.iterate_ids?.join(','),
        })
      }
      const blob = new Blob([result.body], {
        type: result?.headers['content-type'],
      })
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `${props?.title}.xlsx`
      a.href = blobUrl
      a.click()
      setIsVisibleSuccess(true)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      getMessage({
        msg: t('other.exportFailed'),
        type: 'error',
      })
    }
  }
  // 工作进展对比大的列表
  const getWorkContrastList = async (
    value: number[],
    extras?: any,
    sort?: any,
  ) => {
    const res = await workContrastList({
      project_ids:
        value?.length >= 1 || props.headerParmas?.projectIds?.length
          ? value?.length >= 1
            ? value?.join(',')
            : props.headerParmas?.projectIds?.join?.(',')
          : String(props.projectId),
      iterate_ids: props.headerParmas.iterate_ids?.join(','),
      user_ids: extras?.user_ids?.join(','),
      period_time: getTimeStr({
        type: extras?.period_time,
        time: extras?.time,
      }),
      start_time: getTimeStr({ type: extras?.period_time, time: extras?.time })
        ? ''
        : extras?.time?.[0],
      end_time: getTimeStr({ type: extras?.period_time, time: extras?.time })
        ? ''
        : extras?.time?.[1],
      ...(sort || {}),
    })
    setWork(res.work)
    setTableList(res.list)
    setIds(res.list.map(el => el.id))
    setLoading(false)
  }

  // 缺陷分析大的列表
  const getMemberBugList = async (
    value: number[],
    extras?: any,
    sort?: any,
  ) => {
    const res = await memberBugList({
      project_ids:
        value.length >= 1 || props.headerParmas?.projectIds?.length
          ? value.length >= 1
            ? value.join(',')
            : props.headerParmas?.projectIds?.join?.(',')
          : String(props.projectId),
      iterate_ids: props.headerParmas.iterate_ids?.length
        ? props.headerParmas.iterate_ids?.join(',')
        : '',
      user_ids: extras?.user_ids?.join(','),
      period_time: getTimeStr({
        type: extras?.period_time,
        time: extras?.time,
      }),
      start_time: getTimeStr({ type: extras?.period_time, time: extras?.time })
        ? ''
        : extras?.time?.[0],
      end_time: getTimeStr({ type: extras?.period_time, time: extras?.time })
        ? ''
        : extras?.time?.[1],
      ...(sort || {}),
    })
    setWork(res.defect)
    setTableList1(res.list)
    setIds(res.list.map(el => el.id))
    setLoading(false)
  }
  // 后半截详情弹窗
  const openDetail = (event: any, row: { id: number }, str: string) => {
    setTableBeforeAndAfter('after')
    dispatch(setListActiveId(row?.id ?? 0))
    event.stopPropagation()
    dispatch(setVisiblePerson(true))
    dispatch(setVisibleWork(false))
    getUserInfo(row.id)
    setStatusType(str)
    const parmas = {
      user_id: row.id,
      type: str,
      iterate_ids: props.headerParmas.iterate_ids?.join(','),
      project_ids:
        selectProjectIds?.length >= 1
          ? selectProjectIds.join(',')
          : String(props.projectId),
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : '',
      start_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[1],
    }
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  // 前半截详情的弹窗
  const getDatail = (row: { id: number }) => {
    setTableBeforeAndAfter('before')
    if (props.type.includes('Progress')) {
      getHistoryWorkList(row.id)
    } else {
      getHistoryDefectList(row.id)
    }
  }
  // 进展对比的前半截api
  const getHistoryWorkList = async (id: number) => {
    dispatch(setListActiveId(id ?? 0))
    const res = await historyWorkList({ userId: id })
    setHistoryWorkObj(res)
  }
  // 缺陷分析的前半截
  const getHistoryDefectList = async (id: number) => {
    dispatch(setListActiveId(id ?? 0))
    const res = await historyDefectList({ userId: id })
    setHistoryWorkObj(res)
  }

  // 后半截的详情弹窗上半截的获取用户信息
  const getUserInfo = async (id: number) => {
    dispatch(setListActiveId(id ?? 0))
    const res = await plugSelectionUserInfo({
      user_id: id,
      project_ids:
        selectProjectIds?.length >= 1
          ? selectProjectIds.join(',')
          : String(props.projectId),
    })
    setUserInfo(res.userInfo)
    setStatus(res.status)
  }
  // 获取后半截进展对比的列表
  const getEfficiencyMemberWorkList = async (
    parmas: API.Sprint.EfficiencyMemberWorkList.Params,
  ) => {
    setSpinning(true)
    const res = await efficiencyMemberWorkList(parmas)
    setMemberWorkList(res)
    setSpinning(false)
  }
  // 获取后半截缺陷的列表
  const getEfficiencyMemberDefectList = async (
    parmas: API.Sprint.EfficiencyMemberWorkList.Params,
  ) => {
    setSpinning(true)
    const res = await efficiencyMemberDefectList(parmas)
    setMemberWorkList(res)
    setSpinning(false)
  }
  // 详情塞选项的回调
  const plugSelection = (val: API.Sprint.EfficiencyMemberWorkList.Params) => {
    const parmas = {
      ...val,
      project_ids:
        selectProjectIds?.length >= 1
          ? selectProjectIds.join(',')
          : String(props.projectId),
      iterate_ids: props.headerParmas.iterate_ids?.join(','),
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : '',
      start_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[1],
    }
    setSpinning(true)
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  // 弹窗详情的翻页查询
  const onPageNum = (id: number) => {
    const parmas = {
      user_id: id,
      type: statusType,
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : '',
      start_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? ''
        : props.headerParmas?.time?.time?.[1],
    }
    setSpinning(true)
    // 前半截是一个接口，后半截是两个接口
    if (props.type.includes('Progress')) {
      if (tableBeforeAndAfter === 'after') {
        getEfficiencyMemberWorkList(parmas)
        getUserInfo(id)
      } else {
        getDatail({ id })
      }
    } else if (tableBeforeAndAfter === 'after') {
      getEfficiencyMemberDefectList(parmas)
      getUserInfo(id)
    } else {
      getDatail({ id })
    }
  }

  useEffect(() => {
    dispatch(setVisiblePerson(false))
    dispatch(setVisibleWork(false))
    dispatch(setListActiveId(0))
  }, [])
  return (
    <div
      style={{ height: '100%', width: '100%' }}
      onClick={() => {
        dispatch(setListActiveId(0)),
          dispatch(setVisiblePerson(false)),
          dispatch(setVisibleWork(false))
      }}
    >
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        <HeaderAll
          tableList={
            props.type === 'Progress_iteration' ||
            props.type === 'Progress_sprint' ||
            props.type === 'Progress_all'
              ? tableList
              : tableList1
          }
          homeType={props.homeType}
          projectId={props.projectId}
          onGetExportApi={onGetExportApi}
          onSearchData={onSearchData}
          type={props.type}
          viewType={props.viewType}
          headerParmas={props.headerParmas}
        />
        {/* 表格 */}
        <Col style={{ marginLeft: 32 }}>
          <TitleCss>{props.title}</TitleCss>
        </Col>
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 48px' }}
        >
          {work?.map((el, index) => (
            <>
              <PersonText key={el.name}>
                {el.name}: {el.value}
                {el.unit}
              </PersonText>
              {index !== work?.length - 1 && <Line />}
            </>
          ))}
        </div>
        <TableStyle>
          {tableList.length <= 0 && tableList1.length <= 0 && <NoData />}
          <ResizeTable
            isSpinning={false}
            dataWrapNormalHeight="100%"
            col={columns}
            dataSource={
              props.type === 'Progress_iteration' ||
              props.type === 'Progress_sprint' ||
              props.type === 'Progress_all'
                ? tableList
                : tableList1
            }
            pagination={{
              total: (props.type === 'Progress_iteration' ||
              props.type === 'Progress_sprint' ||
              props.type === 'Progress_all'
                ? tableList
                : tableList1
              )?.length,
              showTotal(total: any) {
                return `${t('sprint.total')} ${total}${t('sprint.pieces')}`
              },
              defaultPageSize: 10,
              defaultCurrent: 1,
              pageSizeOptions: ['10', '20', '30', '50'],
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </TableStyle>
        {/* 后半截的弹窗 */}
        <WorkItem
          spinning={spinning}
          visible={visiblePerson}
          ids={ids}
          status={status}
          statusType={statusType}
          type={props.type}
          memberWorkList={memberWorkList}
          onPageNum={id => onPageNum(id)}
          userInfo={userInfo}
          onChange={obj => {
            plugSelection(obj)
          }}
          onCancel={() => {
            dispatch(setVisiblePerson(!visiblePerson))
          }}
        />
        {/* 前半截的弹窗 */}
        <SelectPersonnel
          historyWorkObj={historyWorkObj}
          onPageNum={id => onPageNum(id)}
          type={props.type}
          visible={visibleWork}
          ids={ids}
          onCancel={() => dispatch(setVisibleWork(!visibleWork))}
          onChange={() => 123}
        />
        {/* 导出成功 */}
        <ExportSuccess
          title={t('performance.exportSuccess')}
          notCancel
          text={t('performance.exportSuccessMsg')}
          isVisible={isVisibleSuccess}
          onConfirm={() => {
            setIsVisibleSuccess(false)
          }}
          onChangeVisible={() => setIsVisibleSuccess(false)}
        />
      </Spin>
    </div>
  )
}
export default ProgressComparison

/* eslint-disable react/jsx-handler-names */
// 全局迭代和冲刺的工作进展对比
import CommonIconFont from '@/components/CommonIconFont'
import HeaderAll from './HeaderAll'
import { PersonText, TitleCss, Col, Line, TableStyle } from '../Header/Style'
import { ReactElement, useEffect, useState } from 'react'

import Sort from '@/components/Sort'
import Table from './Table'
import { Tooltip } from 'antd'
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
import { getDate, getDays, getMonthBefor } from './Date'
import ExportSuccess from '../Header/components/ExportSuccess'
import { getMessage } from '@/components/Message'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { copyView } from '@/services/kanban'
import { cos } from '@/services/cos'

// 进展对比tips
const getTitleTips = (text: string, tips: string) => {
  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {text}
      <Tooltip title={tips} trigger="click">
        <div style={{ margin: '0 8px' }}>
          <CommonIconFont type="question" size={16} />
        </div>
      </Tooltip>
    </div>
  )
}
const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.title}
    </Sort>
  )
}
interface Props {
  // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局 //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
  type: string
  title: string
  //代表是全局还是冲刺迭代
  homeType: string
  headerParmas: Models.Efficiency.HeaderParmas
  projectDataList: Array<{ name: string; id: number }>
  projectId: number
}
const ProgressComparison = (props: Props) => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState<
    Array<{
      title: string | ReactElement
      dataIndex: string
    }>
  >([])
  const [order, setOrder] = useState<{ value: string; key: string }>({
    value: '',
    key: '',
  })
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
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [selectProjectIds, setSelectProjectIds] = useState<any>([])
  const [memberWorkList, setMemberWorkList] =
    useState<API.Sprint.EfficiencyMemberWorkList.Result>()
  const [statusType, setStatusType] = useState('')
  const [ids, setIds] = useState<number[]>([])
  const [historyWorkObj, setHistoryWorkObj] =
    useState<API.Efficiency.HistoryWorkList.Result>()
  const [tableBeforeAndAfter, setTableBeforeAndAfter] = useState('')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    console.log(val, 'val', key)
    // props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
    // props.type === 'Progress_iteration' ||
    //   props.type === 'Progress_sprint' ||
    //   props.type === 'Progress_all'
    //   ? getWorkContrastList(selectProjectIds, { pageNum, pageSize })
    //   : getMemberBugList(selectProjectIds, { pageNum, pageSize })
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
  // 进展工作对比迭代和冲刺的
  const columns1 = [
    {
      dataIndex: 'userName',
      title: '用户',
      render: (text: string, record: any) => {
        return (
          <RowText
            onClick={(event: any) => {
              event.stopPropagation()
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
      title:
        '组织',
        // <NewSort
        //   fixedKey="departmentName"
        //   nowKey={order.key}
        //   order={order.value}
        //   title={'组织'}
        //   onUpdateOrderKey={onUpdateOrderKey}
        // ></NewSort>
      dataIndex: 'departmentName',
    },
    {
      title: '职务',
      dataIndex: 'positionName',
      render: (text: string) => {
        return <RowText>{text ? text : '--'}</RowText>
      },
    },
    {
      dataIndex: 'completion_rate',
      title: getTitleTips('完成率', '已完成工作项/新增工作项*100%'),
    },
    {
      dataIndex: 'new',
      title: '新增工作项',
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'new')}>{text}</RowText>
        )
      },
    },
    {
      title: '已完成工作项',
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
      title: '工作项存量',
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
      title: '进行中|已完成',
      dataIndex: 'work_progress',
    },
    {
      title: '工作进度',
      dataIndex: 'work_progress',
      render: (text: string, record: any) => {
        const num = Number(text?.split('|')?.[0])
        const completeNum = Number(text?.split('|')?.[1])
        const total = num + completeNum
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {text
              ? completeNum === 0
                ? '0%'
                : `${Number((completeNum / total) * 100).toFixed(0)}%`
              : '--'}
          </div>
        )
      },
    },
    {
      dataIndex: 'repeat_rate',
      title: getTitleTips('工作重复率', '审批不通过次数/全部审批次数*100%'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'repeat_rate')}>
            {text}
          </RowText>
        )
      },
    },
    {
      dataIndex: 'risk',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'risk')}>{text}</RowText>
        )
      },
    },
  ]
  //进展工作对比全局的
  const columns2 = [
    {
      dataIndex: 'userName',
      title: '用户',
      render: (text: string, record: any) => {
        return (
          <RowText
            onClick={(event: any) => {
              dispatch(setVisibleWork(true))
              event.stopPropagation()
              getDatail(record)
            }}
          >
            {text}
          </RowText>
        )
      },
    },
    {
      title:
        '组织',
        // <NewSort
        //   fixedKey="departmentName"
        //   nowKey={order.key}
        //   order={order.value}
        //   title={'组织'}
        //   onUpdateOrderKey={onUpdateOrderKey}
        // ></NewSort>
      dataIndex: 'departmentName',
    },
    {
      title: '职务',
      dataIndex: 'positionName',
      render: (text: string) => {
        return <RowText>{text ? text : '--'}</RowText>
      },
    },
    {
      dataIndex: 'completion_rate',
      title: getTitleTips('当前完成率', '已完成工作项/新增工作项*100%'),
    },
    {
      dataIndex: 'new',
      title: '当前新增工作项',
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'new')}>{text}</RowText>
        )
      },
    },
    {
      title: '当前已完成工作项',
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
      title: '总工作项存量',
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
      title: '进行中|已完成',
      dataIndex: 'work_progress',
    },
    {
      title: '工作进度',
      dataIndex: 'work_progress',
      render: (text: string, record: any) => {
        const num = Number(text?.split('|')?.[0])
        const completeNum = Number(text?.split('|')?.[1])
        const total = num + completeNum
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {text
              ? completeNum === 0
                ? '0%'
                : `${Number((completeNum / total) * 100).toFixed(0)}%`
              : '--'}
          </div>
        )
      },
    },
    {
      dataIndex: 'repeat_rate',
      title: getTitleTips('总工作重复率', '审批不通过次数/全部审批次数*100%'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'repeat_rate')}>
            {text}
          </RowText>
        )
      },
    },
    {
      dataIndex: 'risk',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'risk')}>{text}</RowText>
        )
      },
    },
  ]
  // 缺陷迭代和冲刺的全局
  const columns3 = [
    {
      dataIndex: 'userName',
      title: '用户',
      render: (text: string, record: any) => {
        return (
          <RowText
            onClick={(event: any) => {
              event.stopPropagation()
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
      title: '组织',
      dataIndex: 'departmentName',
    },
    {
      title: (
        <NewSort
          fixedKey="positionName"
          nowKey={order.key}
          order={order.value}
          title={'职务'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'positionName',
      render: (text: string) => {
        return <RowText>{text ? text : '--'}</RowText>
      },
    },
    {
      dataIndex: 'completion_rate',
      title: getTitleTips('缺陷修复率', '当期已修复缺陷/档期总缺陷*100%'),
    },
    {
      title: '待修复',
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
      title: '修复中',
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
      title: '已完成',
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
      title: getTitleTips('缺陷重开', '当期重开缺陷/当期总缺陷*100%'),
      render: (text: string, record: any) => {
        console.log(record, 'record')
        return (
          <RowText onClick={e => openDetail(e, record, 'repeat_open')}>
            {text}
          </RowText>
        )
      },
    },
    {
      title: '缺陷重开率',
      dataIndex: 'repeat_open_rate',
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'repeat_open_rate')}>
            {text}
          </RowText>
        )
      },
    },
    {
      dataIndex: 'stock_count',
      title: getTitleTips('缺陷存量', '当期未修复缺陷'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'stock_count')}>
            {text}
          </RowText>
        )
      },
    },
  ]
  useEffect(() => {
    // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
    //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
    onSearchData([])
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
  }, [])
  // 数据明细和进展对比查询数据的
  const onSearchData = (value: number[]) => {
    setSelectProjectIds(value)
    if (props.type.includes('Progress')) {
      getWorkContrastList(value)
    } else {
      getMemberBugList(value)
    }
  }
  // 获取时间
  const getTime = (time: { type: number; time: any }) => {
    switch (time.type) {
      case 1:
        return getMonthBefor(1)
      case 3:
        return getMonthBefor(3)
      case 6:
        return getMonthBefor(6)
      case 14:
        return getDays(14)
      case 28:
        return getDays(28)
      default:
        return {
          startTime: time?.time?.[0],
          endTime: time?.time?.[1],
        }
    }
  }
  const getTimeStr = (time: { type: number; time: any }) => {
    switch (time.type) {
      case 1:
        return 'one_month'
      case 3:
        return 'three_month'
      case 6:
        return 'six_month'
      case 14:
        return 'two_week'
      case 28:
        return 'four_week'
      default:
        // eslint-disable-next-line no-undefined
        return undefined
    }
  }

  // 导出
  const onGetExportApi = async (option: number[]) => {
    try {
      let result: any = null
      // 1.工作项导出
      if (
        ['Progress_iteration', 'Progress_sprint', 'Progress_all'].includes(
          props?.type,
        )
      ) {
        result = await getExport({
          project_ids: option.join(','),
          user_ids: props?.headerParmas?.users?.join(','),
          period_time: getTimeStr(props.headerParmas?.time)
            ? getTimeStr(props.headerParmas?.time)
            : // eslint-disable-next-line no-undefined
              undefined,
          start_time: getTimeStr(props.headerParmas?.time)
            ? // eslint-disable-next-line no-undefined
              undefined
            : props.headerParmas?.time?.time?.[0],
          end_time: getTimeStr(props.headerParmas?.time)
            ? // eslint-disable-next-line no-undefined
              undefined
            : props.headerParmas?.time?.time?.[1],
          iterate_ids: props?.headerParmas?.iterate_ids?.join(','),
        })
      } else if (
        ['Defect_iteration', 'Defect_sprint', 'Defect_all'].includes(
          props?.type,
        )
      ) {
        result = await defectExport({
          // eslint-disable-next-line no-undefined
          project_ids: option.join(',') ? option.join(',') : undefined,
          user_ids: props?.headerParmas?.users?.join(','),
          period_time: getTimeStr(props.headerParmas?.time)
            ? getTimeStr(props.headerParmas?.time)
            : // eslint-disable-next-line no-undefined
              undefined,
          start_time: getTimeStr(props.headerParmas?.time)
            ? // eslint-disable-next-line no-undefined
              undefined
            : props.headerParmas?.time?.time?.[0],
          end_time: getTimeStr(props.headerParmas?.time)
            ? // eslint-disable-next-line no-undefined
              undefined
            : props.headerParmas?.time?.time?.[1],
          iterate_ids: props?.headerParmas?.iterate_ids?.join(','),
        })
      }

      if (result && result.status === 200) {
        const blob = new Blob([result.body], {
          type: result?.headers['content-type'],
        })
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = `${props?.title}.xlsx`
        a.href = blobUrl
        a.click()
        getMessage({
          msg: '导出成功',
          type: 'success',
        })
      } else {
        getMessage({
          msg: '导出失败',
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 工作进展对比大的列表
  const getWorkContrastList = async (value: number[], page?: any) => {
    const time = props.headerParmas?.time && getTime(props.headerParmas?.time)
    const res = await workContrastList({
      project_ids:
        value.length >= 1
          ? value.join(',')
          : props.headerParmas?.projectIds?.join?.(','),
      iterate_ids: props.headerParmas.iterate_ids?.join(','),
      user_ids: props.headerParmas.users?.join(','),
      period_time: getTimeStr(props.headerParmas?.time),
      start_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : time.startTime,
      end_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : time.endTime,
      page: page?.pageNum || pageNum,
      pagesize: page?.pageSize || pageSize,
    })
    setWork(res.work)
    setTableList(res.list)
    setTotal(res.pager.total)
    setIds(res.list.map(el => el.id))
  }
  // 缺陷分析大的列表
  const getMemberBugList = async (value: number[], page?: any) => {
    const time = getTime(props.headerParmas.time)
    const res = await memberBugList({
      project_ids:
        value.length >= 1 || props.headerParmas?.projectIds?.length
          ? value.length >= 1
            ? value.join(',')
            : props.headerParmas?.projectIds?.join?.(',')
          : // eslint-disable-next-line no-undefined
            undefined,
      iterate_ids: props.headerParmas.iterate_ids?.length
        ? props.headerParmas.iterate_ids?.join(',')
        : // eslint-disable-next-line no-undefined
          undefined,
      user_ids: props.headerParmas.users?.length
        ? props.headerParmas.users?.join(',')
        : // eslint-disable-next-line no-undefined
          undefined,
      period_time: getTimeStr(props.headerParmas?.time),
      start_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : time.startTime,
      end_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : time.endTime,
      page: page?.pageNum || pageNum,
      pagesize: page?.pageSize || pageSize,
    })
    setWork(res.defect)
    setTableList1(res.list)
    setTotal(res.pager.total)
    setIds(res.list.map(el => el.id))
  }
  // 后半截详情弹窗
  const openDetail = (event: any, row: { id: number }, str: string) => {
    console.log(str)
    setTableBeforeAndAfter('after')
    event.stopPropagation()
    dispatch(setVisiblePerson(true))
    getUserInfo(row.id)
    setStatusType(str)
    const parmas = {
      user_id: row.id,
      type: str,
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : // eslint-disable-next-line no-undefined
          undefined,
      start_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
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
    const res = await historyWorkList({ userId: id })
    setHistoryWorkObj(res)
  }
  // 缺陷分析的前半截
  const getHistoryDefectList = async (id: number) => {
    const res = await historyDefectList({ userId: id })
    setHistoryWorkObj(res)
  }

  // 后半截的详情弹窗上半截的获取用户信息
  const getUserInfo = async (id: number) => {
    const res = await plugSelectionUserInfo({ user_id: id, project_ids: 0 })
    setUserInfo(res.userInfo)
    setStatus(res.status)
  }
  // 获取后半截进展对比的列表
  const getEfficiencyMemberWorkList = async (
    parmas: API.Sprint.EfficiencyMemberWorkList.Params,
  ) => {
    const res = await efficiencyMemberWorkList(parmas)
    setMemberWorkList(res)
  }
  // 获取后半截缺陷的列表
  const getEfficiencyMemberDefectList = async (
    parmas: API.Sprint.EfficiencyMemberWorkList.Params,
  ) => {
    const res = await efficiencyMemberDefectList(parmas)
    setMemberWorkList(res)
  }
  // 详情塞选项的回调
  const plugSelection = (val: API.Sprint.EfficiencyMemberWorkList.Params) => {
    const parmas = {
      ...val,
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : // eslint-disable-next-line no-undefined
          undefined,
      start_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : props.headerParmas?.time?.time?.[1],
    }
    console.log(parmas, 'parmas')
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  // 获取后半截缺陷的列表
  // getEfficiencyMemberDefectList
  // 获取后半截缺陷的列表
  // getEfficiencyMemberDefectList
  // 弹窗详情的翻页查询
  const onPageNum = (id: number) => {
    //
    const parmas = {
      user_id: id,
      type: statusType,
      period_time: getTimeStr(props.headerParmas?.time)
        ? getTimeStr(props.headerParmas?.time)
        : // eslint-disable-next-line no-undefined
          undefined,
      start_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : props.headerParmas?.time?.time?.[0],
      end_time: getTimeStr(props.headerParmas?.time)
        ? // eslint-disable-next-line no-undefined
          undefined
        : props.headerParmas?.time?.time?.[1],
    }
    // 前半截是一个接口，后半截是两个接口
    if (props.type.includes('Progress')) {
      if (tableBeforeAndAfter === 'after') {
        getEfficiencyMemberWorkList(parmas)
        getUserInfo(id)
      } else {
        getDatail({ id })
      }
    } else {
      if (tableBeforeAndAfter === 'after') {
        getEfficiencyMemberDefectList(parmas)
        getUserInfo(id)
      } else {
        getDatail({ id })
      }
    }
  }
  useEffect(() => {
    dispatch(setVisiblePerson(false))
    dispatch(setVisibleWork(false))
  }, [])
  return (
    <div
      style={{ height: '100%', width: '100%' }}
      onClick={() => {
        dispatch(setVisiblePerson(false)), dispatch(setVisibleWork(false))
      }}
    >
      <HeaderAll
        homeType={props.homeType}
        projectId={props.projectId}
        onGetExportApi={onGetExportApi}
        onSearchData={onSearchData}
        type={props.type}
        headerParmas={props.headerParmas}
        projectDataList={props.projectDataList}
      />
      {/* 表格 */}
      <Col>
        <TitleCss>{props.title}</TitleCss>
      </Col>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        {work?.map((el, index) => (
          <>
            <PersonText>
              {el.name}: {el.value}
              {el.unit}
            </PersonText>
            {index !== work?.length - 1 && <Line />}
          </>
        ))}
      </div>
      <TableStyle>
        <Table
          paginationShow={true}
          columns={columns}
          dataSource={
            props.type === 'Progress_iteration' ||
            props.type === 'Progress_sprint' ||
            props.type === 'Progress_all'
              ? tableList
              : tableList1
          }
          isSpinning={false}
          data={{
            currentPage: pageNum,
            total: total,
            pageSize: pageSize,
          }}
          onChangePage={(pageNum, pageSize) => {
            setPageNum(pageNum)
            setPageSize(pageSize)
            props.type === 'Progress_iteration' ||
            props.type === 'Progress_sprint' ||
            props.type === 'Progress_all'
              ? getWorkContrastList(selectProjectIds, { pageNum, pageSize })
              : getMemberBugList(selectProjectIds, { pageNum, pageSize })
          }}
        />
      </TableStyle>
      {/* 后半截的弹窗 */}
      <WorkItem
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
        title={'导出成功'}
        text={'Excel导出成功，可在本地打开文件查看'}
        isVisible={isVisibleSuccess}
        onConfirm={() => {
          setIsVisibleSuccess(false)
        }}
        onChangeVisible={() => setIsVisibleSuccess(false)}
      />
    </div>
  )
}
export default ProgressComparison

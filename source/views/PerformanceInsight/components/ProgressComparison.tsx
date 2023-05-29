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
  efficiencyMemberDefectList,
  efficiencyMemberWorkList,
  historyWorkList,
  memberBugList,
  plugSelectionUserInfo,
  workContrastList,
} from '@/services/efficiency'
import { RowText } from './style'
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
}
const ProgressComparison = (props: Props) => {
  console.log(props, 'props--------')
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
  const [userInfo, setUserInfo] = useState<Model.Sprint.UserInfo1>({
    id: 0,
    name: '',
    avatar: '',
    departmentName: '',
    positionName: '',
  })
  const [status, setStatus] = useState<Array<Model.Sprint.StatusInfo1> | []>([])
  const { visiblePerson, visibleWork } = useSelector(
    store => store.performanceInsight,
  )
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [memberWorkList, setMemberWorkList] =
    useState<API.Sprint.EfficiencyMemberWorkList.Result>()
  const [statusType, setStatusType] = useState('')
  const [ids, setIds] = useState<number[]>([])
  const [historyWorkObj, setHistoryWorkObj] =
    useState<API.Efficiency.historyWorkList.Result>()
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    // props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }
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
              dispatch(setVisibleWork(!visibleWork))
              getDatail(record)
            }}
          >
            {text}
          </RowText>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="departmentName"
          nowKey={order.key}
          order={order.value}
          title={'组织'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'departmentName',
    },
    {
      title: '职务',
      dataIndex: 'positionName',
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
      title: '工作进度',
      dataIndex: 'work_progress',
    },
    {
      title: '工作进度率',
      dataIndex: '',
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
              dispatch(setVisibleWork(!visibleWork))
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
      title: (
        <NewSort
          fixedKey="departmentName"
          nowKey={order.key}
          order={order.value}
          title={'组织'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'departmentName',
    },
    {
      title: '职务',
      dataIndex: 'positionName',
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
      title: '总工作进度',
      dataIndex: 'work_progress',
    },
    {
      title: '总工作进度率',
      dataIndex: 'storyPrefixKey',
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
              dispatch(setVisibleWork(!visiblePerson))
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
      dataIndex: 'repeat_open_rate',
      title: getTitleTips('缺陷重开', '当期重开缺陷/当期总缺陷*100%'),
      render: (text: string, record: any) => {
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
          <RowText onClick={e => openDetail(e, record, 'repeat_open')}>
            {text}
          </RowText>
        )
      },
    },
    {
      dataIndex: 'stock_risk',
      title: getTitleTips('缺陷存量', '当期未修复缺陷'),
      render: (text: string, record: any) => {
        return (
          <RowText onClick={e => openDetail(e, record, 'risk')}>{text}</RowText>
        )
      },
    },
  ]
  useEffect(() => {
    // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
    //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
    if (props.type.includes('Progress')) {
      getWorkContrastList()
      // getMemberBugList()
    } else {
      getMemberBugList()
    }
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
  // 工作进展对比列表
  const getWorkContrastList = async () => {
    const res = await workContrastList({
      project_ids: [1, 2],
      iterate_ids: [12, 23],
      user_ids: [1, 23, 44],
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
    })
    setWork(res.work)
    setTableList(res.list)
    setTotal(res.pager.total)
    // setIds(res.list.map(el => el.id))
    setIds([1, 3, 4])
  }
  // 缺陷分析列表
  const getMemberBugList = async () => {
    const res = await memberBugList({
      project_ids: [1, 2],
      iterate_ids: [12, 23],
      user_ids: [1, 23, 44],
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
    })
    setWork(res.defect)
    setTableList1(res.list)
    setTotal(res.pager.total)
    // setIds(res.list.map(el => el.id))
    setIds([1, 3, 4])
  }
  // 后半截详情弹窗
  const openDetail = (event: any, row: { id: number }, str: string) => {
    event.stopPropagation()
    dispatch(setVisiblePerson(!visiblePerson))
    getUserInfo(row.id)
    setStatusType(str)
    const parmas = {
      user_id: row.id,
      type: str,
    }
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  // 前半截详情的弹窗
  const getDatail = (row: { id: number }) => {
    getHistoryWorkList(row.id)
  }
  // 进展对比的前半截api
  const getHistoryWorkList = async (id: number) => {
    const res = await historyWorkList({ id })
    console.log(res, 'oooo')
    setHistoryWorkObj(res)
  }

  // 获取用户信息
  const getUserInfo = async (id: number) => {
    const res = await plugSelectionUserInfo({ id })
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
  const plugSelection = (
    parmas: API.Sprint.EfficiencyMemberWorkList.Params,
  ) => {
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  // 弹窗详情的翻页查询
  const onPageNum = (id: number) => {
    getUserInfo(id)
    const parmas = {
      user_id: id,
      type: statusType,
    }
    if (props.type.includes('Progress')) {
      getEfficiencyMemberWorkList(parmas)
    } else {
      getEfficiencyMemberDefectList(parmas)
    }
  }
  return (
    <div
      style={{ height: '100%' }}
      onClick={() => {
        dispatch(setVisiblePerson(false)), dispatch(setVisibleWork(false))
      }}
    >
      <HeaderAll
        time="2023-08-08 ~ 2023-09-08"
        personData={[{ name: '123' }]}
        type={props.type}
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
        onChange={obj => plugSelection(obj)}
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
    </div>
  )
}
export default ProgressComparison

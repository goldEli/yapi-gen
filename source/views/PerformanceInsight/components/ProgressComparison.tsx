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
  memberBugList,
  plugSelectionUserInfo,
  workContrastList,
} from '@/services/sprint'
import { getUserInfoAbeyanceStory } from '@/services/memberInfo'
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={(event: any) => {
              event.stopPropagation()
              dispatch(setVisibleWork(!visibleWork))
            }}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '已完成工作项',
      dataIndex: 'completed',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '工作项存量',
      dataIndex: 'work_stock',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'risk',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={(event: any) => {
              dispatch(setVisibleWork(!visibleWork))
              event.stopPropagation()
            }}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '当前已完成工作项',
      dataIndex: 'completed',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '总工作项存量',
      dataIndex: 'work_stock',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'risk',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={(event: any) => {
              event.stopPropagation()
              dispatch(setVisibleWork(!visiblePerson))
            }}
          >
            {text}
          </div>
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
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '修复中',
      dataIndex: 'fixing',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '已完成',
      dataIndex: 'fixed',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'repeat_open_rate',
      title: getTitleTips('缺陷重开', '当期重开缺陷/当期总缺陷*100%'),
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '缺陷重开率',
      dataIndex: 'storyPrefixKey',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'stock_risk',
      title: getTitleTips('缺陷存量', '当期未修复缺陷'),
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={e => openDetail(e, record)}
          >
            {text}
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
    //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
    if (props.type.includes('Progress')) {
      getWorkContrastList()
      getMemberBugList()
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
  // 工作进展对比
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
  }
  // 缺陷分析
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
  }
  // 详情弹窗
  const openDetail = (event: any, row: { id: number }) => {
    console.log(row, '9999')
    event.stopPropagation()
    dispatch(setVisiblePerson(!visiblePerson))
    getUserInfo(row.id)
  }
  // 获取用户信息
  const getUserInfo = async (id: number) => {
    const res = await plugSelectionUserInfo({ id })
    setUserInfo(res.userInfo)
    setStatus(res.status)
  }
  return (
    <div
      style={{ height: '100%' }}
      onClick={() => {
        dispatch(setVisiblePerson(false)), dispatch(setVisibleWork(false))
      }}
    >
      {props.type}
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
      {/* 选择人员 */}
      <WorkItem
        visible={visiblePerson}
        ids={[1, 2, 3]}
        status={status}
        userInfo={userInfo}
        onCancel={() => {
          dispatch(setVisiblePerson(!visiblePerson))
        }}
      />
      {/* 新增工作项 */}
      <SelectPersonnel
        type={props.type}
        visible={visibleWork}
        ids={[1, 2, 3]}
        id={2}
        onCancel={() => dispatch(setVisibleWork(!visibleWork))}
      />
    </div>
  )
}
export default ProgressComparison

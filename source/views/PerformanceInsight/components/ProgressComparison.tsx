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
// setVisiblePerson, setVisibleWork
import { setVisiblePerson, setVisibleWork } from '@store/performanceInsight'
import { useDispatch, useSelector } from '@store/index'
// 进展对比
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
  data: Array<Model.Sprint.WorkListItem>
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
  const { visiblePerson, visibleWork } = useSelector(
    store => store.performanceInsight,
  )
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    // props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }
  // 进展工作对比迭代和冲刺的
  const columns1 = [
    {
      dataIndex: 'user',
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
          fixedKey="story_prefix_key"
          nowKey={order.key}
          order={order.value}
          title={'组织'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '职务',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
      title: getTitleTips('完成率', '已完成工作项/新增工作项*100%'),
    },
    {
      dataIndex: 'user',
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
      title: '工作项存量',
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
      title: '工作进度',
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '工作进度率',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
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
      dataIndex: 'user',
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
      dataIndex: 'user',
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
          fixedKey="story_prefix_key"
          nowKey={order.key}
          order={order.value}
          title={'组织'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '职务',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
      title: getTitleTips('当前完成率', '已完成工作项/新增工作项*100%'),
    },
    {
      dataIndex: 'user',
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
      title: '总工作项存量',
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
      title: '总工作进度',
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '总工作进度率',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
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
      dataIndex: 'user',
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
      dataIndex: 'user',
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
      dataIndex: 'storyPrefixKey',
    },
    {
      title: (
        <NewSort
          fixedKey="story_prefix_key"
          nowKey={order.key}
          order={order.value}
          title={'职务'}
          onUpdateOrderKey={onUpdateOrderKey}
        ></NewSort>
      ),
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
      title: getTitleTips('缺陷修复率', '当期已修复缺陷/档期总缺陷*100%'),
    },
    {
      title: '待修复',
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
      title: '修复中',
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
      title: '已完成',
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
      dataIndex: 'user',
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
      dataIndex: 'user',
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
  const openDetail = (event: any, row: any) => {
    event.stopPropagation()
    dispatch(setVisiblePerson(!visiblePerson))
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
        {props.data.map((el, index) => (
          <>
            <PersonText>
              {el.name}: {el.value}
              {el.unit}
            </PersonText>
            {index !== props.data.length - 1 && <Line />}
          </>
        ))}
      </div>
      <TableStyle>
        <Table
          paginationShow={true}
          columns={columns}
          dataSource={[{ user: '123' }]}
          isSpinning={false}
          data={{
            currentPage: 2,
            total: 80,
            pageSize: 20,
          }}
          onChangePage={(pageNum, pageSize) =>
            console.log(pageNum, pageSize, 9898)
          }
        />
      </TableStyle>
      {/* 选择人员 */}
      <WorkItem
        visible={visiblePerson}
        ids={[1, 2, 3]}
        id={2}
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

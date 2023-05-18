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
// 进展对比
const getTitleTips = (text: string, tips: string) => {
  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {text}
      <Tooltip title={tips} trigger="click" defaultOpen>
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
  // 进展对比 Progress0-迭代 Progress1冲刺 ProgressAll全局 //缺陷 Defect0-迭代 Defect1冲刺 DefectAll全局
  type: string
  title: string
}
const ProgressComparison = (props: Props) => {
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
  const [visible, setVisible] = useState<boolean>(false)
  const [isvisible, setIsvisible] = useState<boolean>(false)
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
            onClick={() => {
              setIsvisible(!isvisible)
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
            onClick={() => openDetail(record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '已完成工作项',
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '工作项存量',
      dataIndex: 'storyPrefixKey',
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
    },
    {
      dataIndex: 'user',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
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
            onClick={() => {
              setIsvisible(!isvisible)
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
            onClick={() => openDetail(record)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '当前已完成工作项',
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '总工作项存量',
      dataIndex: 'storyPrefixKey',
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
    },
    {
      dataIndex: 'user',
      title: getTitleTips('存量风险', '（当期）超过14天未完成的工作项'),
    },
  ]
  // 缺陷迭代和冲刺的
  const columns3 = [
    {
      dataIndex: 'user',
      title: '用户',
      render: (text: string, record: any) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => {
              setIsvisible(!isvisible)
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
    },
    {
      title: '修复中',
      dataIndex: 'storyPrefixKey',
    },
    {
      title: '已完成',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
      title: getTitleTips('缺陷重开', '当期重开缺陷/当期总缺陷*100%'),
    },
    {
      title: '缺陷重开率',
      dataIndex: 'storyPrefixKey',
    },
    {
      dataIndex: 'user',
      title: getTitleTips('缺陷存量', '当期未修复缺陷'),
    },
  ]
  useEffect(() => {
    // 进展对比 Progress0-迭代 Progress1冲刺 ProgressAll全局
    //缺陷 Defect0-迭代 Defect1冲刺 DefectAll全局
    switch (props.type) {
      case 'Progress0':
        setColumns(columns1)
        break
      case 'Progress1':
        setColumns(columns1)
        break
      case 'ProgressAll':
        setColumns(columns2)
        break
      case 'Defect0':
        setColumns(columns3)
        break
      case 'Defect1':
        setColumns(columns3)
        break
      case 'DefectAll':
        setColumns(columns3)
        break
    }
  }, [])
  const openDetail = (row: any) => {
    setVisible(!visible)
  }
  return (
    <>
      <HeaderAll
        time="2023-08-08 ~ 2023-09-08"
        personData={[{ name: '123' }]}
      />
      {/* 表格 */}
      <Col>
        <TitleCss>{props.title}</TitleCss>
      </Col>
      {/* // 进展对比 Progress0-迭代 Progress1冲刺 ProgressAll全局
    //缺陷 Defect0-迭代 Defect1冲刺 DefectAll全局 */}
      {/* 迭代和冲刺的 */}
      {(props.type === 'Progress0' || props.type === 'Progress1') && (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}
        >
          <PersonText>完成率：30%</PersonText>
          <Line />
          <PersonText>新增：40项</PersonText>
          <Line />
          <PersonText>已完成：40项</PersonText>
          <Line />
          <PersonText>工作项存量：100项</PersonText>
          <Line />
          <PersonText>工作项重复率：100%</PersonText>
          <Line />
          <PersonText>存量风险：30项</PersonText>
        </div>
      )}
      {/* 全局的 */}
      {props.type === 'ProgressAll' && (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}
        >
          <PersonText>总完成率：30%</PersonText>
          <Line />
          <PersonText>当前新增：40项</PersonText>
          <Line />
          <PersonText>当前已完成：40项</PersonText>
          <Line />
          <PersonText>总工作项存量：100项</PersonText>
          <Line />
          <PersonText>存量风险：30项</PersonText>
        </div>
      )}
      {(props.type === 'Defect0' || props.type === 'Defect1') && (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}
        >
          <PersonText>缺陷修复率：30%</PersonText>
          <Line />
          <PersonText>待修复：40项</PersonText>
          <Line />
          <PersonText>进行中：40项</PersonText>
          <Line />
          <PersonText>已完成：100项</PersonText>
          <Line />
          <PersonText>缺陷存量：30%</PersonText>
          <Line />
          <PersonText>缺陷重开率：30%</PersonText>
          <Line />
          <PersonText>存量风险：30项</PersonText>
        </div>
      )}
      {props.type === 'DefectAll' && (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}
        >
          <PersonText>总缺陷修复率：30%</PersonText>
          <Line />
          <PersonText>待修复：40项</PersonText>
          <Line />
          <PersonText>进行中：40项</PersonText>
          <Line />
          <PersonText>已完成：100项</PersonText>
          <Line />
          <PersonText>缺陷存量：30%</PersonText>
          <Line />
          <PersonText>缺陷重开率：30%</PersonText>
          <Line />
          <PersonText>存量风险：30项</PersonText>
        </div>
      )}
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
      {/* 新增工作项 */}
      <WorkItem
        visible={visible}
        ids={[1, 2, 3]}
        id={2}
        onCancel={() => setVisible(false)}
      />
      {/* 选择人员 */}
      <SelectPersonnel
        type={props.type}
        visible={isvisible}
        ids={[1, 2, 3]}
        id={2}
        onCancel={() => setIsvisible(false)}
      />
    </>
  )
}
export default ProgressComparison

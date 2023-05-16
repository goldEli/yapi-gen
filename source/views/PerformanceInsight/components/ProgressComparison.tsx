/* eslint-disable react/jsx-handler-names */
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import {
  HeaderRowBox,
  Back,
  RightRow,
  PersonText,
  TitleCss,
  Col,
  Line,
  TableStyle,
} from '../Header/Style'
import Share from '../Header/components/Share'
import { useState } from 'react'
import Export from '../Header/components/Export'
import ExportSuccess from '../Header/components/ExportSuccess'
import Sort from '@/components/Sort'
import Table from './Table'
import { Tooltip } from 'antd'
import WorkItem from './WorkItem'
// 进展对比
interface HaderProps {
  time: string
  personData: Array<{
    name: string
    id?: number
  }>
}
const Header = (props: HaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleSuccess, setIsVisibleSuccess] = useState<boolean>(false)
  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => 123}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text">返回</span>
        </Back>
        <RightRow>
          <PersonText>
            {' '}
            {props.personData?.length ? (
              <span>已选 ({props.personData?.length}人)</span>
            ) : (
              <span>已选 0</span>
            )}
          </PersonText>
          <Line />
          <PersonText>统计时间：{props.time}</PersonText>
          <Back
            onClick={() => setIsVisible(true)}
            style={{ margin: '0 16px 0 24px' }}
          >
            <CommonIconFont type="share" size={16} />
            <span className="text">分享</span>
          </Back>
          <CommonButton type="primary" onClick={() => setIsOpen(true)}>
            <CommonIconFont type="export" size={16} />
            导出
          </CommonButton>
        </RightRow>
      </HeaderRowBox>
      {/* 分享  save代表是否保存的值*/}
      <Share
        title="分享"
        save={true}
        isVisible={isVisible}
        onConfirm={() => {
          setIsVisible(false)
        }}
        onClose={() => setIsVisible(false)}
      />
      {/* 导出 */}
      <Export
        time={'2023-03-01 ~ 2023-03-14'}
        title="按周期导出"
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false), setIsVisibleSuccess(true)
        }}
        personData={[{ name: '123' }]}
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
    </>
  )
}

const getTitle = (text: string, tips: string) => {
  return (
    <>
      {text}
      <Tooltip title={tips} trigger="click" defaultOpen>
        <CommonIconFont type="question" size={16} />
      </Tooltip>
    </>
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
const ProgressComparison = () => {
  const [order, setOrder] = useState<{ value: string; key: string }>({
    value: '',
    key: '',
  })
  const [visible, setVisible] = useState<boolean>(false)
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    // props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const columns = [
    {
      dataIndex: 'user',
      title: '用户',
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
      dataIndex: 'user',
      title: getTitle('完成率', '123'),
    },
  ]
  const openDetail = (row: any) => {
    console.log(row, 'oo')
    setVisible(!visible)
  }
  return (
    <>
      <Header time="2023-08-08 ~ 2023-09-08" personData={[{ name: '123' }]} />
      {/* 表格 */}
      <Col>
        <TitleCss>工作进展对比</TitleCss>
      </Col>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
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
      <WorkItem visible={visible} ids={[1, 2, 3]} id={2} />
    </>
  )
}
export default ProgressComparison

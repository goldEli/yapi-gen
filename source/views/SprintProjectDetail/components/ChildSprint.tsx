import CommonButton from '@/components/CommonButton'
import {
  AddText,
  CancelText,
  InfoItem,
  InfoItemWrap,
  Label,
  LabelWrap,
  ProgressWrap,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { CloseWrap } from '@/components/StyleCommon'
import { useState } from 'react'
import { Space, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'

const ChildSprint = () => {
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dataSource, setDataSource] = useState<any>({
    list: [
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 0,
      },
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 1,
      },
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 2,
      },
    ],
  })

  //   取消搜索
  const onCancelSearch = () => {
    setSearchValue('')
    setIsSearch(false)
  }

  const options = [
    { label: '事务1', value: 1 },
    { label: '事务2', value: 2 },
    { label: '事务3', value: 3 },
  ]

  const onChangeSelect = (value: any) => {
    console.log(value, '121212')
  }

  const columns = [
    {
      title: '',
      dataIndex: 'number',
      render: (text: any, record: any) => <div>DXKJ-256</div>,
    },
    {
      title: '',
      dataIndex: 'name',
      render: (text: any) => <div>事务名称</div>,
    },
    {
      title: '',
      dataIndex: 'priority',
      render: (text: any, record: any) => <div>优先级</div>,
    },
    {
      title: '',
      dataIndex: 'dealName',
      render: (text: any, record: any) => <div>处理人</div>,
    },
    {
      title: '',
      dataIndex: 'status',
      render: (text: string, record: any) => (
        <StateTag name="进行中" state={1} />
      ),
    },
  ]

  return (
    <InfoItem>
      <LabelWrap>
        <Label>子事务</Label>
        {!isSearch && (
          <CloseWrap width={24} height={24} onClick={() => setIsSearch(true)}>
            <CommonIconFont type="search" />
          </CloseWrap>
        )}
        {isSearch && (
          <Space size={16}>
            <CustomSelect
              placeholder="搜索事务名称或编号"
              getPopupContainer={(node: any) => node}
              style={{ width: 184 }}
              options={options}
              showSearch
              showArrow
              optionFilterProp="label"
              onChange={onChangeSelect}
              mode="multiple"
              allowClear
            />
            <AddText>添加</AddText>
            <CancelText onClick={onCancelSearch}>取消</CancelText>
          </Space>
        )}
      </LabelWrap>

      <InfoItemWrap>
        <CommonButton type="primaryText" icon="plus">
          创建子事务
        </CommonButton>
        <Tooltip title="3 done / 3 in progress / 4 to do">
          <ProgressWrap
            percent={60}
            success={{ percent: 20, strokeColor: 'var(--primary-d1)' }}
            format={percent => `已完成${percent}%`}
            trailColor="rgba(102, 136, 255, 0.1)"
            strokeColor="rgba(102, 136, 255, 0.4)"
          />
        </Tooltip>
        <DragTable
          columns={columns}
          dataSource={dataSource}
          onChangeData={setDataSource}
        />
      </InfoItemWrap>
    </InfoItem>
  )
}

export default ChildSprint

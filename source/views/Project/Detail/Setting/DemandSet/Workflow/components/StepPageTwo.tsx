/* eslint-disable max-len */
import styled from '@emotion/styled'
import { Table, Space, Checkbox } from 'antd'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { useMemo, useState } from 'react'
import SetConfig from './SetConfig'

const TableWrap = styled.div({
  width: '100%',
  maxHeight: 'calc(100% - 198px)',
  overflowY: 'auto',
})

const TextWrap = styled.div({
  marginTop: 8,
  color: '#969799',
  fontSize: 12,
  fontWeight: 400,
})

const data = [
  {
    name: '从【规划中】流转到',
    id: 1,
    checked: ['1'],
  },
  {
    name: '从【实现中】流转到',
    id: 1,
    checked: ['1'],
  },
  {
    name: '从【已实现】流转到',
    id: 1,
    checked: ['1'],
  },
]
const statusList = [
  { name: '规划中', key: '1' },
  { name: '实现中', key: '2' },
  { name: '已完成', key: '3' },
  { name: '已关闭', key: '4' },
]

const StepPageTwo = () => {
  const [dataList, setDataList] = useState<any>(data)
  const [isVisible, setIsVisible] = useState(false)

  const onUpdate = () => {

    // 更新列表
  }

  const setColumns: any = useMemo(() => {
    const arr = [
      {
        title: '状态名称',
        width: 200,
        dataIndex: 'name',
        render: (text: any, record: any) => <OmitText width={180}>{text}</OmitText>
        ,
      },
    ]
    statusList?.forEach((i: any) => {
      arr.push({
        title: i.name,
        width: 120,
        dataIndex: i.key,
        render: (text: any, record: any) => (
          <Space size={16}>
            <Checkbox />
            <IconFont
              onClick={() => setIsVisible(true)}
              style={{ color: '#BBBDBF', cursor: 'pointer', fontSize: 16 }}
              type="settings"
            />
          </Space>
        ),
      })
    })
    return arr
  }, [statusList])

  return (
    <>
      <SetConfig
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onUpdate={onUpdate}
      />
      <TableWrap>
        <Table
          pagination={false}
          dataSource={dataList}
          columns={setColumns as any}
          sticky
        />
      </TableWrap>
      <TextWrap>
        工作流流转设置，是设置工作流各状态间的先后流转关系。如果需要设置该流转，请在两个状态间的复选框内打勾
      </TextWrap>
      <TextWrap>注：点击图标，可以设置流转的附加字段及授权用户。</TextWrap>
    </>
  )
}

export default StepPageTwo

import { ToolBarBox, RightWrap } from '@/views/Encephalogram/styles'
import Tabs from '@/components/Tabs'
import { Divider, Select, Space } from 'antd'
import IconFont from '@/components/IconFont'
import { useDispatch } from 'react-redux'
import { setEncephalogramParmas } from '@store/encephalogram'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { CommonIconFont } from '@/components/CommonIconFont'
const Btn = styled.div`
  height: 32px;
  border-radius: 0px 0px 0px 0px;
  padding-left: 16px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 32px;
  cursor: pointer;
`
const SelectWrap = styled(Select)`
   border:none;
   text-align: end;
   background:#fff;
  & .ant-select-clear ,& .ant-select-arrow{
    visibility: hidden;
  }
`
const ToolBar = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('50%')
  useEffect(() => {
    dispatch(setEncephalogramParmas({ activeType: 0 }))
  }, [])
  const onChange = (id: number) => {
    dispatch(setEncephalogramParmas({ activeType: id }))
  }
  const items = [
    {
      label: '25%',
      value: '25',
    },
    {
      label: '50%',
      value: '50',
    },
    {
      label: '75%',
      value: '75%',
    },
    {
      label: '100%',
      value: '100%',
    },
    {
      label: '125%',
      value: '125%',
    },
    {
      label: '150%',
      value: '150%',
    },
    {
      label: '175%',
      value: '175%',
    },
    {
      label: '200%',
      value: '200',
    },
  ]
  const handleChange = (val:string) => {
    console.log(val)
    setValue(val)
  }
  return (
    <ToolBarBox className='toolBar'>
      <RightWrap type="1">
        <Tabs
          tabsValue={[
            {
              text: '按人员',
              id: 0,
            },
            {
              text: '按任务',
              id: 1,
            },
          ]}
          active={0}
          onChange={onChange}
        />
      </RightWrap>
      <RightWrap type="2">
        <Space size={16}>
          <IconFont
            type="fewer-screen"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
            }}
          />
          <IconFont
            type="sync"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span className="line" />
        </Space>
        <Space size={10}>
          <IconFont
            type="zoomin"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <SelectWrap
            showArrow
            options={items}
            style={{ width: '100%' }}
            maxTagCount={1}
            allowClear
            value={value}
            getPopupContainer={(triggerNode: any) => {
              return triggerNode.parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode
            }}
            optionFilterProp="label"
            onChange={(val:any)=>handleChange(val)}
            placement="bottomRight"
            dropdownMatchSelectWidth={160}
            menuItemSelectedIcon={
              <CommonIconFont type="check" color="var(--primary-d1)" />
            }
            dropdownRender={(menu: any) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Btn onClick={()=>handleChange('5%')}>增加5%</Btn>
                <Btn onClick={()=>handleChange('-5%')}>减小5%</Btn>
              </>
            )}
          />
          <IconFont
            type="reduce"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span className="line" />
        </Space>
        <IconFont
          type="download"
          style={{ fontSize: 24, color: 'var(--neutral-n2)' }}
        />
      </RightWrap>
    </ToolBarBox>
  )
}

export default ToolBar

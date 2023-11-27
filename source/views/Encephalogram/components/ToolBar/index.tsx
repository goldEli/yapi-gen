import { ToolBarBox, RightWrap } from '@/views/Encephalogram/styles'
import Tabs from '@/components/Tabs'
import { Divider, Select, Space, Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import html2canvas from 'html2canvas'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode, onFullScreenMode } from '@store/kanBan/kanBan.thunk'
import { useEffect, useState } from 'react'
import { setEncephalogramParams, setExtraParams } from '@store/encephalogram'
import styled from '@emotion/styled'

import _ from 'lodash'

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
  border: none;
  text-align: end;
  background: #fff;
  & .ant-select-clear,
  & .ant-select-arrow {
    visibility: hidden;
  }
`
const ToolBar = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState<any>(1)
  const { fullScreen } = useSelector(store => store.kanBan)
  const { encephalogramParams, extraParams } = useSelector(
    store => store.encephalogram,
  )
  const onChange = (id: number) => {
    dispatch(setEncephalogramParams({ group_by: id === 0 ? 'user' : 'task' }))
  }
  const items = [
    {
      label: '25%',
      value: 0.25,
    },
    {
      label: '50%',
      value: 0.5,
    },
    {
      label: '75%',
      value: 0.75,
    },
    {
      label: '100%',
      value: 1,
    },
    {
      label: '125%',
      value: 1.25,
    },
    {
      label: '150%',
      value: 1.5,
    },
    {
      label: '175%',
      value: 1.75,
    },
    {
      label: '200%',
      value: 2,
    },
  ]
  const handleChange = (val: number) => {
    dispatch(setExtraParams({ num: val }))
    setValue(val)
  }

  const downloadImage = _.debounce(() => {
    const div: any = document.querySelector('#MapContentMountNode')
    html2canvas(div, {
      allowTaint: true,
      backgroundColor: '#fff',
      scale: 5,
      useCORS: true,
    })
      .then((canvas: { toDataURL: (arg0: string) => any }) => {
        const imgData = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = imgData
        downloadLink.download = 'exported-png.png'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        getMessage({
          msg: '导出成功',
          type: 'success',
        })
      })
      .catch(() => {
        getMessage({
          msg: '导出失败',
          type: 'error',
        })
      })
  })
  const handleChangeAdd = () => {
    const val = extraParams.num + 0.05

    dispatch(setExtraParams({ num: val, numType: 'click' }))
  }
  const handleChangeReduce = () => {
    const val = extraParams.num - 0.05
    if (val < 0.2) {
      return
    }
    dispatch(setExtraParams({ numType: 'click', num: val }))
  }
  const onRefresh = _.debounce(() => {
    dispatch(
      setExtraParams({
        refresh: extraParams.refresh + 1,
      }),
    )
  }, 500)
  useEffect(() => {
    setValue(`${Math.trunc(extraParams.num * 100)}%`)
  }, [extraParams.num])
  return (
    <ToolBarBox className="toolBar">
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
          active={encephalogramParams.group_by === 'user' ? 0 : 1}
          onChange={onChange}
        />
      </RightWrap>
      <RightWrap type="2">
        <Space size={16}>
          <Tooltip placement="top" title={'全屏'}>
            <IconFont
              type="fewer-screen"
              style={{
                fontSize: 24,
                color: 'var(--neutral-n2)',
              }}
              onClick={() => {
                if (fullScreen) {
                  dispatch(offFullScreenMode())
                } else {
                  dispatch(onFullScreenMode())
                }
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title={'刷新'}>
            <IconFont
              type="sync"
              style={{
                fontSize: 24,
                color: 'var(--neutral-n2)',
                margin: '0 4px',
              }}
              onClick={onRefresh}
            />
          </Tooltip>
          <span className="line" />
        </Space>
        <Space size={10}>
          <Tooltip placement="top" title={'缩小'}>
            <IconFont
              onClick={handleChangeReduce}
              type="reduce"
              style={{
                fontSize: 24,
                color: 'var(--neutral-n2)',
                margin: '0 4px',
              }}
            />
          </Tooltip>
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
            onChange={(val: any) => handleChange(val)}
            placement="bottomRight"
            dropdownMatchSelectWidth={160}
            dropdownRender={(menu: any) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Btn onClick={handleChangeAdd}>增加5%</Btn>
                <Btn onClick={handleChangeReduce}>减小5%</Btn>
              </>
            )}
          />
          <Tooltip placement="top" title={'放大'}>
            <IconFont
              onClick={handleChangeAdd}
              type="zoomin"
              style={{
                fontSize: 24,
                color: 'var(--neutral-n2)',
                margin: '0 4px',
              }}
            />
          </Tooltip>
          {/* <span className="line" /> */}
        </Space>
        {/* <Tooltip placement="top" title={'下载'}>
          <IconFont
            type="download"
            style={{ fontSize: 24, color: 'var(--neutral-n2)' }}
            onClick={downloadImage}
          />
        </Tooltip> */}
      </RightWrap>
    </ToolBarBox>
  )
}

export default ToolBar

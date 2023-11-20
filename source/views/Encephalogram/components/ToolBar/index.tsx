import { ToolBarBox, RightWrap } from '@/views/Encephalogram/styles'
import Tabs from '@/components/Tabs'
import { Space } from 'antd'
import IconFont from '@/components/IconFont'
import { setEncephalogramParmas } from '@store/encephalogram'
import { useEffect } from 'react'
import html2canvas from 'html2canvas'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode, onFullScreenMode } from '@store/kanBan/kanBan.thunk'

const ToolBar = () => {
  const dispatch = useDispatch()
  const { fullScreen } = useSelector(store => store.kanBan)
  useEffect(() => {
    dispatch(setEncephalogramParmas({ activeType: 0 }))
  }, [])
  const onChange = (id: number) => {
    dispatch(setEncephalogramParmas({ activeType: id }))
  }

  const downloadImage = () => {
    const div: any = document.querySelector('#MapContentMountNode')
    html2canvas(div, {
      allowTaint: true,
      backgroundColor: '#fff',
      scale: 5,
      useCORS: true,
    })
      .then(canvas => {
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
  }

  return (
    <ToolBarBox>
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
            onClick={() => {
              if (fullScreen) {
                dispatch(offFullScreenMode())
              } else {
                dispatch(onFullScreenMode())
              }
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
        <Space size={16}>
          <IconFont
            type="zoomin"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span>100%</span>
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
          onClick={downloadImage}
        />
      </RightWrap>
    </ToolBarBox>
  )
}

export default ToolBar

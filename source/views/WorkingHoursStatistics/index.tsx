import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import WorkHoursPanel from './components/WorkHoursPanel'
import { WorkHoursWrap, MianWrap, Line, SprintDetailMouseDom } from './style'
import WorkHoursHeader from './components/WorkHoursHeader'
import TableLeft from './components/TableLeft'
import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import { workTimeList, updateOverdue, workTimeExport } from '@/services/project'
interface IProps {}
const WorkHours: React.FC<IProps> = props => {
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(400)
  const [focus, setFocus] = useState(false)
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [formVal, setFormVal] = useState<any>()
  const [data, setData] = useState<any>([])
  const onInputSearch = (val: any) => {
    console.log(val)
  }
  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)
      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }
  const onSearch = async (val: any) => {
    setFormVal(val)
    const start_at = val.time ? val.time[0] : val.date[0]
    const end_at = val.time ? val.time[1] : val.date[1]
    const parmas = {
      start_at,
      end_at,
      type: val.type,
      project_id: paramsData.id,
      user_ids: val.user_ids?.length >= 1 ? val.user_ids.split(',') : '',
    }
    const res = await workTimeList(parmas)
    setData(res.data.list)
  }
  const updateOverdueApi = async (row: {
    story_id: number
    user_id: number
    normal_reason: number
  }) => {
    const res = await updateOverdue({ ...row, project_id: paramsData.id })
    onSearch(formVal)
  }
  const onGetExport = async (val: any) => {
    const start_at = val.time ? val.time[0] : val.date[0]
    const end_at = val.time ? val.time[1] : val.date[1]
    const parmas = {
      start_at,
      end_at,
      type: val.type,
      project_id: paramsData.id,
      user_ids: val.user_ids?.length >= 1 ? val.user_ids.split(',') : '',
    }
    const result = await workTimeExport(parmas)
    // const blob = new Blob([result.body], {
    //   type: result?.headers['content-type'],
    // })
    // const blobUrl = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.download = `${props?.title}.xlsx`
    // a.href = blobUrl
    // a.click()
  }
  return (
    <WorkHoursWrap>
      <ProjectCommonOperation
        onInputSearch={onInputSearch}
        title={t('search_for_transaction_name_or_number')}
      />

      <WorkHoursHeader
        id={paramsData.id}
        onSearch={onSearch}
        onGetExport={onGetExport}
      />
      <MianWrap>
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: `calc(100% - ${leftWidth}px)`,
          }}
        >
          <TableLeft data={data} updateOverdue={updateOverdueApi} />
        </div>
        <div style={{ position: 'relative', width: leftWidth }}>
          <SprintDetailMouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: 0 }}
          >
            <Line active={focus} className="line"></Line>
          </SprintDetailMouseDom>
          <WorkHoursPanel></WorkHoursPanel>
        </div>
      </MianWrap>
    </WorkHoursWrap>
  )
}
export default WorkHours

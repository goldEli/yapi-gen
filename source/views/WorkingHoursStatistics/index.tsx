import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import WorkHoursPanel from './components/WorkHoursPanel'
import {
  WorkHoursWrap,
  MianWrap,
  Line,
  SprintDetailMouseDom,
  LeftWrap,
} from './style'
import WorkHoursHeader from './components/WorkHoursHeader'
import TableLeft from './components/TableLeft'
import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import { workTimeList, updateOverdue, workTimeExport } from '@/services/project'
import PaginationBox from '@/components/TablePagination'
import { getMessage } from '@/components/Message'
import { Spin } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
interface IProps {}
const WorkHours: React.FC<IProps> = props => {
  const panelRef = useRef<any>()
  const [leftWidth, setLeftWidth] = useState<any>(504)
  const [direction, setDirection] = useState(false)
  const [focus, setFocus] = useState(false)
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [formVal, setFormVal] = useState<any>()
  const [data, setData] = useState<any>([])
  const [pageObj, setPageObj] = useState<any>({
    currentPage: 1,
    pageSize: 15,
  })
  const [spinning, setSpinning] = useState<boolean>(false)
  const [key, setKey] = useState<any>('')
  const [type, setType] = useState<any>(1)
  const [hoverStyle, setHoverStyle] = useState<boolean>(false)
  // eslint-disable-next-line react/hook-use-state
  const [stat, setStat] = useState<any>({
    report: 0,
    total: 0,
    absence: 0,
    leave: 0,
  })
  const [styleStatus, setStyleStatus] = useState('')
  const onInputSearch = (val: any) => {
    setKey(val)
    onSearch(formVal, type, val)
  }

  // 拖动线条
  const onDragLine = () => {
    setHoverStyle(false)
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
  const onSearch = async (
    val: any,
    type: number,
    keyVal?: string,
    page?: number,
    pageSize?: number,
  ) => {
    setFormVal(val)
    setType(type)
    setSpinning(true)
    const start_at = val.time ? val.time[0] : val.date[0]
    const end_at = type === 0 ? start_at : val.time ? val.time[1] : val.date[1]
    const parmas = {
      start_at,
      end_at,
      type: val.type,
      project_id: paramsData.id,
      is_overdue: val.state,
      user_ids:
        val.user_ids?.length >= 1
          ? val.user_ids.join(',')
          : val.user_ids
          ? String(val.user_ids)
          : '',
      page: page ? page : pageObj.currentPage,
      pagesize: pageSize ? pageSize : pageObj.pageSize,
      keyword: keyVal,
      style: val?.style,
    }
    const res = await workTimeList(parmas)
    setPageObj({
      currentPage: res.data.pager.page,
      size: res.data.pager.pagesize,
      total: res.data.pager.total,
    })
    setData(res.data.list)
    setStat(res.data.stat)
    setSpinning(false)
  }
  const updateOverdueApi = async (row: {
    story_id: number
    user_id: number
    normal_reason: number
  }) => {
    await updateOverdue({ ...row, project_id: paramsData.id })
    getMessage({ msg: t('adjustedSuccessfully'), type: 'success' })
    onSearch(formVal, type, key)
  }
  const onGetExport = async (val: any) => {
    const start_at = val.time ? val.time[0] : val.date[0]
    const end_at = type === 0 ? start_at : val.time ? val.time[1] : val.date[1]
    const parmas = {
      start_at,
      end_at,
      type: val.type,
      project_id: paramsData.id,
      is_overdue: val.state,
      user_ids:
        val.user_ids?.length >= 1
          ? val.user_ids.join(',')
          : val.user_ids
          ? String(val.user_ids)
          : '',
      page: pageObj.currentPage,
      pagesize: pageObj.pageSize,
      keyword: key,
    }
    getMessage({ msg: t('exportSucceeded'), type: 'success' })
    const result: any = await workTimeExport(parmas)
    const blob = new Blob([result.body], {
      type: result?.headers['content-type'],
    })
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `工时统计.xlsx`
    a.href = blobUrl
    a.click()
  }
  const onChangePage = (page: number, pageSize: number) => {
    setPageObj({
      currentPage: page,
      size: pageSize,
      total: pageObj.total,
    })
    onSearch(formVal, type, key, page, pageSize)
  }
  return (
    <WorkHoursWrap>
      <ProjectCommonOperation
        onInputSearch={onInputSearch}
        title={t('search_for_transaction_name_or_number')}
      />
      <Spin spinning={spinning}>
        <WorkHoursHeader
          id={paramsData.id}
          onSearch={(val, type) => onSearch(val, type, key)}
          stat={stat}
          onGetExport={onGetExport}
        />
        <MianWrap>
          <LeftWrap
            style={{
              width: `calc(100% - ${leftWidth}px)`,
            }}
          >
            <TableLeft
              data={data}
              updateOverdue={updateOverdueApi}
              type={formVal?.style}
            />
            <div className="openIconBox">
              <CommonIconFont
                type={direction ? 'indent' : 'outdent'}
                size={20}
                onClick={() => {
                  setHoverStyle(true)
                  setLeftWidth(direction ? 504 : window.innerWidth - 300)
                  setDirection(!direction)
                }}
              />
            </div>
          </LeftWrap>
          <div
            style={{
              position: 'relative',
              width: leftWidth,
              height: '100%',
              top: '-12px',
              transition: hoverStyle ? 'all 0.2s ease 0s' : 'none',
            }}
          >
            <SprintDetailMouseDom
              active={focus}
              onMouseDown={onDragLine}
              onMouseLeave={() => setHoverStyle(false)}
              style={{ left: 0 }}
            >
              <Line active={focus} className="line"></Line>
            </SprintDetailMouseDom>
            <WorkHoursPanel
              dataSource={data}
              ref={panelRef}
              onClick={() => {}}
              direction={direction}
              onConfirm={() => {
                onSearch(formVal, type, key)
              }}
              type={type}
              status={formVal?.style}
            />
          </div>
        </MianWrap>
        <PaginationBox
          hasPadding={true}
          currentPage={pageObj?.currentPage}
          pageSize={pageObj?.size}
          total={pageObj?.total}
          onChange={onChangePage}
        />
      </Spin>
    </WorkHoursWrap>
  )
}
export default WorkHours

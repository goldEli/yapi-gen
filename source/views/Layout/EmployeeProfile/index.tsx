import { useEffect, useRef, useState, useMemo } from 'react'
import EmployeeProfileHeader from './components/EmployeeProfileHeader'
import {
  ContentWrap,
  FoldIcon,
  PersonBox,
  RightBox,
  SideMain,
  Wrap,
  NoDataTextWrap,
} from './style'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import EmployeeProfilePerson from './components/EmployeeProfilePerson'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import EmployeeProfileReport from './components/EmployeeProfileReport'
import { useDispatch, useSelector } from '@store/index'
import {
  setCurrentClickNumber,
  setFilterParamsOverall,
} from '@store/employeeProfile'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'
import CommonButton from '@/components/CommonButton'
import EmployeeAffair from './components/EmployeeAffair'
import { getMemberReportList } from '@/services/employeeProfile'
import useUpdateFilterParams from './components/hooks/useUpdateFilterParams'
import EmployeeDefect from './components/EmployeeDefect'
import EmployeeDemand from './components/EmployeeDemand'

const EmployeeProfile = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)

  const { layoutSideCollapse } = useSelector(state => state.global)
  const [leftWidth, setLeftWidth] = useState(320)
  const [endWidth, setEndWidth] = useState(320)
  const [focus, setFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userReportList, setUserReportList] = useState<any>({ list: [] })
  // 人员是否离职
  const [personStatus, setPersonStatus] = useState(false)
  // 第一条日报的第一个需求数据
  const [reportFirstData, setReportFirstData] = useState<any>({
    // 项目id
    project_id: null,
    // 任务id
    id: null,
    // 项目类型
    project_type: null,
    // 是否是缺陷
    is_bug: null,
    // 当前发日报的人
    user_id: 0,
  })
  const [loading, setLoading] = useState(false)
  const sideMain = useRef<any>(null)
  const sliderRef = useRef<any>(null)
  const maxWidth = 600
  const { currentKey, currentClickNumber } = useSelector(
    store => store.employeeProfile,
  )
  const { filterParamsOverall } = useUpdateFilterParams()

  // 卡片列表
  const cardList = [
    {
      name: t('mine.overdue'),
      type: 'red',
      key: 5,
      fieldKey: 'overdue',
    },
    {
      name: t('inProgress'),
      type: 'blue',
      key: 4,
      fieldKey: 'start',
    },
    {
      name: t('toBePlanned'),
      type: 'org',
      key: 3,
      fieldKey: 'un_start',
    },
    {
      name: t('completed'),
      type: 'green',
      key: 2,
      fieldKey: 'completed',
    },
    {
      name: t('all'),
      type: 'purple',
      key: 1,
      fieldKey: 'all',
    },
  ]

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(320)
      setFocus(true)
      if (!sideMain.current) return
      sideMain.current.style.transition = '0s'
      width = e.clientX - (layoutSideCollapse ? 200 : 80)
      if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        if (isOpen) {
          setIsOpen(!isOpen)
        }
        setLeftWidth(width < 26 ? 26 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 320) {
        setEndWidth(width)
        setLeftWidth(26)
        setIsOpen(true)
      } else if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        setLeftWidth(width)
      }
      if (!sideMain.current) return
      sideMain.current.style.transition = '0.3s'
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  // 点击按钮
  const onChangeSide = () => {
    if (!sideMain.current) return
    sideMain.current.style.transition = '0.3s'
    if (isOpen) {
      setLeftWidth(320)
    } else {
      setLeftWidth(26)
    }
    setEndWidth(0)
    setIsOpen(!isOpen)
  }

  // 计算筛选条件展示
  const onComputedText = () => {
    // 是否有时间
    const hasTime =
      filterParamsOverall.time?.length > 0
        ? `${t('scopePeriod', {
            time: `${filterParamsOverall.time[0]} ~ ${filterParamsOverall.time[1]}`,
          })}`
        : ''

    // 是否有状态
    const hasStatus =
      filterParamsOverall?.status === 0
        ? ''
        : `${t('statusFilter', {
            name: cardList?.filter(
              (i: any) => i.key === filterParamsOverall?.status,
            )[0]?.name,
          })}`

    // 是否有搜索条件
    const hasKeyword =
      filterParamsOverall?.keyword?.length > 0
        ? `${t('keywordFilter', { keyword: filterParamsOverall?.keyword })}`
        : ''

    return hasTime + hasKeyword + hasStatus + t('endText')
  }

  // 获取汇报列表
  const getReportList = async () => {
    setLoading(true)
    const response = await getMemberReportList({
      ...filterParamsOverall,
      page: 1,
    }).finally(() => {
      setLoading(false)
    })
    if (response && response?.list?.length) {
      setUserReportList(response)
      if (response.list.length > 0) {
        const item = response.list?.[0]
        let task = item?.report_content?.find(
          (k: any) => k.name === 'today_end',
        )?.pivot?.params?.[0]
        if (!task) {
          task = item?.report_content?.find(
            (k: any) => k.name === 'overdue_tasks',
          )?.pivot?.params?.[0]
        }
        if (task) {
          setReportFirstData({
            project_id: item.project_id,
            id: task.id,
            project_type: task.project_type,
            is_bug: task.is_bug,
            user_id: item.user.id,
            onlyId: item.id,
          })
        }
      }
    }
  }
  useEffect(() => {
    if (filterParamsOverall?.user_ids?.length) {
      getReportList()
    }
  }, [JSON.stringify(filterParamsOverall)])

  return (
    <Wrap>
      <EmployeeProfileHeader
        onChangeFilter={value => {
          // dispatch(setFilterParamsOverall(value))
          dispatch(setCurrentClickNumber(currentClickNumber + 1))
        }}
      />
      <ContentWrap>
        <PersonBox
          isOpen={isOpen}
          ref={sliderRef}
          style={{
            width: isOpen ? 26 : leftWidth,
            transition: endWidth < 320 ? '0.2s' : 'initial',
          }}
        >
          <SideMain ref={sideMain} style={{ width: leftWidth }} isOpen={isOpen}>
            <div className="box">
              <EmployeeProfilePerson />
            </div>
          </SideMain>
          <MouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: leftWidth - 6 }}
          >
            <DragLine
              active={focus}
              className="line"
              style={{ marginLeft: 4 }}
            />
          </MouseDom>
          <Tooltip title={t('putAway') as string} placement="right">
            <FoldIcon onClick={onChangeSide}>
              <CommonIconFont
                type={isOpen ? 'right' : 'left'}
                size={16}
                color="var(--neutral-n2)"
              />
            </FoldIcon>
          </Tooltip>
        </PersonBox>
        <RightBox style={{ width: `calc(100% - ${leftWidth}px)` }}>
          {/* 日报-关联需求id存在显示日报列表和任务详情 */}
          {reportFirstData.id ? (
            <>
              <EmployeeProfileReport
                onGetReportFirstData={setReportFirstData}
                data={userReportList}
                loading={loading}
                setLoading={setLoading}
                setUserReportList={setUserReportList}
                reportFirstData={reportFirstData}
              />
              {/* 事务 */}
              {reportFirstData?.project_type === 2 && (
                <EmployeeAffair
                  id={reportFirstData?.id}
                  project_id={reportFirstData?.project_id}
                  user_id={reportFirstData?.user_id}
                />
              )}
              {/* 缺陷 */}
              {reportFirstData?.project_type === 1 &&
                reportFirstData?.is_bug === 1 && (
                  <EmployeeDefect
                    id={reportFirstData?.id}
                    project_id={reportFirstData?.project_id}
                    user_id={reportFirstData?.user_id}
                  />
                )}
              {/* 需求 */}
              {reportFirstData?.project_type === 1 &&
                reportFirstData?.is_bug !== 1 && (
                  <EmployeeDemand
                    id={reportFirstData?.id}
                    project_id={reportFirstData?.project_id}
                    user_id={reportFirstData?.user_id}
                  />
                )}
            </>
          ) : (
            <NoData>
              {/* 暂无数据显示,需要日报提供是否有数据 */}
              <NoDataTextWrap>
                <span>{onComputedText()}</span>
                <span>{t('weSuggestThatYouResetTheFiltering')}</span>
              </NoDataTextWrap>
              <CommonButton
                type="light"
                onClick={() => {
                  // 点击清空筛选条件
                }}
                style={{ marginTop: 24 }}
              >
                {t('resetFiltering')}
              </CommonButton>
            </NoData>
          )}
        </RightBox>
      </ContentWrap>
    </Wrap>
  )
}

export default EmployeeProfile

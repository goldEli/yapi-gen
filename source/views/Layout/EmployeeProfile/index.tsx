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
import EmployeeProfileTask from './components/EmployeeProfileTask'
import { useDispatch, useSelector } from '@store/index'
import {
  setCurrentClickNumber,
  setFilterParamsOverall,
} from '@store/employeeProfile'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'
import CommonButton from '@/components/CommonButton'

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
  const [filterParams, setFilterParams] = useState<any>({})
  // 第一条日报的第一个需求数据
  const [reportFirstData, setReportFirstData] = useState<any>({
    project_id: null,
    id: null,
  })
  const sideMain = useRef<any>(null)
  const sliderRef = useRef<any>(null)
  const maxWidth = 600
  const { currentKey, currentClickNumber } = useSelector(
    store => store.employeeProfile,
  )

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
  // filterParams = useMemo(
  //   () => filterParams,
  //   [filterParams?.status, filterParams?.time],
  // )
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
    console.log(filterParams, '=1111')
    // 是否有时间
    const hasTime =
      filterParams.time?.length > 0
        ? `【${filterParams.time[0]} ~ ${filterParams.time[1]}】期间范围内未查询到`
        : ''

    // 是否有状态
    const hasStatus =
      filterParams?.status === 0
        ? ''
        : `状态为【${
            cardList?.filter((i: any) => i.key === filterParams?.status)[0]
              ?.name
          }】`

    // 是否有搜索条件
    const hasKeyword =
      filterParams?.keyword?.length > 0
        ? `关键字为【${filterParams?.keyword}】`
        : ''

    return hasTime + hasKeyword + hasStatus + '的数据'
  }

  // useEffect(() => {
  //   if (paramsData?.user_id) {
  //     console.log('paramsData---', paramsData)

  //   }
  // }, [paramsData?.user_id])
  return (
    <Wrap>
      <EmployeeProfileHeader
        onChangeFilter={value => {
          setFilterParams((pre: any) => ({ ...pre, ...value }))
          dispatch(setFilterParamsOverall(value))
          dispatch(setCurrentClickNumber(currentClickNumber + 1))
        }}
        filterParams={filterParams}
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
              <EmployeeProfilePerson
                onChangeFilter={value => {
                  setFilterParams((pre: any) => ({ ...pre, ...value }))
                  dispatch(setFilterParamsOverall(value))
                }}
                filterParams={filterParams}
              />
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
          {reportFirstData?.id ? (
            <>
              <EmployeeProfileReport
                filterParams={filterParams}
                onGetReportFirstData={setReportFirstData}
              />
              <EmployeeProfileTask filterParams={filterParams} />
            </>
          ) : (
            <NoData>
              {/* 暂无数据显示,需要日报提供是否有数据 */}
              <NoDataTextWrap>
                <span>{onComputedText()}</span>
                <span>建议您【重置筛选】</span>
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

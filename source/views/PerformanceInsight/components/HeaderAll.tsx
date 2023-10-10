/* eslint-disable react/jsx-handler-names */
// 全局的头部
import Export from '@/components/Export'
import {
  HeaderRowBox,
  Back,
  RightRow,
  PersonText,
  Line,
  DivStyle,
  Btn1,
} from '../Header/Style'
import { useEffect, useState, useLayoutEffect } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import Select from './Select'
import CommonButton from '@/components/CommonButton'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMonthBefor, getDays } from './Date'
import { encryptPhp } from '@/tools/cryptoPhp'
import useShareModal from '@/hooks/useShareModal'
import { useSelector } from '@store/index'
import { getParamsData } from '@/tools'
import { getProjectList } from '@/services/project'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import CustomSelect from '@/components/CustomSelect'
import SelectMain from '../Header/components/SelectMain'
import { Space } from 'antd'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import { Left } from './style'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'

const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-left: 16px;
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(
      .ant-select-customize-input
    )
    .ant-select-selector {
    box-shadow: 0 0 0 0px;
  }
  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
    padding-top: 2px !important;
  }
  .ant-select-selection-item {
    padding-top: 1px !important;
  }
`

interface HaderProps {
  type: string
  headerParmas: Models.Efficiency.HeaderParmas
  onSearchData?(extra: any): void
  onGetExportApi?(value: number[]): void
  projectId: number | string
  homeType: string
  viewType: number
  tableList?: Array<{ id: number }>
  state?: string
}
const HeaderAll = (props: HaderProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [projectList, setProjectList] = useState<any>()
  const [dropdownMatchSelectWidth, setDropdownMatchSelectWidth] =
    useState<any>(0)
  const [dropdownMatchSelectWidthTime, setDropdownMatchSelectWidthTime] =
    useState<any>(0)
  const [options, setOptions] = useState<number[]>([])
  const [time, setTime] = useState<{
    startTime: string | undefined
    endTime: string | undefined
  }>()
  const { ShareModal, open } = useShareModal()
  const { projectInfo } = useSelector(store => store.project)
  const { userInfo } = useSelector(store => store.user)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [timeKey, setTimeKey] = useState<number>(1)
  const [timeVal, setTimeVal] = useState<any>()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [person, setPerson] = useState<any>([])
  const isRefresh = useSelector(store => store.user.isRefresh)

  const getProjectApi = async () => {
    const res: any = await getProjectList({
      // self: 1,
      all: 1,
    })
    const idsP = props.headerParmas.projectIds || []
    idsP?.length >= 1
      ? setProjectList(
          res.list
            ?.filter((el: any) => idsP?.includes(el.id))
            .map((el: { id: number; name: string }) => ({
              ...el,
              label: el.name,
              value: el.id,
            })),
        )
      : setProjectList(
          res.list.map((el: { id: number; name: string }) => ({
            ...el,
            label: el.name,
            value: el.id,
          })),
        )
    if (props.homeType === 'all') {
      setOptions(props.headerParmas?.projectIds || [])
    } else {
      setOptions(paramsData?.id ? [paramsData?.id] : [])
      setProjectList(
        res.list
          .filter((k: any) => k.id === paramsData?.id)
          .map((el: { id: number; name: string }) => ({
            ...el,
            label: el.name,
            value: el.id,
          })),
      )
    }
  }
  // 自定义时间
  const onChangeDate = (values: any[]) => {
    if (values) {
      setTimeVal([moment(values[0]), moment(values[1])])
    } else {
      setTimeVal([])
    }
  }
  // 清除选择的成员
  const onClear = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setPerson([])
  }
  // 成员保存弹窗提示需要
  const onConfirm = (data: Array<{ name: string; id: number }>) => {
    setIsVisible(false)
    setPerson(data?.map((k: any) => k.id) ?? [])
  }

  useEffect(() => {
    getProjectApi()
    setTimeKey(props?.headerParmas?.time?.type)
    setPerson(props?.headerParmas?.users ?? [])
    if (props?.headerParmas?.time?.type === 0) {
      setTimeVal([
        moment(
          moment(props?.headerParmas?.time?.time?.[0]).format('YYYY-MM-DD'),
        ),
        moment(
          moment(props?.headerParmas?.time?.time?.[1]).format('YYYY-MM-DD'),
        ),
      ])
    }
    // 根据图表的header选择的项目塞选出选择出来的项目
  }, [])

  useEffect(() => {
    switch (timeKey) {
      case 1:
        setTime(getMonthBefor(1))
        break
      case 3:
        setTime(getMonthBefor(3))
        break
      case 6:
        setTime(getMonthBefor(6))
        break
      case 14:
        setTime(getDays(14))
        break
      case 28:
        setTime(getDays(28))
        break
      default:
        setTime({
          startTime: moment(timeVal?.[0]).format('YYYY-MM-DD'),
          endTime: moment(timeVal?.[1]).format('YYYY-MM-DD'),
        })
        break
    }
  }, [timeVal, timeKey])

  useEffect(() => {
    if (
      (timeKey === 0 && !timeVal) ||
      (props.homeType !== 'all' && options?.length === 0)
      // 如果不是全局的并且没有项目id则拦截
    ) {
      return
    }
    props?.onSearchData?.({
      project_ids: options,
      user_ids: person,
      period_time: timeKey,
      time: timeVal
        ? [
            moment(timeVal?.[0]).format('YYYY-MM-DD'),
            moment(timeVal?.[1]).format('YYYY-MM-DD'),
          ]
        : timeVal,
    })
  }, [options, timeKey, timeVal, person, isRefresh])
  useLayoutEffect(() => {
    const w = document
      .querySelector('#SelectWrap')
      ?.getBoundingClientRect().width
    setDropdownMatchSelectWidth(w)
  }, [props])
  useLayoutEffect(() => {
    const w = document
      .querySelector('#SelectWrapForList')
      ?.getBoundingClientRect().width
    setDropdownMatchSelectWidthTime(w)
  }, [props])
  const onBack = () => {
    if (props.homeType === 'all') {
      const params = encryptPhp(
        JSON.stringify({
          view: props.headerParmas.view,
          valueId: paramsData.valueId,
          headerParmas: paramsData.headerParmas,
          // 新加的type
          newType: paramsData.newType,
          isOverAll: paramsData?.isOverAll,
          overPageType: paramsData?.overPageType,
        }),
      )
      navigate(`/Performance?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({
          // 项目id
          projectId: props.projectId,
          // iteration 迭代还是冲刺
          type: props.homeType,
          // 项目id
          id: props.projectId,
          //
          view: props.headerParmas.view,
          // 分享的id
          valueId: paramsData.valueId,
          // 所有的参数
          headerParmas: paramsData.headerParmas,
        }),
      )
      navigate(`/Report/PerformanceInsight?data=${params}`)
    }
  }

  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => onBack()}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text">{t('performance.back')}</span>
        </Back>
        {props.state === 'hidden' ? null : (
          <RightRow>
            {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
            {/* // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
        //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局 */}

            <div style={{ marginRight: '16px' }}>
              <SelectWrapForList id="SelectWrap">
                <span style={{ margin: '0px 0px 0px 12px', fontSize: '14px' }}>
                  {t('Project')}
                </span>
                <CustomSelect
                  style={{ width: 148 }}
                  getPopupContainer={(node: any) => node}
                  allowClear
                  optionFilterProp="label"
                  showArrow
                  showSearch
                  value={options}
                  placeholder={t('common.pleaseProject')}
                  placement="bottomRight"
                  dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                  options={projectList}
                  onChange={(value: any) => {
                    setOptions(value)
                  }}
                  onConfirm={() => null}
                />
              </SelectWrapForList>
            </div>
            <div style={{ marginRight: '16px' }}>
              <SelectWrapForList>
                {/* 成员选择 */}
                <DivStyle noBorder onClick={() => setIsVisible(true)}>
                  {person?.length > 0 ? (
                    <Left>
                      <span>{t('project.member')}</span>
                      <Btn1>
                        {t('version2.checked', { count: person.length })}
                      </Btn1>
                    </Left>
                  ) : (
                    <span>{t('performance.all')}</span>
                  )}
                  {person?.length > 0 ? (
                    <CommonIconFont
                      type="close-solid"
                      size={14}
                      color="var(--neutral-n4)"
                      onClick={e => onClear(e)}
                    />
                  ) : (
                    <CommonIconFont
                      onClick={() => setIsVisible(true)}
                      type={isVisible ? 'up' : 'down'}
                      size={14}
                      color="var(--neutral-n4)"
                    />
                  )}
                </DivStyle>
              </SelectWrapForList>
            </div>

            <Space size={16}>
              <SelectWrapForList id="SelectWrapForList">
                <span style={{ margin: '0px 0px 0px 12px', fontSize: '14px' }}>
                  {t('Time')}
                </span>
                <SelectMain
                  allowClear={false}
                  onChange={e => {
                    setTimeKey(e)
                  }}
                  value={timeKey}
                  placement="bottomRight"
                  dropdownMatchSelectWidth={dropdownMatchSelectWidthTime}
                  placeholder={t('common.pleaseSelect')}
                  list={[
                    {
                      name: t('performance.tWeek'),
                      key: 14,
                    },
                    {
                      name: t('performance.fWeek'),
                      key: 28,
                    },
                    {
                      name: t('performance.oMonth'),
                      key: 1,
                    },
                    {
                      name: t('performance.tMonth'),
                      key: 3,
                    },
                    {
                      name: t('performance.sMonth'),
                      key: 6,
                    },
                    {
                      name: t('performance.custom'),
                      key: 0,
                    },
                  ]}
                />
              </SelectWrapForList>
              {timeKey === 0 && (
                <RangePicker
                  dateValue={timeVal}
                  onChange={onChangeDate}
                  width="283px"
                  hasClear
                />
              )}
            </Space>
            {props.homeType === 'all' ? (
              <NewAddUserModalForTandD
                title={t('calendarManager.add_a_member')}
                state={2}
                defaultPeople={person}
                isVisible={isVisible}
                onConfirm={onConfirm}
                onClose={() => setIsVisible(false)}
              />
            ) : (
              /* 项目走的 */
              <AddDepartmentOrTeamModal
                users={person}
                projectId={paramsData?.id}
                type={2}
                isVisible={isVisible}
                onConfirm={onConfirm}
                onClose={() => setIsVisible(false)}
              />
            )}
            <Back
              onClick={() =>
                open({
                  onOk: () => {
                    return Promise.resolve()
                  },
                })
              }
              style={{ margin: '0 16px 0 24px' }}
            >
              <CommonIconFont type="share" size={16} />
              <span className="text">{t('performance.share')}</span>
            </Back>
            <CommonButton
              isDisable={props?.tableList && props?.tableList?.length < 1}
              type="primary"
              onClick={() => setIsOpen(true)}
            >
              <CommonIconFont type="export" size={16} />
              {t('performance.export')}
            </CommonButton>
          </RightRow>
        )}
      </HeaderRowBox>
      {/* 分享  save代表是否保存的值*/}
      <ShareModal
        // 视图id
        id={props?.headerParmas?.view?.value}
        viewType={props.viewType}
        type={3}
        name={props?.headerParmas?.view?.title}
        // 视图的配置
        config={{
          project_ids: options
            ? [options]
            : paramsData?.headerParmas.projectIds,
          iterate_ids: paramsData?.headerParmas.iterate_ids,
          user_ids: person,
          start_time:
            timeKey === 0
              ? timeVal?.[0]
              : // eslint-disable-next-line no-undefined
                undefined,
          end_time:
            timeKey === 0
              ? timeVal?.[0]
              : // eslint-disable-next-line no-undefined
                undefined,
          period_time:
            // eslint-disable-next-line no-undefined, no-negated-condition
            timeKey !== 0
              ? timeKey
              : // eslint-disable-next-line no-undefined
                undefined,
        }}
        url={window.location.href}
        // 2钟不同的分享标题
        title={`【${
          projectInfo.name ? projectInfo.name : t('mine.allProject')
        }-${
          paramsData.num === 1
            ? t('performance.title06')
            : t('performance.title07')
        }-${userInfo?.name}】`}
      />
      {/* 导出 */}
      <Export
        time={`${time?.startTime} ~ ${time?.endTime}`}
        title={t('performance.exportTitle')}
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false), props?.onGetExportApi?.(options)
        }}
        personData={person}
      />
    </>
  )
}
export default HeaderAll

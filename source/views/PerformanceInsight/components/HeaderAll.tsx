/* eslint-disable react/jsx-handler-names */
// 全局的头部
import Export from '../Header/components/Export'
import { HeaderRowBox, Back, RightRow, PersonText, Line } from '../Header/Style'
import { useEffect, useState } from 'react'
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
interface HaderProps {
  type: string
  headerParmas: Models.Efficiency.HeaderParmas
  onSearchData(value: number[]): void
  onGetExportApi(value: number[]): void
  projectId: number | string
  homeType: string
  viewType: number
  tableList: Array<{ id: number }>
}
const HeaderAll = (props: HaderProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [projectList, setProjectList] = useState<any>()
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
    setOptions(props.headerParmas?.projectIds || [])
  }
  useEffect(() => {
    if (props.type === 'Progress_all' || props.type === 'Defect_all') {
      getProjectApi()
    }
    switch (props.headerParmas.time.type) {
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
          startTime: props.headerParmas.time?.time?.[0],
          endTime: props.headerParmas.time?.time?.[1],
        })
        break
    }
    // 根据图表的header选择的项目塞选出选择出来的项目
  }, [])
  const onBack = () => {
    if (props.homeType === 'all') {
      const params = encryptPhp(
        JSON.stringify({
          view: props.headerParmas.view,
          valueId: paramsData.valueId,
          headerParmas: paramsData.headerParmas,
        }),
      )
      navigate(`/Performance?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({
          projectId: props.projectId,
          type: props.homeType,
          id: props.projectId,
          view: props.headerParmas.view,
          valueId: paramsData.valueId,
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
        <RightRow>
          {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
          {/* // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
        //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局 */}
          {(props.type === 'Progress_all' || props.type === 'Defect_all') &&
            projectList?.length >= 1 && (
              <div style={{ marginRight: '16px' }}>
                <Select
                  type=""
                  options={projectList}
                  more
                  value={options}
                  placeholder={t('common.pleaseProject')}
                  onChange={(value: number[]) => {
                    setOptions(value), props.onSearchData(value)
                  }}
                />
              </div>
            )}
          <PersonText>
            {props.headerParmas.users?.length ? (
              <span>
                {t('performance.select')}： {props.headerParmas.users?.length}
                {t('performance.people')}
              </span>
            ) : (
              <span>{t('performance.allPeople')}</span>
            )}
          </PersonText>
          <Line />
          {time?.startTime && time?.endTime ? (
            <PersonText>
              {t('performance.statistics')}
              {time?.startTime} ~ {time?.endTime}
            </PersonText>
          ) : null}
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
            isDisable={props.tableList?.length < 1}
            type="primary"
            onClick={() => setIsOpen(true)}
          >
            <CommonIconFont type="export" size={16} />
            {t('performance.export')}
          </CommonButton>
        </RightRow>
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
          project_ids: paramsData?.headerParmas.projectIds,
          iterate_ids: paramsData?.headerParmas.iterate_ids,
          user_ids: paramsData?.headerParmas.users,
          start_time:
            paramsData?.headerParmas?.time?.type === 0
              ? paramsData?.headerParmas?.time?.time?.[0]
              : // eslint-disable-next-line no-undefined
                undefined,
          end_time:
            paramsData?.headerParmas?.time?.type === 0
              ? paramsData?.headerParmas?.time?.time?.[1]
              : // eslint-disable-next-line no-undefined
                undefined,
          period_time:
            // eslint-disable-next-line no-undefined, no-negated-condition
            paramsData?.headerParmas?.time?.type !== 0
              ? paramsData?.headerParmas.period_time
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
          setIsOpen(false), props.onGetExportApi(options)
        }}
        personData={props.headerParmas.users}
      />
    </>
  )
}
export default HeaderAll

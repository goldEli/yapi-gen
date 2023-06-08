/* eslint-disable react/jsx-handler-names */
// 全局的头部
import Share from '../Header/components/Share'
import Export from '../Header/components/Export'
import ExportSuccess from '../Header/components/ExportSuccess'
import { HeaderRowBox, Back, RightRow, PersonText, Line } from '../Header/Style'
import { useEffect, useState } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import Select from './Select'
import CommonButton from '@/components/CommonButton'
import { useNavigate } from 'react-router-dom'
import { getMonthBefor, getDays } from './Date'
import { encryptPhp } from '@/tools/cryptoPhp'
interface HaderProps {
  type: string
  projectDataList: Array<{
    name: string
    id: number
  }>
  headerParmas: Models.Efficiency.HeaderParmas
  onSearchData: (value: number[]) => void
  onGetExportApi: (value: number[]) => void
  projectId: number
  homeType: string
}
const HeaderAll = (props: HaderProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [projectList, setProjectList] = useState<any>()
  const [options, setOptions] = useState<number[]>([])
  const [time, setTime] = useState<{
    startTime: string | undefined
    endTime: string | undefined
  }>()
  useEffect(() => {
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
    props.headerParmas.projectIds?.length >= 1
      ? setProjectList(
          props.projectDataList?.filter(el =>
            props.headerParmas.projectIds.includes(el.id),
          ),
        )
      : setProjectList(props.projectDataList)
  }, [])
  const onBack = () => {
    if (props.homeType === 'all') {
      navigate(`/Performance`)
    } else {
      const params = encryptPhp(
        JSON.stringify({
          projectId: props.projectId,
          type: props.type,
        }),
      )
      navigate(`/Performance?data=${params}`)
    }
  }
  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => 123}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text" onClick={() => onBack()}>
            返回
          </span>
        </Back>
        <RightRow>
          {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
          {/* // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
        //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局 */}
          {props.type === 'Progress_all' && (
            <div style={{ marginRight: '16px' }}>
              <Select
                options={projectList}
                more={true}
                value={options}
                placeholder="请选择项目"
                onChange={(value: number[]) => {
                  setOptions(value), props.onSearchData(value)
                }}
              />
            </div>
          )}
          <PersonText>
            {' '}
            {props.headerParmas.users?.length ? (
              <span>已选 {props.headerParmas.users?.length}人</span>
            ) : (
              <span>已选 全员</span>
            )}
          </PersonText>
          <Line />
          {time?.startTime && time?.endTime && (
            <PersonText>
              统计时间：{time?.startTime} ~ {time?.endTime}
            </PersonText>
          )}
          <Back
            onClick={() => setIsVisible(true)}
            style={{ margin: '0 16px 0 24px' }}
          >
            <CommonIconFont type="share" size={16} />
            <span className="text">分享</span>
          </Back>
          <CommonButton type="primary" onClick={() => setIsOpen(true)}>
            <CommonIconFont type="export" size={16} />
            导出
          </CommonButton>
        </RightRow>
      </HeaderRowBox>
      {/* 分享  save代表是否保存的值*/}
      <Share
        title="分享"
        save={true}
        isVisible={isVisible}
        onConfirm={() => {
          setIsVisible(false)
        }}
        onClose={() => setIsVisible(false)}
      />
      {/* 导出 */}
      <Export
        time={`${time?.startTime} ~ ${time?.endTime}`}
        title="按周期导出"
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

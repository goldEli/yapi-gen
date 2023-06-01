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
import { useSelector } from '@store/index'
import { getMonthBefor, getDays } from './Date'
interface HaderProps {
  type: string
  time: string
  personData: Array<{
    name: string
    id?: number
  }>
}
const HeaderAll = (props: HaderProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleSuccess, setIsVisibleSuccess] = useState<boolean>(false)
  const [projectList, setProjectList] = useState<any>()
  const [time, setTime] = useState<{ startTime: string; endTime: string }>()
  const { headerParmas, projectDataList } = useSelector(
    store => store.performanceInsight,
  )
  useEffect(() => {
    switch (headerParmas.time.type || headerParmas.time) {
      case 0:
        setTime({
          startTime: headerParmas.time.time[0],
          endTime: headerParmas.time.time[1],
        })
        break
      case 1:
        setTime(getMonthBefor(1))
        break
      case 3:
        setTime(getMonthBefor(3))
        break
      case 7:
        setTime(getDays(7))
        break
      case 15:
        setTime(getDays(15))
        break
    }
    // 根据图表的header选择的项目塞选出选择出来的项目
    headerParmas.projectIds?.length >= 1
      ? setProjectList(
          projectDataList?.filter(el =>
            headerParmas.projectIds.includes(el.id),
          ),
        )
      : setProjectList(projectDataList)
  }, [])

  console.log(projectList, 'projectList')
  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => 123}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text" onClick={() => navigate(-1)}>
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
                value={[]}
                placeholder="请选择项目"
                onChange={(value: number[]) => console.log(value)}
              />
            </div>
          )}
          <PersonText>
            {' '}
            {headerParmas.users?.length ? (
              <span>已选 {headerParmas.users?.length}人</span>
            ) : (
              <span>已选 0</span>
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
          setIsOpen(false), setIsVisibleSuccess(true)
        }}
        personData={headerParmas.users}
      />
      {/* 导出成功 */}
      <ExportSuccess
        title={'导出成功'}
        text={'Excel导出成功，可在本地打开文件查看'}
        isVisible={isVisibleSuccess}
        onConfirm={() => {
          setIsVisibleSuccess(false)
        }}
        onChangeVisible={() => setIsVisibleSuccess(false)}
      />
    </>
  )
}
export default HeaderAll

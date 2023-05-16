import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { HeaderRowBox, Back, RightRow, PersonText } from '../Header/Style'
import Share from '../Header/components/Share'
import { useState } from 'react'
import Export from '../Header/components/Export'
import ExportSuccess from '../Header/components/ExportSuccess'
// 进展对比
interface HaderProps {
  time: string
  personData: Array<{
    name: string
    id?: number
  }>
}
const Header = (props: HaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleSuccess, setIsVisibleSuccess] = useState<boolean>(false)
  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => 123}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text">返回</span>
        </Back>
        <RightRow>
          <PersonText>
            {' '}
            {props.personData?.length ? (
              <span>已选 ({props.personData?.length}人)</span>
            ) : (
              <span>已选 0</span>
            )}
          </PersonText>
          <span className="line" />
          <PersonText>统计时间：{props.time}</PersonText>
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
        time={'2023-03-01 ~ 2023-03-14'}
        title="按周期导出"
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false), setIsVisibleSuccess(true)
        }}
        personData={[{ name: '123' }]}
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
const ProgressComparison = () => {
  return (
    <>
      <Header time="2023-08-08 ~ 2023-09-08" personData={[{ name: '123' }]} />
    </>
  )
}
export default ProgressComparison

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

interface HaderProps {
  time: string
  personData: Array<{
    name: string
    id?: number
  }>
}
interface ItemProps {
  label: string
  value: string
  id: string
  avatar: string | undefined
}
const HeaderAll = (props: HaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleSuccess, setIsVisibleSuccess] = useState<boolean>(false)
  const [more, setMore] = useState(false)
  const [options, setOptions] = useState<ItemProps[] | []>([])
  useEffect(() => {
    const a = []
    for (let i = 1; i < 10; i++) {
      const value = i.toString(10) + i
      a.push({
        label: `Long Label: ${value}`,
        value,
        id: value,
        avatar: '',
      })
    }
    setOptions(a)
  }, [])

  const onShowAll = () => {
    setMore(true)
    const a = []
    for (let i = 1; i < 50; i++) {
      const value = i.toString(10) + i
      a.push({
        label: `Long Label: ${value}`,
        value,
        id: value,
        avatar: '',
      })
    }
    setOptions(a)
  }
  // 下拉框查询
  const onSearch = (value: string) => {
    console.log(value, 'value')
  }
  return (
    <>
      <HeaderRowBox>
        <Back onClick={() => 123}>
          <CommonIconFont type="left-md" size={16} />
          <span className="text">返回</span>
        </Back>
        <RightRow>
          {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
          <div style={{ marginRight: '16px' }}>
            <Select
              onSearch={onSearch}
              options={options}
              more={more}
              onChange={(value: string[]) => console.log(value)}
              onShowAll={() => onShowAll()}
            />
          </div>
          <PersonText>
            {' '}
            {props.personData?.length ? (
              <span>已选 ({props.personData?.length}人)</span>
            ) : (
              <span>已选 0</span>
            )}
          </PersonText>
          <Line />
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
export default HeaderAll

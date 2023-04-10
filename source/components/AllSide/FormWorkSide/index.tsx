/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import AddFormWork from '@/components/AllSide/FormWorkSide/AddFormWork'
import { setActiveItem } from '@store/formWork/index'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import SupplementaryIntercourse from './SupplementaryIntercourse'
import WriteReport from './WriteReport'
import { createTemplate } from '@/services/formwork'
import { getTemplateList } from '@store/formWork/thunk'
import { message } from 'antd'
// getTemplateList
const FormWorkSideStyle = styled.div`
  width: 200px;
  min-width: 200px;
`
const TitleStyle = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 24px 20px 24px;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  justify-content: space-between;
  font-family: SiYuanMedium;
`
const Slide = styled.div`
  height: 44px;
  padding-left: 24px;
  font-size: 14px;
  color: var(--neutral-n1-d2);
  line-height: 44px;
  &:hover {
    cursor: pointer;
  }
`
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: '18px',
  borderRadius: '6px',
  padding: '5px',
  '&: hover': {
    background: 'var(--hover-d1)',
    color: 'var(--neutral-n1-d1)',
    cursor: 'pointer',
  },
})
const a = [
  {
    label: '工作日报',
    id: 1,
  },
  {
    label: '工作周报',
    id: 2,
  },
  {
    label: '工作月报',
    id: 3,
  },
]

const FormWorkSide = () => {
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const { dataList } = useSelector(store => store.formWork)
  useEffect(() => {
    dispatch(setActiveItem(a.find((el, index) => index === isActive)))
  }, [isActive])
  const onConfirm = async (name: string) => {
    const res = await createTemplate({ name })
    message.success('创建成功')
    await dispatch(getTemplateList())
  }
  const getDataList = async () => {
    await dispatch(getTemplateList())
  }
  useEffect(() => {
    getDataList()
  }, [])

  useEffect(() => {
    console.log(dataList)
  }, [dataList])
  return (
    <FormWorkSideStyle>
      <TitleStyle>
        <span>模板</span>
        <IconFontStyle type="plus" onClick={() => setIsVisible(true)} />
      </TitleStyle>
      {dataList.map((el: { name: string; id: number }, index: number) => {
        return (
          <Slide
            key={el.id}
            onClick={() => setIsActive(index)}
            style={{
              color:
                isActive == index
                  ? 'var(--primary-d2)'
                  : 'var(--neutral-n1-d2)',
              background:
                isActive == index
                  ? 'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)'
                  : 'none',
            }}
          >
            {el.name}
          </Slide>
        )
      })}
      {/* 创建模板 */}
      <AddFormWork
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
        onConfirm={onConfirm}
      />
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text="【模版名称】还未保存，是否保存编辑内容？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
      {/* 补交汇报弹窗 */}
      <SupplementaryIntercourse
        title="补交汇报"
        isVisible={false}
        onConfirm={() => 123}
        onClose={() => 123}
      />
      {/* 写汇报 */}
      <WriteReport
        title="写汇报"
        isVisible={false}
        onConfirm={() => 123}
        onClose={() => 123}
      />
    </FormWorkSideStyle>
  )
}
export default FormWorkSide

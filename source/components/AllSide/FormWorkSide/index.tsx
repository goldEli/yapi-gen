/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import AddFormWork from '@/components/AllSide/FormWorkSide/AddFormWork'
import { setActiveItem, setFillingRequirements } from '@store/formWork/index'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import SupplementaryIntercourse from './SupplementaryIntercourse'
import WriteReport from './WriteReport'
import { getTemplateList } from '@store/formWork/thunk'
import {
  setTemplateName,
  setDataList,
  setReportContent,
  setTemplateContentConfigs,
} from '@store/formWork'
import { message } from 'antd'
import { cos } from '@/services'
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
  padding-right: 12px;
  font-size: 14px;
  color: var(--neutral-n1-d2);
  line-height: 44px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  const { dataList, activeItem } = useSelector(store => store.formWork)
  useEffect(() => {
    dataList.forEach((el: any, index: any) => {
      if (el.id === activeItem.id) {
        setIsActive(index)
      }
    })
  }, [activeItem])
  const onConfirm = async (name: string) => {
    setIsVisible(false)
    dispatch(setTemplateName(name))
    dispatch(setDataList([...dataList, { name }]))
  }
  const getDataList = async () => {
    const res = await dispatch(getTemplateList())
    res.payload?.length >= 1 &&
      dispatch(
        setActiveItem({ id: res?.payload[0]?.id, name: res?.payload[0]?.name }),
      )
  }
  useEffect(() => {
    getDataList()
    const item: any = dataList.find((el: any, index: any) => index === 0)
    dispatch(setActiveItem(item))
    localStorage.setItem('edit', '0')
  }, [])
  const itemActive = (el: any, index: any) => {
    if (localStorage.getItem('edit') === '1') {
      setDelIsVisible(true)
      return
    }
    setIsActive(index)
    const data = [
      {
        name: '汇报对象',
        is_required: 2,
        tips: '',
        type: 1,
      },
    ]
    dispatch(setTemplateContentConfigs(data))
    const claerConfig: any = {
      day: [],
      template_configs: [],
      hand_scope: 1,
      is_all_write: 2,
      is_all_view: 2,
      is_submitter_edit: false,
      is_cycle_limit: false,
      is_supply: false,
      reminder_time: null,
      auto_reminder: false,
      submit_cycle: 1,
      is_holiday: false,
      end_time: null,
      start_time: null,
    }
    dispatch(
      setReportContent({
        template_configs: [],
        is_all_view: 2,
        is_all_write: 2,
      }),
    )
    dispatch(setFillingRequirements(claerConfig))
    dispatch(setActiveItem(el))
    dispatch(setTemplateName(el.name))
  }
  return (
    <FormWorkSideStyle>
      <TitleStyle>
        <span>模板</span>
        <IconFontStyle type="plus" onClick={() => setIsVisible(true)} />
      </TitleStyle>
      {dataList?.map((el: { name: string; id: number }, index: number) => {
        return (
          <Slide
            key={el.id}
            onClick={() => itemActive(el, index)}
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
        onConfirm={(name: string) => onConfirm(name)}
      />
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text="【模版名称】还未保存，是否保存编辑内容？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
    </FormWorkSideStyle>
  )
}
export default FormWorkSide

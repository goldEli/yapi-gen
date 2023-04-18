/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import AddFormWork from '@/components/AllSide/FormWorkSide/AddFormWork'
import { setActiveItem, setFillingRequirements } from '@store/formWork/index'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getTemplateList } from '@store/formWork/thunk'
import {
  setTemplateName,
  setDataList,
  setReportContent,
  setTemplateContentConfigs,
} from '@store/formWork'
import { aWeekDataList } from '@/views/WorkReport/Formwork/DataList'
// getTemplateList
const FormWorkSideStyle = styled.div`
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
const NoDataCreateWrap = styled.div({
  marginTop: 8,
  minHeight: 68,
  borderRadius: 6,
  padding: '8px 12px',
  '.top': {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 12,
    svg: {
      color: '#FA9746',
      fontSize: 16,
      marginTop: 2,
    },
    div: {
      color: 'var(--neutral-n2)',
      fontSize: 12,
      marginLeft: 8,
      flexWrap: 'wrap',
    },
  },
  '.bottom': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: ' var(--primary-d2)',
    svg: {
      fontSize: 10,
    },
    div: {
      fontSize: 12,
      marginLeft: 6,
    },
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
const Box = styled.div`
  height: calc(100vh - 150px);
  overflow-y: auto;
`
const FormWorkSide = () => {
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const { dataList, activeItem, editSave } = useSelector(
    store => store.formWork,
  )
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
  }, [])
  const itemActive = (el: any, index: any) => {
    if (!editSave) {
      setDelIsVisible(true)
      return
    }
    setIsActive(index)
    const data = [
      {
        name: '汇报对象',
        is_required: 1,
        tips: '',
        type: 1,
      },
    ]
    dispatch(setTemplateContentConfigs(data))
    const claerConfig: any = {
      day: aWeekDataList,
      template_configs: [],
      hand_scope: 1,
      is_all_write: 2,
      is_all_view: 2,
      is_submitter_edit: true,
      is_cycle_limit: true,
      is_supply: true,
      reminder_time: null,
      auto_reminder: true,
      submit_cycle: 1,
      is_holiday: true,
      end_time: {
        day_type: 1,
        time: 24 * 60 * 60,
      },
      start_time: {
        day_type: 1,
        time: 24 * 60 * 60,
      },
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
      <Box>
        {dataList?.length < 1 ? (
          <NoDataCreateWrap>
            <div className="top">
              <IconFont type="Warning" />
              <div>暂无模板，创建一个吧~</div>
            </div>
            <div className="bottom">
              <div
                className="bottom"
                onClick={() => setIsVisible(true)}
                style={{ cursor: 'pointer' }}
              >
                <IconFont type="plus" />
                <div>新建模板</div>
              </div>
            </div>
          </NoDataCreateWrap>
        ) : (
          dataList?.map((el: { name: string; id: number }, index: number) => {
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
          })
        )}
      </Box>
      {/* 创建模板 */}
      <AddFormWork
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
        onConfirm={(name: string) => onConfirm(name)}
      />
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text={`【${activeItem?.name}】还未保存，是否保存编辑内容？`}
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
    </FormWorkSideStyle>
  )
}
export default FormWorkSide

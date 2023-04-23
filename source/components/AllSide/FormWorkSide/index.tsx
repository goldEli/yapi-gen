/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import AddFormWork from '@/components/AllSide/FormWorkSide/AddFormWork'
import {
  setActiveItem,
  setEditSave,
  setFillingRequirements,
} from '@store/formWork/index'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getTemplateList } from '@store/formWork/thunk'
import {
  setDataList,
  setReportContent,
  setTemplateContentConfigs,
  setTemplateName,
} from '@store/formWork'
import { aWeekDataList } from '@/views/WorkReport/Formwork/DataList'
import { CloseWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
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
  color: ${(props: any) =>
    props.theme ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  background: ${(props: any) =>
    props.theme
      ? 'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)'
      : 'none'};
  &:hover {
    cursor: pointer;
    color: var(--primary-d1);
  }
`
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
    color: 'var(--primary-d2)',
    svg: {
      fontSize: 10,
    },
    div: {
      fontSize: 12,
      marginLeft: 6,
    },
  },
})

const Box = styled.div`
  height: calc(100vh - 150px);
  overflow-y: auto;
`
const FormWorkSide = () => {
  const [t] = useTranslation()
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const { dataList, activeItem, editSave } = useSelector(
    store => store.formWork,
  )
  useEffect(() => {
    dataList.forEach((el: any, index: any) => {
      if (el.name === activeItem?.name) {
        setIsActive(index)
      }
    })
    dispatch(setTemplateName(activeItem?.name))
  }, [activeItem])
  const onConfirm = async (name: string) => {
    dispatch(setDataList([...dataList, { name }]))
    setIsActive(dataList?.length - 1)
    dispatch(setActiveItem({ name }))
    dispatch(
      setTemplateContentConfigs([
        {
          name: '汇报对象',
          is_required: 1,
          tips: '',
          type: 1,
        },
      ]),
    )
    const claerConfig: any = {
      day: aWeekDataList,
      template_configs: [],
      hand_scope: 1,
      is_all_write: 2,
      is_all_view: 2,
      is_submitter_edit: true,
      is_cycle_limit: true,
      is_supply: true,
      reminder_time: 2 * 60 * 60,
      auto_reminder: true,
      submit_cycle: 1,
      is_holiday: true,
      end_time: {
        day_type: 2,
        time: 0,
      },
      start_time: {
        day_type: 1,
        time: 0,
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
    setIsVisible(false)
  }
  const getDataList = async () => {
    const res = await dispatch(getTemplateList())
    if (res.payload?.length < 1) {
      const claerConfig: any = {
        day: aWeekDataList,
        template_configs: [],
        hand_scope: 1,
        is_all_write: 2,
        is_all_view: 2,
        is_submitter_edit: true,
        is_cycle_limit: true,
        is_supply: true,
        reminder_time: 2 * 60 * 60,
        auto_reminder: true,
        submit_cycle: 1,
        is_holiday: true,
        end_time: {
          day_type: 2,
          time: 0,
        },
        start_time: {
          day_type: 1,
          time: 0,
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
    } else {
      dispatch(
        setActiveItem({ id: res?.payload[0]?.id, name: res?.payload[0]?.name }),
      )
    }
  }
  useEffect(() => {
    getDataList()
    const item: any = dataList.find((el: any, index: any) => index === 0)
    dispatch(setActiveItem(item))
  }, [])
  const itemActive = debounce((el: any, index: any) => {
    if (!editSave) {
      setDelIsVisible(true)
      return
    }
    const data = [
      {
        name: t('formWork.title3'),
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
      reminder_time: 2 * 60 * 60,
      auto_reminder: true,
      submit_cycle: 1,
      is_holiday: true,
      end_time: {
        day_type: 2,
        time: 0,
      },
      start_time: {
        day_type: 1,
        time: 0,
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
  }, 500)
  return (
    <FormWorkSideStyle>
      <TitleStyle>
        <span>{t('formWork.text3')}</span>
        <CloseWrap width={24} height={24}>
          <IconFont
            style={{ fontSize: 18 }}
            type="plus"
            onClick={() => {
              if (!editSave && activeItem?.name) {
                setDelIsVisible(true)
                return
              }
              setIsVisible(true)
            }}
          />
        </CloseWrap>
      </TitleStyle>
      <Box>
        {dataList?.length < 1 ? (
          <NoDataCreateWrap>
            <div className="top">
              <IconFont type="Warning" />
              <div>{t('formWork.text4')}</div>
            </div>
            <div className="bottom">
              <div
                className="bottom"
                onClick={() => setIsVisible(true)}
                style={{ cursor: 'pointer' }}
              >
                <IconFont type="plus" />
                <div>{t('formWork.text5')}</div>
              </div>
            </div>
          </NoDataCreateWrap>
        ) : (
          dataList?.map((el: { name: string; id: number }, index: number) => {
            return (
              <Slide
                key={el.name}
                onClick={() => itemActive(el, index)}
                theme={isActive == index}
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
        title={t('formWork.text6')}
        text={`【${activeItem?.name}】${t('formWork.text7')}`}
        isVisible={delIsVisible}
        onChangeVisible={() => {
          dispatch(setEditSave(true)), setDelIsVisible(false)
        }}
        onConfirm={() => setDelIsVisible(false)}
      />
    </FormWorkSideStyle>
  )
}
export default FormWorkSide

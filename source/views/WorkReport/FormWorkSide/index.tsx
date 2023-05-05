/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
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
import { getMessage } from '@/components/Message'
import { upDateTemplate, createTemplate } from '@/services/formwork'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { Tooltip } from 'antd'
import AddFormWork from './AddFormWork'
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
      color: 'var(--function-warning)',
      fontSize: 16,
      marginTop: 1,
    },
    div: {
      color: 'var(--neutral-n2)',
      fontSize: 14,
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
  const [activeItems, setActiveItems] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const {
    dataList,
    editSave,
    activeItem,
    reportContent,
    templateContentConfigs,
    fillingRequirements,
    err,
    templateName,
    errMsg,
  } = useSelector(store => store.formWork)
  useEffect(() => {
    dataList.forEach((el: any, index: any) => {
      if (el.name === activeItem?.name) {
        setIsActive(index)
      }
    })
    dispatch(setTemplateName(activeItem?.name))
  }, [activeItem])
  const onConfirm = async (name: string) => {
    setIsOpen(false)
    const filterName = dataList.find((el: any) => el.name === name)
    if (filterName) {
      return getMessage({ msg: '已有重复模板名称', type: 'warning' })
    }
    dispatch(setDataList([{ name }, ...dataList]))
    setIsActive(dataList?.length - 1)
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
    dispatch(setActiveItem({ name }))
    setIsVisible(false)
  }
  const getDataList = async () => {
    const res = await dispatch(getTemplateList())
    dispatch(
      setActiveItem({ name: res?.payload[0]?.name, id: res?.payload[0]?.id }),
    )
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
    }
  }
  useEffect(() => {
    getDataList()
    // 汇报过来直接打开弹窗
    paramsData?.isOpen && paramsData?.type === 'report' && setIsVisible(true)
  }, [])
  const itemActive = debounce(async (el: any, index: any) => {
    if (!editSave) {
      setDelIsVisible(true)
      setActiveItems(el)
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
  const getVerifyParams = (parmas: any) => {
    if (!parmas.name) {
      getMessage({ msg: t('formWork.text11'), type: 'warning' })
      return false
    }
    // 谁可以写是必填的
    if (parmas.is_all_write !== 1) {
      const list = parmas.template_configs.filter(
        (el: any) => el.user_type === 1,
      )
      if (list?.length < 1) {
        getMessage({ msg: t('formWork.message1'), type: 'warning' })
        return false
      }
    }
    if (
      parmas.submit_cycle === 1 ||
      parmas.submit_cycle === 2 ||
      parmas.submit_cycle === 3
    ) {
      if (
        (parmas.submit_cycle === 1 || parmas.submit_cycle === 3) &&
        parmas.requirement?.start_time?.day_type ===
          parmas.requirement?.end_time?.day_type
      ) {
        if (
          parmas.requirement?.start_time?.time >
          parmas.requirement?.end_time?.time
        ) {
          getMessage({ msg: t('formWork.msg10'), type: 'warning' })
          return false
        }
      }
      if (!parmas.requirement.start_time) {
        getMessage({ msg: t('formWork.message3'), type: 'warning' })
        return false
      } else if (!parmas.requirement.end_time) {
        getMessage({ msg: t('formWork.message4'), type: 'warning' })
        return false
      } else if (!parmas.reminder_time) {
        getMessage({ msg: t('formWork.message5'), type: 'warning' })
        return false
      }
    }
    if (parmas.submit_cycle === 4) {
      if (!parmas.requirement.end_time) {
        getMessage({ msg: t('formWork.message4'), type: 'warning' })
        return false
      } else if (!parmas.reminder_time) {
        getMessage({ msg: t('formWork.message5'), type: 'warning' })
        return false
      }
    }
    return true
  }
  const getEndTime = (timeVal: number) => {
    let timeValLen = String(timeVal)
    return timeValLen.length === 13 ? timeVal / 1000 : timeVal
  }
  const getTemplateSort = (list: any) => {
    const sortData = list.map((item: any, index: number) => ({
      ...item,
      sort: index,
    }))
    sortData.forEach((el: any) => {
      Number(el.id) < 1 && delete el.id
    })
    return sortData
  }
  const saveApi = async () => {
    const config = reportContent?.template_configs
      ?.filter((el: any) => el.target_value)
      ?.filter((item: any) => item.target_value.key !== 'all')
    let parmas: any = {}
    parmas = {
      submit_cycle: fillingRequirements?.submit_cycle,
      auto_reminder: fillingRequirements?.auto_reminder ? 1 : 2,
      reminder_time: fillingRequirements?.reminder_time,
      is_supply: fillingRequirements?.is_supply ? 1 : 2,
      is_cycle_limit: fillingRequirements?.is_cycle_limit ? 1 : 2,
      is_submitter_edit: fillingRequirements?.is_submitter_edit ? 1 : 2,
      hand_scope:
        fillingRequirements?.hand_scope?.key || fillingRequirements?.hand_scope,
      is_all_view: reportContent?.is_all_view,
      is_all_write: reportContent?.is_all_write,
      template_content_configs: getTemplateSort(templateContentConfigs),
      template_configs: config,
      id: activeItem?.id,
    }
    parmas.name = templateName || activeItem?.name
    parmas.requirement = {
      day:
        fillingRequirements.submit_cycle === 1
          ? fillingRequirements?.day
              .filter((el: { value: boolean }) => el.value)
              .map((el: { key: number }) => el.key)
          : [],
      end_time:
        fillingRequirements.submit_cycle === 4
          ? getEndTime(fillingRequirements?.end_time)
          : fillingRequirements?.end_time,
      start_time: fillingRequirements?.start_time,
      is_holiday: fillingRequirements?.is_holiday ? 1 : 2,
    }
    if (!getVerifyParams(parmas)) {
      return
    }
    if (!err) {
      getMessage({ msg: errMsg, type: 'warning' })
      return
    }
    if (activeItem?.id) {
      await upDateTemplate(parmas)
      getMessage({ msg: t('formWork.message6'), type: 'success' })
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ name: templateName, id: activeItem?.id }))
    } else {
      const res = await createTemplate(parmas)
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ id: res.data.id, name: res.data.name }))
      getMessage({ msg: t('formWork.message7'), type: 'success' })
    }
    dispatch(setEditSave(true))
    setDelIsVisible(false)
  }

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
                setIsOpen(true)
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
                {el.name?.length >= 25 ? (
                  <Tooltip placement="topLeft" title={el.name}>
                    {el.name}
                  </Tooltip>
                ) : (
                  <span>{el.name}</span>
                )}
              </Slide>
            )
          })
        )}
      </Box>
      {/* 创建模板 */}
      <AddFormWork
        onClose={() => {
          setIsOpen(false), setIsVisible(false)
        }}
        isVisible={isVisible}
        onConfirm={(name: string) => onConfirm(name)}
      />
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        onCancelState={true}
        onCancel={() => setDelIsVisible(false)}
        title={t('formWork.text6')}
        text={`【${activeItem?.name}】${t('formWork.text7')}`}
        isVisible={delIsVisible}
        onChangeVisible={() => {
          dispatch(setEditSave(true)),
            setDelIsVisible(false),
            activeItems && dispatch(setActiveItem(activeItems)),
            isOpen && setIsVisible(true),
            activeItems || (isOpen && getDataList())
        }}
        onConfirm={() => saveApi()}
      />
    </FormWorkSideStyle>
  )
}
export default FormWorkSide

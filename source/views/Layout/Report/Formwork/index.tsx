/* eslint-disable @typescript-eslint/naming-convention */
import RightFormWork from './RightWrap'
import { useDispatch, useSelector } from '@store/index'
import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {
  setActiveItem,
  setDataList,
  setEditSave,
  setFillingRequirements,
  setReportContent,
  setTemplateContentConfigs,
  setTemplateName,
} from '@store/formWork'
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import AddFormWork from './AddFormWork'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { getMessage } from '@/components/Message'
import { getTemplateList } from '@store/formWork/thunk'
import { debounce } from 'lodash'
import { aWeekDataList } from './DataList'
import { createTemplate, upDateTemplate } from '@/services/formwork'

const FormWork = () => {
  const [t]: any = useTranslation()
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  asyncSetTtile(`${t('formWork.t1')}`)

  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [delIsVisible, setDelIsVisible] = useState(false)
  const [activeItems, setActiveItems] = useState()
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

  const onConfirm = async (name: string) => {
    setIsOpen(false)
    const filterName = dataList.find((el: any) => el.name === name)
    if (filterName) {
      return getMessage({
        msg: t('thereIsADuplicateTemplateName'),
        type: 'warning',
      })
    }
    dispatch(setDataList([{ name }, ...dataList]))
    setIsActive(dataList?.length - 1)
    dispatch(
      setTemplateContentConfigs([
        {
          name: t('reportingObjects'),
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

  useEffect(() => {
    dataList.forEach((el: any, index: any) => {
      if (el.name === activeItem?.name) {
        setIsActive(index)
      }
    })
    dispatch(setTemplateName(activeItem?.name))
  }, [activeItem])

  useEffect(() => {
    getDataList()
    // 汇报过来直接打开弹窗
    paramsData?.isOpen && paramsData?.type === 'report' && setIsVisible(true)
  }, [])

  // useEffect(() => {
  //   return () => {
  //     dispatch(setEditSave(true))
  //     dispatch(setActiveItem(null))
  //   }
  // })

  console.log(dataList, 'dataList', activeItem)

  return (
    <HaveTabsContentWrap>
      {/* 创建模板 */}
      <AddFormWork
        onClose={() => {
          setIsOpen(false)
          setIsVisible(false)
        }}
        isVisible={isVisible}
        onConfirm={(name: string) => onConfirm(name)}
      />
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        onCancelState
        onCancel={() => setDelIsVisible(false)}
        title={t('formWork.text6')}
        text={`【${activeItem?.name}】${t('formWork.text7')}`}
        isVisible={delIsVisible}
        onChangeVisible={() => {
          dispatch(setEditSave(true))
          setDelIsVisible(false)
          activeItems && dispatch(setActiveItem(activeItems))
          isOpen && setIsVisible(true)
          activeItems || (isOpen && getDataList())
        }}
        onConfirm={() => saveApi()}
      />
      <TabsContent
        onChangeRouter={(key: string) =>
          itemActive(
            dataList?.filter(
              (i: any, index: number) => index === Number(key),
            )[0],
            dataList.findIndex(
              (element: any, index: number) => index === Number(key),
            ),
          )
        }
        tabItems={dataList?.map((i: any, index: number) => ({
          key: String(index),
          label: i.name,
        }))}
        activeKey={String(isActive)}
      />
      <RightFormWork />
    </HaveTabsContentWrap>
  )
}
export default FormWork

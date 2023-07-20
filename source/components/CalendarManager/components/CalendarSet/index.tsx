import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { uploadFileByTask } from '@/services/cos'
import styled from '@emotion/styled'
import { setRouterMenu } from '@store/calendar'
import { updateCalendarConfig } from '@store/calendar/calendar.thunk'
import { useDispatch, useSelector } from '@store/index'
import { Checkbox, message, Select, Space, Tooltip, Upload } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CalendarSetWrap = styled.div`
  padding: 20px 4px 20px 24px;
  background: var(--neutral-white-d4);
  height: 100%;
  min-width: 1152px;
`

const CrumbsWrap = styled(Space)`
  display: flex;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 12px;
  .ant-space-item {
    line-height: 32px;
  }
  .main {
    color: var(--neutral-n1-d1);
    cursor: pointer;
  }
  .sub {
    color: var(--neutral-n3);
  }
`

const ContentWrap = styled.div`
  padding: 0 56px;
  height: calc(100% - 60px);
  overflow: auto;
`

const TitleIcon = styled(IconFont)`
  font-size: 16px;
  color: var(--neutral-n3) !important;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 16px;
  font-family: SiYuanRegular;
`

const Title = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;
  .name {
    font-family: SiYuanMedium;
    font-size: 16px;
    color: var(--neutral-n1-d1);
  }
`

const CheckBoxWrap = styled(Checkbox.Group)`
  margin-top: 8px;
  .ant-checkbox-group-item {
    margin-right: 56px;
  }
`

const CheckBoxViewWrap = styled(Space)`
  margin-top: 8px;
  .ant-checkbox-group-item {
    margin-right: 56px;
  }
`

const Label = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  margin-bottom: 8px;
`

const LineForm = styled(Space)`
  display: flex;
  align-items: center;
  margin: 8px 0 24px 0;
`

const NotificationWrap = styled.div`
  display: flex;
  flex-direction: column;
`

const ImportBox = styled.div`
  margin-top: 8px;
  width: 640px;
  border-radius: 6px;
  background: var(--neutral-n8);
  padding: 16px;
`

const ImportItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .name {
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--neutral-n2);
    font-size: 14px;
  }
  .icon {
    font-size: 16px;
    color: var(--neutral-n3);
    cursor: pointer;
    visibility: hidden;
  }
  &:hover {
    .icon {
      visibility: visible;
    }
  }
`

const CalendarSet = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { menuList, routerMenu, calendarConfig, relateConfig, calendarData } =
    useSelector(store => store.calendar)
  // 配置选项默认值
  const [formParams, setFormParams] = useState<any>({
    view_options: {
      hide_reject_schedule: 2,
      reduce_finish_schedule_light: 2,
      show_lunar_calendar: 2,
    },
    schedule_configs: {},
    notification_configs: {},
    isUpdate: false,
  })
  // 默认导入的日历
  const [importCalendar, setImportCalendar] = useState<number>()
  // 导出的日历
  const [exportIds, setExportIds] = useState<CheckboxValueType[]>([])
  // 导入的日历数组
  const [importList, setImportList] = useState<
    { name: string; id: string | number }[]
  >([])

  // 视图选项
  const options = [
    {
      label: t('calendarManager.hide_rejected_schedules'),
      value: 0,
      key: 'hide_reject_schedule',
    },
    // {
    //   label: t('calendarManager.reduce_the_brightness_of_completed_schedules'),
    //   value: 1,
    //   key: 'reduce_finish_schedule_light',
    // },
    {
      label: t('calendarManager.display_lunar_calendar'),
      value: 2,
      key: 'show_lunar_calendar',
    },
  ]

  // 一周的第一天
  const timeOption = [
    { label: t('calendarManager.sunday'), value: 0 },
    { label: t('calendarManager.saturday'), value: 6 },
    { label: t('calendarManager.monday'), value: 1 },
  ]

  // 日程颜色
  const colorList = [
    {
      name: t('calendarManager.modern_Colored_Text'),
      value: 1,
      background: 'var(--function-tag5)',
      color: 'var(--neutral-n1-d1)',
    },
    {
      name: t('calendarManager.classic_white_text'),
      value: 2,
      background: 'var(--primary-d1)',
      color: 'var(--neutral-white-d7)',
    },
  ]

  // 修改配置 key： 表单对应的key, value：修改的值 outKey: 最外层的key
  const onChangeSet = (value: number, key: string, outKey: string) => {
    const params = {
      ...formParams[outKey],
      ...{ [key]: value },
    }
    setFormParams({
      ...formParams,
      ...{ [outKey]: params },
      ...{ isUpdate: true },
    })
  }

  const onCustomRequest = async (file: any) => {
    if (
      !(file.file.type?.includes('iCal') || file.file.type?.includes('VCS'))
    ) {
      message.warning(t('calendarManager.import_calendar_text'))
      return
    }
    const data = await uploadFileByTask(
      file.file,
      file.name,
      `richEditorFiles_${new Date().getTime()}`,
    )
    setImportList([...importList, ...[{ name: data.name, id: data.id }]])
  }

  // 删除的导入的日历
  const onDeleteImport = (id: number | string) => {
    const resultList = importList.filter(
      (i: { name: string; id: number | string }) => i.id !== id,
    )
    setImportList(resultList)
  }

  const onBack = () => {
    localStorage.removeItem('calendarSetKey')
    dispatch(setRouterMenu({ name: '', key: '' }))
  }

  useEffect(() => {
    if (calendarData.manager?.length > 0) {
      setImportCalendar(calendarData.manager[0].calendar_id)
    }
  }, [calendarData])

  useEffect(() => {
    setFormParams(calendarConfig)
  }, [calendarConfig])

  useEffect(() => {
    if (formParams.isUpdate) {
      dispatch(updateCalendarConfig(formParams))
      setFormParams({ ...formParams, ...{ isUpdate: false } })
    }
  }, [formParams])

  useEffect(() => {
    if (routerMenu.key) {
      const dom = document.getElementById(`calendar-${routerMenu.key}`)
      dom?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [routerMenu])

  return (
    <CalendarSetWrap>
      <CrumbsWrap size={4}>
        <div className="main" onClick={onBack}>
          {t('calendarManager.programme')}
        </div>
        <IconFont className="main" type="right" style={{ fontSize: 14 }} />
        <div className="sub">
          {t(
            menuList.filter(
              (i: Model.Calendar.RouterMenu) => i.key === routerMenu.key,
            )[0].name as any,
          )}
        </div>
      </CrumbsWrap>
      <ContentWrap>
        <div id="calendar-view">
          <Title>
            <div className="name">{t('calendarManager.view_options')}</div>
          </Title>
          <CheckBoxViewWrap size={56}>
            {options.map((i: any) => (
              <Checkbox
                key={i.key}
                checked={formParams?.view_options?.[i.key] === 1}
                onChange={e =>
                  onChangeSet(e.target.checked ? 1 : 2, i.key, 'view_options')
                }
              >
                {i.label}
              </Checkbox>
            ))}
          </CheckBoxViewWrap>
          <Label style={{ marginTop: 24 }}>
            {t('calendarManager.the_first_day_of_the_week')}
          </Label>
          <Select
            onChange={time =>
              onChangeSet(time, 'week_first_day', 'view_options')
            }
            value={formParams?.view_options?.week_first_day}
            options={timeOption}
            style={{ width: 320 }}
            getPopupContainer={n => n}
          />
        </div>
        <div id="calendar-schedule">
          <Title>
            <div className="name">{t('calendarManager.schedule_settings')}</div>
          </Title>
          {/* <Label style={{ marginTop: 8 }}>
            {t('calendarManager.schedule_color')}
          </Label>
          <ScheduleColorWrap size={56}>
            {colorList.map(
              (i: {
                name: string
                value: number
                background: string
                color: string
              }) => (
                <div
                  className="box"
                  key={i.value}
                  onClick={() =>
                    onChangeSet(i.value, 'schedule_color', 'schedule_configs')
                  }
                >
                  <div
                    className="colorBox"
                    style={{ background: i.background, color: i.color }}
                  >
                    <span>{t('calendarManager.meeting')}</span>
                    <span>10:00-12:00</span>
                  </div>
                  <div className="radio">
                    <div
                      className={
                        formParams?.schedule_configs?.schedule_color === i.value
                          ? 'active'
                          : 'normal'
                      }
                    >
                      <div />
                    </div>
                    <div className="name">{i.name}</div>
                  </div>
                </div>
              ),
            )}
          </ScheduleColorWrap> */}
          <Label style={{ marginTop: 8 }}>
            {t('calendarManager.default_duration_of_schedule')}
          </Label>
          <Select
            onChange={normalValue =>
              onChangeSet(
                normalValue,
                'schedule_default_duration',
                'schedule_configs',
              )
            }
            value={formParams?.schedule_configs?.schedule_default_duration}
            options={relateConfig.schedule.default_duration}
            style={{ width: 320 }}
            getPopupContainer={n => n}
          />
        </div>
        <div id="calendar-notice">
          <Title>
            <div className="name">
              {t('calendarManager.notification_settings')}
            </div>
          </Title>
          <LineForm size={56}>
            <NotificationWrap>
              <Label>
                {t(
                  'calendarManager.default_reminder_time_for_non_full_day_schedule',
                )}
              </Label>
              <Select
                onChange={partialDayValue =>
                  onChangeSet(
                    partialDayValue,
                    'not_all_day_remind',
                    'notification_configs',
                  )
                }
                value={formParams?.notification_configs?.not_all_day_remind}
                options={relateConfig.schedule.un_all_day_remind}
                style={{ width: 320 }}
                getPopupContainer={n => n}
              />
            </NotificationWrap>
            <NotificationWrap>
              <Label>
                {t(
                  'calendarManager.default_reminder_time_for_all_day_schedule',
                )}
              </Label>
              <Select
                onChange={allDayValue =>
                  onChangeSet(
                    allDayValue,
                    'all_day_remind',
                    'notification_configs',
                  )
                }
                value={formParams?.notification_configs?.all_day_remind}
                options={relateConfig.schedule.all_day_remind}
                style={{ width: 320 }}
                getPopupContainer={n => n}
              />
            </NotificationWrap>
          </LineForm>
          <Checkbox
            checked={formParams?.notification_configs?.only_remind_accept === 1}
            onChange={e =>
              onChangeSet(
                e.target.checked ? 1 : 2,
                'only_remind_accept',
                'notification_configs',
              )
            }
          >
            {t('calendarManager.remind_me_only_of_accepted_schedules')}
          </Checkbox>
        </div>
        {/* <div id="calendar-import">
          <Title>
            <div className="name">{t('calendarManager.calendar_import')}</div>
            <Tooltip title={t('calendarManager.can_import_text')}>
              <TitleIcon className="icon" type="question" />
            </Tooltip>
            <Upload fileList={[]} customRequest={onCustomRequest}>
              <CommonButton type="primaryText">
                {t('calendarManager.leading_in')}
              </CommonButton>
            </Upload>
          </Title>
          <Label style={{ marginTop: 8 }}>
            {t('calendarManager.add_to_calendar')}
          </Label>
          <Select
            getPopupContainer={n => n}
            onChange={setImportCalendar}
            value={importCalendar}
            options={calendarData.manager?.map((i: Model.Calendar.Info) => ({
              label: i.name,
              value: i.calendar_id,
            }))}
            style={{ width: 320 }}
          />
          {importList.length > 0 && (
            <ImportBox>
              {importList.map((i: { name: string; id: string | number }) => (
                <ImportItem key={i.id}>
                  <Tooltip
                    title={i.name}
                    placement="topLeft"
                    getPopupContainer={n => n}
                  >
                    <div className="name">{i.name}</div>
                  </Tooltip>
                  <IconFont
                    onClick={() => onDeleteImport(i.id)}
                    className="icon"
                    type="close"
                  />
                </ImportItem>
              ))}
            </ImportBox>
          )}
        </div>
        <div id="calendar-export">
          <Title>
            <div className="name" style={{ marginRight: 16 }}>
              {t('calendarManager.calendar_export')}
            </div>
            <CommonButton type="primaryText">
              {t('calendarManager.leading_out')}
            </CommonButton>
          </Title>
          <Label style={{ marginTop: 8 }}>
            {t('calendarManager.Select_export_calendar')}
          </Label>
          <CheckBoxWrap
            style={{ margin: 0 }}
            value={exportIds}
            options={calendarData.manager?.map((i: Model.Calendar.Info) => ({
              label: i.name,
              value: i.calendar_id,
            }))}
            onChange={setExportIds}
          />
        </div> */}
      </ContentWrap>
    </CalendarSetWrap>
  )
}

export default CalendarSet

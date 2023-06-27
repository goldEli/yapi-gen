import { useSelector, useDispatch } from '@store/index'
import { setScheduleModal } from '@store/calendar'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import {
  Checkbox,
  Radio,
  type RadioChangeEvent,
  Select,
  message,
  Popover,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ScheduleInfoHeader,
  ScheduleInfoHeaderContent,
  statusClass,
  ScheduleInfoHeaderBtn,
  ScheduleInfoHeaderDate,
  iconBox,
  BoxTip,
  confirmText,
  confirmSure,
  ModalChildren,
} from '../styles'
import React, { useState, useEffect, useImperativeHandle } from 'react'
import { refreshCalendarPanelScheduleList } from '@store/schedule/schedule.thunk'
import { setShowScheduleInfoTip, setIsAddOrDelete } from '@store/schedule'
import ScheduleInfoIcon from './../ScheduleInfoIcon'
import DeleteConfirm from '@/components/DeleteConfirm'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import CommonModal from '@/components/CommonModal'
import { scheduleInfoDelete, scheduleInfoTransfer } from '@/services/schedule'
import IconFont from '@/components/IconFont'
dayjs.extend(weekday)
const { Option } = Select
interface ScheduleInfoDropdownProps {}

const ScheduleInfoHeaderBox: React.FC<ScheduleInfoDropdownProps> = props => {
  const [isVisible, setIsVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showTipBox, setShowTipBox] = useState(false)
  const [isExit, setIsExit] = useState<number>(0)
  const [userId, setUserId] = useState<number>(0)
  const { showScheduleInfoTip } = useSelector(state => state.schedule)
  const { scheduleInfo } = useSelector(state => state.schedule)
  const [t] = useTranslation()
  const disPatch = useDispatch()
  const onChangeVisible = () => {
    setIsVisible(false)
  }
  const confirmTransference = async () => {
    if (!userId) {
      message.error(t('calendarManager.user_not_empty'))
      return
    }
    const params = {
      is_exit: isExit,
      user_id: userId ?? 0,
      id: scheduleInfo?.id ? String(scheduleInfo?.id) : '',
    }
    try {
      await scheduleInfoTransfer(params)
      message.success(t('calendarManager.transfer_success'))
      setModalVisible(false)
      setShowTipBox(false)
      disPatch(setScheduleInfoDropdown({ visible: false }))
      disPatch(refreshCalendarPanelScheduleList())
    } catch (error) {
      // console.log(error)
    }
  }
  const confirmDelete = async () => {
    const params = {
      id: scheduleInfo?.id ? String(scheduleInfo?.id) : '',
      is_remind: checked,
    }
    try {
      await scheduleInfoDelete(params)
      setIsVisible(false)
      message.success(t('common.deleteSuccess'))
      disPatch(setScheduleInfoDropdown({ visible: false }))
      disPatch(refreshCalendarPanelScheduleList())
      disPatch(setIsAddOrDelete(true))
    } catch (error) {
      // console.log(error)
    }
  }
  return (
    <ScheduleInfoHeader
      onClick={e => {
        showScheduleInfoTip && disPatch(setShowScheduleInfoTip(false))
        showTipBox && setShowTipBox(!showTipBox)
        e.stopPropagation()
      }}
    >
      <ScheduleInfoHeaderBtn onClick={e => {}}>
        <span className={statusClass}>
          {scheduleInfo?.is_busy === 1
            ? t('calendarManager.busy')
            : t('calendarManager.free')}
        </span>
        <div className={iconBox}>
          {scheduleInfo?.able_update ? (
            <span
              onClick={() => {
                disPatch(
                  setScheduleModal({
                    visible: true,
                    params: { id: scheduleInfo?.id ?? 0 },
                  }),
                )
                disPatch(setScheduleInfoDropdown({ visible: false }))
              }}
            >
              <IconFont
                type="edit"
                style={{ fontSize: '18px' }}
                className="icon"
              />
            </span>
          ) : null}
          {scheduleInfo?.is_creator ? (
            <span
              onClick={() => {
                setIsVisible(true)
                disPatch(setIsAddOrDelete(false))
              }}
            >
              <IconFont
                type="delete"
                style={{ fontSize: '18px' }}
                className="icon"
              />
            </span>
          ) : null}

          <div className="moreOperate">
            <label onClick={() => disPatch(setShowScheduleInfoTip(true))}>
              <IconFont
                style={{ fontSize: '18px' }}
                type="more-01"
                className="icon"
              />
            </label>
            {showScheduleInfoTip ? (
              <BoxTip>
                <span
                  onClick={() => {
                    if (!scheduleInfo) {
                      return
                    }
                    setShowTipBox(!showTipBox)
                    disPatch(
                      setScheduleModal({
                        visible: true,
                        params: { copyScheduleId: Number(scheduleInfo?.id) },
                      }),
                    )
                    disPatch(setScheduleInfoDropdown({ visible: false }))
                  }}
                >
                  {t('calendarManager.copySchedule')}
                </span>
                {scheduleInfo?.members?.length && scheduleInfo?.is_creator ? (
                  <span
                    onClick={() => {
                      setModalVisible(true)
                      setShowTipBox(!showTipBox)
                      disPatch(setScheduleInfoDropdown({ visible: false }))
                    }}
                  >
                    {t('calendarManager.transfer_schedule')}
                  </span>
                ) : null}
              </BoxTip>
            ) : null}
          </div>
          <span
            onClick={e => {
              e.stopPropagation()
              disPatch(setScheduleInfoDropdown({ visible: false }))
            }}
          >
            <IconFont
              style={{ fontSize: '18px' }}
              type="close"
              className="icon"
            />
          </span>
        </div>
      </ScheduleInfoHeaderBtn>
      <ScheduleInfoHeaderContent>
        {scheduleInfo?.subject}
      </ScheduleInfoHeaderContent>
      <ScheduleInfoHeaderDate>{scheduleInfo?.title}</ScheduleInfoHeaderDate>
      <DeleteConfirm
        isVisible={isVisible}
        onConfirm={confirmDelete}
        onChangeVisible={onChangeVisible}
        title={t('calendarManager.delete_schedule')}
      >
        <div className={confirmText}>{t('calendarManager.delete_tips')}</div>
        <div>
          <Checkbox
            onChange={e => {
              setChecked(e.target.checked)
            }}
          ></Checkbox>
          <span className={confirmSure}>
            {t('calendarManager.delete_notice')}
          </span>
        </div>
      </DeleteConfirm>
      <CommonModal
        isVisible={modalVisible}
        title={t('calendarManager.transfer_schedule')}
        width={570}
        onClose={() => {
          setModalVisible(false)
        }}
        onConfirm={confirmTransference}
      >
        <ModalChildren>
          <Select
            style={{ width: '100%' }}
            placeholder={t('calendarManager.search_users')}
            optionLabelProp="label"
            showSearch={true}
            filterOption={(input, option) =>
              ((option?.label ?? '') as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onSelect={value => {
              setUserId(value)
            }}
          >
            {scheduleInfo?.members?.map(ele => (
              <Option
                key={ele.user_id}
                value={ele.user_id}
                label={ele?.user.name}
              >
                {ele.user.name}
              </Option>
            ))}
          </Select>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setIsExit(e.target.value)}
            value={isExit}
          >
            <Radio value={1}>{t('calendarManager.transfer_tip1')}</Radio>
            <Radio value={0}>{t('calendarManager.transfer_tip2')}</Radio>
          </Radio.Group>
        </ModalChildren>
      </CommonModal>
    </ScheduleInfoHeader>
  )
}

export default ScheduleInfoHeaderBox

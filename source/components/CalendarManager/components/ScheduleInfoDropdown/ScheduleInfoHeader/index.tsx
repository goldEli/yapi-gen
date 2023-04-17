/* eslint-disable no-empty */

import { useSelector, useDispatch } from '@store/index'
import { setScheduleModal } from '@store/calendar'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { Checkbox, Radio, type RadioChangeEvent, Select, message } from 'antd'
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
import React, { useState, useEffect } from 'react'
import ScheduleInfoIcon from './../ScheduleInfoIcon'
import DeleteConfirm from '@/components/DeleteConfirm'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import CommonModal from '@/components/CommonModal'
import { scheduleInfoDelete, scheduleInfoTransfer } from '@/services/schedule'
import { useTranslation } from 'react-i18next'
dayjs.extend(weekday)
const { Option } = Select
interface ScheduleInfoDropdownProps {}

const ScheduleInfoHeaderBox: React.FC<ScheduleInfoDropdownProps> = props => {
  const [isVisible, setIsVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showTipBox, setShowTipBox] = useState(false)
  const [isExit, setIsExit] = useState(true)
  const [userId, setUserId] = useState<number>()
  const { scheduleInfo } = useSelector(state => state.schedule)
  const [t] = useTranslation()
  const disPatch = useDispatch()
  const onChangeVisible = () => {
    setIsVisible(false)
  }
  const confirmTranster = async () => {
    const params = {
      is_exit: isExit,
      user_id: userId ?? 0,
      id: scheduleInfo?.id ? String(scheduleInfo?.id) : '',
    }
    try {
      await scheduleInfoTransfer(params)
      message.success(t('转让成功'))
      setModalVisible(false)
      setShowTipBox(false)
      disPatch(setScheduleInfoDropdown({ visible: false }))
    } catch (error) {
      console.log(error)
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
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ScheduleInfoHeader>
      <ScheduleInfoHeaderBtn>
        <span className={statusClass}>
          {scheduleInfo?.is_busy === 1 ? '忙碌' : '空闲'}
        </span>
        <div className={iconBox}>
          <span
            onClick={() => {
              disPatch(
                setScheduleModal({
                  visible: true,
                  params: { id: scheduleInfo?.id ?? 0 },
                }),
              )
            }}
          >
            <ScheduleInfoIcon type="edit" />
          </span>
          <span
            onClick={() => {
              setIsVisible(true)
            }}
          >
            <ScheduleInfoIcon type="delete" />
          </span>
          <div className="moreOperate">
            <label onClick={() => setShowTipBox(!showTipBox)}>...</label>
            {showTipBox ? (
              <BoxTip>
                <span
                  onClick={() => {
                    if (!scheduleInfo) {
                      return
                    }
                    disPatch(
                      setScheduleModal({
                        visible: true,
                        params: { copyScheduleId: Number(scheduleInfo?.id) },
                      }),
                    )
                  }}
                >
                  复制日程
                </span>
                <span
                  onClick={() => {
                    setModalVisible(true)
                  }}
                >
                  转让日程
                </span>
              </BoxTip>
            ) : null}
          </div>
          <span
            onClick={() => {
              disPatch(setScheduleInfoDropdown({ visible: false }))
            }}
          >
            <ScheduleInfoIcon type="close" />
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
        title="删除日程"
      >
        <div className={confirmText}>
          日程将删除，该日程同时会从参与者日历中移除
        </div>
        <div>
          <Checkbox
            onChange={e => {
              setChecked(e.target.checked)
            }}
          ></Checkbox>
          <span className={confirmSure}>删除后通知参与者</span>
        </div>
      </DeleteConfirm>
      <CommonModal
        isVisible={modalVisible}
        title="转让日程"
        width={528}
        onClose={() => {
          setModalVisible(false)
        }}
        onConfirm={confirmTranster}
      >
        <ModalChildren>
          <Select
            style={{ width: '100%' }}
            placeholder="搜索新的所有者"
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
                label={ele.user.name}
              >
                {ele.user.name}
              </Option>
            ))}
          </Select>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setIsExit(e.target.value)}
            value={isExit}
          >
            <Radio value={true}>转让我退出该日程</Radio>
            <Radio value={false}>转让我变为参与者</Radio>
          </Radio.Group>
        </ModalChildren>
      </CommonModal>
    </ScheduleInfoHeader>
  )
}

export default ScheduleInfoHeaderBox

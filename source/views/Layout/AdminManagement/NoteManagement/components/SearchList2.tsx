/* eslint-disable no-undefined */
// 公司员工筛选组件

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form } from 'antd'
import {
  SearchLine,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import { useEffect, useState, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import RangePicker from '@/components/RangePicker'
import { getAffiliationUser } from '@/services/project'

const Wrap = styled.div({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
})

const ClearForm = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const FormWrap = styled(Form)({
  gap: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  '.ant-form-item': {
    margin: 0,
  },
})

interface Props {
  onChangeForm?(value: any): void
  showForm?: boolean
  onSearch(value: any): void
}

const SearchList = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { isRefresh } = useSelector(store => store.user)
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [boxMaps, setBoxMaps] = useState<any>()
  const onClearForm = async () => {
    form.resetFields()
    const value = await form.validateFields()

    props.onSearch(value)
  }
  const init = async () => {
    const res = await getAffiliationUser(0)

    setDepartmentOptions(res)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (isRefresh) {
      init()
    }
  }, [isRefresh])
  useLayoutEffect(() => {
    const map: any = new Map()
    const box = document.querySelectorAll('.SelectWrapBedeck')
    box.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      map.set(attr, w)
    })
    setBoxMaps(map)
  }, [isRefresh])
  const onChangePicker = async (_values: any) => {
    form.setFieldsValue({
      times: _values,
    })
    const value = await form.validateFields()
    const obj = {
      ...value,
      start_at: value.times
        ? value.times[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      end_at: value.times
        ? value.times[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      times: undefined,
    }
    props.onSearch(obj)
  }
  const confirm = async () => {
    const value = await form.validateFields()
    const obj = {
      ...value,
      start_at: value.times
        ? value.times[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      end_at: value.times
        ? value.times[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      times: undefined,
    }
    props.onSearch(obj)
  }
  return (
    <SearchLine style={{ padding: '0 0 0px 0px', marginBottom: '24px' }}>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          <SelectWrapBedeck
            className="SelectWrapBedeck"
            datatype="send_user_ids"
          >
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('p2.sender')}
            </span>
            <Form.Item name="send_user_ids">
              <SelectWrap
                showArrow
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('send_user_ids')}
                allowClear
                options={departmentOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck
            className="SelectWrapBedeck"
            datatype="receive_user_ids"
          >
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('receiver')}
            </span>
            <Form.Item name="receive_user_ids">
              <SelectWrap
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('receive_user_ids')}
                options={departmentOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('time_of_departure')}
            </span>
            <Form.Item name="times" noStyle>
              <RangePicker
                isShowQuick
                dateValue={form.getFieldValue('times')}
                onChange={(_values: any) => onChangePicker(_values)}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck
            className="SelectWrapBedeck"
            datatype="notice_style"
          >
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('notification_type')}
            </span>
            <Form.Item name="notice_style">
              <SelectWrap
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('notice_style')}
                options={[
                  {
                    label: t('top'),
                    value: '2',
                  },
                  {
                    label: t('window'),
                    value: '1',
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="send_type">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('send_type')}
            </span>
            <Form.Item name="send_type">
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('send_type')}
                options={[
                  {
                    label: t('draft'),
                    value: 1,
                  },
                  {
                    label: t('withdrawn'),
                    value: 2,
                  },
                  {
                    label: t('sent'),
                    value: 3,
                  },
                  {
                    label: t('unsent_scheduled'),
                    value: 4,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>

          <ClearForm onClick={onClearForm}>
            <span
              style={{
                color: 'var(--primary-d2)',
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              {t('common.clearForm')}
            </span>
          </ClearForm>
        </FormWrap>
      </Wrap>
    </SearchLine>
  )
}

export default SearchList

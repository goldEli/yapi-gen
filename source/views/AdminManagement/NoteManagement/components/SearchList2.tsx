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
import { useEffect, useState } from 'react'
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
    <SearchLine style={{ padding: '0 0 0 24px' }}>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>发送人</span>
            <Form.Item name="send_user_ids">
              <SelectWrap
                showArrow
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                allowClear
                options={departmentOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>接收人</span>
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
                options={departmentOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('setting.operationTime')}
            </span>
            <Form.Item name="times" noStyle>
              <RangePicker
                isShowQuick
                dateValue={form.getFieldValue('times')}
                onChange={(_values: any) => onChangePicker(_values)}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>通知类型</span>
            <Form.Item name="type">
              <SelectWrap
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: '顶部',
                    value: 1,
                  },
                  {
                    label: '窗口',
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>发送类型</span>
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
                options={[
                  {
                    label: '草稿',
                    value: 1,
                  },
                  {
                    label: '已撤回',
                    value: 2,
                  },
                  {
                    label: '已发送',
                    value: 3,
                  },
                  {
                    label: '定时未发送',
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

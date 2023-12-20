import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import IconFont from '@/components/IconFont'
import MoreOptions from '@/components/MoreOptions'
import CommonButton from '@/components/CommonButton'
import { DatePicker, Form, Input, Select, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FooterBtn, FormWrap } from './style'
import { makePy } from '@/components/CreateAProjectForm/tool'
import moment from 'moment'
import { getMessage } from '@/components/Message'

const RightForm = (props: {
  isEditId: any
  formValues: any
  selectLeaders: []
  onUpdateValues(val: any): void
  onCreate(val: any): void
  onCancel(): void
  onBack(): void
}) => {
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [t] = useTranslation()

  const [lock, setLock] = useState(true)

  const upper = (str: string) => {
    // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
    const pattern = new RegExp('[\u4E00-\u9FA5]+')
    const newStr = []
    for (const i of str.split('')) {
      if (pattern.test(i)) {
        newStr.push(makePy(i))
      } else {
        newStr.push(i.toLocaleUpperCase())
      }
    }
    return newStr.join('')
  }

  const transformStr = (str: string) => {
    // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
    const judgeFn = new RegExp(/\s+/g)
    const newStr = []
    if (judgeFn.test(str)) {
      for (const i of str.split(' ')) {
        newStr.push(i.substring(0, 1))
      }

      return upper(newStr.join(''))
    }
    return upper(str)
  }

  const onChange = (e: any) => {
    const textStr = e.target.value.trim()
    if (lock) {
      form.setFieldsValue({
        prefix:
          transformStr(textStr).length > 10
            ? transformStr(textStr).slice(0, 10)
            : transformStr(textStr),
      })
    }
  }

  useEffect(() => {
    if (props.formValues) {
      form.setFieldsValue({ ...props.formValues })
    } else {
      form.resetFields()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [props.formValues])

  //  表单抛出去的参数
  const onCreateProject = async () => {
    const formData = await form.validateFields()
    if (
      formData?.expected_start_at &&
      formData?.expected_end_at &&
      moment(formData?.expected_start_at || '').unix() >
        moment(formData?.expected_end_at || '').unix()
    ) {
      getMessage({
        msg: t('version2.startTimeComputedEndTime'),
        type: 'warning',
      })
      return
    }

    const formObj = {
      ...formData,
      expected_start_at: formData?.expected_start_at
        ? moment(formData?.expected_start_at).format('YYYY-MM-DD')
        : '',
      expected_end_at: formData?.expected_end_at
        ? moment(formData?.expected_end_at).format('YYYY-MM-DD')
        : '',
    }
    props.onCreate(formObj)
  }

  // 表单实时更新的字段
  const onValuesChange = async (e: any, val: any) => {
    const nameVal = val.name.trim()
    if (nameVal) {
      // 编号的字段会比名称慢一步
      val.prefix =
        transformStr(nameVal).length > 10
          ? transformStr(nameVal).slice(0, 10)
          : transformStr(nameVal)
    }
    const formObj = {
      ...val,
      expected_start_at: val?.expected_start_at
        ? moment(val?.expected_start_at).format('YYYY-MM-DD')
        : '',
      expected_end_at: val?.expected_end_at
        ? moment(val?.expected_end_at).format('YYYY-MM-DD')
        : '',
    }
    await props.onUpdateValues(formObj)
  }
  return (
    <div>
      <FormWrap
        onFinish={onCreateProject}
        onValuesChange={onValuesChange}
        form={form}
        layout="vertical"
        onFinishFailed={() => {
          setTimeout(() => {
            const errorList = (document as any).querySelectorAll(
              '.ant-form-item-has-error',
            )
            errorList[0]?.scrollIntoView({
              block: 'center',
              behavior: 'smooth',
            })
          }, 100)
        }}
      >
        <Form.Item
          // eslint-disable-next-line react/jsx-no-undef
          label={<FormTitleSmall text={t('project_name')} />}
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input
            ref={inputRefDom as any}
            maxLength={30}
            placeholder={t('please_enter_a_project_name')}
            onChange={onChange}
            allowClear
            autoFocus
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label={
            <div>
              <FormTitleSmall text={t('serialNumber')} />
              <Tooltip
                overlayStyle={{
                  fontSize: '12px',
                }}
                trigger={['click']}
                placement="top"
                title={t(
                  'the_key_is_used_to_distinguish_items_and_is_used_as_a_requirement_number_prefix',
                )}
              >
                <IconFont
                  style={{
                    position: 'absolute',
                    left: localStorage.language === 'zh' ? '43px' :'72px',
                    top: '4px',
                    color: 'var(--neutral-n3)',
                  }}
                  type="question"
                />
              </Tooltip>
            </div>
          }
          name="prefix"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <Input
            maxLength={10}
            onChange={e => !e.target.value && setLock(true)}
            onFocus={() => setLock(false)}
            placeholder={t('please_enter_the_key')}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: '' }]}
          label={<FormTitleSmall text={t('project_leader')} />}
          name="leader_id"
        >
          <CustomSelect
            optionFilterProp="label"
            showSearch
            placeholder={t('please_select_project_leader')}
          >
            {props.selectLeaders?.map((i: any) => (
              <Select.Option value={i.id} key={i.id} label={i.name}>
                <MoreOptions
                  type="user"
                  name={i.name}
                  dec={i.dec}
                  img={i.img}
                />
              </Select.Option>
            ))}
          </CustomSelect>
        </Form.Item>

        <Form.Item
          label={<FormTitleSmall text={t('estimatedStartTime')} />}
          name="expected_start_at"
        >
          <DatePicker
            getPopupContainer={node => node}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label={<FormTitleSmall text={t('estimatedEndTime')} />}
          name="expected_end_at"
        >
          <DatePicker
            getPopupContainer={node => node}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={<FormTitleSmall text={t('project_description')} />}
          name="info"
        >
          <Input.TextArea
            style={{ marginBottom: 16 }}
            placeholder={t('please_enter_project_description')}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </FormWrap>
      <FooterBtn style={{ gap: '16px' }}>
        <CommonButton type="light" onClick={props.onCancel}>
          取消
        </CommonButton>
        {!props.isEditId && (
          <CommonButton type="secondary" onClick={props.onBack}>
            上一步
          </CommonButton>
        )}
        <CommonButton type="primary" onClick={onCreateProject}>
          {props.isEditId ? '编辑' : '创建'}
        </CommonButton>
      </FooterBtn>
    </div>
  )
}
export default RightForm

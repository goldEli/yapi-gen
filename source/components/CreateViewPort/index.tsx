/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import { useDispatch, useSelector } from '@store/index'
import { changeCreateVisible } from '@store/view'
import { addViewList, getViewList } from '@store/view/thunk'
import { Form, Input, message } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import FormTitleSmall from '../FormTitleSmall'
import { Wrap, WrapText } from './style'

const CreateViewPort = (props: any) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { searchKey, valueKey, titles, sort, createVisible, inputKey } =
    useSelector(state => state.view)
  const dispatch = useDispatch()
  const onConfirm = async () => {
    const res = await form.validateFields()
    const obj: any = {}
    for (const i in searchKey) {
      obj[searchKey[i].key] = null
    }

    const data = {
      name: res.name,
      config: {
        search: { ...obj, ...valueKey, keyword: inputKey },
        fields: titles,
        sort,
      },
      project_id: props.pid,
    }

    await dispatch(addViewList(data))
    await dispatch(getViewList(props.pid))
    await dispatch(changeCreateVisible(false))
    message.success(t('common.createSuccess'))
    form.resetFields()
  }
  const onClose = () => {
    form.resetFields()
    dispatch(changeCreateVisible(false))
  }
  return (
    <CommonModal
      onConfirm={onConfirm}
      onClose={onClose}
      title={t('creating_a_view')}
      isVisible={createVisible}
    >
      <Wrap>
        <WrapText>
          {t(
            'saves_the_current_filter_criteria_display_fields_and_sort_as_a_new_view',
          )}
        </WrapText>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<FormTitleSmall text={t('name_of_view')} />}
            name="name"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              maxLength={20}
              placeholder={t('please_enter_a_view_name_limited_to_20_words')}
            />
          </Form.Item>
        </Form>
      </Wrap>
    </CommonModal>
  )
}

export default CreateViewPort

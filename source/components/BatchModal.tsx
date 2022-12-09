// 批量操作弹窗 -- 编辑及删除

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */

import { useEffect, useState } from 'react'
import DeleteConfirm from './DeleteConfirm'
import CommonModal from './CommonModal'
import { Checkbox, DatePicker, Form, message, Select } from 'antd'
import { FormWrapDemand } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, getTypeComponent } from '@/tools'
import moment from 'moment'

interface Props {
  isVisible: boolean
  onChangeVisible(): void
  type: string
  selectRows: any
  onClose(): void
}

const BatchModal = (props: Props) => {
  const [t] = useTranslation()
  const [haveChildren, setHaveChildren] = useState(false)
  const [form] = Form.useForm()
  const { batchDelete, batchEdit, getBatchEditConfig } = useModel('demand')
  const { memberList, selectAllStaffData } = useModel('project')
  const [chooseSelect, setChooseSelect] = useState<any>([])
  const [chooseType, setChooseType] = useState('')
  const [chooseAfter, setChooseAfter] = useState<any>({})
  // 需求类别的状态下拉
  const [categoryStatusList, setCategoryStatusList] = useState<any>([])
  const [currentTypeItem, setCurrentTypeItem] = useState<any>({})
  const { isRefresh } = useModel('user')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  // 获取批量编辑的下拉列表
  const getBatchEditConfigList = async () => {
    const response = await getBatchEditConfig({
      projectId,
      demandIds: props.selectRows?.map((i: any) => i.id),
    })
    setChooseSelect(response)
  }

  useEffect(() => {
    if (props.type === 'edit') {
      getBatchEditConfigList()
    }
  }, [props.type])

  useEffect(() => {
    const list = JSON.parse(JSON.stringify(chooseSelect))
    let filterItem: any = {}
    if (chooseType) {
      // 筛选对应key的下拉值
      filterItem = list?.filter((i: any) => i.value === chooseType)[0]
      if (
        chooseType === 'users' ||
        (['user_select_checkbox', 'user_select'].includes(filterItem.attr) &&
          filterItem.selectList[0] === 'projectMember')
      ) {
        // 单独处理项目人员下拉
        filterItem.selectList = memberList?.map((i: any) => ({
          label: i.name,
          value: i.id,
        }))
      } else if (
        chooseType === 'copysend' ||
        (['user_select_checkbox', 'user_select'].includes(filterItem.attr) &&
          filterItem.selectList[0] === 'companyMember')
      ) {
        // 单独处理公司人员下拉
        filterItem.selectList = selectAllStaffData
      } else if (chooseType === 'category_id') {
        // 单独处理需求类别下拉
        filterItem.selectList = filterItem.selectList?.map((i: any) => ({
          label: i.content,
          value: i.list[0].category_id,
          list: i.list?.map((k: any) => ({
            label: k.status.content,
            value: k.status.id,
          })),
        }))
      } else {
        // 其余的下拉，如果是自定义字段则单独处理
        filterItem.selectList = String(chooseType).includes('custom_')
          ? filterItem.selectList
          : filterItem.selectList?.map((i: any) => ({
              label: i.content,
              value: i.id,
            }))
      }
    }
    setChooseAfter(filterItem)
  }, [chooseType])

  // 批量删除的取消事件
  const onCloseDelete = () => {
    setHaveChildren(false)
    props.onChangeVisible()
  }

  // 批量删除的确认事件
  const onConfirmDelete = async () => {
    try {
      await batchDelete({
        isDeleteChild: haveChildren ? 1 : 2,
        demandIds: props.selectRows?.map((i: any) => i.id),
        projectId,
      })
      message.success(t('common.deleteSuccess'))
      setHaveChildren(false)
      props.onClose()
    } catch (error) {
      //
    }
  }

  // 批量编辑的取消事件
  const onEditClose = () => {
    props.onChangeVisible()
    setChooseAfter({})
    setCategoryStatusList([])
    form.resetFields()
  }

  // 批量编辑的确认事件
  const onConfirmEdit = async () => {
    await form.validateFields()
    let params: any = {
      projectId,
      demandIds: props.selectRows?.map((i: any) => i.id),
      type: chooseType,
    }
    const values = form.getFieldsValue()
    if (chooseType === 'category_id') {
      params.target = {
        category_id: values.target,
        status: values.status,
      }
    } else {
      if (values.target) {
        // 如果是时间组件的话，需要处理成字符串，还要加是否有时分秒判断
        params.target =
          ['expected_start_at', 'expected_end_at'].includes(chooseType) ||
          chooseAfter.attr === 'date'
            ? moment(values.target).format(
                chooseAfter.selectList[0] === 'datetime'
                  ? 'YYYY-MM-DD HH:mm:ss'
                  : 'YYYY-MM-DD',
              )
            : values.target
      } else {
        // 如果没选target，处理target参数类型
        let targetValue: any
        if (['tag', 'users', 'copysend'].includes(currentTypeItem.value)) {
          targetValue = []
        } else if (
          String(currentTypeItem.value).includes('custom_') &&
          ['select_checkbox', 'checkbox', 'user_select_checkbox'].includes(
            currentTypeItem?.attr,
          )
        ) {
          targetValue = []
        } else {
          targetValue = ''
        }
        params.target = targetValue
      }
    }
    try {
      await batchEdit(params)
      message.success(t('common.editSuccess'))
      onEditClose()
      props.onClose()
    } catch (error) {
      //
    }
  }

  // 单独控制需求类别的状态
  const onChangeCategory = (value: any) => {
    if (!value) {
      form.setFieldsValue({
        status: '',
      })
    }
    setCategoryStatusList(
      value
        ? chooseAfter.selectList?.filter((i: any) => i.value === value)[0]?.list
        : [],
    )
  }

  // 切换更新属性
  const onChangeType = (value: any) => {
    setChooseAfter({})
    setCategoryStatusList([])
    form.resetFields()
    form.setFieldsValue({
      type: value,
    })
    setChooseType(value)
    setCurrentTypeItem(chooseSelect?.filter((i: any) => i.value === value)[0])
  }

  return (
    <>
      {props.type === 'delete' && (
        <DeleteConfirm
          isVisible={props.isVisible}
          onChangeVisible={onCloseDelete}
          title={t('version2.deleteTitle', { count: props.selectRows?.length })}
          onConfirm={onConfirmDelete}
        >
          <div style={{ marginBottom: 12 }}>{t('version2.deleteToast')}</div>
          <Checkbox onChange={e => setHaveChildren(e.target.checked)}>
            {t('version2.deleteChildren')}
          </Checkbox>
        </DeleteConfirm>
      )}
      {props.type === 'edit' && (
        <CommonModal
          isVisible={props.isVisible}
          onClose={onEditClose}
          title={t('version2.editTitle', { count: props.selectRows?.length })}
          onConfirm={onConfirmEdit}
        >
          <FormWrapDemand
            form={form}
            layout="vertical"
            style={{ padding: '0 20px 0 2px' }}
          >
            <Form.Item
              label={t('version2.chooseUpdate')}
              name="type"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                options={chooseSelect}
                onChange={onChangeType}
              />
            </Form.Item>
            {String(chooseType).includes('expected_') && (
              <Form.Item label={t('version2.updateAfter')} name="target">
                <DatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            )}
            {!String(chooseType).includes('expected_') &&
              !String(chooseType).includes('custom_') && (
                <Form.Item
                  label={t('version2.updateAfter')}
                  name="target"
                  rules={[
                    { required: chooseType === 'category_id', message: '' },
                  ]}
                >
                  <Select
                    showSearch
                    showArrow
                    optionFilterProp="label"
                    getPopupContainer={node => node}
                    allowClear
                    options={chooseAfter.selectList}
                    onChange={
                      chooseType === 'category_id' ? onChangeCategory : void 0
                    }
                    mode={
                      [
                        'priority',
                        'iterate_id',
                        'parent_id',
                        'class_id',
                        'category_id',
                      ].includes(chooseType)
                        ? ('' as any)
                        : 'multiple'
                    }
                  />
                </Form.Item>
              )}
            {chooseType && String(chooseType).includes('custom_') && (
              <Form.Item label={t('version2.updateAfter')} name="target">
                {getTypeComponent(
                  {
                    attr: chooseAfter.attr,
                    remarks: '',
                    value: chooseAfter.selectList,
                  },
                  false,
                )}
              </Form.Item>
            )}
            {chooseType === 'category_id' && (
              <Form.Item
                label={t('version2.updateAfterStatus')}
                name="status"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  placeholder={t('common.pleaseSelect')}
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  options={categoryStatusList}
                />
              </Form.Item>
            )}
          </FormWrapDemand>
        </CommonModal>
      )}
    </>
  )
}

export default BatchModal

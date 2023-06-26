/* eslint-disable no-lonely-if */
// 批量操作弹窗 -- 编辑及删除
import { useEffect, useState } from 'react'
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  TreeSelect,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  getNestedChildren,
  getParamsData,
  getTypeComponent,
  removeNull,
} from '@/tools'
import moment from 'moment'
import { useSelector } from '@store/index'
import { batchDelete, batchEdit, getBatchEditConfig } from '@/services/demand'
import { getMessage } from '../Message'
import DeleteConfirm from '../DeleteConfirm'
import CommonModal from '../CommonModal'
import CustomSelect from '../CustomSelect'
import {
  batchAffairsDelete,
  getAffairsBatchEditConfig,
  batchAffairsEdit,
} from '@/services/affairs'
import {
  batchFlawDelete,
  batchFlawEdit,
  getFlawBatchEditConfig,
} from '@/services/flaw'

interface Props {
  // 弹窗状态
  isVisible: boolean
  // 关闭弹窗
  onChangeVisible(): void
  // 编辑、删除
  type: 'edit' | 'delete'
  // 批量勾选的数组
  selectRows: any
  onClose(): void
  // 1-需求，2-缺陷，3-事务
  modelType: number
}

const BatchModal = (props: Props) => {
  const [t] = useTranslation()
  const [haveChildren, setHaveChildren] = useState(false)
  const [form] = Form.useForm()
  const [chooseSelect, setChooseSelect] = useState<any>([])
  const [chooseType, setChooseType] = useState('')
  const [chooseAfter, setChooseAfter] = useState<any>({})
  // 需求类别的状态下拉
  const [categoryStatusList, setCategoryStatusList] = useState<any>([])
  const [currentTypeItem, setCurrentTypeItem] = useState<any>({})
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfoValues } = useSelector(store => store.project)
  // 是否包含标准事务类型-个数
  const [hasStandard, setHasStandard] = useState(false)
  const modelMethods = [
    {
      type: 1,
      config: getBatchEditConfig,
      update: batchEdit,
      del: batchDelete,
      checkboxText: '同时删除对应子需求',
      text: '勾选的需求将被删除，确认删除吗？',
    },
    {
      type: 2,
      config: getFlawBatchEditConfig,
      update: batchFlawEdit,
      del: batchFlawDelete,
      checkboxText: '同时删除对应子项',
      text: '勾选的缺陷将被删除，确认删除吗？',
    },
    {
      type: 3,
      config: getAffairsBatchEditConfig,
      update: batchAffairsEdit,
      del: batchAffairsDelete,
      checkboxText: '同时删除对应子事务',
      text: '勾选的事务将被删除，确认删除吗？',
    },
  ]
  const currentType = modelMethods.filter(
    (i: any) => i.type === props.modelType,
  )[0]

  // 获取批量编辑的下拉列表
  const getBatchEditConfigList = async () => {
    const response = await currentType?.config({
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
    if (
      props.modelType === 3 &&
      props.selectRows.filter((i: any) => [5, 4].includes(i.work_type))
        ?.length > 0
    ) {
      setHasStandard(true)
      setHaveChildren(true)
    }
  }, [props.selectRows])

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
        filterItem.selectList = removeNull(projectInfoValues, 'user_name')?.map(
          (k: any) => ({
            label: k.content,
            value: k.id,
          }),
        )
      } else if (
        chooseType === 'copysend' ||
        (['user_select_checkbox', 'user_select'].includes(filterItem.attr) &&
          filterItem.selectList[0] === 'companyMember')
      ) {
        // 单独处理公司人员下拉
        filterItem.selectList = removeNull(
          projectInfoValues,
          'users_copysend_name',
        )?.map((k: any) => ({
          label: k.content,
          value: k.id,
        }))
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
      } else if (chooseType === 'class_id') {
        // 需求分类的下拉数据
        filterItem.attr = 'treeSelect'
        const classList = filterItem.selectList
        filterItem.selectList = [
          ...[
            {
              title: t('newlyAdd.unclassified'),
              key: 0,
              value: 0,
              children: [],
            },
          ],
          ...getNestedChildren(classList, 0),
        ]
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
    await currentType?.del({
      isDeleteChild: haveChildren ? 1 : 2,
      demandIds: props.selectRows?.map((i: any) => i.id),
      projectId,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    setHaveChildren(false)
    props.onClose()
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
        if (['severity', 'discovery_version'].includes(chooseType)) {
          params.target = values.target
        } else {
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
        }
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
    await currentType?.update(params)
    getMessage({ msg: t('common.editSuccess'), type: 'success' })
    onEditClose()
    props.onClose()
  }

  // 单独控制需求类别的状态
  const onChangeCategory = (value: any) => {
    if (!value) {
      form.setFieldsValue({
        status: '',
      })
    }
    form.setFieldsValue({
      target: value,
    })
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

  // 获取删除文字
  const getDeleteText = () => {
    if (props.modelType === 3) {
      // 如果勾选的全部都是子任务类型，则不显示勾选框
      if (
        props.selectRows.filter((i: any) => i.work_type === 6)?.length ===
        props.selectRows?.length
      ) {
        return ''
      } else {
        // 如果是包含了标准事务类型，则禁用并勾选，如果是长故事类型就展示勾选框
        return (
          <Checkbox
            checked={haveChildren}
            disabled={hasStandard}
            onChange={e => setHaveChildren(e.target.checked)}
          >
            {currentType?.checkboxText}
          </Checkbox>
        )
      }
    } else {
      return (
        <Checkbox onChange={e => setHaveChildren(e.target.checked)}>
          {currentType?.checkboxText}
        </Checkbox>
      )
    }
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
          <div style={{ marginBottom: 12 }}>{currentType?.text}</div>
          {getDeleteText()}
        </DeleteConfirm>
      )}
      {props.type === 'edit' && (
        <CommonModal
          isVisible={props.isVisible}
          onClose={onEditClose}
          title={t('version2.editTitle', { count: props.selectRows?.length })}
          onConfirm={onConfirmEdit}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ padding: '0 20px 0 24px' }}
          >
            <Form.Item
              label={t('version2.chooseUpdate')}
              name="type"
              rules={[{ required: true, message: '' }]}
            >
              <CustomSelect
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={(node: any) => node}
                allowClear
                optionFilterProp="label"
                options={chooseSelect}
                onChange={onChangeType}
              />
            </Form.Item>
            {/* 时间相关字段 */}
            {String(chooseType).includes('expected_') && (
              <Form.Item label={t('version2.updateAfter')} name="target">
                <DatePicker
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={t('common.pleaseSelect')}
                />
              </Form.Item>
            )}
            {/* 解决办法 */}
            {String(chooseType).includes('solution') && (
              <Form.Item label={t('version2.updateAfter')} name="target">
                <Input placeholder={t('common.pleaseEnter')} allowClear />
              </Form.Item>
            )}
            {/* 分类 */}
            {chooseType === 'class_id' && (
              <Form.Item label={t('version2.updateAfter')} name="target">
                <TreeSelect
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  treeData={chooseAfter.selectList}
                  placeholder={t('common.pleaseSelect')}
                />
              </Form.Item>
            )}
            {/* 不是时间字段、分类及解决办法并且不是自定义字段 */}
            {!String(chooseType).includes('expected_') &&
              chooseType !== 'class_id' &&
              chooseType !== 'solution' &&
              chooseType !== 'category_id' &&
              !String(chooseType).includes('custom_') && (
                <Form.Item
                  label={t('version2.updateAfter')}
                  name="target"
                  rules={[
                    { required: chooseType === 'category_id', message: '' },
                  ]}
                >
                  <CustomSelect
                    placeholder={t('common.pleaseSelect')}
                    showSearch
                    showArrow
                    optionFilterProp="label"
                    getPopupContainer={(node: any) => node}
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
                        'severity',
                        'discovery_version',
                      ].includes(chooseType)
                        ? ('' as any)
                        : 'multiple'
                    }
                  />
                </Form.Item>
              )}
            {/* 自定义字段但不是确认勾选 */}
            {chooseType &&
              String(chooseType).includes('custom_') &&
              chooseAfter.attr !== 'single_checkbox' && (
                <Form.Item label={t('version2.updateAfter')} name="target">
                  {getTypeComponent(
                    {
                      attr: chooseAfter.attr,
                      remarks: [
                        'select_checkbox',
                        'radio',
                        'checkbox',
                        'select',
                        'user_select',
                        'user_select_checkbox',
                        'date',
                      ].includes(chooseAfter.attr)
                        ? t('common.pleaseSelect')
                        : t('common.pleaseEnter'),
                      value: chooseAfter.selectList,
                    },
                    void 0,
                  )}
                </Form.Item>
              )}
            {/* 自定义字段是确认勾选 */}
            {chooseType &&
              String(chooseType).includes('custom_') &&
              chooseAfter.attr === 'single_checkbox' && (
                <Form.Item label={t('version2.updateAfter')} name="target">
                  <CustomSelect
                    placeholder={t('common.pleaseSelect')}
                    showSearch
                    showArrow
                    optionFilterProp="label"
                    getPopupContainer={(node: any) => node}
                    allowClear
                  >
                    <Select.Option value={0}>{t('untick')}</Select.Option>
                    <Select.Option value={1}>{t('check')}</Select.Option>
                  </CustomSelect>
                </Form.Item>
              )}
            {/* 类别 */}
            {chooseType === 'category_id' && (
              <Form.Item
                label={t('version2.updateAfterStatus')}
                name="status"
                rules={[{ required: true, message: '' }]}
              >
                <CustomSelect
                  placeholder={t('common.pleaseSelect')}
                  showArrow
                  showSearch
                  getPopupContainer={(node: any) => node}
                  allowClear
                  optionFilterProp="label"
                  options={categoryStatusList}
                />
              </Form.Item>
            )}
          </Form>
        </CommonModal>
      )}
    </>
  )
}

export default BatchModal

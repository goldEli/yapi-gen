/* eslint-disable no-delete-var */
// 公用列表筛选组件

/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Popover, Collapse, Input, TreeSelect } from 'antd'
import IconFont from './IconFont'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { DelButton, SearchLine, SelectWrapBedeck } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import RangePicker from './RangePicker'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys } from '@store/project'
import { saveValue } from '@store/view'
import MoreSelect from './MoreSelect'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import CategoryDropdown from './CategoryDropdown'
import { useLocation } from 'react-router-dom'

const MySpan = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: var(--neutral-n2);
  border-radius: 6px 6px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    /* background: var(--hover-d1); */
    color: var(--primary-d2);
  }
`

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const SelectWrap = styled.div`
  min-width: 160px;
  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
  }
  display: flex;
  align-items: center;
`

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

export const rangPicker = css`
  .ant-picker-panel-container {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-picker-footer {
    min-width: inherit;
    width: max-content;
  }
  .ant-picker-ranges {
    display: flex;
    flex-direction: column;
  }
  .ant-tag {
    margin-right: 0;
  }
`

const CollapseDiv = styled.div({
  color: 'var(--neutral-n2)',
  minHeight: 35,
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '24px',
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    background: 'var(--neutral-n7)',
    color: 'black',
  },
})
const danweiCss = css`
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
  margin: 0 16px;
`
const CollapseWrap = styled(Collapse)({
  border: 'none',
  backgroundColor: 'white',
  '.ant-collapse-item': {
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  '.ant-collapse-item > .ant-collapse-header': {
    height: 32,
    width: '100%',
    lineHeight: '32px',
    padding: '0 16px',
    direction: 'rtl',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var( --neutral-n2)',
    '.ant-collapse-arrow': {
      margin: '0 0 0 8px',
    },
  },
  '.ant-collapse-content': {
    width: '100%',
    padding: '8px 0',
    '.ant-collapse-content-box': {
      padding: 0,
    },
  },
})

const PopoverWrap = styled(Popover)({
  '.ant-popover-content': {
    minWidth: 188,
  },
})
const IconFontStyle = styled(IconFont)({
  fontSize: 20,
  // color: 'var(--neutral-n4)',
})
export const NumericInput = (props: any) => {
  const [t] = useTranslation()
  const { value, onChange, onPress } = props

  const enter = (e: any) => {
    onChange({ ...value, start: e })
  }
  const enter2 = (e: any) => {
    onChange({ ...value, end: e })
  }

  return (
    <>
      <Input
        type="number"
        placeholder={t('newlyAdd.pleaseValue')}
        onPressEnter={onPress}
        onChange={e => enter(e.target.value)}
        value={value?.start}
        onBlur={onPress}
        allowClear
        style={{ width: '100px', border: 'none' }}
      />
      <span className={danweiCss}>{t('newlyAdd.unit')}</span>
      <Input
        type="number"
        placeholder={t('newlyAdd.pleaseValue')}
        onPressEnter={onPress}
        onChange={e => enter2(e.target.value)}
        value={value?.end}
        style={{ width: '100px', border: 'none' }}
        onBlur={onPress}
        allowClear
      />
      {/* <span className={danweiCss}>{t('newlyAdd.unit')}</span> */}
    </>
  )
}

export const NumericInput2 = (props: any) => {
  const [t] = useTranslation()
  const { value, onChange, onPress } = props

  const enter = (e: any) => {
    onChange({ ...value, start: e })
  }
  const enter2 = (e: any) => {
    onChange({ ...value, end: e })
  }

  return (
    <>
      <Input
        type="number"
        placeholder={t('newlyAdd.pleaseValue')}
        onPressEnter={onPress}
        onChange={e => enter(e.target.value)}
        value={value?.start}
        onBlur={onPress}
        allowClear
        style={{ width: '100px', border: 'none' }}
      />
      <Input
        type="number"
        placeholder={t('newlyAdd.pleaseValue')}
        onPressEnter={onPress}
        onChange={e => enter2(e.target.value)}
        value={value?.end}
        style={{ width: '100px', border: 'none' }}
        onBlur={onPress}
        allowClear
      />
    </>
  )
}

const TableFilter = (props: any) => {
  const [t] = useTranslation()
  const location = useLocation()
  const info = useGetloginInfo()
  const { list, basicsList, specialList, customList } = props
  const [form] = Form.useForm()
  const { filterKeys, projectInfoValues } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const searchChoose = useSelector(store => store.view.searchChoose)
  const myId = useSelector(store => store.user.loginInfo.id)

  const filterBasicsList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = basicsList
      ?.filter((item: any) => !newKeys.includes(item.content))
      .filter((item: any) => {
        if (props.noNeed) {
          return item.content !== 'class'
        }
        return item
      })
    return arr
  }, [list, basicsList])

  const filterSpecialList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = specialList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, specialList])

  const filterCustomList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = customList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, customList])

  // 查询筛选值，operationKey： 记录当前查询的key,delKey: 删除的key, type: 类型值1位字符串，2是时间
  const confirm = async (operationKey?: any, delKey?: any, type?: any) => {
    // 当前查询的存入计数
    if (operationKey) {
      const keys = [...filterKeys, ...[operationKey]]
      dispatch(setFilterKeys([...new Set(keys)]))
    } else {
      dispatch(setFilterKeys([]))
    }

    const value = await form.getFieldsValue()
    const res = JSON.parse(JSON.stringify(value))
    const res2 = JSON.parse(JSON.stringify(value))
    const customField: any = {}
    for (const key in res2) {
      if (key.startsWith('custom')) {
        customField[key] = res2[key]
      }
    }

    if (typeof delKey === 'string') {
      if (delKey?.includes('custom_')) {
        delete customField[delKey]
        delete res[delKey]
      } else {
        delete res[delKey]
      }
      form.setFieldsValue({
        [delKey]: type === 1 ? '' : type === 2 ? null : [],
      })
    }

    // 当前被删除的和值全部清空的删除计数
    if (
      delKey ||
      form.getFieldValue(operationKey)?.length <= 0 ||
      !form.getFieldValue(operationKey)
    ) {
      const keys = filterKeys?.filter((i: any) => i !== operationKey)
      dispatch(setFilterKeys([...new Set(keys)]))
    }

    props.onSearch(res, customField)

    dispatch(saveValue(res))
  }

  // 点击删除按钮
  const delList = (key: string, type?: any) => {
    props.onFilter(key, 0)
    confirm(key, key, type)
  }

  const addList = (key: string) => {
    props.onFilter(key, 1)
  }

  const onClearForm = async () => {
    form.resetFields()
    confirm()
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.defaultValue)
    // 页面报错加的这条
    if (!props.defaultValue) {
      return
    } else if (Object.keys(props.defaultValue)?.length === 0) {
      return
    }
    confirm()
  }, [props.defaultValue])

  useEffect(() => {
    if (Object.hasOwn(searchChoose || {}, 'system_view')) {
      if (searchChoose.system_view === 1) {
        form.resetFields()
        confirm()
      }
      if (searchChoose.system_view === 2) {
        form.resetFields()
        form.setFieldValue('users_name', [myId])
        confirm('users_name')
      }
      if (searchChoose.system_view === 3) {
        form.resetFields()
        form.setFieldValue('user_name', [myId])
        confirm('user_name')
      }
    }
  }, [searchChoose])
  useEffect(() => {
    form.resetFields()
    confirm()
  }, [location])
  // 折叠图标
  const expandIcon = (e: any) => {
    return (
      <IconFont
        type={e.isActive ? 'down' : 'right'}
        style={{ fontSize: 14, marginRight: 0 }}
      />
    )
  }

  const content = (
    <div
      style={{
        padding: '5px 0',
      }}
    >
      <CollapseWrap
        defaultActiveKey={['1']}
        accordion
        expandIcon={e => expandIcon(e)}
      >
        <Collapse.Panel header={t('components.basicFiled')} key="1">
          {filterBasicsList
            ?.filter((k: any) =>
              props.isIteration ? k.key !== 'iterate_name' : k,
            )
            ?.map((i: any) => (
              <CollapseDiv onClick={() => addList(i.content)} key={i.id}>
                {i.content_txt}
              </CollapseDiv>
            ))}
        </Collapse.Panel>
        <Collapse.Panel header={t('components.personOrTime')} key="2">
          {filterSpecialList?.map((i: any) => (
            <CollapseDiv onClick={() => addList(i.content)} key={i.id}>
              {i.content_txt}
            </CollapseDiv>
          ))}
        </Collapse.Panel>
        <Collapse.Panel header={t('newlyAdd.customFields')} key="3">
          {filterCustomList?.map((i: any) => (
            <CollapseDiv onClick={() => addList(i.content)} key={i.id}>
              {i.title}
            </CollapseDiv>
          ))}
        </Collapse.Panel>
      </CollapseWrap>
    </div>
  )

  const onChangeTime = (key: any, dates: any) => {
    if (dates) {
      form.setFieldsValue({
        [key]: [
          moment(dates[0]).unix()
            ? moment(dates[0]).format('YYYY-MM-DD')
            : '1970-01-01',
          moment(dates[1]).unix() === 1893427200
            ? '2030-01-01'
            : moment(dates[1]).format('YYYY-MM-DD'),
        ],
      })
    } else {
      form.setFieldsValue({
        [key]: null,
      })
    }
    confirm(key, '', 2)
  }

  function deWeight(arr: any) {
    const map = new Map()
    for (const item of arr || []) {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    }
    arr = [...map.values()]
    return arr
  }
  const format = (arr: any) => {
    const newA = arr.filter((j: any) => {
      return j.value === info
    })

    const newB = arr.filter((j: any) => {
      return j.value !== info
    })

    return newA
      .map((i: any) => ({
        id: i.id,
        value: i.value,
        label: `${i.label}（${t('myself')}）`,
      }))
      .concat(newB)
  }
  useEffect(() => {
    form.resetFields()
    confirm()
  }, [location])
  return (
    <SearchLine hasLeft={props?.hasLeft}>
      <Wrap hidden={props.showForm} style={{ userSelect: 'none' }}>
        <FormWrap form={form}>
          {list
            ?.filter((k: any) =>
              props.isIteration ? k.key !== 'iterate_name' : k,
            )
            ?.map((i: any) => (
              <div key={i.key}>
                {[
                  'select_checkbox',
                  'checkbox',
                  'select',
                  'radio',
                  'dan',
                ].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item
                      name={i.key === 'status' ? 'category_status_ids' : i.key}
                    >
                      {i.key === 'category' ? (
                        <SelectWrap>
                          <CategoryDropdown
                            mode="multiple"
                            categoryList={
                              projectInfoValues
                                ?.filter((k: any) => k.key === i.key)[0]
                                ?.children.map(
                                  (item: {
                                    name: any
                                    category_attachment: string
                                  }) => ({
                                    ...item,
                                    labelName: item.name,
                                    attachmentPath: item.category_attachment,
                                  }),
                                ) || []
                            }
                            onChangeCallBack={data => {
                              form.setFieldValue('category', data)
                              confirm('category')
                            }}
                          />
                        </SelectWrap>
                      ) : (
                        <MoreSelect
                          onConfirm={confirm}
                          options={
                            i.key === 'users_name' ||
                            i.key === 'users_copysend_name' ||
                            i.key === 'user_name'
                              ? format(
                                  deWeight(
                                    projectInfoValues
                                      ?.filter((k: any) => k.key === i.key)[0]
                                      ?.children?.map((v: any) => ({
                                        label: v.content_txt || v.content,
                                        value: v.id,
                                        id: v.id,
                                      })),
                                  ),
                                )
                              : i.key === 'status'
                              ? projectInfoValues
                                  ?.filter((k: any) => k.key === i.key)[0]
                                  ?.children?.filter((l: any) => l.id > 0)
                                  .map((v: any) => ({
                                    label: v.name,
                                    children: v?.statuss?.map((val: any) => ({
                                      label: val.content_txt || val.content,
                                      value: val?.pivot?.id,
                                      id: val?.pivot?.id,
                                    })),
                                  }))
                              : format(
                                  deWeight(
                                    projectInfoValues
                                      ?.filter((k: any) => k.key === i.key)[0]
                                      ?.children?.map((v: any) => ({
                                        label:
                                          i.key === 'iterate_name'
                                            ? `${v.content_txt || v.content} ${
                                                v?.start_at
                                                  ? `(${v?.start_at}~${v?.end_at})`
                                                  : ''
                                              } `
                                            : v.content_txt || v.content,
                                        value: v.id,
                                        id: v.id,
                                      })),
                                  ),
                                )
                          }
                        />
                      )}
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {['single_checkbox'].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <MoreSelect
                        more
                        onConfirm={confirm}
                        options={[
                          {
                            label: t('notChecked'),
                            value: 0,
                            id: 0,
                          },
                          {
                            label: t('itIsChecked'),
                            value: 1,
                            id: 1,
                          },
                        ]}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {['time', 'date'].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <RangePicker
                        isShowQuick
                        dateValue={
                          form.getFieldValue(i.key)
                            ? [
                                moment(form.getFieldValue(i.key)[0]),
                                moment(form.getFieldValue(i.key)[1]),
                              ]
                            : null
                        }
                        onChange={dates => onChangeTime(i.key, dates)}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.key, 2)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {i.type === 'number' && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <NumericInput onPress={() => confirm(i.key, '', 1)} />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content, 1)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {i.type === 'integer' && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <NumericInput2 onPress={() => confirm(i.key, '', 1)} />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content, 1)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {['text', 'textarea'].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item
                      getValueFromEvent={event => {
                        return event.target.value.replace(/(?<start>^\s*)/g, '')
                      }}
                      name={i.key}
                    >
                      <Input
                        allowClear
                        autoComplete="off"
                        onBlur={() => confirm(i.key, '', 1)}
                        onPressEnter={() => confirm(i.key, '', 1)}
                        style={{ border: 'none' }}
                        placeholder={t('newlyAdd.pleaseKeyword')}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content, 1)}>
                      <IconFont type="close-solid" className="icon" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {i.type === 'tree' && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <TreeSelect
                        style={{ minWidth: '200px', border: 'none' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={
                          projectInfoValues?.filter(
                            (k: any) => k.key === 'class',
                          )[0]?.children
                        }
                        placeholder={t('common.pleaseSelect')}
                        treeDefaultExpandAll
                        onSelect={() => confirm(i.key)}
                        multiple
                        onChange={() => confirm(i.key)}
                        allowClear
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont className="icon" type="close-solid" />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
              </div>
            ))}

          <PopoverWrap
            placement="bottom"
            content={content}
            trigger={['click']}
            getPopupContainer={node => node}
          >
            <MySpan
              style={{
                marginTop: '4px',
              }}
            >
              <IconFontStyle type="plus-square" />
            </MySpan>
          </PopoverWrap>
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

export default TableFilter

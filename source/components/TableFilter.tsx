// 公用列表筛选组件

/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import {
  Form,
  Select,
  Button,
  Popover,
  Collapse,
  Input,
  TreeSelect,
} from 'antd'
import IconFont from './IconFont'
import moment from 'moment'
import { useMemo } from 'react'
import { SearchLine } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import RangePicker from './RangePicker'

const Wrap = styled.div({
  display: 'flex',
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

export const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 140px;
    border: none !important;
    outline: none !important;
  }

  .ant-select-selection-placeholder {
    color: rgba(187, 189, 191, 1);
  }
`

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

const DelButton = styled.div`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #9b9daa;
  position: absolute;
  right: -7px;
  top: -7px;
  width: 15px;
  height: 15px;
  visibility: hidden;
  z-index: 2;
  &:hover {
    background-color: #2877ff;
  }
`

export const SelectWrapBedeck = styled.div`
  height: 32px;
  position: relative;
  height: 32px;
  border: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  border-radius: 6px;
  &:hover ${DelButton} {
    visibility: visible;
  }

  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
    padding-top: 0 !important;
  }
  .ant-picker {
    border: none;
  }
  .ant-select-selector {
    border: none !important;
    background-color: transparent !important;
  }
`

const CollapseDiv = styled.div({
  height: 28,
  fontSize: 12,
  lineHeight: '28px',
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    background: '#F0F4FA',
    color: '#2877ff',
  },
})
const danweiCss = css`
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
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
    color: 'rgba(187, 189, 191, 1)',
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
      <span className={danweiCss}>{t('newlyAdd.unit')}</span>
    </>
  )
}

const TableFilter = (props: any) => {
  const [t, i18n] = useTranslation()
  const { list, basicsList, specialList, customList } = props
  const [form] = Form.useForm()

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

  const confirm = async (val?: any, delKey?: any) => {
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
        [delKey]: null,
      })
    }
    props.onSearch(res, customField)
  }

  const delList = (key: string) => {
    props.onFilter(key, 0)
    confirm('', key)
  }

  const addList = (key: string) => {
    props.onFilter(key, 1)
  }

  const onClearForm = async () => {
    form.resetFields()
    confirm()
  }
  const content = (
    <CollapseWrap defaultActiveKey={['1', '2', '3']}>
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
    confirm()
  }

  function deWeight(arr: any) {
    const map = new Map()
    for (const item of arr) {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    }
    arr = [...map.values()]
    return arr
  }
  return (
    <SearchLine>
      <Wrap hidden={props.showForm} style={{ userSelect: 'none' }}>
        <FormWrap form={form}>
          {list
            ?.filter((k: any) =>
              props.isIteration ? k.key !== 'iterate_name' : k,
            )
            ?.map((i: any) => (
              <div key={i.key}>
                {['select_checkbox', 'checkbox', 'select', 'radio'].includes(
                  i.type,
                ) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <SelectWrap
                        showArrow
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={t('common.pleaseSelect')}
                        showSearch
                        onChange={confirm}
                        allowClear
                        optionFilterProp="label"
                        options={deWeight(
                          i.children.map((v: any) => ({
                            label: v.content_txt,
                            value: v.id,
                            id: v.id,
                          })),
                        )}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {['dan'].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <SelectWrap
                        showArrow
                        style={{ width: '100%' }}
                        placeholder={t('common.pleaseSelect')}
                        showSearch
                        onChange={confirm}
                        allowClear
                        optionFilterProp="label"
                        options={deWeight(
                          i.children.map((v: any) => ({
                            label: v.content_txt,
                            value: v.id,
                            id: v.id,
                          })),
                        )}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
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
                    <DelButton onClick={() => delList(i.key)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {i.type === 'number' && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <NumericInput onPress={confirm} />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
                    </DelButton>
                  </SelectWrapBedeck>
                )}
                {['text', 'textarea'].includes(i.type) && (
                  <SelectWrapBedeck key={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <Form.Item name={i.key}>
                      <Input
                        allowClear
                        autoComplete="off"
                        onBlur={confirm}
                        onPressEnter={confirm}
                        style={{ border: 'none' }}
                        placeholder={t('newlyAdd.pleaseKeyword')}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
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
                        treeData={i.children}
                        placeholder={t('common.pleaseSelect')}
                        treeDefaultExpandAll
                        onSelect={confirm}
                        multiple
                        onChange={confirm}
                        allowClear
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
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
            <Button
              style={{ background: 'white', border: '1px solid #d5d6d9' }}
              icon={<IconFont type="plus" />}
            />
          </PopoverWrap>
          <ClearForm onClick={onClearForm}>
            <span style={{ color: '#2877FF', fontSize: 15, cursor: 'pointer' }}>
              {t('common.clearForm')}
            </span>
          </ClearForm>
        </FormWrap>
      </Wrap>
    </SearchLine>
  )
}

export default TableFilter

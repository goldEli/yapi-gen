/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
/* eslint-disable max-len */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Select, DatePicker, Button, Popover, Collapse } from 'antd'
import IconFont from './IconFont'
import moment from 'moment'
import { useMemo } from 'react'
import { SearchLine } from './StyleCommon'
import { useTranslation } from 'react-i18next'

const { Option } = Select
const Wrap = styled.div({
  display: 'flex',

  // minHeight: 64,
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '.ant-form-item': {
    margin: 0,
  },
})
const TimeWrap = styled(DatePicker.RangePicker)<{ label: string }>`
  &::before {
    content: '${({ label }) => label}';
    display: inline-block;
    white-space: nowrap;
    margin-right: 16px;
    margin-left: 10px;
  }
  .ant-picker-active-bar {
    visibility: hidden;
    /* left: 200px !important; */
  }
`

const SelectWrap = styled(Select)`
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

const rangPicker = css`
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
  &:hover {
    background-color: #2877ff;
  }
`

const SelectWrapBedeck = styled.div`
  height: 32px;
  position: relative;
  height: 32px;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  align-items: center;
  border-radius: 6px;
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-picker {
    border: none;
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

const TableFilter = (props: any) => {
  const [t, i18n] = useTranslation()
  const { list, basicsList, specialList } = props
  const [form] = Form.useForm()

  const filterBasicsList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = basicsList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, basicsList])

  const filterSpecialList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = specialList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, specialList])

  const delList = (key: string) => {
    props.onFilter(key, 0)

    // setList(list.filter((item, idx) => item.key !== key))
  }
  const addList = (key: string) => {
    props.onFilter(key, 1)
  }
  const confirm = async () => {
    const value = await form.getFieldsValue()
    const res = JSON.parse(JSON.stringify(value))
    props.onSearch(res)
  }
  const onClearForm = async () => {
    form.resetFields()
    confirm()
  }
  const content = (
    <CollapseWrap defaultActiveKey={['2']}>
      <Collapse.Panel header={t('components.basicFiled')} key="1">
        {filterBasicsList
          ?.filter((k: any) => props.isIteration ? k.key !== 'iterate_name' : k)
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
    }
    confirm()
  }

  return (
    <SearchLine>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          {list
            ?.filter((k: any) => props.isIteration ? k.key !== 'iterate_name' : k)
            ?.map((i: any) => {
              if (i.type === 'select') {
                return (
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
                        optionFilterProp="label"
                        options={i.children.map((v: any) => ({
                          label: v.content_txt,
                          value: v.id,
                        }))}
                      />
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
                    </DelButton>
                  </SelectWrapBedeck>
                )
              }
              return (
                <SelectWrapBedeck key={i.key}>
                  <Form.Item name={i.key}>
                    <span style={{ margin: '0 16px', fontSize: '14px' }}>
                      {i.contentTxt}
                    </span>
                    <DatePicker.RangePicker
                      onChange={dates => onChangeTime(i.key, dates)}
                      className={rangPicker}
                      getPopupContainer={node => node}
                      format={(times: moment.Moment) => {
                        if (times.unix() === 0 || times.unix() === 1893427200) {
                          return t('common.null')
                        }
                        return times.format('YYYY-MM-DD')
                      }}
                      ranges={
                        i18n.language === 'zh'
                          ? {
                              最近一周: [
                                moment(new Date())
                                  .startOf('days')
                                  .subtract(6, 'days'),
                                moment(new Date()).endOf('days'),
                              ],
                              最近一月: [
                                moment(new Date())
                                  .startOf('months')
                                  .subtract(1, 'months'),
                                moment(new Date()).endOf('days'),
                              ],
                              最近三月: [
                                moment(new Date())
                                  .startOf('months')
                                  .subtract(3, 'months'),
                                moment(new Date()).endOf('days'),
                              ],
                              今天开始: [
                                moment(new Date()).startOf('days'),
                                moment(1893427200 * 1000),
                              ],
                              今天截止: [
                                moment(0),
                                moment(new Date()).endOf('days'),
                              ],
                            }
                          : {
                              'Last Week': [
                                moment(new Date())
                                  .startOf('days')
                                  .subtract(6, 'days'),
                                moment(new Date()).endOf('days'),
                              ],
                              'Last Month': [
                                moment(new Date())
                                  .startOf('months')
                                  .subtract(1, 'months'),
                                moment(new Date()).endOf('days'),
                              ],
                              'Last March': [
                                moment(new Date())
                                  .startOf('months')
                                  .subtract(3, 'months'),
                                moment(new Date()).endOf('days'),
                              ],
                              'Start today': [
                                moment(new Date()).startOf('days'),
                                moment(1893427200 * 1000),
                              ],
                              'Due today': [
                                moment(0),
                                moment(new Date()).endOf('days'),
                              ],
                            }
                      }
                    />
                  </Form.Item>
                  <DelButton onClick={() => delList(i.key)}>
                    <IconFont type="close" style={{ fontSize: '12px' }} />
                  </DelButton>
                </SelectWrapBedeck>
              )
            })}

          <Popover placement="bottom" content={content} trigger={['click']}>
            <Button
              style={{ background: 'white', border: '1px solid #d5d6d9' }}
              icon={<IconFont type="plus" />}
            />
          </Popover>
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

/* eslint-disable @typescript-eslint/no-shadow */
// 可配置的表格字段弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react'
import { Checkbox, Col, Divider, Row, Space } from 'antd'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

const CheckboxGroup = Checkbox.Group
import styled from '@emotion/styled'
import { ShowWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import CommonModal from './CommonModal'

const text = css`
  color: rgba(150, 151, 153, 1);
  font-size: 12px;
  margin-bottom: 8px;
`
const CheckedItem = styled.div({
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  height: 40,
  borderRadius: 4,
  padding: '  0 16px',
  '&: hover': {
    background: ' rgba(240, 244, 250, 1)',
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
})
const Wrap = styled.div`
  display: flex;
`
const Left = styled.div`
  width: 524px;
  height: 350px;
  overflow: scroll;
`
const Right = styled.div`
  box-sizing: border-box;
  padding: 0 16px 0 24px;
  width: 240px;
  height: 350px;
  overflow: scroll;
`
const ItemWrap = styled.div`
  margin-bottom: 24px;
`
type OptionalFeldProps = {
  plainOptions: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  plainOptions2: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  plainOptions3?: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  checkList: CheckboxValueType[]
  allTitleList?: CheckboxValueType[]
  checkList2: CheckboxValueType[]
  checkList3?: CheckboxValueType[]
  getCheckList(
    checkList: CheckboxValueType[],
    checkList2: CheckboxValueType[],
    checkList3?: CheckboxValueType[],
    allList?: CheckboxValueType[],
  ): void
  onClose(): void
  isVisible: boolean
}

export const OptionalFeld = (props: OptionalFeldProps) => {
  const [t] = useTranslation()
  const { plainOptions, plainOptions2 } = props
  const plainOptions3 = props?.plainOptions3 || []
  const [all, setAll] = useState<any>([])
  const [checkList, setCheckList] = useState<CheckboxValueType[]>(
    props.checkList,
  )
  const [checkList2, setCheckList2] = useState<CheckboxValueType[]>(
    props.checkList2,
  )
  const [checkList3, setCheckList3] = useState<CheckboxValueType[]>(
    props?.checkList3 || [],
  )
  const onChange = (list: CheckboxValueType[]) => {
    setCheckList(list)
  }
  const onChange2 = (list: CheckboxValueType[]) => {
    setCheckList2(list)
  }

  const onChange3 = (list: CheckboxValueType[]) => {
    setCheckList3(list)
  }

  function del(value: string) {
    if (checkList.includes(value)) {
      const arr = checkList.filter(value1 => value1 !== value)
      setCheckList([...arr])
    } else if (checkList2.includes(value)) {
      const arr2 = checkList2.filter(value1 => value1 !== value)
      setCheckList2([...arr2])
    } else {
      const arr3 = checkList3.filter(value1 => value1 !== value)
      setCheckList3([...arr3])
    }
  }

  const handleOk = () => {
    props.getCheckList(
      checkList,
      checkList2,
      checkList3,
      all.map((i: any) => i.value),
    )
    props.onClose()
  }
  const allList = useMemo(() => {
    const arr = [...checkList, ...checkList2, ...checkList3]
    const arr2 = [...plainOptions, ...plainOptions2, ...plainOptions3]

    const all = arr2.reduce(
      (res: { labelTxt: string; label: string; value: string }[], item) => {
        if (arr.includes(item.value)) {
          res.push(item)
        }
        return res
      },
      [],
    )
    setAll(all)
    return all.map(item => (
      <CheckedItem key={item.value}>
        <IconFont style={{ fontSize: 12, marginRight: '8px' }} type="move" />
        <span>{item.labelTxt}</span>
        {item.value !== 'name' && (
          <ShowWrap style={{ marginLeft: 'auto' }}>
            <IconFont
              style={{ fontSize: 12 }}
              type="close"
              onClick={() => del(item.value)}
            />
          </ShowWrap>
        )}
      </CheckedItem>
    ))
  }, [
    checkList,
    checkList2,
    checkList3,
    plainOptions,
    plainOptions2,
    plainOptions3,
  ])

  return (
    <CommonModal
      isVisible={props.isVisible}
      width={784}
      title={t('components.showFiled')}
      onClose={props.onClose}
      onConfirm={handleOk}
    >
      <Wrap>
        <Left>
          <ItemWrap>
            <div className={text}>{t('components.basicFiled')}</div>
            <CheckboxGroup value={checkList} onChange={onChange}>
              <Row gutter={[0, 10]}>
                {plainOptions.map(item => (
                  <Col key={item.label} span={8}>
                    <Checkbox
                      disabled={item.value === 'name'}
                      value={item.value}
                    >
                      {item.labelTxt}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </ItemWrap>
          <ItemWrap>
            <div className={text}>{t('components.personOrTime')}</div>
            <CheckboxGroup value={checkList2} onChange={onChange2}>
              <Row gutter={[0, 10]}>
                {/* <Space style={{ flexWrap: 'wrap' }}> */}
                {plainOptions2.map(item => (
                  <Col key={item.label} span={8}>
                    <Checkbox value={item.value}>{item.labelTxt}</Checkbox>
                  </Col>
                ))}
                {/* </Space> */}
              </Row>
            </CheckboxGroup>
          </ItemWrap>
          {plainOptions3?.length > 0 && (
            <ItemWrap>
              <div className={text}>{t('newlyAdd.customFields')}</div>
              <CheckboxGroup value={checkList3} onChange={onChange3}>
                <Row gutter={[0, 10]}>
                  {plainOptions3?.map(item => (
                    <Col key={item.label} span={8}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>
            </ItemWrap>
          )}
        </Left>
        <Divider
          type="vertical"
          style={{ background: '#EBEDF0', margin: '0 16px 0 4px', height: 350 }}
        />
        <Right>
          <div className={text}>{t('components.currentFiled')}</div>
          {allList}
        </Right>
      </Wrap>
    </CommonModal>
  )
}

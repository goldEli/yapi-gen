import React, { useMemo, useState } from 'react'
import { Checkbox, Modal, Col, Row } from 'antd'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
const CheckboxGroup = Checkbox.Group
import styled from '@emotion/styled'
import { ShowWrap } from './StyleCommon'

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
  padding: '0 8px',
  '&: hover': {
    background: ' rgba(240, 244, 250, 1)',
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
})
const Wrap = styled.div`
  width: 784px;

  display: flex;
`
const Left = styled.div`
  width: 524px;
  height: 350px;
  border-right: 1px solid #f1f2f4;
`
const Right = styled.div`
  box-sizing: border-box;
  padding: 0 24px;
  width: 240px;
  height: 350px;
  overflow: scroll;
`
const ItemWrap = styled.div`
  margin-bottom: 24px;
`
type OptionalFeldProps = {
  plainOptions: { label: string; value: string }[]
  plainOptions2: { label: string; value: string }[]
  checkList: CheckboxValueType[]
  checkList2: CheckboxValueType[]
  getCheckList: (
    checkList: CheckboxValueType[],
    checkList2: CheckboxValueType[],
  ) => void
  close: () => void
  visible: boolean
}
export const OptionalFeld = (props: OptionalFeldProps) => {
  const { plainOptions, plainOptions2 } = props
  const [checkList, setCheckList] = useState<CheckboxValueType[]>(
    props.checkList,
  )
  const [checkList2, setCheckList2] = useState<CheckboxValueType[]>(
    props.checkList2,
  )
  const onChange = (list: CheckboxValueType[]) => {
    setCheckList(list)
  }
  const onChange2 = (list: CheckboxValueType[]) => {
    setCheckList2(list)
  }
  function del(value: string) {
    if (checkList.includes(value)) {
      let arr = checkList.filter(value1 => value1 !== value)
      setCheckList([...arr])
    } else {
      let arr2 = checkList2.filter(value1 => value1 !== value)
      setCheckList2([...arr2])
    }
  }

  const handleOk = () => {
    props.getCheckList(checkList, checkList2)
    props.close()
  }
  const allList = useMemo(() => {
    let arr = [...checkList, ...checkList2]
    let arr2 = [...plainOptions, ...plainOptions2]
    let all = arr2.reduce((res: { label: string; value: string }[], item) => {
      if (arr.includes(item.value)) {
        res.push(item)
      }
      return res
    }, [])

    return all.map(item => (
      <CheckedItem key={item.value}>
        <IconFont style={{ fontSize: 12, marginRight: '8px' }} type="move" />
        <span>{item.label}</span>
        <ShowWrap style={{ marginLeft: 'auto' }}>
          <IconFont
            style={{ fontSize: 12 }}
            type="close"
            onClick={() => del(item.value)}
          />
        </ShowWrap>
      </CheckedItem>
    ))
  }, [checkList, checkList2])
  return (
    <Modal
      width={800}
      title="显示字段配置"
      visible={props.visible}
      onCancel={props.close}
      onOk={handleOk}
    >
      <Wrap>
        <Left>
          <ItemWrap>
            <div className={text}>基本字段</div>
            <CheckboxGroup value={checkList} onChange={onChange}>
              <Row>
                {plainOptions.map(item => (
                  <Col key={item.value} span={8}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </ItemWrap>
          <ItemWrap>
            <div className={text}>人员与时间字段</div>
            <CheckboxGroup value={checkList2} onChange={onChange2}>
              <Row>
                {plainOptions2.map(item => (
                  <Col key={item.value} span={8}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </ItemWrap>
        </Left>
        <Right>
          <div className={text}>当前选择字段</div>
          {allList}
        </Right>
      </Wrap>
    </Modal>
  )
}

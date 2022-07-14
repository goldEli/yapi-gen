import React, { useMemo, useState } from 'react'
import { Checkbox, Button, Modal, Col, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
const CheckboxGroup = Checkbox.Group

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
      <div key={item.value}>
        {item.label}
        <Button onClick={() => del(item.value)}>×</Button>
      </div>
    ))
  }, [checkList, checkList2])
  return (
    <Modal
      title="显示字段配置"
      visible={props.visible}
      onCancel={props.close}
      onOk={handleOk}
    >
      <div style={{ display: 'flex' }}>
        <div>
          <h3>基本字段</h3>
          <CheckboxGroup
            options={plainOptions}
            value={checkList}
            onChange={onChange}
          ></CheckboxGroup>
          <hr></hr>
          <h3>人员与时间字段</h3>
          <CheckboxGroup value={checkList2} onChange={onChange2}>
            <Row>
              {plainOptions2.map(item => (
                <Col key={item.value} span={8}>
                  <Checkbox value={item.value}>{item.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>
        </div>
        <div>
          <h3>当前选择字段</h3>
          {allList}
        </div>
      </div>
    </Modal>
  )
}

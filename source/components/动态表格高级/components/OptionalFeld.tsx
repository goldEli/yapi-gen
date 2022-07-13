import React, { useEffect, useMemo, useState } from "react";
import { Table, Checkbox, Button, Dropdown, Menu, Modal, Col, Row } from "antd";
const CheckboxGroup = Checkbox.Group;

export const plainOptions = [
  { label: "id", value: "name" },
  { label: "id1", value: "age" },
  { label: "id2", value: "address" },
  { label: "id3", value: "address1" },
  { label: "id4", value: "address2" },
];
export const plainOptions2 = [
  { label: "飞机", value: "feiji" },
  { label: "大炮", value: "dapao" },
  { label: "坦克", value: "tanke" },
  { label: "直升机", value: "zhishengji" },
  { label: "战舰", value: "zhanjian" },
];
export const OptionalFeld = (props) => {
  const [checkList, setCheckList] = useState(props.checkList);
  const [checkList2, setCheckList2] = useState(props.checkList2);
  const onChange = (list) => {
    setCheckList(list);
  };
  const onChange2 = (list) => {
    setCheckList2(list);
  };
  function del(value) {
    if (checkList.includes(value)) {
      let arr = checkList.filter((value1) => value1 !== value);
      setCheckList([...arr]);
    } else {
      let arr2 = checkList2.filter((value1) => value1 !== value);
      setCheckList2([...arr2]);
    }
  }

  const handleOk = () => {
    props.getCheckList(checkList, checkList2);
    props.close();
  };
  const allList = useMemo(() => {
    let arr = [...checkList, ...checkList2];
    let arr2 = [...plainOptions, ...plainOptions2];
    let all = arr2.reduce((res, item) => {
      if (arr.includes(item.value)) {
        res.push(item);
      }
      return res;
    }, []);

    return all.map((item) => (
      <div key={item.value}>
        {item.label}
        <Button onClick={() => del(item.value)}>×</Button>
      </div>
    ));
  }, [checkList, checkList2]);
  return (
    <Modal
      title="显示字段配置"
      visible={props.visible}
      onCancel={props.close}
      onOk={handleOk}
    >
      <div style={{ display: "flex" }}>
        <div>
          <h3>基本字段</h3>
          <CheckboxGroup
            options={plainOptions}
            value={checkList}
            onChange={onChange}
          ></CheckboxGroup>
          <hr></hr>
          <h3>人员与时间字段</h3>
          <CheckboxGroup   value={checkList2} onChange={onChange2}>
            <Row>
              {plainOptions2.map((item) => (
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
  );
};

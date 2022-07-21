/* eslint-disable react/jsx-no-literals */
import React, { useState } from 'react'
import { Modal, Space } from 'antd'
import logoWithNameImage from '@/assets/logo_with_name.png'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import SwiperCard from '@/views/Mine/components/SwiperCard'

interface Props {
  onChangeState(): void
  visible: boolean
}

const ContentWrap = styled.div({
  boxSizing: 'border-box',
  padding: '10px',
  maxHeight: 400,
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'start',
  gap: '16px',
})

const FooterWrap = styled(Space)({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: 16,
})

export default (props: Props) => {
  const list = [
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
  ]
  const [activeIdx, setActiveIdx] = useState(0)
  return (
    <Modal
      visible={props.visible}
      width={750}
      title="公司切换"
      onCancel={props.onChangeState}
      footer={false}
      bodyStyle={{ padding: 16 }}
    >
      <ContentWrap>
        {list.map((i, index) => (
          <SwiperCard
            tap={() => setActiveIdx(index)}
            show={index === activeIdx}
          ></SwiperCard>
        ))}
      </ContentWrap>
      <FooterWrap size={16}>
        <Button type="primary" onClick={props.onChangeState}>
          确定
        </Button>
        <Button onClick={props.onChangeState}>取消</Button>
      </FooterWrap>
    </Modal>
  )
}

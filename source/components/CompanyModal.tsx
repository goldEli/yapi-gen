/* eslint-disable react/jsx-no-literals */
import React, { useState } from 'react'
import { Modal, Space } from 'antd'
import logoWithNameImage from '@/assets/logo_with_name.png'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

interface Props {
  onChangeState(): void
  visible: boolean
}

const ContentWrap = styled.div({
  maxHeight: 200,
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap'
})

const CardWrap = styled.div<{ active: boolean }>({
  width: 200,
  borderRadius: 4,
  border: '1px solid #f2f2f4',
  marginTop: 8,
  padding: 8,
  marginLeft: 8
}, ({ active }) =>
  active ? {
    border: '1px solid #2877ff',
  } : { border: '1px solid #f2f2f4' })

const ImgWrap = styled.div({
  width: '100%',
  height: 80,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const TitleWrap = styled.div({
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  marginTop: 8
})

const FooterWrap = styled(Space)({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: 16
})

export default (props: Props) => {
  const list = [
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage },
    { name: '公司名公司名称公司名称公司名称称', url: logoWithNameImage }
  ]
  const [activeIdx, setActiveIdx] = useState(0)
  return (
    <Modal
      visible={props.visible}
      width={700}
      title="公司切换"
      onCancel={props.onChangeState}
      footer={false}
      bodyStyle={{ padding: 16 }}
    >
      <ContentWrap>
        {
          list.map((i, index) => (
            <CardWrap active={index === activeIdx} key={i.url} onClick={() => setActiveIdx(index)}>
              <ImgWrap>
                <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={i.url} alt="" />
              </ImgWrap>
              <TitleWrap>{i.name}</TitleWrap>
            </CardWrap>
          ))
        }
      </ContentWrap>
      <FooterWrap size={16}>
        <Button type="primary" onClick={props.onChangeState}>确定</Button>
        <Button onClick={props.onChangeState}>取消</Button>
      </FooterWrap>
    </Modal>
  )
}

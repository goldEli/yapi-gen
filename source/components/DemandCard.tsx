/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { Dropdown, Modal } from 'antd'
import { OmitText } from '@star-yun/ui'
import { useNavigate } from 'react-router-dom'

interface Item {
  name: string
  person: { name: string; avatar: string }[]
  demand: number
}

interface Props {
  item: Item
  onChangeEdit?(): void
  onChangeDelete?(): void
  menu: React.ReactElement
}

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  cursor: 'pointer',
  color: '#BBBDBF',
})

const Wrap = styled.div({
  width: 268,
  height: 90,
  background: 'white',
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  overflow: 'hidden',
  position: 'relative',
  marginTop: 16,
  cursor: 'pointer',
  '&: hover': {
    [MoreWrap.toString()]: {
      display: 'block',
    },
  },
})

const WrapBorder = styled.div({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: 4,
  background: '#BBBDBF',
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 16px 12px 20px',
})

const AvatarWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 12,
})

const NameGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.item': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    background: '#619BFF',
    border: '1px solid white',
    color: 'white',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '.more': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid white',
    background: '#A8C8FF',
    fontSize: 16,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    zIndex: 4,
  },
})

export default (props: Props) => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const onDemandClick = (e: any) => {
    e.stopPropagation()
    setVisible(true)
  }

  return (
    <div>
      <Wrap>
        <WrapBorder />
        <MainWrap>
          <div onClick={() => navigate('/Detail/Demand?type=info')}>
            <OmitText width={200}>{props.item.name}</OmitText>
          </div>
          <AvatarWrap>
            <NameGroup>
              {props.item.person.slice(0, 4).map((item, index) => (
                <div
                  className="box"
                  key={item.name}
                  style={{ marginLeft: index ? -10 : 0, zIndex: index }}
                >
                  <div
                    className="item"
                    style={{ background: index ? '#619BFF' : '#2877FF' }}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
              <div className="more">
                <IconFont type="more" />
              </div>
            </NameGroup>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={e => onDemandClick(e)}
            >
              <IconFont
                type="apartment"
                style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
              />
              <span style={{ color: '#323233', fontSize: 16 }}>
                {props.item.demand}
              </span>
            </div>
          </AvatarWrap>
        </MainWrap>
        <Dropdown
          overlay={props.menu}
          placement="bottomCenter"
          trigger={['hover']}
        >
          <MoreWrap type="more" />
        </Dropdown>
      </Wrap>

      <Modal visible={visible} onCancel={() => setVisible(false)}>
        sdsdsd
      </Modal>
    </div>
  )
}

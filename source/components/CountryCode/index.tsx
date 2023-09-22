import React, { useEffect, useState } from 'react'
import Pinyin from 'tiny-pinyin'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Dropdown, Space } from 'antd'
import countryData from './utils/countryData.json'

const StyledDropdown = styled(Dropdown)`
  height: 30px;
  border-radius: 30px 30px 30px 30px;
  /* background-color: #fff; */
  color: #646566;
  border-color: transparent;
  outline: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  /* padding-left: 14px;
  padding-right: 8px; */
  .ant-dropdown {
    background: #fff;
  }
  .ant-dropdown-menu-vertical {
    min-width: 292px;
    max-height: 390px;
    overflow-x: hidden;
    overflow-y: auto;
    .ant-dropdown-menu-item-only-child {
      width: 100%;
    }
  }

  &:hover {
    color: #6688ff;
  }
  .ant-dropdown-menu-item {
    color: #646566;
  }
  .ant-dropdown-menu-item:hover {
    color: #646566;
  }
  .ant-dropdown-menu-item-selected {
    background: transparent;
    color: #6688ff;
    div {
      color: #6688ff;
    }
  }
`
const Wrap = styled.span({
  cursor: 'pointer',
})
const Anchor = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 3px;
  top: 0;
  bottom: 0;
  height: 390px;
  font-size: 9px;
  color: #969799;
  padding: 0 12px;
  line-height: 14px;
  transform: scale(0.9);
  background: #fff;
  a {
    flex: 1;
    color: #969799;
  }
`
const LabelDiv = styled.div`
  height: 22px;
  color: #323233;
  display: flex;
`
const LabelCode = styled.div`
  width: 60px;
`
const LabelCountry = styled.div``

type Props = {
  value?: string
  onChange?(value: string): void
  // 绑定手机号icon不同
  icon: string
}

const LoginDropDown = (props: Props) => {
  const { i18n, t } = useTranslation()
  const [items, setItems] = useState<any>([])
  const getSelectValue = (e: any) => {
    props.onChange?.(e.key)
  }
  const resultEn = () => {
    const data = countryData.sort((a, b) => a.en.localeCompare(b.en))
    const groupedData: { [key: string]: any[] } = {}
    data.forEach((item, index) => {
      const firstLetter = item.en.charAt(0).toUpperCase()
      if (!groupedData[firstLetter as keyof typeof groupedData]) {
        groupedData[firstLetter] = []
      }
      const itemData = {
        key: `+${item.phone_code}/${index}`,
        label: labelRow(item.phone_code, item.en),
        ...item,
      }
      groupedData[firstLetter as keyof typeof groupedData].push(itemData)
    })
    return groupedData
  }
  const resultZh = () => {
    const dataWithPinyin = countryData.map(item => ({
      ...item,
      pinyin: Pinyin.convertToPinyin(item.zh, '', true),
    }))

    dataWithPinyin.sort((a, b) => a.pinyin.localeCompare(b.pinyin))
    const groupedData: any = {}
    dataWithPinyin.forEach(item => {
      const firstLetter = item.pinyin.charAt(0).toUpperCase()
      if (!groupedData[firstLetter]) {
        groupedData[firstLetter] = []
      }
      const itemData = {
        key: `+${item.phone_code}/${item.country_code}`,
        label: `${item.zh} +${item.phone_code}`,
        ...item,
      }
      groupedData[firstLetter].push(itemData)
    })
    return groupedData
  }
  useEffect(() => {
    const groupedData = i18n.language === 'en' ? resultEn() : resultZh()
    groupedData[0] = [
      {
        key: '+86/CN',
        label: labelRow('86', i18n.language === 'en' ? 'China' : '中国'),
      },
      {
        key: '+65/SG',
        label: labelRow('65', i18n.language === 'en' ? 'Singapore' : '新加坡'),
      },
    ]
    const result = Object.keys(groupedData).map(letter => ({
      key: letter,
      type: 'group',
      label:
        letter === '0' ? (
          <div>{t('selectCountryOrRegion')}</div>
        ) : (
          <div id={letter}>{letter}</div>
        ),
      children: groupedData[letter as keyof typeof groupedData],
    }))
    setItems(result)
  }, [i18n.language])
  const labelRow = (code: string, text: string) => {
    return (
      <LabelDiv>
        <LabelCode>+{code}</LabelCode>
        <LabelCountry>{text}</LabelCountry>
      </LabelDiv>
    )
  }
  const DropdownRender = () => {
    return (
      <Anchor>
        {items.map(
          (x: any, index: number) =>
            x.key !== '0' && (
              <a key={index} href={`#${x.key}`}>
                {x.key}
              </a>
            ),
        )}
      </Anchor>
    )
  }
  return (
    <StyledDropdown
      menu={{
        items,
        selectable: true,
        onClick: getSelectValue,
      }}
      dropdownRender={menu => (
        <div>
          {React.cloneElement(menu as React.ReactElement)}
          <Space style={{ padding: 8 }}>
            <DropdownRender />
          </Space>
        </div>
      )}
      trigger={['click']}
      getPopupContainer={(node: any) => node}
    >
      <Wrap>
        {props.value}
        <IconFont
          type={props.icon || 'FillIconxialajiantou'}
          style={{ fontSize: 12, marginLeft: '8px' }}
        />
      </Wrap>
    </StyledDropdown>
  )
}

export default LoginDropDown

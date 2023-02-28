import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Input } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreatDragging from './CreatDragging'
const CreateFieldWrap = styled.div`
  margin: 20px 0 0 20px;
  border-left: 1px solid var(--neutral-n6-d1);
  padding-left: 24px;
`
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 0 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const BottomTitleStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-n1-d1);
  margin: 0 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const BottomList = styled.div`
  margin-top: 24px;
`
const InputStyle = styled(Input)`
  border: none;
  width: 192px;
  height: 32px;
  background: var(--neutral-white-d4);
  border-radius: 6px;
  .ant-input {
    font-size: 14px;
  }
  .ant-input-prefix {
    margin-right: 10px;
  }
  padding: 0 12px;
  border-radius: 0;
  border-bottom: 1px solid var(--neutral-n6-d1);
  .ant-input-affix-wrapper {
    border: none;
  }
  .ant-input:focus {
    border: none;
  }
  &::placeholder {
    font-size: 14px;
  }
  input {
    background: 'var(--neutral-white-d4)';
  }
`
const SearchItemList = styled.div`
  width: 352px;
  height: 44px;
  border-radius: 8px;
  background-color: var(--neutral-n8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 14px;
  .delIcon {
    display: none;
  }
  &:hover {
    cursor: pointer;
    background-color: var(--white-d6);
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    .delIcon {
      display: block;
    }
  }
`
const CreateField = () => {
  const [t] = useTranslation()
  const [searchIcon, setSearchIcon] = useState(false)
  const [search, setSearch] = useState(false)
  const [createIcon, setCreateIcon] = useState(true)
  const option = [
    { label: t('newlyAdd.lineText'), value: '1', type: 'text' },
    { label: t('newlyAdd.moreLineText'), value: '2', type: 'textarea' },
    { label: t('newlyAdd.radioDropdown'), value: '3', type: 'select' },
    { label: t('newlyAdd.multiDropdown'), value: '4', type: 'select_checkbox' },
    { label: t('newlyAdd.checkbox'), value: '5', type: 'checkbox' },
    { label: t('newlyAdd.radio'), value: '6', type: 'radio' },
    { label: t('newlyAdd.time'), value: '7', type: 'date' },
    { label: t('newlyAdd.number'), value: '8', type: 'number' },
    { label: t('version2.personRadio'), value: '9', type: 'user_select' },
    {
      label: t('version2.personCheckbox'),
      value: '10',
      type: 'user_select_checkbox',
    },
  ]
  const [list, setList] = React.useState<any>(() =>
    [1, 2, 3, 4, 5].map(v => ({
      key: v,
      children: `Item ${v}`,
    })),
  )
  const onChangeDragging = (item: any) => {
    setList(
      list.map((el: any) => ({
        ...el,
        active: el.children === item ? true : false,
      })),
    )
  }
  return (
    <CreateFieldWrap>
      <TitleStyle onClick={() => setCreateIcon(!createIcon)}>
        <CommonIconFont
          type={createIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span>创建字段</span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--neutral-n3)',
            marginLeft: '8px',
          }}
        >
          将字段拖动左侧区域创建字段
        </span>
      </TitleStyle>
      {createIcon && (
        <CreatDragging
          onChange={(item: any) => onChangeDragging(item)}
          list={option}
          setList={setList}
        />
      )}

      <BottomList>
        <BottomTitleStyle>
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setSearchIcon(!searchIcon)}
          >
            <CommonIconFont
              type={searchIcon ? 'down-icon' : 'right-icon'}
              size={14}
              color="var(--neutral-n3)"
            />
            <span>项目已有字段</span>
          </div>
          {search ? (
            <InputStyle
              placeholder="请输入关键字"
              onBlur={(e: any) => 113}
              onPressEnter={(e: any) => 12}
              allowClear
              prefix={
                <CommonIconFont
                  type="search"
                  size={16}
                  color="var(--neutral-n2)"
                />
              }
            />
          ) : (
            <CommonIconFont
              type="search"
              size={16}
              color="var(--neutral-n2)"
              onClick={() => setSearch(true)}
            />
          )}
        </BottomTitleStyle>
        {searchIcon && (
          <SearchItemList>
            <div>
              <CommonIconFont
                type="interation"
                size={19}
                color="var(--neutral-n1-d1)"
              />
              <span style={{ marginLeft: '8px' }}>123</span>
            </div>
            <div className="delIcon">
              <CommonIconFont
                type="delete"
                size={19}
                color="var(--primary-d2)"
              />
            </div>
          </SearchItemList>
        )}
      </BottomList>
    </CreateFieldWrap>
  )
}
export default CreateField

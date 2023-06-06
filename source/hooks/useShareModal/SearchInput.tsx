import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getStaffList } from '@/services/staff'
import styled from '@emotion/styled'
import { Input, Popover } from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import IconFont from '@/components/IconFont'

const PopoverWrap = styled(Popover)``
const ContentWrap = styled.div`
  width: 480px;
  max-height: 230px;
  overflow: scroll;
  padding: 2px;
`

const InputBox = styled.div<{ fail: boolean }>`
  width: 100%;
  border: ${(props: any) =>
    props.fail ? '1px solid red' : '1px solid var(--neutral-n6-d1)'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 11px;
  .ant-input-status-error:not(.ant-input-disabled):not(
      .ant-input-borderless
    ).ant-input,
  .ant-input-status-error:not(.ant-input-disabled):not(
      .ant-input-borderless
    ).ant-input:hover {
    border: 1px solid transparent;
  }
`

const InputStyle = styled(Input)`
  border: 1px solid transparent;
  &:hover,
  &:focus {
    border: 1px solid transparent;
  }
  padding: 0px;
`

const PersonItemWrap = styled.div<{ isActive: boolean }>(
  {
    marginLeft: 5,
    height: 32,
    fontSize: 14,
    color: 'var(--neutral-n1-d1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '0px 16px',
    '&: hover': {
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    div: {
      color: String(isActive ? 'var(--primary-d1)' : 'var(--neutral-n1-d1)'),
    },
  }),
)

const SearchInput = (props: any) => {
  const { placeholder, onChange, fail, changeFirstState, setFail } = props
  const [t]: any = useTranslation()
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [value, setValue] = useState('')
  const [staffList, setStaffList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>()

  const getUserList = async () => {
    const response = await getStaffList({ all: 1 })
    setStaffList(response)
  }

  useEffect(() => {
    getUserList()
  }, [])

  useEffect(() => {
    if (!value) {
      setPeopleValue(null)
    }
    onChange(value ? (peopleValue ? peopleValue : value) : value)
  }, [value])

  const getContent = useMemo(() => {
    const userList = staffList.filter((item: any) =>
      item?.name?.includes(value),
    )
    return (
      value && (
        <ContentWrap>
          {userList?.length > 0 ? (
            userList?.map((i: any) => (
              <PersonItemWrap
                isActive={peopleValue?.id === i.id}
                key={i.id}
                onClick={() => {
                  setFail(false)
                  setPeopleValue(i)
                  setValue(value === i.name ? ` ${i.name}` : i.name)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {i.avatar ? (
                    <img
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 16,
                      }}
                      src={i?.avatar}
                    />
                  ) : (
                    <CommonUserAvatar size="small" />
                  )}
                  <span style={{ marginLeft: 8 }}>{i.name}</span>
                </div>
                {peopleValue?.id === i.id ? (
                  <IconFont
                    type="check"
                    style={{ fontSize: 16, color: 'var(--primary-d1)' }}
                  />
                ) : null}
              </PersonItemWrap>
            ))
          ) : (
            <NoData />
          )}
        </ContentWrap>
      )
    )
  }, [value, peopleValue])

  return (
    <PopoverWrap
      placement="bottomRight"
      title=""
      visible={popoverVisible}
      //   onVisibleChange={setPopoverVisible}
      content={getContent}
      trigger="[click]"
    >
      <InputBox fail={fail}>
        {peopleValue && peopleValue.name ? (
          peopleValue?.avatar ? (
            <img
              style={{
                width: 24,
                height: 24,
                borderRadius: 16,
                marginRight: 4,
              }}
              src={peopleValue?.avatar}
            />
          ) : (
            <span
              style={{
                marginRight: 4,
              }}
            >
              <CommonUserAvatar size="small" />
            </span>
          )
        ) : null}
        <InputStyle
          autoFocus
          type="text"
          value={value}
          placeholder={placeholder}
          onFocus={() => setPopoverVisible(true)}
          onBlur={() => {
            setTimeout(() => {
              setPopoverVisible(false)
            }, 300)
          }}
          onChange={(e: any) => {
            changeFirstState()
            const val = e.target.value
            setValue(val)
          }}
        />
      </InputBox>
    </PopoverWrap>
  )
}

export default SearchInput

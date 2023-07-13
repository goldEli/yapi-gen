/**
 * 多个头像展示组件
 */
/* eslint-disable react/jsx-handler-names */
import React, { useEffect, useMemo, useState } from 'react'
import CommonUserAvatar from '../CommonUserAvatar'
import { Dropdown } from 'antd'
import { AvatarBox, MoreIcon, MultipleAvatarBox, ItemRow, Text } from './styled'
import { getUserIntroList } from '@/services/user'
interface MultipleAvatarProps {
  list: {
    id?: number
    name: string
    avatar?: string
  }[]
  // 最多展示多少个头像
  max: number
  disableDropDown?: boolean
}

const MultipleAvatar: React.FC<MultipleAvatarProps> = props => {
  console.log(props.list)
  const [visible, setVisible] = useState(false)
  const [items, setItems] = useState(
    props.list?.map((item, idx) => {
      return {
        key: item?.id + '' + idx,
        label: (
          <ItemRow>
            <CommonUserAvatar isBorder name={item.name} avatar={item?.avatar} />
          </ItemRow>
        ),
      }
    }),
  )
  const data = props.list?.slice(0, props.max)
  const len = props.list?.length
  const hiddenNum = len - data?.length

  const text = React.useMemo(() => {
    if (hiddenNum > 99) {
      return '99+'
    }
    return `+${hiddenNum}`
  }, [hiddenNum])

  const width = useMemo(() => {
    if (hiddenNum) {
      return (data?.length + 1) * 22
    }
    return data?.length * 22
  }, [data, hiddenNum])

  const getUserIntroListApi = async () => {
    const ids = props.list.map(el => el.id)
    const res = await getUserIntroList({ ids: ids.join(',') })
    const data = res.list.map((item: any, idx: number) => {
      return {
        key: item.id + '' + idx,
        label: (
          <ItemRow>
            <CommonUserAvatar isBorder name={item.name} avatar={item.avatar} />(
            <Text>{item.position ? item.position : '--'}</Text>)
          </ItemRow>
        ),
      }
    })
    setItems(data)
  }
  if (len === 0) {
    return <>--</>
  }
  if (len === 1) {
    return (
      <Dropdown
        menu={{ items }}
        onVisibleChange={e => {
          setVisible(e), e && getUserIntroListApi()
        }}
        visible={visible}
      >
        <div onClick={e => e.preventDefault()}>
          <CommonUserAvatar
            isBorder
            avatar={props.list[0].avatar}
            name={props.list[0].name}
          />
        </div>
      </Dropdown>
    )
  }
  return (
    <Dropdown
      visible={visible}
      menu={{ items }}
      disabled={props.disableDropDown}
      // trigger={['click']}
      onVisibleChange={e => {
        setVisible(e), e && getUserIntroListApi()
      }}
    >
      <MultipleAvatarBox width={width}>
        {data?.map((item, idx) => {
          return (
            <AvatarBox left={idx * 20} key={item.id}>
              <CommonUserAvatar isBorder avatar={item?.avatar} />
            </AvatarBox>
          )
        })}
        <MoreIcon show={hiddenNum > 0} left={data?.length * 20}>
          {text}
        </MoreIcon>
      </MultipleAvatarBox>
    </Dropdown>
  )
}

export default MultipleAvatar

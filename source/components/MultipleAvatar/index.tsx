/**
 * 多个头像展示组件
 */
/* eslint-disable react/jsx-handler-names */
import React, { useEffect, useMemo, useState } from 'react'
import CommonUserAvatar from '../CommonUserAvatar'
import { Dropdown, Popover } from 'antd'
import IconFont from '@/components/IconFont'
import {
  AvatarBox,
  MoreIcon,
  MultipleAvatarBox,
  ItemRow,
  Text,
  Email,
  Name,
  LabelContentWrap,
  ItemWrap,
  BottomWrap,
  DetailWrap,
  HeaderWrap,
} from './styled'
import { getUserIntroList } from '@/services/user'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import PeopleCard from './components/PeopleCard'
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
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const data = props.list?.slice(0, props.max)
  const len = props.list?.length
  const hiddenNum = len - data?.length
  const { fullScreen } = useSelector(store => store.kanBan)

  useEffect(() => {
    if (props.list) {
      setItems(
        props.list?.map((item, idx) => {
          return {
            key: `${item?.id}-${idx}`,
            label: (
              <ItemRow>
                <CommonUserAvatar
                  isBorder
                  name={item.name}
                  avatar={item?.avatar}
                />
              </ItemRow>
            ),
          }
        }),
      )
    }
  }, [props.list])

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

  // 查询人员信息
  const getUserIntroListApi = async () => {
    const ids = props.list.map(el => el.id)
    const res = await getUserIntroList({ ids: ids.join(',') })

    labelContent(res.list)
  }
  const labelContent = (dataList: any) => {
    const data = dataList?.map((item: any, idx: number) => {
      return {
        key: `${item.id}_${idx}`,
        label: (
          <LabelContentWrap>
            {fullScreen ? (
              <Popover
                placement="leftTop"
                zIndex={99999}
                getPopupContainer={() =>
                  document.querySelector('.kanBanFullScreenBox') as any
                }
                content={<PeopleCard {...item}></PeopleCard>}
              >
                <ItemRow>
                  <CommonUserAvatar
                    isBorder
                    name={item.name}
                    avatar={item.avatar}
                  />
                  (<Text>{item.position ? item.position : '--'}</Text>)
                </ItemRow>
              </Popover>
            ) : (
              <Popover
                placement="leftTop"
                zIndex={99999}
                content={<PeopleCard {...item}></PeopleCard>}
              >
                <ItemRow>
                  <CommonUserAvatar
                    isBorder
                    name={item.name}
                    avatar={item.avatar}
                  />
                  (<Text>{item.position ? item.position : '--'}</Text>)
                </ItemRow>
              </Popover>
            )}
          </LabelContentWrap>
        ),
      }
    })
    setItems(data)
  }

  if (len === 0) {
    return <>--</>
  }
  if (len === 1) {
    return fullScreen ? (
      <Dropdown
        menu={{ items }}
        onVisibleChange={e => {
          setVisible(e), e && getUserIntroListApi()
        }}
        visible={visible}
        getPopupContainer={() =>
          document.querySelector('.kanBanFullScreenBox') as any
        }
      >
        <div onClick={e => e.preventDefault()}>
          <CommonUserAvatar
            isBorder
            avatar={props.list[0].avatar}
            name={props.list[0].name}
          />
        </div>
      </Dropdown>
    ) : (
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
  return fullScreen ? (
    <Dropdown
      visible={visible}
      menu={{ items }}
      disabled={props.disableDropDown}
      onVisibleChange={e => {
        setVisible(e), e && getUserIntroListApi()
      }}
      getPopupContainer={() =>
        document.querySelector('.kanBanFullScreenBox') as any
      }
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
  ) : (
    <Dropdown
      overlayClassName="custom-menu"
      visible={visible}
      menu={{ items }}
      disabled={props.disableDropDown}
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

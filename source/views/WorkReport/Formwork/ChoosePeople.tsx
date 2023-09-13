// 日志选人组件

import { useEffect, useMemo, useState } from 'react'
import { NameWrap } from '@/components/StyleCommon'
import { Popover } from 'antd'
import IconFont from '@/components/IconFont'
import { getStaffListAll } from '@/services/staff'
import ChoosePerson from '@/components/ChoosePerson'
import styled from '@emotion/styled'
import CommonUserAvatar from '@/components/CommonUserAvatar'

const IconFontWrap = styled(IconFont)({
  fontSize: 14,
  color: 'var(--neutral-n4)',
  cursor: 'pointer',
  display: 'none',
  position: 'absolute',
  right: -4,
  top: -5,
})
const NewNameWrap = styled.div({
  position: 'relative',
  overflow: 'inherit',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '&: hover': {
    [IconFontWrap.toString()]: {
      display: 'block',
    },
  },
})
const ChoosePeople = (props: any) => {
  const [allMemberList, setAllMemberList] = useState<any>([])
  const [options, setOptions] = useState<any>([])
  const [isOpen, setIsOpen] = useState(false)

  const confirm = () => {
    const ids = allMemberList.map((item: any) => item.id)

    props.onChange(ids)
  }

  // 更新流转审核线并过滤人员下拉
  const onChangeList = async (obj: any, type: string) => {
    const newList = JSON.parse(JSON.stringify(allMemberList))

    if (type === 'add') {
      newList.push(obj)
    } else {
      newList.splice(
        newList.findIndex((item: any) => item.id === obj),
        1,
      )
    }
    await setAllMemberList(newList)
  }

  const getList = async () => {
    const result = await getStaffListAll({ all: 1 })

    setOptions(result)
  }

  const filterOptions = useMemo(() => {
    const filterOptionsList = options.filter(
      (item: any) => !allMemberList.some((ele: any) => ele.id === item.id),
    )
    return filterOptionsList
  }, [allMemberList, options])

  useEffect(() => {
    confirm()
  }, [allMemberList])

  useEffect(() => {
    setAllMemberList(props.initValue)
  }, [props.initValue])
  const onDelCheckPerson = async (id: any) => {
    await onChangeList(id, 'del')
  }
  const onAddPerson = async (obj: any) => {
    await onChangeList(obj, 'add')
    setIsOpen(false)
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <div style={{ alignItems: 'flex-start', marginTop: props.margin ?? 8 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {!props.hiddenNumbers &&
          allMemberList?.map((i: any, index: any) => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',

                  alignItems: 'center',
                }}
              >
                <NewNameWrap>
                  {i.avatar ? (
                    <img
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 16,
                      }}
                      src={i.avatar}
                    />
                  ) : (
                    <div
                      style={{
                        marginRight: 8,
                      }}
                    >
                      <CommonUserAvatar size="small" />
                    </div>
                  )}
                  <IconFontWrap
                    type="close-circle-fill"
                    onClick={() => onDelCheckPerson(i.id)}
                  />
                </NewNameWrap>
                <span
                  style={{
                    marginLeft: '4px',
                    color: 'var(--neutral-n2)',
                    fontSize: '12px',
                  }}
                >
                  {i.name}
                </span>
              </div>
              {index !== allMemberList?.length - 1 && (
                <IconFont
                  style={{
                    fontSize: 16,
                    margin: '-20px 8px 0',
                    color: 'var(--neutral-n4)',
                  }}
                  type=""
                />
              )}
            </div>
          ))}
        {/* 类型是模板只读 */}
        {props.type === 'formWork' ? (
          <div
            style={{
              marginLeft:
                props.margin ?? (allMemberList?.length ? '28px' : '10px'),
              marginTop: '1px',
              width: '24px',
              height: '24px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '1px dashed var(--neutral-n3)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconFont
                className="icon"
                type="plus"
                style={{
                  color: 'var(--neutral-n3)',
                  fontSize: '16px',
                }}
                // onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        ) : (
          <Popover
            key={isOpen.toString()}
            visible={isOpen}
            placement="topRight"
            trigger="click"
            onVisibleChange={visible => setIsOpen(visible)}
            getTooltipContainer={node => node}
            content={
              <ChoosePerson
                onChangeValue={(obj: any) => onAddPerson(obj)}
                options={filterOptions}
                visible={isOpen}
              />
            }
            getPopupContainer={node => node}
          >
            <div
              style={{
                marginLeft:
                  props.margin ?? (allMemberList?.length ? '28px' : '10px'),
                marginTop: '1px',
                width: '24px',
                height: '24px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  border: '1px dashed var(--neutral-n3)',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconFont
                  className="icon"
                  type="plus"
                  style={{
                    color: 'var(--neutral-n3)',
                    fontSize: '16px',
                  }}
                  // onClick={() => setIsOpen(true)}
                />
              </div>
            </div>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default ChoosePeople

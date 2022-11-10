import { useEffect, useMemo, useState } from 'react'
import { NameWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import { Popover, Space } from 'antd'
import {
  AddWrap,
  ChoosePerson,
  IconFontWrap,
  ItemWrap,
  NewNameWrap,
} from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import IconFont from '@/components/IconFont'
import { getStaffList2 } from '@/services/staff'

const ChoosePeople = (props: any) => {
  const [t] = useTranslation()
  const [allMemberList, setAllMemberList] = useState<any>([])
  const [options, setOptions] = useState<any>([])
  const [isOpen, setIsOpen] = useState(false)

  const tagMenuList = [
    { name: t('newlyAdd.sequence'), value: 1, icon: 'right' },
    { name: t('newlyAdd.andExamine'), value: 2, icon: 'and' },
    { name: t('newlyAdd.orExamine'), value: 3, icon: 'line' },
  ]
  const confirm = () => {
    const ids = allMemberList.map((item: any) => item.id)

    props.onChange(ids)
  }

  // 更新流转审核线并过滤人员下拉
  const onChangeList = async (obj: any, type: string) => {
    const newList = structuredClone(allMemberList)

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
    const result = await getStaffList2({ all: 1 })

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
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <ItemWrap style={{ alignItems: 'flex-start', marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {allMemberList?.map((i: any, index: any) => (
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
                  <NameWrap style={{ margin: 0, width: 24, height: 24 }}>
                    {String(
                      i?.name?.substring(0, 1).trim().slice(0, 1),
                    ).toLocaleUpperCase()}
                  </NameWrap>
                )}
                <IconFontWrap
                  type="close-circle-fill"
                  onClick={() => onDelCheckPerson(i.id)}
                />
              </NewNameWrap>
              <span
                style={{
                  marginLeft: '4px',
                  color: '#646566',
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
                  color: '#BBBDBF',
                }}
                type=""
              />
            )}
          </div>
        ))}
        <Popover
          key={isOpen.toString()}
          visible={isOpen}
          placement="bottomRight"
          trigger="click"
          onVisibleChange={visible => setIsOpen(visible)}
          getTooltipContainer={node => node}
          content={
            <ChoosePerson
              onChangeValue={obj => onAddPerson(obj)}
              options={filterOptions}
            />
          }
          getPopupContainer={node => node}
        >
          <AddWrap
            style={{
              marginLeft: allMemberList?.length ? '40px' : 0,
            }}
          >
            <IconFont
              className="icon"
              type="plus"
              onClick={() => setIsOpen(true)}
            />
          </AddWrap>
        </Popover>
      </div>
    </ItemWrap>
  )
}

export default ChoosePeople

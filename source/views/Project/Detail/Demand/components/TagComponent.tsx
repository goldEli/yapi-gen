/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, message, Popover, Space } from 'antd'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'

const TagCheckedItem = styled.div<{ color?: string }>(
  {
    height: 22,
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    position: 'relative',
    color: '#969799',
    marginRight: 8,
    border: '1px solid #969799',
    boxSizing: 'border-box',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    '.icon': {
      display: 'none',
    },
    '&:hover': {
      '.icon': {
        display: 'block',
      },
    },
  },
  ({ color }) => ({
    color: color || '#969799',
    border: `1px solid ${color}`,
  }),
)

const TagWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const TagItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  cursor: 'pointer',
  paddingLeft: 16,
  div: {
    height: 16,
    width: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  span: {
    color: '#646566',
    fontSize: 14,
  },
  '&:hover': {
    background: '#F0F4FA',
    span: {
      color: '#2877ff',
    },
  },
})

const ColorWrap = styled.div({
  height: 16,
  width: 16,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: {
    color: 'white',
  },
})

interface TagProps {
  tap?(value: any): void
  canAdd?: boolean
  isClear: boolean
  onChangeIsClear(val: boolean): void
  onChangeIsOpen(val: boolean): void
  onChangeTag?(arr: any, type: string): void
  checkedTags: any
}

const TagBox = (props: TagProps) => {
  const { tagList } = useModel('project')
  const { demandInfo, addInfoDemand, getDemandInfo } = useModel('demand')
  const [value, setValue] = useState('')
  const [arr, setArr] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  useEffect(() => {
    setArr(
      tagList?.filter(
        (i: any) => !props.checkedTags?.find(
          (k: any) => k.content === i.content && i.color === k.color,
        ),
      ),
    )
  }, [tagList, props.checkedTags])

  const onCreateTag = () => {
    props.tap?.(value)
    props.onChangeIsClear(true)
  }

  useEffect(() => {
    if (props.isClear) {
      setValue('')
    }
  }, [props.isClear])

  const onPressEnter = (val: any) => {
    setValue(val)
    setArr(tagList.filter((i: any) => i?.content?.includes(val)))
  }

  const onHasTagAdd = async (item: any) => {
    if (props.canAdd) {
      try {
        await addInfoDemand({
          projectId,
          demandId: demandInfo?.id,
          type: 'tag',
          targetId: [{ name: item.content, color: item.color }],
        })
        message.success('添加成功')
        getDemandInfo({ projectId, id: demandInfo?.id })
        props.onChangeIsOpen(false)
      } catch (error) {

        //
      }
    } else {
      props.onChangeTag?.({ name: item.content, color: item.color }, 'add')
      props.onChangeIsOpen(false)
    }
  }

  return (
    <TagWrap title="">
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <Input.Search
          value={value}
          onChange={e => setValue(e.target.value)}
          onPressEnter={(e: any) => onPressEnter(e.target.value)}
        />
      </div>
      {arr.map((i: any) => (
        <TagItem key={i.id} onClick={() => onHasTagAdd(i)}>
          <div style={{ background: i.color }} />
          <span>{i.content}</span>
        </TagItem>
      ))}
      <TagItem hidden={!value}>
        <span onClick={onCreateTag}>{`创建【${value}】标签`}</span>
      </TagItem>
    </TagWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
  canAdd?: boolean
  onChangeTag?(arr: any, type: string): void
  defaultList?: any
}

const TagComponent = (props: Props) => {
  const { getTagList } = useModel('project')
  const { addInfoDemand, demandInfo, getDemandInfo, deleteInfoDemand }
    = useModel('demand')
  const [newTag, setNewTag] = useState<any>('')
  const [isChooseColor, setIsChooseColor] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isClear, setIsClear] = useState(false)
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const checkedTags = props.defaultList?.map((i: any) => ({
    color: i?.color,
    content: i?.name,
  }))

  const colorList = ['#FF5C5E', '#43BA9A', '#2877FF', '#969799']

  const onAddDemandTags = (value: any) => {
    setNewTag(value)
    setIsChooseColor(true)
    setIsOpen(false)
  }

  const onAddInfoDemand = async (value: any) => {
    if (props.canAdd) {
      try {
        await addInfoDemand({
          projectId,
          demandId: demandInfo?.id,
          type: 'tag',
          targetId: [{ name: newTag, color: value }],
        })
        message.success('添加成功')
        getDemandInfo({ projectId, id: demandInfo?.id })
        setNewTag('')
        setIsChooseColor(false)
        getTagList({ projectId })
        setIsClear(false)
      } catch (error) {

        //
      }
    } else {
      if (
        !props.defaultList?.filter(
          (k: any) => k.name === newTag && k.color === value,
        ).length
      ) {
        props.onChangeTag?.({ name: newTag, color: value }, 'add')
      }
      setNewTag('')
      setIsChooseColor(false)
      setIsClear(false)
    }
  }

  const onDeleteInfoDemand = async (item: any) => {
    if (props.canAdd) {
      try {
        await deleteInfoDemand({
          projectId,
          demandId: demandInfo?.id,
          type: 'tag',
          targetId: item.id,
        })
        message.success('删除成功')
        getDemandInfo({ projectId, id: demandInfo?.id })
        getTagList({ projectId })
      } catch (error) {

        //
      }
    } else {
      props.onChangeTag?.(
        { content: item.content, color: item.color },
        'delete',
      )
    }
  }

  const colorStatus = (
    <Space
      style={{ display: 'flex', alignItems: 'center', padding: 16 }}
      size={8}
    >
      {colorList.map(i => (
        <ColorWrap
          onClick={() => onAddInfoDemand(i)}
          key={i}
          style={{ background: i }}
        >
          <IconFont hidden={i !== '#969799'} type="check" />
        </ColorWrap>
      ))}
    </Space>
  )

  const onVisibleChange = (visible: any) => {
    onAddInfoDemand('#969799')
    setIsChooseColor(visible)
  }

  const onVisibleOpenChange = (visible: any) => {
    setIsOpen(visible)
    setIsClear(true)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Popover
        visible={isChooseColor}
        placement="bottom"
        trigger="click"
        content={colorStatus}
        onVisibleChange={onVisibleChange}
      >
        <TagCheckedItem hidden={!newTag}>{newTag}</TagCheckedItem>
      </Popover>
      <div
        hidden={!checkedTags?.length}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {checkedTags?.reverse()?.map((i: any) => (
          <TagCheckedItem
            key={i.id}
            style={{
              cursor: 'pointer',
              alignItems: 'center',
              color: i.color,
              border: `1px solid ${i.color}`,
            }}
          >
            <div>{i.content}</div>
            <IconFont
              className="icon"
              style={{
                position: 'absolute',
                right: -6,
                top: -6,
                color: '#969799',
              }}
              type="close-circle-fill"
              onClick={() => onDeleteInfoDemand(i)}
            />
          </TagCheckedItem>
        ))}
      </div>
      <Popover
        visible={isOpen}
        placement="bottom"
        trigger="click"
        onVisibleChange={onVisibleOpenChange}
        content={
          <TagBox
            isClear={isClear}
            tap={onAddDemandTags}
            canAdd={props.canAdd}
            onChangeIsClear={setIsClear}
            onChangeIsOpen={setIsOpen}
            onChangeTag={props.onChangeTag}
            checkedTags={checkedTags}
          />
        }
        getPopupContainer={node => node}
      >
        <div onClick={() => setIsOpen(!isOpen)}>{props.addWrap}</div>
      </Popover>
    </div>
  )
}

export default TagComponent

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
    border: '1px solid #EBEDF0',
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

interface TagProps {
  tap?(value: any): void
  canAdd?: boolean
  isClear: boolean
  onChangeIsClear(val: boolean): void
}

const TagBox = (props: TagProps) => {
  const { tagList } = useModel('project')
  const [value, setValue] = useState('')
  const [arr, setArr] = useState<any>(tagList)

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
        <TagItem key={i.id}>
          <div style={{ background: i.color }} />
          <span>{i.content}</span>
        </TagItem>
      ))}
      {props.canAdd ? (
        <TagItem hidden={!value}>
          <span onClick={onCreateTag}>创建【创建新标签】标签</span>
        </TagItem>
      )
        : ''
      }
    </TagWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
  canAdd?: boolean
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
  const checkedTags = demandInfo?.tag?.map((i: any) => i.tag)
  const colorList = ['#FF5C5E', '#43BA9A', '#2877FF', '#969799']

  const onAddDemandTags = (value: any) => {
    setNewTag(value)
    setIsChooseColor(true)
    setIsOpen(false)
  }

  const onAddInfoDemand = async (value: any) => {
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
  }

  const onDeleteInfoDemand = async (item: any) => {
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
  }

  const colorStatus = (
    <Space
      style={{ display: 'flex', alignItems: 'center', padding: 16 }}
      size={8}
    >
      {colorList.map(i => (
        <div
          onClick={() => onAddInfoDemand(i)}
          key={i}
          style={{
            background: i,
            height: 16,
            width: 16,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        />
      ))}
    </Space>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        hidden={!checkedTags?.length}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Popover
          visible={isChooseColor}
          placement="bottom"
          trigger="click"
          content={colorStatus}
        >
          <TagCheckedItem hidden={!newTag}>{newTag}</TagCheckedItem>
        </Popover>
        {checkedTags?.reverse()?.map((i: any) => (
          <TagCheckedItem
            key={i.id}
            style={{ cursor: 'pointer', alignItems: 'center' }}
          >
            <div>{i.content}</div>
            <IconFont
              className="icon"
              style={{ position: 'absolute', right: -6, top: -6 }}
              type="close-circle"
              onClick={() => onDeleteInfoDemand(i)}
            />
          </TagCheckedItem>
        ))}
      </div>
      <Popover
        visible={isOpen}
        placement="bottom"
        trigger="click"
        content={
          <TagBox
            isClear={isClear}
            tap={onAddDemandTags}
            canAdd={props.canAdd}
            onChangeIsClear={setIsClear}
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

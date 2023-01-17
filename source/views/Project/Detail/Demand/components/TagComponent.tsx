/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, message, Popover, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector } from '@store/index'

const TagCheckedItem = styled.div<{ color?: string }>(
  {
    height: 22,
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    position: 'relative',
    color: '#969799',
    border: '1px solid #969799',
    boxSizing: 'border-box',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    margin: '4px 8px 4px 0 ',
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
  padding: '16px 0',
  maxWidth: 400,
})

const TagItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  minHeight: '32px',
  cursor: 'pointer',
  padding: '0 16px',
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
  cursor: 'pointer',
  svg: {
    color: 'white',
  },
})

const SearchInput = styled(Input)`
  font-size: 14px;
  min-width: 240px;
  height: 32px;
  background: rgba(245, 246, 247, 1);
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;

  padding: 5px 12px 5px 12px;
  border: none;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`
interface TagProps {
  tap?(value: any): void
  canAdd?: boolean
  isClear: boolean
  onChangeIsClear(val: boolean): void
  onChangeIsOpen(val: boolean): void
  onChangeTag?(arr: any, type: string): void
  checkedTags: any
  id?: any
}

const TagBox = (props: TagProps) => {
  const [t] = useTranslation()
  const { projectInfoValues } = useModel('project')
  const { demandInfo, addInfoDemand, getDemandInfo } = useModel('demand')
  const [value, setValue] = useState('')
  const [arr, setArr] = useState<any>([])
  const [searchParams] = useSearchParams()
  const inputRefDom = useRef<HTMLInputElement>(null)
  let projectId: any
  if (props?.id) {
    projectId = props?.id
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
  }

  useEffect(() => {
    setArr(
      projectInfoValues
        ?.filter((i: any) => i.key === 'tag')[0]
        ?.children?.filter((i: any) => i.id !== -1)
        ?.filter(
          (i: any) =>
            !props.checkedTags?.find(
              (k: any) => k.content === i.content && i.color === k.color,
            ),
        ),
    )
  }, [projectInfoValues, props.checkedTags])

  const onCreateTag = () => {
    props.tap?.(value)
    props.onChangeIsClear(true)
  }

  useEffect(() => {
    if (props.isClear) {
      setValue('')
    }
  }, [props.isClear])

  useEffect(() => {
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [])

  const onPressEnter = (val: any) => {
    setValue(val)
    setArr(
      projectInfoValues
        ?.filter((i: any) => i.key === 'tag')[0]
        ?.children?.filter((i: any) => i.id !== -1)
        .filter((i: any) => i?.content?.includes(val)),
    )
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
        message.success(t('common.addSuccess'))
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
      <div style={{ padding: '0px 16px' }}>
        <SearchInput
          ref={inputRefDom as any}
          onPressEnter={(e: any) => onPressEnter(e.target.value)}
          onChange={e => setValue(e.target.value)}
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 16 }}
            />
          }
          allowClear
          value={value}
          placeholder={t('common.searchOrCreate')}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 4 }}>
        {arr
          ?.filter((i: any) => String(i.content).includes(value))
          .map((i: any) => (
            <TagItem key={i.id} onClick={() => onHasTagAdd(i)}>
              <div style={{ background: i.color }} />
              <span>{i.content}</span>
            </TagItem>
          ))}
      </div>
      <TagItem
        hidden={!value || arr?.filter((i: any) => i.content === value)?.length}
      >
        <span onClick={onCreateTag}>{t('project.createTag', { value })}</span>
      </TagItem>
    </TagWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
  canAdd?: boolean
  onChangeTag?(arr: any, type: string): void
  defaultList?: any
  id?: any
  isQuick?: boolean
}

const TagComponent = (props: Props) => {
  const [t] = useTranslation()
  const { addInfoDemand, demandInfo, getDemandInfo, deleteInfoDemand } =
    useModel('demand')
  const [newTag, setNewTag] = useState<any>('')
  const [isChooseColor, setIsChooseColor] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isClear, setIsClear] = useState(false)
  const [searchParams] = useSearchParams()
  let projectId: any
  if (props?.id) {
    projectId = props?.id
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
  }
  const checkedTags = props.defaultList?.map((i: any) => ({
    color: i?.color,
    content: i?.name,
    id: i.id,
  }))

  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

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
        message.success(t('common.addSuccess'))
        getDemandInfo({ projectId, id: demandInfo?.id })
        setNewTag('')
        setIsChooseColor(false)
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
        message.success(t('common.deleteSuccess'))
        getDemandInfo({ projectId, id: demandInfo?.id })
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        flexWrap: 'wrap',
      }}
    >
      <Popover
        visible={isChooseColor}
        placement="bottom"
        trigger="click"
        content={colorStatus}
        onVisibleChange={onVisibleChange}
      >
        <TagCheckedItem hidden={!newTag}>{newTag}</TagCheckedItem>
      </Popover>
      {checkedTags?.reverse()?.map((i: any) => (
        <TagCheckedItem
          key={i.id}
          style={{
            cursor: isCanEdit || props?.isQuick ? 'pointer' : 'inherit',
            alignItems: 'center',
            color: i.color,
            border: `1px solid ${i.color}`,
          }}
        >
          <div>{i.content}</div>
          {isCanEdit || props?.isQuick ? (
            <IconFont
              className="icon"
              style={{
                position: 'absolute',
                right: -6,
                top: -6,
                color: '#969799',
                fontSize: 14,
              }}
              type="close-solid"
              onClick={() => onDeleteInfoDemand(i)}
            />
          ) : null}
        </TagCheckedItem>
      ))}
      {props?.isQuick || isCanEdit ? (
        <Popover
          visible={isOpen}
          placement="bottom"
          trigger="click"
          onVisibleChange={onVisibleOpenChange}
          content={
            isOpen ? (
              <TagBox
                isClear={isClear}
                tap={onAddDemandTags}
                canAdd={props.canAdd}
                onChangeIsClear={setIsClear}
                onChangeIsOpen={setIsOpen}
                onChangeTag={props.onChangeTag}
                checkedTags={checkedTags}
                id={props?.id}
              />
            ) : null
          }
          getPopupContainer={node => node}
        >
          <div onClick={() => setIsOpen(!isOpen)}>{props.addWrap}</div>
        </Popover>
      ) : null}
    </div>
  )
}

export default TagComponent

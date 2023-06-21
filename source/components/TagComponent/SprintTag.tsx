/* eslint-disable @typescript-eslint/naming-convention */
import { Input, message, Popover, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import IconFont from '@/components/IconFont'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import CommonIconFont from '../CommonIconFont'
import { getMessage } from '../Message'
import {
  ColorWrap,
  SearchInput,
  TagCheckedItem,
  TagItem,
  TagWrap,
} from './style'
import { addInfoAffairs, deleteInfoAffairs } from '@/services/affairs'
import { getProjectInfoValuesStore } from '@store/project/project.thunk'

interface TagProps {
  tap?(value: any): void
  canAdd?: boolean
  isClear: boolean
  onChangeIsClear(val: boolean): void
  onChangeIsOpen(val: boolean): void
  onChangeTag?(arr: any, type: string): void
  checkedTags: any
  id?: any
  detail: Model.Affairs.AffairsInfo
}

const TagBox = (props: TagProps) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { projectInfoValues } = useSelector(store => store.project)
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
        await addInfoAffairs({
          projectId,
          sprintId: props.detail.id,
          type: 'tag',
          targetId: [{ name: item.content, color: item.color }],
        })
        getMessage({ msg: t('common.addSuccess'), type: 'success' })
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
            <CommonIconFont type="search" color="var(--neutral-n4)" size={16} />
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
  // 是否支持直接修改
  canAdd?: boolean
  onChangeTag?(arr: any, type: string): void
  defaultList?: any
  id?: any
  isQuick?: boolean
  detail: Model.Affairs.AffairsInfo
  onUpdate(): void
}

const SprintTag = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
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

  const { projectInfo } = useSelector(store => store.project)
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) =>
        i.identity ===
        (projectInfo.projectType === 1
          ? 'b/story/update'
          : 'b/transaction/update'),
    )?.length > 0

  const colorList = ['#FF5C5E', '#43BA9A', 'var(--primary-d2)', '#969799']

  const onAddDemandTags = (value: any) => {
    setNewTag(value)
    setIsChooseColor(true)
    setIsOpen(false)
  }

  const onAddInfoDemand = async (value: any) => {
    if (props.canAdd) {
      try {
        await addInfoAffairs({
          projectId,
          sprintId: props.detail?.id,
          type: 'tag',
          targetId: [{ name: newTag, color: value }],
        })
        getMessage({ msg: t('common.addSuccess'), type: 'success' })
        dispatch(getProjectInfoValuesStore({ projectId }))
        props.onUpdate()
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
        await deleteInfoAffairs({
          projectId,
          sprintId: props.detail?.id,
          type: 'tag',
          targetId: item.id,
        })
        getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
        props.onUpdate()
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
          {i === '#969799' && <CommonIconFont type="check" />}
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
                color: 'var(--neutral-n3)',
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
          placement="bottomRight"
          trigger="click"
          onVisibleChange={onVisibleOpenChange}
          content={
            isOpen ? (
              <TagBox
                isClear={isClear}
                tap={onAddDemandTags}
                canAdd={props.canAdd}
                onChangeIsClear={setIsClear}
                onChangeIsOpen={value => {
                  setIsOpen(value)
                  props.onUpdate()
                }}
                onChangeTag={props.onChangeTag}
                checkedTags={checkedTags}
                id={props?.id}
                detail={props.detail}
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

export default SprintTag

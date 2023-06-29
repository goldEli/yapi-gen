// 详情右侧弹窗创建标签

import { addInfoDemand, deleteInfoDemand } from '@/services/demand'
import { useSelector } from '@store/index'
import { message, Popover, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '../CommonIconFont'
import IconFont from '../IconFont'
import { getMessage } from '../Message'
import {
  AddTagIcon,
  ColorWrap,
  SearchInput,
  TagCheckedItem,
  TagGroups,
  TagItem,
  TagWrap,
} from './style'

interface Props {
  demandDetail: any
  onUpdate(): void
}

const DrawerTagComponent = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const [list, setList] = useState<any>([])
  const [newTag, setNewTag] = useState<any>('')
  const [isChooseColor, setIsChooseColor] = useState(false)
  const [checkTags, setCheckTags] = useState<any>([])

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0

  const colorList = [
    '#FF5C5E',
    '#43BA9A',
    'var(--primary-d2)',
    'var(--neutral-n3)',
  ]

  useEffect(() => {
    const checks = props?.demandDetail?.tag
      ?.map((i: any) => ({ ...i.tag, ...{ deleteId: i.id } }))
      .reverse()
    setCheckTags(checks)
    setList(
      projectInfoValues
        ?.filter((i: any) => i.key === 'tag')[0]
        ?.children?.filter((i: any) => i.id !== -1)
        ?.filter(
          (i: any) =>
            !checks?.find(
              (k: any) => k.content === i.content && i.color === k.color,
            ),
        ),
    )
  }, [props.demandDetail])

  // 搜索
  const onPressEnter = (val: any) => {
    setValue(val)
    setList(list.filter((i: any) => i?.content?.includes(val)))
  }

  // 点击已创建标签添加
  const onHasTagAdd = async (item: any) => {
    await addInfoDemand({
      projectId: props.demandDetail.projectId,
      demandId: props.demandDetail?.id,
      type: 'tag',
      targetId: [{ name: item.content, color: item.color }],
    })
    getMessage({ msg: t('common.addSuccess'), type: 'success' })
    props.onUpdate()
    setIsOpen(false)
  }

  // 点击创建新标签
  const onCreateTag = () => {
    setNewTag(value)
    setIsChooseColor(true)
    setIsOpen(false)
  }

  // 点击颜色添加标签
  const onAddInfoDemand = async (value1: any) => {
    try {
      await addInfoDemand({
        projectId: props.demandDetail.projectId,
        demandId: props.demandDetail?.id,
        type: 'tag',
        targetId: [{ name: newTag, color: value1 }],
      })
      getMessage({ msg: t('common.addSuccess'), type: 'success' })
      props.onUpdate()
      setNewTag('')
      setIsChooseColor(false)
      setValue('')
    } catch (error) {
      //
    }
  }

  // 颜色弹窗
  const onVisibleChange = (visible: any) => {
    onAddInfoDemand('var(--neutral-n3)')
    setIsChooseColor(visible)
  }

  const onDeleteInfoDemand = async (item: any) => {
    await deleteInfoDemand({
      projectId: props.demandDetail.projectId,
      demandId: props.demandDetail?.id,
      type: 'tag',
      targetId: item.deleteId,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    props.onUpdate()
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
          {i === 'var(--neutral-n3)' && <CommonIconFont type="check" />}
        </ColorWrap>
      ))}
    </Space>
  )

  const content = (
    <TagWrap>
      <div style={{ padding: '0px 16px' }}>
        <SearchInput
          onPressEnter={(e: any) => onPressEnter(e.target.value)}
          onChange={e => setValue(e.target.value)}
          suffix={
            <CommonIconFont type="search" color="var(--neutral-n4)" size={16} />
          }
          allowClear
          value={value}
          placeholder={t('common.searchOrCreate')}
          style={{ border: '1px solid var(--neutral-n6-d1)' }}
        />
      </div>
      <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 4 }}>
        {list
          ?.filter((i: any) => String(i.content).includes(value))
          .map((i: any) => (
            <TagItem key={i.id} onClick={() => onHasTagAdd(i)}>
              <div style={{ background: i.color }} />
              <span>{i.content}</span>
            </TagItem>
          ))}
      </div>
      <TagItem
        hidden={!value || list?.filter((i: any) => i.content === value)?.length}
      >
        <span onClick={onCreateTag}>{t('project.createTag', { value })}</span>
      </TagItem>
    </TagWrap>
  )

  return (
    <TagGroups size={0}>
      <Popover
        visible={isChooseColor}
        placement="bottom"
        trigger="click"
        content={colorStatus}
        onVisibleChange={onVisibleChange}
      >
        <TagCheckedItem hidden={!newTag}>{newTag}</TagCheckedItem>
      </Popover>
      {checkTags?.map((i: any) => (
        <TagCheckedItem
          key={i.id}
          style={{
            cursor: isCanEdit ? 'pointer' : 'inherit',
            alignItems: 'center',
            color: i.color,
            border: `1px solid ${i.color}`,
          }}
        >
          <div>{i.content}</div>
          {isCanEdit ? (
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
      <Popover
        visible={isOpen}
        placement="bottomRight"
        trigger="click"
        onVisibleChange={setIsOpen}
        content={isCanEdit ? content : null}
        getPopupContainer={node => node}
      >
        <AddTagIcon>
          <IconFont type="plus" />
        </AddTagIcon>
      </Popover>
    </TagGroups>
  )
}

export default DrawerTagComponent

/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, message, Popover, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'

const DemandCheckedItem = styled.div({
  height: 22,
  lineHeight: '22px',
  padding: '0 8px 0 0',
  fontSize: 12,
  position: 'relative',
  color: '#323233',
  boxSizing: 'border-box',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  '.icon': {
    visibility: 'hidden',
    marginLeft: 8,
    cursor: 'pointer',
  },
  '&:hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

const DemandWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const DemandItem = styled.div<{ isActive?: boolean }>(
  {
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
  },
  ({ isActive }) => ({
    background: isActive ? '#F0F4FA' : 'white',
  }),
)

interface DemandProps {
  tap?(item: any): void
}

const TagBox = (props: DemandProps) => {
  const { getDemandList, demandInfo } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [demandList, setDemandList] = useState<any>([])

  const getList = async () => {
    const result = await getDemandList({ projectId, all: true })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setDemandList(arr)
  }

  useEffect(() => {
    getList()
  }, [])

  const [value, setValue] = useState('')
  return (
    <DemandWrap title="">
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <Input.Search onPressEnter={(e: any) => setValue(e.target.value)} />
      </div>
      {demandList
        ?.filter((k: any) => String(k.label).includes(value))
        ?.map((i: any) => (
          <DemandItem
            onClick={() => props.tap?.(i)}
            isActive={i.value === demandInfo.parentId}
            key={i.value}
          >
            {i.label}
          </DemandItem>
        ))}
    </DemandWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
}

const ParentDemand = (props: Props) => {
  const { addInfoDemand, demandInfo, getDemandInfo, deleteInfoDemand }
    = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const onChangeParent = async (item: any) => {
    try {
      await addInfoDemand({
        projectId,
        demandId: demandInfo?.id,
        type: 'parent',
        targetId: [item.value],
      })
      message.success('添加成功')
      getDemandInfo({ projectId, id: demandInfo?.id })
    } catch (error) {

      //
    }
  }

  const onDeleteInfoDemand = async () => {
    try {
      await deleteInfoDemand({
        projectId,
        demandId: demandInfo?.id,
        type: 'parent',
        targetId: demandInfo?.parentId,
      })
      message.success('删除成功')
      getDemandInfo({ projectId, id: demandInfo?.id })
    } catch (error) {

      //
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DemandCheckedItem
        onClick={onDeleteInfoDemand}
        hidden={!demandInfo?.parentId}
      >
        <div style={{ color: '#323233', fontSize: 14, cursor: 'pointer' }}>
          {demandInfo?.parentName}
          <IconFont className="icon" type="close" />
        </div>
      </DemandCheckedItem>
      <Popover
        placement="bottom"
        trigger="click"
        content={<TagBox tap={onChangeParent} />}
        getPopupContainer={node => node}
      >
        <div hidden={demandInfo?.parentId}>{props.addWrap}</div>
      </Popover>
    </div>
  )
}

export default ParentDemand

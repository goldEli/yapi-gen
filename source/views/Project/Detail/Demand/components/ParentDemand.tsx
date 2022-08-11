/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, message, Popover, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const MaxWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 240,
  overflow: 'auto',
})

const DemandItem = styled.div<{ isActive?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    cursor: 'pointer',
    paddingLeft: 16,
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

const SearchInput = styled(Input)`
  font-size: 14px;
  width: 240px;
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

interface DemandProps {
  tap?(item: any): void
}

const TagBox = (props: DemandProps) => {
  const [t] = useTranslation()
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
    <DemandWrap>
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <SearchInput
          onPressEnter={(e: any) => setValue(e.target.value)}
          onChange={e => setValue(e.target.value)}
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 16 }}
            />
          }
          allowClear
          value={value}
          placeholder={t('common.searchParent')}
        />
      </div>
      <MaxWrap>
        {demandList
          ?.filter((item: any) => item.value !== demandInfo?.id)
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
      </MaxWrap>
    </DemandWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
}

const ParentDemand = (props: Props) => {
  const [t] = useTranslation()
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
      message.success(t('common.addSuccess'))
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
      message.success(t('common.deleteSuccess'))
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

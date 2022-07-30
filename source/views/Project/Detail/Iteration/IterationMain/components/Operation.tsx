/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useEffect, useState } from 'react'
import { IconFont } from '@staryuntech/ant-pro'
import { Popover, Space, Modal, message } from 'antd'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'

const OperationWrap = styled.div({
  minHeight: 52,
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StickyWrap = styled.div({
  padding: '0 24px',
  background: 'white',

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
})

const IterationInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusTag = styled.div({
  height: 22,
  borderRadius: 6,
  textAlign: 'center',
  lineHeight: '22px',
  padding: '0 8px',
  color: '#43BA9A',
  fontSize: 12,
  background: '#EDF7F4',
  cursor: 'pointer',
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeIsShowLeft?(): void
  onIsUpdateList?(val: boolean): void
  currentDetail?: any
  settingState: boolean
  onChangeSetting(val: boolean): void
  onSearch(params: any): void
}

const Operation = (props: Props) => {
  const [filterState, setFilterState] = useState(true)
  const [visible, setVisible] = useState(false)
  const { updateIterateStatus, getIterateInfo } = useModel('iterate')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { filterAll, projectInfo } = useModel('project')
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [searchGroups, setSearchGroups] = useState<any>({
    statusId: [],
    priorityId: [],
    iterateId: [],
    tagId: [],
    userId: [],
    usersnameId: [],
    usersCopysendNameId: [],
    createdAtId: [],
    expectedStartAtId: [],
    expectedendat: [],
    updatedat: [],
    finishAt: [],
  })

  const onChangeStatus = async (val: number) => {
    if (val !== props.currentDetail?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: props.currentDetail?.id,
          status: val === 1,
        })
        message.success('修改成功')
        getIterateInfo({ projectId, id: props?.currentDetail?.id })
        props.onIsUpdateList?.(true)
      } catch (error) {

        //
      }
    }
  }

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag onClick={() => onChangeStatus(1)}>开启中</StatusTag>
      <StatusTag
        onClick={() => onChangeStatus(2)}
        style={{ color: '#969799', background: '#F2F2F4' }}
      >
        已结束
      </StatusTag>
    </Space>
  )

  const onFilterSearch = (e: any) => {
    const params = {
      statusId: e.status,
      priorityId: e.priority,
      iterateId: e.iterate_name,
      tagId: e.tag,
      userId: e.user_name,
      usersnameId: e.users_name,
      usersCopysendNameId: e.users_copysend_name,
      createdAtId: e.created_at,
      expectedStartAtId: e.expected_start_at,
      expectedendat: e.expected_end_at,
      updatedat: e.updated_at,
      finishAt: e.finish_at,
    }
    setSearchGroups(params)
    props.onSearch(params)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const addList = filterAll?.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }

    const arr = filterAll?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
  }

  useEffect(() => {
    getSearchKey()
  }, [projectInfo, filterAll])

  return (
    <StickyWrap>
      <Modal
        width={548}
        visible={visible}
        onCancel={() => setVisible(false)}
        title="迭代目标"
        footer={false}
        destroyOnClose
      >
        <div
          dangerouslySetInnerHTML={{
            __html: props.currentDetail?.info,
          }}
        />
      </Modal>
      <OperationWrap>
        <IterationInfo>
          <IconFont
            onClick={props.onChangeIsShowLeft}
            type="indent"
            style={{
              fontSize: 16,
              color: 'black',
              cursor: 'pointer',
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: 14, color: 'black', marginRight: 8 }}>
            {props.currentDetail?.name}
          </span>
          <span style={{ fontSize: 12, color: '#BBBDBF', marginRight: 8 }}>
            {props.currentDetail?.startTime}-{props.currentDetail?.endTime}
          </span>
          <Popover
            placement="bottom"
            content={changeStatus}
            getPopupContainer={node => node}
          >
            <StatusTag>
              {props.currentDetail?.status === 1 ? '开启中' : '已结束'}
              <IconFont
                type="down-icon"
                style={{ fontSize: 12, marginLeft: 4 }}
              />
            </StatusTag>
          </Popover>
          <IconFont
            onClick={() => setVisible(true)}
            type="detail"
            style={{
              fontSize: 16,
              color: '#969799',
              cursor: 'pointer',
              marginLeft: 8,
            }}
          />
        </IterationInfo>
        <OperationGroup
          onChangeFilter={() => setFilterState(!filterState)}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>
      {filterState
        ? null
        : (
            <TableFilter
              onFilter={getSearchKey}
              onSearch={onFilterSearch}
              list={searchList}
              basicsList={filterBasicsList}
              specialList={filterSpecialList}
              isIteration
            />
          )}
    </StickyWrap>
  )
}

export default Operation

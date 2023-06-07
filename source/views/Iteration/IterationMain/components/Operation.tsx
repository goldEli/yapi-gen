/* eslint-disable react/jsx-no-leaked-render */
// 迭代右侧的操作栏

/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useEffect, useRef, useState } from 'react'
import { IconFont } from '@staryuntech/ant-pro'
import { message, Space, Tooltip } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import EditAchievements from '../../components/EditAchievements'
import CommonModal from '@/components/CommonModal'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys, setProjectInfoValues } from '@store/project'
import { updateIterateStatus } from '@/services/iterate'
import { Editor } from '@xyfe/uikit'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import IterationStatus from '@/components/IterationStatus'

const OperationWrap = styled.div({
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StickyWrap = styled.div({
  background: 'white',
})

const IterationInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '70%',
  '.iterationName': {
    fontSize: 14,
    color: 'var(--neutral-n1-d1)',
    margin: '0 8px',
    maxWidth: '26%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
})

const IconWrap = styled(IconFont)({
  fontSize: 20,
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})
interface Props {
  isGrid: any
  onChangeGrid(val: boolean): void
  onChangeIsShowLeft?(): void
  onIsUpdateList?(val: boolean): void
  currentDetail?: any
  settingState: boolean
  onChangeSetting(val: boolean): void
  onSearch(params: any): void
  onRefresh(): void
  isShowLeft?: boolean
}

const Operation = (props: Props) => {
  const [t] = useTranslation()
  const [filterState, setFilterState] = useState(true)
  const [visible, setVisible] = useState(false)
  const [isAchievements, setIsAchievements] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, filterKeys, projectInfoValues } = useSelector(
    store => store.project,
  )
  // const { screenMin } = useSelector(store => store.global)
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [searchVal, setSearchVal] = useState('')
  const [searchGroups, setSearchGroups] = useState<any>({})
  const stickyWrapDom = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )
  const isCanCheck = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve/info',
  )

  const onChangeStatus = async (val: number) => {
    if (val !== props.currentDetail?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: props.currentDetail?.id,
          status: val,
        })
        getMessage({ msg: t('common.editS') as string, type: 'success' })
        const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
        // 修改迭代状态更新到项目下拉数据中
        const newValues = beforeValues?.map((i: any) =>
          i.key === 'iterate_name'
            ? {
                ...i,
                children: i.children?.map((v: any) => ({
                  ...v,
                  status: v.id === props?.currentDetail?.id ? val : v.status,
                })),
              }
            : i,
        )
        dispatch(setProjectInfoValues(newValues))
        props.onIsUpdateList?.(true)
      } catch (error) {
        //
      }
    }
  }

  const onFilterSearch = (e: any, customField: any) => {
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
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
      searchValue: searchVal,
    }
    setSearchGroups(params)
    props.onSearch(params)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    const filterFelid = projectInfo?.filterFelid
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }

    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
    setFilterCustomList(projectInfo?.filterCustomList)
  }

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
    }
  }, [projectInfo])

  const onChangeFilter = () => {
    setFilterState(!filterState)
  }

  const onClickIcon = (value: any) => {
    if (value === 1) {
      setIsShow2(false)
    } else {
      setIsShow(false)
    }
    props?.onChangeIsShowLeft?.()
  }

  return (
    <StickyWrap ref={stickyWrapDom}>
      <CommonModal
        width={784}
        isVisible={visible}
        onClose={() => setVisible(false)}
        title={t('project.iterateTarget')}
        isShowFooter
      >
        <div
          style={{
            overflow: 'auto',
            padding: '0 20px 16px 24px',
            height: '60vh',
          }}
        >
          {props.currentDetail?.info ? (
            <Editor
              value={props.currentDetail?.info || '--'}
              getSuggestions={() => []}
              readonly
            />
          ) : (
            // <div
            //   dangerouslySetInnerHTML={{
            //     __html: props.currentDetail?.info || '--',
            //   }}
            // />
            <NoData />
          )}
        </div>
      </CommonModal>
      <OperationWrap>
        <IterationInfo>
          {props.isShowLeft ? (
            <Tooltip
              key={isShow.toString()}
              visible={isShow}
              onVisibleChange={isShow3 => setIsShow(isShow3)}
              getTooltipContainer={node => node}
              title={t('common.collapseMenu')}
            >
              <IconWrap
                onClick={() => onClickIcon(1)}
                type="outdent"
                color="black"
              />
            </Tooltip>
          ) : (
            <Tooltip
              key={isShow2.toString()}
              visible={isShow2}
              onVisibleChange={isShow1 => setIsShow2(isShow1)}
              getTooltipContainer={node => node}
              title={t('common.openMenu')}
            >
              <IconWrap
                onClick={() => onClickIcon(2)}
                type="indent"
                color="black"
              />
            </Tooltip>
          )}
          {props.currentDetail?.id && (
            <>
              <Tooltip title={props.currentDetail?.name}>
                <span className="iterationName">
                  {props.currentDetail?.name}
                </span>
              </Tooltip>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--neutral-n4)',
                  marginRight: 8,
                }}
              >
                {props.currentDetail?.createdTime}-
                {props.currentDetail?.endTime}
              </span>
              <IterationStatus
                hasChangeStatus={hasChangeStatus}
                iterateInfo={props.currentDetail}
                onChangeStatus={onChangeStatus}
              />
              <Space size={8} style={{ marginLeft: 8 }}>
                <ScreenMinHover
                  label={t('project.iterateTarget')}
                  icon="detail"
                  onClick={() => setVisible(true)}
                  isActive={visible}
                />
                {isCanCheck ? null : (
                  <>
                    <DividerWrap type="vertical" />
                    <ScreenMinHover
                      label={t('p2.d2')}
                      icon="iteration"
                      onClick={() => setIsAchievements(true)}
                      isActive={isAchievements}
                    />
                  </>
                )}
              </Space>
            </>
          )}
        </IterationInfo>

        <OperationGroup
          onChangeFilter={onChangeFilter}
          onChangeGrid={props.onChangeGrid}
          onRefresh={props.onRefresh}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>
      {filterState ? null : (
        <TableFilter
          onFilter={getSearchKey}
          onSearch={onFilterSearch}
          list={searchList}
          basicsList={filterBasicsList.filter((i: any) => i.is_flaw !== 1)}
          specialList={filterSpecialList}
          customList={filterCustomList}
          isIteration
        />
      )}

      <EditAchievements
        isAchievements={isAchievements}
        onClose={() => setIsAchievements(false)}
        projectId={projectId}
        id={props.currentDetail?.id}
        isInfo={false}
      />
    </StickyWrap>
  )
}

export default Operation

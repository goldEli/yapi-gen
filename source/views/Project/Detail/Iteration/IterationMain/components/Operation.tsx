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
import IterationStatus from '../../components/IterationStatus'
import CommonModal from '@/components/CommonModal'
import EditorInfoReview from '@/components/EditorInfoReview'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import CommonInput from '@/components/CommonInput'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys, setProjectInfoValues } from '@store/project'
import { updateIterateStatus } from '@/services/project/iterate'

const OperationWrap = styled.div<{ isShowLeft?: boolean }>(
  {
    padding: '10px 24px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ({ isShowLeft }) => ({
    flexWrap: isShowLeft ? 'wrap' : 'initial',
  }),
)

const StickyWrap = styled.div({
  background: 'white',
})

const IterationInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
})

const IconWrap = styled(IconFont)<{ color?: string }>(
  {
    fontSize: 20,
    cursor: 'pointer',
    marginLeft: 8,
  },
  ({ color }) => ({
    color: color || '#969799',
  }),
)

interface Props {
  isGrid: any
  onChangeGrid(val: boolean): void
  onChangeIsShowLeft?(): void
  onIsUpdateList?(val: boolean): void
  currentDetail?: any
  settingState: boolean
  onChangeSetting(val: boolean): void
  onSearch(params: any): void
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
        message.success(t('common.editS'))
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

  const onChangeSearch = (value: string) => {
    if (searchVal !== value) {
      setSearchVal(value)
      const params = searchGroups
      params.searchValue = value
      setSearchGroups(params)
      props.onSearch(params)
      // 添加搜索项 计数
      const keys = value
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
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
            padding: '0 20px 16px 0',
            height: '60vh',
          }}
        >
          {props.currentDetail?.info ? (
            <EditorInfoReview info={props.currentDetail?.info || '--'} />
          ) : (
            <NoData />
          )}
        </div>
      </CommonModal>
      <OperationWrap isShowLeft={props.isShowLeft}>
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
              <span style={{ fontSize: 14, color: 'black', margin: '0 8px' }}>
                {props.currentDetail?.name}
              </span>
              <span style={{ fontSize: 12, color: '#BBBDBF', marginRight: 8 }}>
                {props.currentDetail?.createdTime}-
                {props.currentDetail?.endTime}
              </span>
              <IterationStatus
                hasChangeStatus={hasChangeStatus}
                iterateInfo={props.currentDetail}
                onChangeStatus={onChangeStatus}
              />
              <Space size={8} style={{ marginLeft: 8 }}>
                <HoverWrap onClick={() => setVisible(true)} isActive={visible}>
                  <IconFont className="iconMain" type="detail" />
                  <span className="label">{t('project.iterateTarget')}</span>
                </HoverWrap>
                {isCanCheck ? null : (
                  <>
                    <DividerWrap type="vertical" />
                    <HoverWrap
                      onClick={() => setIsAchievements(true)}
                      isActive={isAchievements}
                    >
                      <IconFont className="iconMain" type="iteration" />
                      <span className="label">{t('p2.d2')}</span>
                    </HoverWrap>
                  </>
                )}
              </Space>
            </>
          )}
        </IterationInfo>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CommonInput
            placeholder={t('common.pleaseSearchDemand')}
            onChangeSearch={onChangeSearch}
          />
          <OperationGroup
            onChangeFilter={onChangeFilter}
            onChangeGrid={props.onChangeGrid}
            isGrid={props.isGrid}
            filterState={filterState}
            settingState={props.settingState}
            onChangeSetting={() => props.onChangeSetting(!props.settingState)}
          />
        </div>
      </OperationWrap>
      {filterState ? null : (
        <TableFilter
          onFilter={getSearchKey}
          onSearch={onFilterSearch}
          list={searchList}
          basicsList={filterBasicsList}
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

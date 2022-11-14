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
import { Modal, message, Tooltip } from 'antd'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import EditAchievements from '../../components/EditAchievements'
import IterationStatus from '../../components/IterationStatus'
import CommonModal from '@/components/CommonModal'
import { TextWrapEditor } from '@/components/StyleCommon'

const OperationWrap = styled.div({
  padding: '0 24px',
  minHeight: 52,
  lineHeight: '52px',
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
  isGrid: boolean
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
  const { updateIterateStatus, getIterateInfo, setFilterHeightIterate } =
    useModel('iterate')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { filterAll, projectInfo } = useModel('project')
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const stickyWrapDom = useRef<HTMLDivElement>(null)
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
        getIterateInfo({ projectId, id: props?.currentDetail?.id })
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
    }
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
    setFilterCustomList(projectInfo?.filterCustomList)
  }

  useEffect(() => {
    getSearchKey()
  }, [projectInfo, filterAll])

  const onChangeFilter = () => {
    setFilterState(!filterState)

    setTimeout(() => {
      setFilterHeightIterate(Number(stickyWrapDom.current?.clientHeight) + 8)
    }, 42)
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
            padding: '0 20px 16px 0',
            minHeight: 400,
          }}
        >
          {props.currentDetail?.info ? (
            <TextWrapEditor
              dangerouslySetInnerHTML={{
                __html: props.currentDetail?.info,
              }}
            />
          ) : (
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
          <span style={{ fontSize: 14, color: 'black', margin: '0 8px' }}>
            {props.currentDetail?.name}
          </span>
          <span style={{ fontSize: 12, color: '#BBBDBF', marginRight: 8 }}>
            {props.currentDetail?.createdTime}-{props.currentDetail?.endTime}
          </span>
          <IterationStatus
            hasChangeStatus={hasChangeStatus}
            iterateInfo={props.currentDetail}
            onChangeStatus={onChangeStatus}
          />
          <Tooltip title={t('project.iterateTarget')}>
            <IconWrap onClick={() => setVisible(true)} type="detail" />
          </Tooltip>
          {isCanCheck ? null : (
            <Tooltip title={t('p2.d2')}>
              <IconWrap
                onClick={() => setIsAchievements(true)}
                type="iteration"
              />
            </Tooltip>
          )}
        </IterationInfo>
        <OperationGroup
          onChangeFilter={onChangeFilter}
          onChangeGrid={props.onChangeGrid}
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
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
          customList={filterCustomList}
          isIteration
        />
      )}
      {isAchievements ? (
        <EditAchievements
          isAchievements={isAchievements}
          onClose={() => setIsAchievements(false)}
          projectId={projectId}
          id={props.currentDetail?.id}
          isInfo={false}
        />
      ) : null}
    </StickyWrap>
  )
}

export default Operation

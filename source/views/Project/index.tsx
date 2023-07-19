/* eslint-disable max-params */
/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import CreateActionBar from '@/components/CreateActionBar'
import DeleteConfirm from '@/components/DeleteConfirm'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import LeftTitle from '@/components/LeftTitle'
import MainGrid from '@/components/MainGrid/MainGrid'
import MainTable from '@/components/MainTable/MainTable'
import { getMessage } from '@/components/Message'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import PermissionWrap from '@/components/PermissionWrap'
import useSetTitle from '@/hooks/useSetTitle'
import {
  deleteProject,
  getProjectList,
  openProject,
  stopProject,
} from '@/services/project'
import { getProjectCover } from '@store/cover/thunks'
import { changeCreateVisible, onRest } from '@store/create-propject'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefreshGroup, onChangeGuideVisible } from '@store/project'
import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Content, Wrap } from './style'
import ProjectSide from './ProjectSide'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.jpg'
import guide_2 from './img/guide_2.jpg'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'

const ProjectManagementOptimization = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { guideVisible } = useSelector(store => store.project)
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(t('title.project'))

  const [stepsEnabled, setStepsEnabled] = useState(false)
  const [initialStep, setInitialStep] = useState(0)
  const [steps, setSteps] = useState([
    {
      element: '.hello',
      intro: 'Hello step',
    },
    {
      element: '.app-2',
      intro: (
        <div
          style={{
            color: 'red',
          }}
        >
          feiji
        </div>
      ),
    },
  ])

  const [isGrid, setIsGrid] = useState(false)
  const [isStop, setIsStop] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [projectTypes, setProjectTypes] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const [groupId, setGroupId] = useState<any>(null)
  const { userInfo, currentMenu, userPreferenceConfig } = useSelector(
    store => store.user,
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const [projectList, setProjectList] = useState<any>({
    list: undefined,
  })
  const isRest = useSelector(state => state.createProject.isRest)
  const { groupId: storeGid, typeId } = useSelector(
    state => state.createProject,
  )

  // console.log('isGrid', isGrid)

  const inform = [
    {
      key: 0,
      title: t('project.stepTitle1'),
      desc: t('project.stepDesc1'),
      img: guide_1,
    },
    {
      key: 1,
      title: t('project.stepTitle2'),
      desc: t('project.stepDesc2'),
      extra: t('project.stepExtra'),
      img: guide_2,
    },
  ]

  const getList = async (
    active: number,
    isTable: boolean,
    isDisable: boolean,
    val: string,
    sortVal: any,
    pageVal: any,
    groupIdVal?: any,
  ) => {
    setIsSpinning(true)
    const params: any = {
      searchValue: val,
      orderKey: sortVal.key,
      order: sortVal.value,
      status: isDisable ? 1 : 0,
      groupId: groupIdVal,
      project_types: projectTypes,
    }
    if (isTable) {
      params.all = true
    }
    if (!isTable) {
      params.page = pageVal.page
      params.pageSize = pageVal.size
    }
    if (!groupIdVal) {
      params.self = active !== 1
      if (active) {
        params.isPublic = 1
      }
    }
    const result = await getProjectList(params)
    setProjectList(result)
    setIsSpinning(false)
    dispatch(onRest(false))
  }

  useEffect(() => {
    getList(activeType, isGrid, isHidden, searchVal, order, pageObj, groupId)
  }, [
    isHidden,
    activeType,
    order,
    searchVal,
    isGrid,
    pageObj,
    groupId,
    isRest,
    projectTypes,
  ])

  useEffect(() => {
    dispatch(getProjectCover())
  }, [])

  // 更新列表
  const onUpdate = () => {
    getList(activeType, isGrid, isHidden, searchVal, order, pageObj, groupId)
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  const onChangeSort = (str: string) => {
    setOrder({ value: 'asc', key: str })
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  const onChangeSearch = (value: string) => {
    if (searchVal !== value) {
      setProjectList({
        list: undefined,
      })
      setSearchVal(value)
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      setIsDelete(false)
      setOperationDetail({})
      onUpdate()
      dispatch(setIsRefreshGroup(true))
    } catch (error) {
      //
    }
  }

  const onEndOrOpen = async (item: any) => {
    try {
      if (item.status === 1) {
        await stopProject({ id: item.id })
      } else {
        await openProject({ id: item.id })
      }
      getMessage({
        msg:
          item.status === 1 ? t('common.endSuccess') : t('common.openSuccess'),
        type: 'success',
      })
      setOperationDetail({})
      setIsStop(false)
      onUpdate()
    } catch (error) {
      //
    }
  }

  const onChangeOperation = (type: string, item: any, e?: any) => {
    if (e) {
      e.stopPropagation()
    }
    setOperationDetail(item)
    if (type === 'delete') {
      setIsDelete(true)
    } else if (type === 'edit') {
      setIsVisible(true)
    } else if (item.status === 1) {
      setIsStop(true)
    } else {
      onEndOrOpen(item)
    }
  }

  const onStopProject = () => {
    onEndOrOpen(operationDetail)
  }

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  const onAddClick = () => {
    dispatch({ type: 'createProject/changeCreateVisible', payload: true })
    setOperationDetail({})
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj({
      page: item.page,
      size: item.size,
    })
  }

  const onUpdateOrderKey = (item: any) => {
    setOrder(item)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  const onChangeType = (type: number) => {
    setActiveType(type)
    setGroupId(null)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }
  const onChangeProjectType = (data: any) => {
    // console.log(data, '数据')
    setProjectTypes(data)
  }
  // 切换分组查询列表
  const onChangeGroup = (id: number) => {
    setGroupId(id)
    setActiveType(-1)
  }

  useEffect(() => {
    if (storeGid) {
      setGroupId(storeGid)
      setActiveType(-1)
    }
  }, [storeGid])

  useEffect(() => {
    if (typeId || typeId === 0) {
      setActiveType(typeId)
      setGroupId(null)
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
    }
  }, [typeId])
  const onExit = () => {
    setStepsEnabled(false)
  }
  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <HasSideCommonLayout
        side={
          <ProjectSide
            onAddClick={onAddClick}
            onChangeType={onChangeType}
            activeType={activeType}
            onChangeGroup={onChangeGroup}
          />
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '32px',
            padding: '20px 24px',
            marginBottom: '20px',
          }}
        >
          <LeftTitle
            title={t(typeId === 0 ? 'project.mineJoin' : 'all_enterprises')}
          />
          <div>
            <InputSearch
              width={184}
              bgColor="var(--neutral-white-d4)"
              length={12}
              placeholder={t('other.pleaseNameOrKey')}
              onChangeSearch={(value: string) => setSearchVal(value)}
              leftIcon
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            // justifyContent: 'space-between',
            alignItems: 'center',
            height: '32px',
            padding: '20px 24px',
          }}
        >
          {(
            userInfo.company_permissions?.map((i: any) => i.identity) || []
          ).includes('b/project/save') && (
            <div className="hello">
              <CommonButton
                type="primary"
                onClick={() => dispatch(changeCreateVisible(true))}
                icon="plus"
                iconPlacement="left"
              >
                {t('common.createProject')}
              </CommonButton>
            </div>
          )}

          <CreateActionBar
            sort={order.key}
            isGrid={isGrid}
            activeType={activeType}
            onRefresh={onUpdate}
            onChangeSort={onChangeSort}
            onChangeFormat={onChangeGrid}
            onChangeHidden={onChangeHidden}
            onChangeSearch={onChangeSearch}
            onChangeProjectType={onChangeProjectType}
          />
        </div>
        <Wrap>
          <Content isGrid={isGrid}>
            <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
              {isGrid ? (
                <MainGrid
                  onChangeVisible={() => setIsVisible(true)}
                  onChangeOperation={onChangeOperation}
                  onAddClear={() => setOperationDetail({})}
                  hasFilter={searchVal.length > 0 || isHidden}
                  projectList={projectList}
                />
              ) : (
                <MainTable
                  onChangeOperation={onChangeOperation}
                  onChangePageNavigation={onChangePageNavigation}
                  onUpdateOrderKey={onUpdateOrderKey}
                  order={order}
                  onAddClick={onAddClick}
                  hasFilter={searchVal.length > 0 || isHidden}
                  projectList={projectList}
                />
              )}
            </Spin>
          </Content>
        </Wrap>
      </HasSideCommonLayout>

      <DeleteConfirm
        text={t('mark.delP')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <DeleteConfirm
        title={t('mark.endP')}
        text={t('common.stopProjectToast', { name: operationDetail?.name })}
        isVisible={isStop}
        onChangeVisible={() => setIsStop(!isStop)}
        onConfirm={onStopProject}
      />
      {userPreferenceConfig?.guidePageConfig?.project_list === 1 && isGrid ? (
        <GuideModal
          width={784}
          height={700}
          inform={inform}
          close={async () => {
            await updateCompanyUserPreferenceConfig({
              id: userPreferenceConfig?.id,
              previewModel: userPreferenceConfig.previewModel,
              guidePageConfig: {
                project_list: 2,
              },
            })
            dispatch(getLoginDetail())
          }}
        />
      ) : null}
    </PermissionWrap>
  )
}

export default ProjectManagementOptimization

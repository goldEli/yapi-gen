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
import { setIsRefreshGroup } from '@store/project'
import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Content, Wrap } from './style'

const ProjectManagementOptimization = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(t('title.project'))
  const [isGrid, setIsGrid] = useState(true)
  const [isStop, setIsStop] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const [groupId, setGroupId] = useState<any>(null)
  const { userInfo } = useSelector(store => store.user)
  const [isSpinning, setIsSpinning] = useState(false)
  const [projectList, setProjectList] = useState<any>({
    list: undefined,
  })
  const isRest = useSelector(state => state.createProject.isRest)
  const { groupId: storeGid, typeId } = useSelector(
    state => state.createProject,
  )
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
  }, [isHidden, activeType, order, searchVal, isGrid, pageObj, groupId, isRest])
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
      message.success(t('common.deleteSuccess'))
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
      message.success(
        item.status === 1 ? t('common.endSuccess') : t('common.openSuccess'),
      )
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
    setIsVisible(true)
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

  useEffect(() => {
    setGroupId(storeGid)
    setActiveType(-1)
  }, [storeGid])
  useEffect(() => {
    setActiveType(typeId)
    setGroupId(null)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }, [typeId])

  return (
    <div>
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '32px',
          padding: '20px 24px',
          marginBottom: '20px',
        }}
      >
        <LeftTitle title="企业全部" />
        <div>
          <InputSearch
            width={184}
            bgColor="var(--neutral-white-d4)"
            length={12}
            placeholder="请输入昵称姓名邮箱电话"
            onChangeSearch={(value: string) => setSearchVal(value)}
            leftIcon
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '32px',
          padding: '20px 24px',
          margin: '20px 0 ',
        }}
      >
        <CommonButton
          type="primary"
          onClick={() => dispatch(changeCreateVisible(true))}
        >
          <span>
            <IconFont type="plus" style={{ fontSize: 15 }} />
            创建项目
          </span>
        </CommonButton>

        <CreateActionBar
          sort={order.key}
          isGrid={isGrid}
          activeType={activeType}
          onChangeSort={onChangeSort}
          onChangeFormat={onChangeGrid}
          onChangeHidden={onChangeHidden}
          onChangeSearch={onChangeSearch}
        />
      </div>
      <Wrap>
        <Content isGrid={isGrid}>
          <Spin spinning={isSpinning}>
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
                onChangeOperation={(e, type, item) =>
                  onChangeOperation(e, type, item)
                }
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
    </div>
  )
}

export default ProjectManagementOptimization

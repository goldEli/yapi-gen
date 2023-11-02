/* eslint-disable no-undefined */
import { useState } from 'react'
import HeaderFilter from './components/HeaderFilter'
import { ProjectWrap, ProjectIndexWrap } from './style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { Spin } from 'antd'
import MainGrid from '@/components/MainGrid/MainGrid'
import MainTable from '@/components/MainTable/MainTable'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'
import {
  deleteProject,
  getProjectList,
  openProject,
  stopProject,
} from '@/services/project'
import DeleteConfirm from '@/components/DeleteConfirm'
import GuideModal from '@/components/GuideModal'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'

const ProjectIndex = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userPreferenceConfig } = useSelector(store => store.user)
  // 缩略图还是列表
  const [isSpinning, setIsSpinning] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isStop, setIsStop] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  // 当前操作的数据
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [dataList, setDataList] = useState({
    list: undefined,
  })
  // 筛选条件默认值
  const [filterParams, setFilterParams] = useState({
    // 查看类型 例-最近查看
    type: 1,
    // 状态
    status: 2,
    // 搜索值
    keyword: '',
    // 项目周期
    time: [],
    //其他的类型
    otherType: [1, 2, 3],
    pageObj: { page: 1, size: 30 },
    order: { value: '', key: '' },
    isGrid: false,
  })

  const inform = [
    {
      key: 0,
      title: t('project.stepTitle1'),
      desc: t('project.stepDesc1'),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/iteration/guide_1.jpg',
    },
    {
      key: 1,
      title: t('project.stepTitle2'),
      desc: t('project.stepDesc2'),
      extra: t('project.stepExtra'),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/iteration/guide_2.jpg',
    },
  ]

  // 获取数据
  const getList = async (params: any, notSpin?: boolean) => {
    setIsSpinning(notSpin ? false : true)
    const paramsObj: any = {
      searchValue: params?.keyword,
      orderKey: params?.order?.key,
      order: params?.order?.value,
      status: '',
      project_types: '',
    }
    if (params?.isGrid) {
      paramsObj.all = true
    }
    if (!params?.isGrid) {
      paramsObj.page = 1
      paramsObj.pageSize = 20
    }

    const result = await getProjectList(paramsObj)
    setDataList(result)
    setIsSpinning(false)
  }

  //   筛选条件变化后更新数据 或者是 刷新
  const onChangeParamsUpdate = (params: any, notSpin?: boolean) => {
    setFilterParams(params)
    getList(params, notSpin)
  }

  //  修改分页
  const onChangePageNavigation = (item: any) => {
    onChangeParamsUpdate({
      ...filterParams,
      pageObj: {
        page: item.page,
        size: item.size,
      },
    })
  }

  // 修改排序值
  const onUpdateOrderKey = (item: any) => {
    onChangeParamsUpdate({
      ...filterParams,
      order: item,
      pageObj: {
        page: 1,
        size: filterParams?.pageObj.size,
      },
    })
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      setIsDelete(false)
      setOperationDetail({})
      onChangeParamsUpdate(filterParams, true)
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
      onChangeParamsUpdate(filterParams, true)
    } catch (error) {
      //
    }
  }

  const onStopProject = () => {
    onEndOrOpen(operationDetail)
  }

  // 操作更多 例-编辑
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

  // 项目列表点击快捷添加
  const onAddClick = () => {
    dispatch({ type: 'createProject/changeCreateVisible', payload: true })
    setOperationDetail({})
  }

  return (
    <ProjectIndexWrap>
      {/* 删除项目 */}
      <DeleteConfirm
        text={t('mark.delP')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />

      {/* 结束或者和是开启项目 */}
      <DeleteConfirm
        title={t('mark.endP')}
        text={t('common.stopProjectToast', {
          name: operationDetail?.name,
          name1:
            operationDetail?.project_type === 2
              ? t('Transaction_sprint')
              : t('Requirement_iteration'),
        })}
        isVisible={isStop}
        onChangeVisible={() => setIsStop(!isStop)}
        onConfirm={onStopProject}
      />
      <HeaderFilter
        filterParamsAll={filterParams}
        onChangeParamsUpdate={onChangeParamsUpdate}
      />
      <ProjectWrap>
        <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
          {filterParams?.isGrid ? (
            <MainGrid
              onChangeVisible={() => setIsVisible(true)}
              onChangeOperation={onChangeOperation}
              onAddClick={onAddClick}
              hasFilter={
                filterParams?.keyword?.length > 0 ||
                filterParams?.time?.length > 0 ||
                filterParams?.status > 0 ||
                filterParams?.otherType?.length > 0
              }
              projectList={dataList}
            />
          ) : (
            <MainTable
              onChangeOperation={onChangeOperation}
              onChangePageNavigation={onChangePageNavigation}
              onUpdateOrderKey={onUpdateOrderKey}
              order={filterParams?.order}
              onAddClick={onAddClick}
              hasFilter={
                filterParams?.keyword?.length > 0 ||
                filterParams?.time?.length > 0 ||
                filterParams?.status > 0 ||
                filterParams?.otherType?.length > 0
              }
              projectList={dataList}
            />
          )}
        </Spin>
      </ProjectWrap>
      {userPreferenceConfig?.guidePageConfig?.project_list === 1 &&
      filterParams?.isGrid ? (
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
    </ProjectIndexWrap>
  )
}

export default ProjectIndex

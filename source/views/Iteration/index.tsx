// 迭代主页

/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import IterationMain from './IterationMain'
import IterationInfo from './IterationInfo'
import ChangeRecord from './ChangeRecord'
import Demand from './Demand'
import Achieve from './Achieve'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, message } from 'antd'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import { encryptPhp } from '@/tools/cryptoPhp'
import TableFilter from '@/components/TableFilter'
import { OptionalFeld } from '@/components/OptionalFeld'
import DropDownMenu from '@/components/DropDownMenu'
import InputSearch from '@/components/InputSearch'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateAddWorkItem, setProjectInfoValues } from '@store/project'
import {
  deleteIterate,
  getIterateInfo,
  updateIterateStatus,
} from '@/services/iterate'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
  setIterateInfo,
} from '@store/iterate'
import SetShowField from '@/components/SetShowField/indedx'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import PermissionWrap from '@/components/PermissionWrap'
import CommonButton from '@/components/CommonButton'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import IterationStatus from '@/components/IterationStatus'

import useKeyPress from '@/hooks/useKeyPress'
const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding: 20px 24px 0 0px;
  flex-direction: column;
`

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  background: 'white',
  margin: '20px 0 6px 24px',
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.name': {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    marginRight: 8,
  },
})

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 90px)',
  padding: '0 0 0 24px',
})

const MainWrap = styled.div({
  background: 'white',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--neutral-n6-d1)',
  '.ant-space-item': {
    display: 'flex',
  },
})

const TitleWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const OperationWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const Item = styled.div<{ activeIdx: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    span: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 4,
      color: 'var(--neutral-n2)',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)',
      borderBottom: activeIdx
        ? '2px solid var(--primary-d2)'
        : '2px solid white',
      fontFamily: activeIdx ? 'SiYuanMedium' : '',
    },
    div: {
      color: activeIdx ? 'white' : 'var(--primary-d2)',
      background: activeIdx ? 'var(--primary-d2)' : 'var(--function-tag5)',
    },
  }),
)

const Iteration = () => {
  const { useKeys } = useKeyPress()
  useKeys('2', '/ProjectManagement/KanBan')
  useKeys('3', '/Report/PerformanceInsight')
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [settingState, setSettingState] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { type } = paramsData
  const navigate = useNavigate()
  const { iterateId } = paramsData
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const { currentMenu } = useSelector(store => store.user)
  const { iterateInfo, createIterationParams } = useSelector(
    store => store.iterate,
  )
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const [searchValue, setSearchValue] = useState('')

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
    searchVal: '',
  })
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(`${t('title.iteration')}【${projectInfo.name}】`)

  const getSearchKey = async (key?: any, typeVal?: number) => {
    const filterFelid = projectInfo?.filterFelid
    if (key && typeVal === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && typeVal === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }

    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
  }

  const onUpdateIterateInfo = async (id: any) => {
    const result = await getIterateInfo({ projectId, id })
    dispatch(setIterateInfo(result))
    dispatch(setCreateIterationParams({}))
  }

  useEffect(() => {
    // 迭代详情页面调用迭代详情
    if (iterateId || (iterateId && createIterationParams?.isUpdate)) {
      onUpdateIterateInfo(iterateId)
    }
  }, [iterateId, createIterationParams?.isUpdate])

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
      setFilterBasicsList(projectInfo?.filterBasicsList)
      setFilterSpecialList(projectInfo?.filterSpecialList)
      setFilterCustomList(projectInfo?.filterCustomList)
      setPlainOptions(projectInfo.plainOptions)
      setPlainOptions2(projectInfo.plainOptions2)
      setPlainOptions3(projectInfo.plainOptions3)
      setTitleList(projectInfo.titleList)
      setTitleList2(projectInfo.titleList2)
      setTitleList3(projectInfo.titleList3)
      setAllTitleList([
        ...projectInfo.titleList,
        ...projectInfo.titleList2,
        ...projectInfo.titleList3,
      ])
    }
  }, [projectInfo])

  const onChangeOperation = (item: any) => {
    setOperationDetail(item)
  }

  const onChangeVisible = (val?: any) => {
    setIsVisible(!isVisible)
    if (val) {
      setOperationDetail({})
    }
  }

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <Wrap>
        <IterationMain
          onChangeVisible={onChangeVisible}
          onChangeOperation={item => onChangeOperation(item)}
          updateState={isUpdateState}
          onChangeIsUpdate={setIsUpdateState}
        />
      </Wrap>
    </PermissionWrap>
  )
}

export default Iteration

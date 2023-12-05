/* eslint-disable no-param-reassign */
// 需求主页-操作栏

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { Popover, Select, Space, Tooltip } from 'antd'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import ExportDemand from '@/components/CommonExport'
import ImportDemand from '@/components/CommonImport'
import { useDispatch, useSelector } from '@store/index'
import {
  setAddWorkItemModal,
  setCreateCategory,
  setFilterParamsModal,
} from '@store/project'
import { clearValue, saveScreen } from '@store/view'
import CommonIconFont from '@/components/CommonIconFont'
import {
  getImportDownloadModel,
  getImportExcel,
  getImportExcelUpdate,
  getExportFields,
  getLoadListFields,
  getExportExcel,
} from '@/services/demand'
import {
  IconWrap,
  LiWrap,
  OperationWrap,
  StatusGroup,
  StatusItems,
  StickyWrap,
} from '../style'
import { useHotkeys } from 'react-hotkeys-hook'
import InputSearch from '@/components/InputSearch'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import MoreSelect from '@/components/MoreSelect'
import RangePicker from '@/components/RangePicker'
import dayjs from 'dayjs'
import moment from 'moment'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'

interface Props {
  isGrid: any
  onChangeGrid(val: any): void
  onSearch(params: any): void
  onRefresh(): void
  settingState: boolean
  onChangeSetting(val: boolean): void
  onChangeIsShowLeft?(): void
  isShowLeft?: boolean
  otherParams: any
  dataLength: any
  pid: any
  statistics: any
  onInputSearch?(value?: string): void
}

const Operation = (props: Props, ref: any) => {
  const [t, i18n] = useTranslation()
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [isShowExport, setIsShowExport] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [defaultValue, setDefaultValue] = useState({})

  // 导出超出限制提示
  const [exceedState, setExceedState] = useState(false)
  const { projectInfo, filterKeys, projectInfoValues, filterParams } =
    useSelector(store => store.project)
  const { searchChoose } = useSelector(store => store.view)
  const { userInfo } = useSelector(store => store.user)
  const [activityIndex, setActivityIndex] = useState(0)
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [searchVal, setSearchVal] = useState('')
  const [boxMaps, setBoxMaps] = useState<any>()
  const [date, setDate] = useState<any>()
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
    searchValue: '',
  })

  const stickyWrapDom = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const info = useGetloginInfo()
  const splitArrayByValue = (arr: any) => {
    let arr1 = arr.filter((x: any) => x.status === 1)
    // 已离职
    let arr2 = arr
      .filter((x: any) => x.status === 2)
      .map((item: any, index: number) => ({ ...item, isFirst: index === 0 }))
    const a = {
      label: t('working'),
      children: arr1,
    }
    const b = {
      label: t('resigned'),
      children: arr2,
    }
    return [...arr1, ...arr2]
    return arr2.length >= 1 ? [...arr1, b] : [...arr1]
  }
  function deWeight(arr: any) {
    const map = new Map()
    for (const item of arr || []) {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    }
    arr = [...map.values()]
    return arr
  }
  const format = (arr: any) => {
    const newA = arr.filter((j: any) => {
      return j.value === info
    })

    const newB = arr.filter((j: any) => {
      return j.value !== info
    })

    return newA
      .map((i: any) => ({
        ...i,
        id: i.id,
        value: i.value,
        label: `${i.label}（${t('myself')}）`,
      }))
      .concat(newB)
  }
  const onFilterSearch = (e: any, customField: any) => {
    const params = {
      statusId: e.category_status_ids,
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
      searchValue: searchVal,
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
    }
    setSearchGroups(params)
    props.onSearch(params)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    const filterFelid = projectInfo?.filterFelid

    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      dispatch(
        saveScreen(searchList.filter((item: any) => item.content !== key)),
      )
      return
    }
    if (key && type === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)
      setSearchList([...searchList, ...addList])
      dispatch(saveScreen([...searchList, ...addList]))
      return
    }
    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)
    setSearchList(arr)
    dispatch(saveScreen(arr))
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
    setFilterCustomList(projectInfo?.filterCustomList)
  }

  function filterObj(mainObject: any, filterFunction: any) {
    return Object.keys(mainObject)
      .filter(ObjectKey => {
        return filterFunction(mainObject[ObjectKey])
      })
      .reduce((result: any, ObjectKey) => {
        result[ObjectKey] = mainObject[ObjectKey]
        return result
      }, {})
  }

  useEffect(() => {
    if (JSON.stringify(searchChoose) === '{}' || !searchChoose) {
      return
    }
    if (JSON.stringify(searchChoose) !== '{}' && searchChoose) {
      const targetSubjects = filterObj(searchChoose, (grade: any) => {
        return grade !== null
      })
      const keys = Object.keys(searchChoose)
      const filterFelid = projectInfo?.filterFelid
      const newArr = filterFelid?.filter((i: any) => {
        return keys.includes(i.content)
      })
      setSearchList(newArr)
      dispatch(saveScreen(newArr))
      setDefaultValue(targetSubjects)
    }
  }, [searchChoose])

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
    }
  }, [projectInfo])
  useLayoutEffect(() => {
    const map: any = new Map()
    // time-spanTag
    const box = document.querySelectorAll('.SelectWrapBedeck')
    box.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      map.set(attr, w)
    })
    setBoxMaps(map)
  }, [props])
  const onChangeFilter = () => {
    setFilterState(!filterState)
  }

  const onChangeCategory = (e: any, item: any) => {
    dispatch(setCreateCategory(item))

    // 需求列表筛选参数赋值给 弹窗
    dispatch(setFilterParamsModal(filterParams))
    setTimeout(() => {
      dispatch(
        setAddWorkItemModal({
          visible: true,
          params: {
            projectId: projectInfo?.id,
            type: 1,
            title: t('createRequirements'),
          },
        }),
      )
      setIsVisible(false)
    }, 0)
  }
  useHotkeys(
    'c',
    () => {
      dispatch(
        setAddWorkItemModal({
          visible: true,
          params: {
            projectId: projectInfo?.id,
            type: 1,
            title: t('createRequirements'),
          },
        }),
      )
    },
    [],
  )
  //   状态类型列表
  const statusList = [
    { name: '全部', key: 0, field: '' },
    { name: '指派我的', key: 1, field: 'users_name', type: 'handler_count' },
    { name: '我创建的', key: 2, field: 'user_name', type: 'user_create_count' },
  ]
  const onImportClick = () => {
    setIsVisible(false)
    setIsShowImport(true)
    setIsVisibleMore(false)
  }

  const onExportClick = () => {
    if (props.dataLength > 5000) {
      setIsVisibleMore(false)
      setExceedState(true)
      return
    }
    setIsVisible(false)
    setIsShowExport(true)
    setIsVisibleMore(false)
  }
  useImperativeHandle(ref, () => {
    return {
      onImportClick,
      onExportClick,
    }
  })
  const onImportClose = () => {
    setIsShowImport(false)
  }

  const onClickIcon = (value: any) => {
    if (value === 1) {
      setIsShow2(false)
    } else {
      setIsShow(false)
    }
    props?.onChangeIsShowLeft?.()
  }
  useEffect(() => {
    dispatch(clearValue())
  }, [location])

  return (
    <StickyWrap ref={stickyWrapDom}>
      <DeleteConfirm
        onConfirm={() => setExceedState(false)}
        onChangeVisible={() => setExceedState(false)}
        isVisible={exceedState}
        title={t('p2.toast')}
        text={t('p2.exportDemandText')}
      />
      <CommonModal
        isVisible={isShowImport}
        width={784}
        title={t('newlyAdd.importDemand')}
        isShowFooter
        onClose={onImportClose}
      >
        <ImportDemand
          tips={{
            tab1: (
              <>
                <span>{t('newlyAdd.importText2')}</span>
                <span>{t('newlyAdd.importText3')}</span>
                <span>{t('newlyAdd.importText4')}</span>
                <span>{t('newlyAdd.importText5')}</span>
                <span>{t('newlyAdd.importText6')}</span>
                <span>{t('newlyAdd.importText7')}</span>
                <span>{t('newlyAdd.importText8')}</span>
                <span>{t('newlyAdd.importText9')}</span>
              </>
            ),
            tab2: (
              <>
                <span>{t('newlyAdd.importText10')}</span>
                <span>{t('newlyAdd.importText4')}</span>
                <span>{t('newlyAdd.importText6')}</span>
                <span>{t('newlyAdd.importText7')}</span>
                <span>{t('newlyAdd.importText8')}</span>
                <span>{t('newlyAdd.importText9')}</span>
                <span>{t('newlyAdd.importText11')}</span>
                <span>{t('newlyAdd.importText12')}</span>
              </>
            ),
          }}
          stepText={t('newlyAdd.uploadDemand')}
          interfaces={{
            getImportDownloadModel,
            getImportExcel,
            getImportExcelUpdate,
          }}
          templateInterfaces={{
            getExportFields,
            getLoadListFields,
          }}
          templateTitle={t('newlyAdd.importChoose')}
          onUpdate={props.onRefresh}
        />
      </CommonModal>

      <ExportDemand
        exportText={t('newlyAdd.exportDemand')}
        isShowExport={isShowExport}
        onClose={setIsShowExport}
        searchGroups={searchGroups}
        otherParams={props.otherParams}
        interfaces={{ getExportExcel }}
        templateInterfaces={{
          getExportFields,
          getLoadListFields,
        }}
      />
      <OperationWrap>
        <Space size={16} style={{ position: 'relative' }}>
          {props.isShowLeft ? (
            <Tooltip
              visible={isShow}
              onVisibleChange={isShow3 => setIsShow(isShow3)}
              getTooltipContainer={node => node}
              title={t('newlyAdd.collapseClass')}
            >
              <IconWrap onClick={() => onClickIcon(1)} type="outdent" />
            </Tooltip>
          ) : (
            <Tooltip
              visible={isShow2}
              onVisibleChange={isShow1 => setIsShow2(isShow1)}
              getTooltipContainer={node => node}
              title={t('newlyAdd.openClass')}
            >
              <IconWrap onClick={() => onClickIcon(2)} type="indent" />
            </Tooltip>
          )}
          <StatusGroup>
            {statusList?.map((i: any, index: number) => (
              <StatusItems
                key={i.key}
                isActive={i.key === activityIndex}
                onClick={() => {
                  console.log(userInfo)
                  // 处理人users_name 创建人user_name
                  const { field } = i
                  const { id } = userInfo
                  onFilterSearch({ [field]: id }, {})
                  setActivityIndex(index)
                }}
              >
                {i.name}
                {i.type ? props?.statistics?.[i.type] : null}
              </StatusItems>
            ))}
          </StatusGroup>
          <InputSearch
            placeholder="搜索事务名称或编号"
            onChangeSearch={(value: any) => {
              props.onInputSearch && props.onInputSearch(value)
            }}
          ></InputSearch>
          <SelectWrapBedeck
            key="users_name"
            datatype="users_name"
            className="SelectWrapBedeck"
          >
            <span style={{ marginLeft: '16px', fontSize: '14px' }}>处理人</span>
            <MoreSelect
              onChange={(value: any) => {
                onFilterSearch({ users_name: value }, {})
              }}
              width={boxMaps?.get('users_name')}
              renderChildren
              options={splitArrayByValue(
                format(
                  deWeight(
                    projectInfoValues
                      ?.filter((k: any) => k.key === 'users_name')[0]
                      ?.children?.map((v: any) => ({
                        ...v,
                        label: v.content_txt || v.content,
                        value: v.id,
                        id: v.id,
                      })),
                  ),
                ),
              )}
            >
              {splitArrayByValue(
                format(
                  deWeight(
                    projectInfoValues
                      ?.filter((k: any) => k.key === 'user_name')[0]
                      ?.children?.map((v: any) => ({
                        ...v,
                        label: v.content_txt || v.content,
                        value: v.id,
                        id: v.id,
                      })),
                  ),
                ),
              )?.map((item: any) => {
                return (
                  <Select.Option
                    key={item.id}
                    value={item.id}
                    label={item.label}
                    className={
                      item.status === 2 && item.isFirst ? 'removeStyle' : ''
                    }
                  >
                    {item.label ?? item.content}
                    <span>{item.status === 1 ? '' : t('removed')}</span>
                  </Select.Option>
                )
              })}
            </MoreSelect>
          </SelectWrapBedeck>

          <SelectWrapBedeck
            key="date"
            datatype="date"
            className="SelectWrapBedeck"
          >
            <span style={{ marginLeft: '16px', fontSize: '14px' }}>时间</span>
            <RangePicker
              onChange={dates => {
                if (!dates) {
                  setDate('')
                  onFilterSearch({}, {})
                  return
                }
                const [expected_start_at, expected_end_at] = dates
                setDate(dates)
                onFilterSearch(
                  {
                    expected_start_at:
                      dayjs(expected_start_at).format('YYYY-MM-DD'),
                    expected_end_at:
                      dayjs(expected_end_at).format('YYYY-MM-DD'),
                  },
                  {},
                )
              }}
              isShowQuick
              placement="bottomLeft"
              dateValue={
                date
                  ? [
                      moment(date[0]).unix()
                        ? moment(date[0])
                        : moment('1970-01-01'),
                      moment(date[1]).unix() === 1893427200 ||
                      moment(date[1]).unix() === 0
                        ? moment('2030-01-01')
                        : moment(date[1]),
                    ]
                  : null
              }
              w={boxMaps?.get('date')}
            ></RangePicker>
          </SelectWrapBedeck>
        </Space>

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

      <div
        style={{
          height: filterState ? '0px' : 'initial',
          visibility: filterState ? 'hidden' : 'visible',
        }}
      >
        <TableFilter
          noNeed
          defaultValue={defaultValue}
          onFilter={getSearchKey}
          onSearch={(e: any, customField: any) =>
            onFilterSearch(e, customField)
          }
          list={searchList?.filter((i: any) => i.is_flaw !== 1)}
          basicsList={filterBasicsList?.filter((i: any) => i.is_flaw !== 1)}
          specialList={filterSpecialList}
          customList={filterCustomList}
        />
      </div>
    </StickyWrap>
  )
}

export default forwardRef(Operation)

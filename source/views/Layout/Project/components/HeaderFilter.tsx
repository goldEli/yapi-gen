/* eslint-disable react/no-unknown-property */
import CommonButton from '@/components/CommonButton'
import {
  HeaderBottom,
  HeaderFilterWrap,
  HeaderTop,
  StatusGroup,
  StatusItems,
  FilterLeftWrap,
  ResetWrap,
  DividerWrap,
  FilterRightWrap,
} from '../style'
import { useState, useLayoutEffect, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import InputSearch from '@/components/InputSearch'
import RangePicker from '@/components/RangePicker'
import { HasIconMenu, SelectWrapBedeck } from '@/components/StyleCommon'
import moment from 'moment'
import { Checkbox, Menu } from 'antd'
import { getMessage } from '@/components/Message'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import ScreenMinHover from '@/components/ScreenMinHover'
import { useDispatch, useSelector } from '@store/index'

interface HeaderFilterProps {
  filterParamsAll: any
  onChangeParamsUpdate(params: any): void
}

const HeaderFilter = (props: HeaderFilterProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const { filterParamsAll, onChangeParamsUpdate } = props
  const [time, setTime] = useState([])
  const [spanMaps, setSpanMaps] = useState<any>()

  const [isVisibleFormat, setIsVisibleFormat] = useState(false)
  const [filterParams, setFilterParams] = useState(filterParamsAll)

  //   查看项目类型列表
  const typeList = [
    { name: t('recentlyViewed'), key: 1, count: 0 },
    { name: t('allProjects'), key: 2, count: 10 },
  ]
  //   状态类型列表
  const statusList = [
    { name: t('progress'), key: 1, count: 0 },
    { name: t('hasNotStarted'), key: 2, count: 10 },
    { name: t('paused'), key: 3, count: 10 },
    { name: t('completed'), key: 4, count: 10 },
  ]
  //   多选状态列表
  const checkTypeList = [
    { label: t('iteration'), value: 1 },
    { label: t('sprint2'), value: 2 },
    { label: t('iParticipated'), value: 3 },
  ]

  // 切换显示类型
  const onClickMenuFormat = (type: boolean) => {
    getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    setFilterParams({
      ...filterParams,
      isGrid: type,
      pageObj: {
        page: 1,
        size: filterParams?.pageObj.size,
      },
    })
    setIsVisibleFormat(false)
  }

  const menuFormat = (
    <Menu
      items={[
        {
          key: 'list',
          label: (
            <HasIconMenu
              onClick={() => onClickMenuFormat(false)}
              isCheck={!filterParams?.isGrid}
            >
              <span className="label">{t('common.list')}</span>
              <IconFont
                className="checked"
                type={filterParams?.isGrid ? '' : 'check'}
              />
            </HasIconMenu>
          ),
        },
        {
          key: 'thumbnail',
          label: (
            <HasIconMenu
              onClick={() => onClickMenuFormat(true)}
              isCheck={filterParams?.isGrid}
            >
              <span className="label">{t('common.thumbnail')}</span>
              <IconFont
                className="checked"
                type={filterParams?.isGrid ? 'check' : ''}
              />
            </HasIconMenu>
          ),
        },
      ]}
    />
  )

  //   修改参数值
  const onChangeParams = (key: string, value: any) => {
    let resultParams: any = {}
    if (key === 'time') {
      resultParams = {
        ...filterParams,
        ...{
          [key]: value
            ? [
                moment(value[0]).unix()
                  ? moment(value[0]).format('YYYY-MM-DD')
                  : '1970-01-01',
                moment(value[1]).unix() === 1893427200
                  ? '2030-01-01'
                  : moment(value[1]).format('YYYY-MM-DD'),
              ]
            : [],
        },
      }
      setTime(value)
    } else {
      resultParams = { ...filterParams, ...{ [key]: value } }
    }
    console.log(resultParams)
    setFilterParams(resultParams)
  }

  //   重置
  const onReset = () => {
    setFilterParams({
      type: 1,
      status: 1,
      keyword: '',
      time: [],
      otherType: [1, 2, 3],
      pageObj: {
        page: 1,
        size: 30,
      },
    })
  }

  // 点击创建项目
  const onCreateProject = () => {
    dispatch({ type: 'createProject/changeCreateVisible', payload: true })
  }

  useLayoutEffect(() => {
    const mapSpan: any = new Map()
    const boxSpan = document.querySelectorAll('.time-spanTag')
    boxSpan.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      mapSpan.set(attr, w)
    })
    setSpanMaps(mapSpan)
  }, [])

  useEffect(() => {
    onChangeParamsUpdate(filterParams)
  }, [filterParams])

  return (
    <HeaderFilterWrap>
      <HeaderTop>
        <StatusGroup>
          {typeList?.map((i: any) => (
            <StatusItems key={i.key} isActive={i.key === filterParams.type}>
              {i.name}
            </StatusItems>
          ))}
          {statusList?.map((i: any) => (
            <StatusItems key={i.key} isActive={i.key === filterParams.status}>
              {i.name}
            </StatusItems>
          ))}
        </StatusGroup>
        {(
          userInfo.company_permissions?.map((i: any) => i.identity) || []
        ).includes('b/project/save') && (
          <CommonButton type="primary" icon="plus" onClick={onCreateProject}>
            {t('createProject')}
          </CommonButton>
        )}
      </HeaderTop>
      <HeaderBottom>
        <FilterLeftWrap>
          <InputSearch
            width={184}
            bgColor="var(--neutral-white-d4)"
            length={12}
            placeholder={t('other.pleaseNameOrKey')}
            onChangeSearch={(value: string) => onChangeParams('keyword', value)}
            leftIcon
          />
          <SelectWrapBedeck>
            <span
              style={{ marginLeft: '12px', fontSize: '14px' }}
              className="time-spanTag"
              datatype="time"
            >
              {t('projectCycle')}
            </span>
            <RangePicker
              width="230px"
              w={spanMaps?.get('time')}
              isShowQuick
              dateValue={time}
              onChange={(values: any) => onChangeParams('time', values)}
            />
          </SelectWrapBedeck>
          <Checkbox.Group
            options={checkTypeList}
            value={filterParams.otherType}
            onChange={(values: any) => onChangeParams('otherType', values)}
          />
          <ResetWrap onClick={onReset}>{t('reset')}</ResetWrap>
        </FilterLeftWrap>
        <FilterRightWrap>
          <DropDownMenu
            isVisible={isVisibleFormat}
            onChangeVisible={setIsVisibleFormat}
            menu={menuFormat}
            icon={filterParams?.isGrid ? 'app-store' : 'unorderedlist'}
          >
            <div>
              {filterParams?.isGrid ? t('common.thumbnail') : t('common.list')}
            </div>
          </DropDownMenu>
          <DividerWrap type="vertical" />
          <ScreenMinHover
            onClick={() => props?.onChangeParamsUpdate(filterParams)}
            icon="sync"
            label={t('common.refresh')}
          />
        </FilterRightWrap>
      </HeaderBottom>
    </HeaderFilterWrap>
  )
}

export default HeaderFilter

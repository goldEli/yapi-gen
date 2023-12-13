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
  statistics: any
  onChangeParamsUpdate(params: any): void
}

const HeaderFilter = (props: HeaderFilterProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const { filterParamsAll, onChangeParamsUpdate } = props
  const [spanMaps, setSpanMaps] = useState<any>()

  const [isVisibleFormat, setIsVisibleFormat] = useState(false)
  const [filterParams, setFilterParams] = useState(filterParamsAll)

  //   状态类型列表
  const statusList = [
    { name: t('recentlyViewed'), key: 5, field: '' },
    { name: t('allProjects'), key: 0, field: 'all' },
    { name: t('progress'), key: 1, field: 'open' },
    { name: t('hasNotStarted'), key: 4, field: 'un_open' },
    { name: t('paused'), key: 3, field: 'suspend' },
    { name: t('completed'), key: 2, field: 'end' },
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
    if (key === 'keyword' && value === filterParams?.keyword) {
      return
    }
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
    } else {
      resultParams = { ...filterParams, ...{ [key]: value } }
    }
    setFilterParams(resultParams)
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
          {statusList?.map((i: any) => (
            <StatusItems
              key={i.key}
              isActive={i.key === filterParams.status}
              onClick={() => onChangeParams('status', i.key)}
            >
              {i.name}
              {props?.statistics?.[i.field]
                ? `（${props?.statistics?.[i.field]}）`
                : ''}
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
            defaultValue={filterParams.keyword}
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
              dateValue={
                filterParams?.time?.length > 0
                  ? [
                      moment(filterParams?.time[0]),
                      moment(filterParams?.time[1]),
                    ]
                  : null
              }
              onChange={(values: any) => onChangeParams('time', values)}
            />
          </SelectWrapBedeck>
          <Checkbox.Group
            options={checkTypeList}
            value={filterParams.otherType}
            onChange={(values: any) => onChangeParams('otherType', values)}
          />
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
        </FilterRightWrap>
      </HeaderBottom>
    </HeaderFilterWrap>
  )
}

export default HeaderFilter

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
  RightCreateWrap,
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
import SwitchMode from '@/components/SwitchMode'

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
  const [filterParams, setFilterParams] = useState(filterParamsAll)

  //   状态类型列表
  const statusList = [
    // { name: t('recentlyViewed'), key: 5, field: '' },
    // { name: t('allProjects'), key: 0, field: 'all' },
    { name: t('progress'), key: 1, field: 'open' },
    { name: t('hasNotStarted'), key: 4, field: 'un_open' },
    { name: t('paused'), key: 3, field: 'suspend' },
    { name: t('completed'), key: 2, field: 'end' },
  ]

  // 切换显示类型
  const onClickMenuFormat = (type: number) => {
    getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    setFilterParams({
      ...filterParams,
      isGrid: type,
      pageObj: {
        page: 1,
        size: filterParams?.pageObj.size,
      },
    })
  }

  // 模式数组
  const menuFormat = [
    {
      key: 'unorderedlist',
      label: t('common.list'),
      id: 0,
    },
    {
      key: 'provider',
    },
    {
      key: 'app-store',
      label: t('common.thumbnail'),
      id: 1,
    },
  ]

  const menuFormat1 = (
    <Menu
      items={[
        {
          key: 'list',
          label: (
            <HasIconMenu
              onClick={() => onClickMenuFormat(0)}
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
              onClick={() => onClickMenuFormat(1)}
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
    const resultParams: any = { ...filterParams, ...{ [key]: value } }

    setFilterParams(resultParams)
  }

  // 点击创建项目
  const onCreateProject = () => {
    dispatch({ type: 'createProject/changeCreateVisible', payload: true })
  }

  useEffect(() => {
    onChangeParamsUpdate(filterParams)
  }, [filterParams])

  return (
    <HeaderFilterWrap>
      <HeaderBottom>
        <FilterLeftWrap>
          <InputSearch
            width={184}
            bgColor="var(--neutral-white-d4)"
            length={12}
            placeholder={t('searchProjectName')}
            onChangeSearch={(value: string) => onChangeParams('keyword', value)}
            leftIcon
            defaultValue={filterParams.keyword}
          />
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
          </HeaderTop>
        </FilterLeftWrap>
        <RightCreateWrap>
          <SwitchMode
            menuList={menuFormat}
            isActiveId={filterParams?.isGrid}
            onClickMenuFormat={onClickMenuFormat}
          />
          {(
            userInfo.company_permissions?.map((i: any) => i.identity) || []
          ).includes('b/project/save') && (
            <CommonButton
              style={{ marginLeft: 16 }}
              type="primary"
              icon="plus"
              onClick={onCreateProject}
            >
              {t('createProject')}
            </CommonButton>
          )}
        </RightCreateWrap>
      </HeaderBottom>
    </HeaderFilterWrap>
  )
}

export default HeaderFilter

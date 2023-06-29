import { Checkbox, Divider, Menu, message, Select, Space } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DropDownMenu from '../DropDownMenu'
import IconFont from '../IconFont'
import {
  DividerWrap,
  HasIconMenu,
  HoverWrap,
  SelectWrap,
  SelectWrapBedeck,
} from '../StyleCommon'
import { MainTitle, WrapRight } from './style'
import ScreenMinHover from '../ScreenMinHover'
import { getMessage } from '../Message'

interface Props {
  sort: string
  isGrid: boolean
  activeType: number
  onChangeSort(val: string): void
  onChangeFormat(val: boolean): void
  onChangeHidden(val: boolean): void
  onChangeSearch?(val: string): void
  onRefresh?(): void
  onChangeProjectType?(value: any): void
}

const CreateActionBar = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)

  // 切换显示类型
  const onClickMenu = (value: any) => {
    props.onChangeSort?.(value)
    setIsVisible(false)
  }

  // 切换显示类型
  const onClickMenuFormat = (type: boolean) => {
    getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    props.onChangeFormat(type)
    setIsVisibleFormat(false)
  }
  const confirm = (value: any) => {
    props.onChangeProjectType?.(value)
  }
  const menu = (
    <Menu
      items={[
        {
          key: 'name',
          label: (
            <HasIconMenu
              onClick={() => onClickMenu('name')}
              isCheck={props.sort === 'name'}
            >
              <span className="label">{t('common.projectName')}</span>
              {props.sort === 'name' && (
                <IconFont className="checked" type="check" />
              )}
            </HasIconMenu>
          ),
        },
        {
          key: 'created_at',
          label: (
            <HasIconMenu
              onClick={() => onClickMenu('created_at')}
              isCheck={props.sort === 'created_at'}
            >
              <span className="label">{t('common.createTime')}</span>
              {props.sort === 'created_at' && (
                <IconFont className="checked" type="check" />
              )}
            </HasIconMenu>
          ),
        },
      ]}
    />
  )

  const menuFormat = (
    <Menu
      items={[
        {
          key: 'list',
          label: (
            <HasIconMenu
              onClick={() => onClickMenuFormat(false)}
              isCheck={!props.isGrid}
            >
              <span className="label">{t('common.list')}</span>
              <IconFont
                className="checked"
                type={props.isGrid ? '' : 'check'}
              />
            </HasIconMenu>
          ),
        },
        {
          key: 'thumbnail',
          label: (
            <HasIconMenu
              onClick={() => onClickMenuFormat(true)}
              isCheck={props.isGrid}
            >
              <span className="label">{t('common.thumbnail')}</span>
              <IconFont
                className="checked"
                type={props.isGrid ? 'check' : ''}
              />
            </HasIconMenu>
          ),
        },
      ]}
    />
  )

  return (
    <WrapRight>
      <Space size={8}>
        <SelectWrapBedeck style={{ marginRight: '4px' }}>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>项目类型</span>

          <SelectWrap
            mode="multiple"
            onChange={confirm}
            style={{ width: '100%' }}
            placeholder={t('common.all')}
            showSearch
            optionFilterProp="label"
            showArrow
            allowClear
            options={[
              {
                label: '冲刺-企业项目 ',
                value: 1,
              },
              {
                label: ' 冲刺-团队项目 ',
                value: 2,
              },
              {
                label: '迭代-企业项目',
                value: 3,
              },
              {
                label: '迭代-团队项目',
                value: 4,
              },
            ]}
          />
        </SelectWrapBedeck>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox onChange={e => props.onChangeHidden(e.target.checked)} />
          <MainTitle style={{ marginLeft: 8 }}>
            {t('project.hiddenProject')}
          </MainTitle>
        </div>
        <Divider style={{ height: 16, margin: '0 0 0 8px' }} type="vertical" />
        {props.isGrid ? (
          <div
            hidden={!props.isGrid}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <DropDownMenu
              menu={menu}
              icon="sort"
              isVisible={isVisible}
              onChangeVisible={setIsVisible}
            >
              <div>
                {props.sort === 'name'
                  ? t('common.projectName')
                  : t('common.createTime')}
              </div>
            </DropDownMenu>
          </div>
        ) : null}

        {props.isGrid ? (
          <Divider style={{ height: 16, margin: 0 }} type="vertical" />
        ) : null}

        <DropDownMenu
          isVisible={isVisibleFormat}
          onChangeVisible={setIsVisibleFormat}
          menu={menuFormat}
          icon={props.isGrid ? 'app-store' : 'unorderedlist'}
        >
          <div>{props.isGrid ? t('common.thumbnail') : t('common.list')}</div>
        </DropDownMenu>

        <DividerWrap type="vertical" />

        <ScreenMinHover
          onClick={props.onRefresh}
          icon="sync"
          label={t('common.refresh')}
        />
      </Space>
    </WrapRight>
  )
}

export default CreateActionBar

// 项目筛选

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space, Checkbox, Divider, Menu, message } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import CommonInput from '@/components/CommonInput'
import DropDownMenu from '@/components/DropDownMenu'
import { HasIconMenu } from '@/components/StyleCommon'
import { useState } from 'react'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
})

const WrapRight = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '.ant-space-item': {
    display: 'flex',
    alignItems: 'center',
  },
})

const MainTitle = styled.div({
  fontSize: 14,
  color: '#646566',
  fontWeight: 400,
})
interface Props {
  sort: string
  isGrid: boolean
  activeType: number
  onChangeSort(val: string): void
  onChangeFormat(val: boolean): void
  onChangeHidden(val: boolean): void
  onChangeSearch?(val: string): void
}

const Filter = (props: Props) => {
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
    message.success(t('version2.reviewModeChangeSuccess'))
    props.onChangeFormat(type)
    setIsVisibleFormat(false)
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
    <Wrap>
      <CommonInput
        placeholder={t('mark.searchP')}
        onChangeSearch={props.onChangeSearch}
      />
      <WrapRight>
        <Space size={8}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox onChange={e => props.onChangeHidden(e.target.checked)} />
            <MainTitle style={{ marginLeft: 8 }}>
              {t('project.hiddenProject')}
            </MainTitle>
          </div>
          <Divider
            style={{ height: 16, margin: '0 0 0 8px' }}
            type="vertical"
          />
          {props.isGrid && (
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
          )}
          {props.isGrid && (
            <Divider style={{ height: 16, margin: 0 }} type="vertical" />
          )}
          <DropDownMenu
            isVisible={isVisibleFormat}
            onChangeVisible={setIsVisibleFormat}
            menu={menuFormat}
            icon={props.isGrid ? 'app-store' : 'unorderedlist'}
          >
            <div>{props.isGrid ? t('common.thumbnail') : t('common.list')}</div>
          </DropDownMenu>
        </Space>
      </WrapRight>
    </Wrap>
  )
}

export default Filter

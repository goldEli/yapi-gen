// 项目筛选

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space, Checkbox, Divider, Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import CommonInput from '@/components/CommonInput'
import { HoverWrap } from '@/components/StyleCommon'

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
  color: '#969799',
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
  const menu = (
    <Menu
      items={[
        {
          key: 'name',
          label: (
            <div onClick={() => props.onChangeSort('name')}>
              {t('common.projectName')}
            </div>
          ),
        },
        {
          key: 'created_at',
          label: (
            <div onClick={() => props.onChangeSort('created_at')}>
              {t('common.createTime')}
            </div>
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
            <div onClick={() => props.onChangeFormat(false)}>
              {t('common.list')}
            </div>
          ),
        },
        {
          key: 'thumbnail',
          label: (
            <div onClick={() => props.onChangeFormat(true)}>
              {t('common.thumbnail')}
            </div>
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
          <div
            hidden={!props.isGrid}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Dropdown overlay={menu} getPopupContainer={node => node}>
              <HoverWrap>
                <IconFont type="sort" />
                <div>
                  {props.sort === 'name'
                    ? t('common.projectName')
                    : t('common.createTime')}
                </div>
              </HoverWrap>
            </Dropdown>
          </div>
          <Divider style={{ height: 16, margin: 0 }} type="vertical" />
          <Dropdown overlay={menuFormat} getPopupContainer={node => node}>
            <HoverWrap style={{ color: '#2877ff' }}>
              <IconFont type={props.isGrid ? 'app-store' : 'unorderedlist'} />
              <div>
                {props.isGrid ? t('common.thumbnail') : t('common.list')}
              </div>
            </HoverWrap>
          </Dropdown>
        </Space>
      </WrapRight>
    </Wrap>
  )
}

export default Filter

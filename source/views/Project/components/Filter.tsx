/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space, Checkbox, Divider, Dropdown, Menu, Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 52,
  background: 'white',
  padding: '0 24px',
})

const WrapLeft = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const IconfontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    color: '#969799',
    fontSize: 20,
    cursor: 'pointer',
    '&: hover': {
      color: '#2877FF',
    },
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const WrapRight = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '.ant-space-item': {
    display: 'flex',
    alignItems: 'center',
  },
})

const TitleBox = styled.div<{ idx: boolean }>(
  {
    height: 50,
    lineHeight: '50px',
    color: '#323233',
    fontWeight: 400,
    fontSize: 14,
    cursor: 'pointer',
  },
  ({ idx }) => ({
    borderBottom: idx ? '2px solid #2877FF' : '2px solid white',
    color: idx ? '#2877FF' : '#323233',
  }),
)

const MainTitle = styled.div({
  fontSize: 14,
  color: '#323233',
  fontWeight: 400,
})

const TotalText = styled.div({
  fontSize: 12,
  color: '#969799',
  fontWeight: 400,
})

interface Props {
  total: number
  sort: string
  isGrid: boolean
  activeType: number
  onChangeSort(val: string): void
  onChangeFormat(val: boolean): void
  onChangeHidden(val: boolean): void
  onChangeType(val: number): void
  show: boolean
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
  return (
    <Wrap>
      {props.show ? (
        <WrapLeft size={48}>
          <TitleBox
            onClick={() => props.onChangeType(0)}
            idx={!props.activeType}
          >
            {t('project.mineJoin')}
          </TitleBox>
          <TitleBox
            onClick={() => props.onChangeType(1)}
            idx={props.activeType === 1}
          >
            {t('project.companyAll')}
          </TitleBox>
        </WrapLeft>
      ) : null}

      <WrapRight>
        <Space size={12}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox onChange={e => props.onChangeHidden(e.target.checked)} />
            <MainTitle style={{ marginLeft: 8 }}>
              {t('project.hiddenProject')}
            </MainTitle>
          </div>
          <div
            hidden={!props.isGrid}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <MainTitle style={{ marginRight: 12 }}>
              {props.sort === 'name'
                ? t('common.projectName')
                : t('common.createTime')}
            </MainTitle>
            <Dropdown overlay={menu} getPopupContainer={node => node}>
              <IconfontWrap type="sort" />
            </Dropdown>
          </div>
        </Space>
        <Divider style={{ height: 20 }} type="vertical" />
        <TotalText>{t('project.allProject', { count: props.total })}</TotalText>
        <Divider style={{ height: 20 }} type="vertical" />
        <Space size={12}>
          <Tooltip title={t('common.thumbnail')}>
            <IconfontWrap
              onClick={() => props.onChangeFormat(true)}
              active={props.isGrid}
              type="app-store"
            />
          </Tooltip>
          <Tooltip title={t('common.list')}>
            <IconfontWrap
              onClick={() => props.onChangeFormat(false)}
              active={!props.isGrid}
              type="unorderedlist"
            />
          </Tooltip>
        </Space>
      </WrapRight>
    </Wrap>
  )
}

export default Filter

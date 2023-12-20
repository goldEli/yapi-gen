// 需求筛选处-设置的下拉菜单

import { updateCompanyUserPreferenceConfig } from '@/services/user'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setUserPreferenceConfig } from '@store/user'
import { Menu, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '../CommonIconFont'
import IconFont from '../IconFont'
import { getMessage } from '../Message'
import {
  onTapInputKey,
  onTapSearchChoose,
  onTapSort,
  onTapTitles,
} from '@store/view'

const ChangeItem = styled.div<{ isActive?: boolean; height?: number }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: SiYuanRegular;
  cursor: pointer;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  &:hover {
    color: var(--neutral-n1-d1);
  }
`

const CustomLabel = styled.span`
  color: var(--neutral-n2) !important;
  &:hover {
    color: var(--neutral-n1-d1) !important;
  }
`
interface Props {
  // 是否有预览模式
  notView?: boolean
  onChangeFieldVisible(): void
  isGrid?: 1 | 2
  onChangeView?(type?: number): void
  onImportChange?(): void
  onExportChange?(): void
  onRefresh?(): void
}

const SetShowField = (props: Props) => {
  const [t] = useTranslation()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const [active, setActive] = useState()
  const { viewList } = useSelector(state => state.view)
  const onChangeViewMode = async (type: number) => {
    await updateCompanyUserPreferenceConfig({
      previewModel: type,
      id: userPreferenceConfig?.id,
    })
    getMessage({
      msg: t('switch_preview_mode_successfully') as string,
      type: 'success',
    })
    dispatch(
      setUserPreferenceConfig({
        ...userPreferenceConfig,
        ...{ previewModel: type },
      }),
    )
  }
  const filterByViewList = (data: any) => {
    const value = viewList[viewList.findIndex((i: any) => i.id === data.id)]
    // setNowKey(e.key)
    dispatch(onTapTitles(value.config.fields))
    dispatch(onTapSearchChoose(value.config.search))
    dispatch(onTapSort(value.config.sort))
    if (value.config.search.keyword) {
      dispatch(onTapInputKey(value.config.search.keyword))
    }
    console.log('filterByViewList', data)
  }
  const moreOperaeMaps = new Map([
    [
      '/ProjectDetail/Affair',
      {
        importText: t('importTransactions'),
        exportText: t('exportTransactions'),
      },
    ],
    [
      '/ProjectDetail/Demand',
      {
        importText: t('importRequirements'),
        exportText: t('exportRequirements'),
      },
    ],
    [
      '/ProjectDetail/Defect',
      { importText: t('importDefects'), exportText: t('exportDefects') },
    ],
  ])
  let menuItems = [
    {
      key: 'refresh',
      label: <div onClick={props.onRefresh}>{t('refresh')}</div>,
    },
    {
      key: 'import',
      label: (
        <div onClick={props.onImportChange}>
          {moreOperaeMaps.get(location.pathname)?.importText}
        </div>
      ),
    },
    {
      key: 'export',
      label: (
        <div onClick={props.onExportChange}>
          {moreOperaeMaps.get(location.pathname)?.exportText}
        </div>
      ),
    },
    {
      key: '0',
      label: (
        <div onClick={props.onChangeFieldVisible}>{t('common.setField')}</div>
      ),
    },
    // {
    //   key: '1-1',
    //   label: <CustomLabel>{t('howToOpenTheDetailsPage')}111</CustomLabel>,
    //   // children: [
    //   //   {
    //   //     key: '3',
    //   //     label: (
    //   //       <ChangeItem
    //   //         height={22}
    //   //         onClick={() => onChangeViewMode(3)}
    //   //         isActive={
    //   //           active === '3' || userPreferenceConfig.previewModel === 3
    //   //         }
    //   //       >
    //   //         <span style={{ paddingRight: 10 }}>{t('popup_preview')}</span>
    //   //         {(active === '3' || userPreferenceConfig.previewModel === 3) && (
    //   //           <CommonIconFont type="check" color={'var(--primary-d2)'} />
    //   //         )}
    //   //       </ChangeItem>
    //   //     ),
    //   //   },
    //   //   {
    //   //     key: '2',
    //   //     label: (
    //   //       <ChangeItem
    //   //         height={22}
    //   //         onClick={() => onChangeViewMode(2)}
    //   //         isActive={
    //   //           active === '2' || userPreferenceConfig.previewModel === 2
    //   //         }
    //   //       >
    //   //         <span style={{ paddingRight: 10 }}>{t('fullScreenPreview')}</span>
    //   //         {(active === '2' || userPreferenceConfig.previewModel === 2) && (
    //   //           <CommonIconFont type="check" color={'var(--primary-d2)'} />
    //   //         )}
    //   //       </ChangeItem>
    //   //     ),
    //   //   },

    //   //   {
    //   //     key: '1',
    //   //     label: (
    //   //       <ChangeItem
    //   //         height={22}
    //   //         onClick={() => onChangeViewMode(1)}
    //   //         isActive={
    //   //           active === '1' || userPreferenceConfig.previewModel === 1
    //   //         }
    //   //       >
    //   //         <span style={{ paddingRight: 10 }}>{t('slideOutSide')}</span>
    //   //         {(active === '1' || userPreferenceConfig.previewModel === 1) && (
    //   //           <CommonIconFont type="check" color={'var(--primary-d2)'} />
    //   //         )}
    //   //       </ChangeItem>
    //   //     ),
    //   //   },
    //   // ],
    // },
    {
      key: '1',
      label: (
        <ChangeItem
          height={22}
          onClick={() => onChangeViewMode(3)}
          isActive={active === '3' || userPreferenceConfig.previewModel === 3}
        >
          <span style={{ paddingRight: 10 }}>{t('popup_preview')}</span>
          {(active === '3' || userPreferenceConfig.previewModel === 3) && (
            <CommonIconFont type="check" color={'var(--primary-d2)'} />
          )}
        </ChangeItem>
      ),
    },
    {
      key: '2',
      label: (
        <ChangeItem
          height={22}
          onClick={() => onChangeViewMode(2)}
          isActive={active === '2' || userPreferenceConfig.previewModel === 2}
        >
          <span style={{ paddingRight: 10 }}>{t('fullScreenPreview')}</span>
          {(active === '2' || userPreferenceConfig.previewModel === 2) && (
            <CommonIconFont type="check" color={'var(--primary-d2)'} />
          )}
        </ChangeItem>
      ),
    },

    {
      key: '3',
      label: (
        <ChangeItem
          height={22}
          onClick={() => onChangeViewMode(1)}
          isActive={active === '1' || userPreferenceConfig.previewModel === 1}
        >
          <span style={{ paddingRight: 10 }}>{t('slideOutSide')}</span>
          {(active === '1' || userPreferenceConfig.previewModel === 1) && (
            <CommonIconFont type="check" color={'var(--primary-d2)'} />
          )}
        </ChangeItem>
      ),
    },
    {
      // key: '4',
      key: 'viewManage',
      label: <div>视图管理</div>,
      children: [
        {
          key: '1',
          type: 'group',
          label: t('personalView'),
          children: viewList
            ?.filter((i: any) => {
              return i.type !== 2
            })
            .filter((i: any) => {
              return i.status !== 2
            })
            .map((item: any) => {
              return {
                key: item.id,
                label: (
                  <span onClick={() => filterByViewList(item)}>
                    {item.name}
                  </span>
                ),
              }
            }),
        },
        // {
        //   key: '2',
        //   type: 'group',
        //   label: t('setting.system'),
        //   children: viewList
        //     ?.filter((i: any) => {
        //       return i.type === 2
        //     })
        //     .map((item: any) => {
        //       return {
        //         key: item.id,
        //         label: (
        //           <span onClick={() => filterByViewList(item)}>
        //             {item.name}
        //           </span>
        //         ),
        //       }
        //     }),
        // },
        {
          key: '5',
          label: (
            <div
              onClick={() => {
                props.onChangeView && props.onChangeView(1)
              }}
            >
              创建视图
            </div>
          ),
        },
        {
          key: '6',
          label: (
            <div
              onClick={() => {
                props.onChangeView && props.onChangeView(2)
              }}
            >
              管理视图
            </div>
          ),
        },
      ],
    },
  ]

  if (props.notView) {
    menuItems = menuItems.filter((i: any) => i.key === '0')
  }

  if (props.isGrid === 1) {
    menuItems = menuItems.filter((i: any) => i.key !== '0')
  }
  if (!moreOperaeMaps.get(location.pathname)) {
    const keys = ['import', 'export', 'refresh', 'viewManage']
    menuItems = menuItems.filter((i: any) => !keys.includes(i.key))
  }
  const onClick = (e: any) => {
    setActive(e.key)
  }
  return (
    <Menu
      getPopupContainer={node => node}
      selectedKeys={[String(userPreferenceConfig?.previewModel)]}
      onClick={(e: any) => onClick(e)}
      items={menuItems}
      expandIcon={
        <IconFont
          style={{
            marginTop: '5px',
            fontSize: '16px!important',
            color: 'var(--neutral-n3)',
          }}
          type="right"
        />
      }
    />
  )
}

export default SetShowField

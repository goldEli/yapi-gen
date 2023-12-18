/* eslint-disable react/no-unstable-nested-components */
import { useDispatch, useSelector } from '@store/index'
import {
  changeCreateVisible,
  changeViewVisible,
  onTapInputKey,
  onTapSearchChoose,
  onTapSort,
  onTapTitles,
  setCreateViewPort,
} from '@store/view'
import { getViewList } from '@store/view/thunk'
import { Divider, Dropdown } from 'antd'
import { t } from 'i18next'
import {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import CommonIconFont from '../CommonIconFont'
import { dropdowncontent, Name, SetLine, TextSpan, ViewPortWrap } from './style'

const ViewPort = (props: any, ref: any) => {
  const [show, setShow] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const { viewList } = useSelector(state => state.view)
  const [nowKey, setNowKey] = useState('')
  const items: any = [
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
            label: <TextSpan>{item.name}</TextSpan>,
          }
        }),
    },
    {
      key: '2',
      type: 'group',
      label: t('setting.system'),
      children: viewList
        ?.filter((i: any) => {
          return i.type === 2
        })
        .map((item: any) => {
          return {
            key: item.id,
            label: <TextSpan>{item.name}</TextSpan>,
          }
        }),
    },
  ]

  const onClick = (e: any) => {
    setIsVisible(false)
    setShow(false)
    const value =
      viewList[viewList.findIndex((i: any) => String(i.id) === e.key)]
    setNowKey(e.key)
    dispatch(onTapTitles(value.config.fields))
    dispatch(onTapSearchChoose(value.config.search))
    dispatch(onTapSort(value.config.sort))
    if (value.config.search.keyword) {
      dispatch(onTapInputKey(value.config.search.keyword))
    }
  }
  useEffect(() => {
    dispatch(getViewList({ projectId: props.pid, type: props.type }))
  }, [])

  const name = useMemo(() => {
    const value = viewList?.find((i: any) => String(i.id) === nowKey)
    if (value) {
      return value.name
    }
    return t('whole')
  }, [viewList, nowKey])

  // 点击打开下拉弹窗
  const onOpenChange = (open: boolean) => {
    setShow(open)
    setIsVisible(open)
  }

  // 创建视图
  const onChangeCreate = () => {
    onOpenChange(false)
    dispatch(changeCreateVisible(true))
    dispatch(setCreateViewPort({ type: props.type }))
  }
  // 视图管理
  const onChangeView = () => {
    onOpenChange(false)
    dispatch(changeViewVisible(true))
    dispatch(setCreateViewPort({ type: props.type }))
  }
  useImperativeHandle(ref, () => {
    return {
      onChangeCreate,
      onChangeView,
    }
  })
  return (
    <Dropdown
      open={isVisible}
      onOpenChange={onOpenChange}
      trigger={['click']}
      menu={{ items, onClick }}
      getPopupContainer={(node: any) => node.parentNode}
      dropdownRender={menu => (
        <div className={dropdowncontent}>
          {menu}
          <div
            style={{
              margin: '0 10px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              width: '105px',
            }}
          />
          <SetLine onClick={onChangeCreate}>
            <TextSpan>{t('creating_a_view') as string}</TextSpan>
          </SetLine>
          <SetLine onClick={onChangeView}>
            <TextSpan>{t('view_of_administration') as string}</TextSpan>
          </SetLine>
        </div>
      )}
    >
      <ViewPortWrap show={false}>
        {/* <CommonIconFont size={18} type="view-n" />
        <Name>
          {t('view')}：{name}{' '}
        </Name> */}
      </ViewPortWrap>
    </Dropdown>
  )
}

export default forwardRef(ViewPort)

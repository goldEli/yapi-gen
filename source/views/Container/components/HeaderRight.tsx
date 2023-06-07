/* eslint-disable no-negated-condition */
/* eslint-disable react/jsx-no-leaked-render */
import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { CloseWrap } from '@/components/StyleCommon'
import { getTicket, loginOut } from '@/services/user'
import { useDispatch, useSelector } from '@store/index'
import { changeLanguage, type LocaleKeys } from '@/locals'
import { message, Popover, Space, Tooltip } from 'antd'
import { useMemo, useState } from 'react'
import {
  ChangeItem,
  ChangeItems,
  CreateWrap,
  CreateIcon,
  Provider,
  imgCss,
  Line,
  MenuItem,
  MenuItems,
  MenuLeft,
  MenuRight,
  NameWrap,
  PersonalHead,
  PhoneWrap,
  UserInfoBox,
  UserInfoTop,
  UserInfoWrap,
  Line2,
  LineBox,
} from './../style'
import { getLoginDetail } from '@store/user/user.thunk'
import helpPdf from '/Agile.pdf'
import { t } from 'i18next'
import SiteNotifications from '@/views/SiteNotifications/SiteNotifications'
import {
  setCalendarModal,
  setScheduleModal,
  setSubscribeModal,
} from '@store/calendar'
import { setIsAddOrDelete } from '@store/schedule'
import { setIsRefresh } from '@store/user'
import { setWriteReportModal } from '@store/workReport'
import { getMessage } from '@/components/Message'
import { setAddWorkItemModal } from '@store/project'
import SystemFeedback from '@/components/SystemFeedback/SystemFeedback'
import { changeFreedVisibleVisible } from '@store/feedback'

const ChangeComponent = (props: { item: any; onClose(): void }) => {
  const { language, theme } = useSelector(store => store.global)
  const { isRefresh } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const [isChangeVisible, setIsChangeVisible] = useState(false)

  const languageList = [
    { name: '简体中文', key: 'zh' },
    { name: 'English', key: 'en' },
  ]

  // const themeList = [
  //   { name: '亮色主题', key: 'light', type: 0 },
  //   { name: '暗色主题', key: 'black', type: 1 },
  // ]

  const onClose = () => {
    props.onClose()
    setIsChangeVisible(false)
  }

  // 可切换的内容
  const changeContent = (key: number) => {
    // 切换语言
    const onChangeLanguage = async (type: string) => {
      if (type === language) return
      onClose()
      await changeLanguage(type as LocaleKeys)
      getMessage({ msg: t('common.localsSwitching'), type: 'success' })
      dispatch({
        type: 'global/setLanguage',
        payload: type,
      })
      dispatch(getLoginDetail())
      dispatch(setIsRefresh(!isRefresh))
    }

    // // 切换主题
    // const onChangeTheme = (type: number) => {
    //   if (type === theme) return
    //   onClose()
    //   dispatch({
    //     type: 'global/setTheme',
    //     payload: type,
    //   })
    // }

    return (
      <>
        {key === 0 && (
          <ChangeItems>
            {languageList.map((i: any) => (
              <ChangeItem
                isActive={language === i.key}
                key={i.key}
                onClick={() => onChangeLanguage(i.key)}
              >
                {i.name}
                {language === i.key && <CommonIconFont type="check" />}
              </ChangeItem>
            ))}
          </ChangeItems>
        )}
        {/* {key !== 0 && (
          <ChangeItems>
            {themeList.map((i: any) => (
              <ChangeItem
                isActive={theme === i.type}
                key={i.key}
                onClick={() => onChangeTheme(i.type)}
              >
                {i.name}
                {theme === i.type && <CommonIconFont type="check" />}
              </ChangeItem>
            ))}
          </ChangeItems>
        )} */}
      </>
    )
  }

  return (
    <Popover
      content={changeContent(props.item.key)}
      placement="left"
      open={isChangeVisible}
      onOpenChange={setIsChangeVisible}
    >
      <MenuItem key={props.item.key}>
        <MenuLeft className="menuLeft">
          <CommonIconFont type={props.item.icon} />
          <span>{props.item.name}</span>
        </MenuLeft>
        {props.item.isRight && (
          <MenuRight>
            {!props.item.key && (
              <span>{language === 'zh' ? '简体中文' : 'English'}</span>
            )}
            <CommonIconFont type="right" />
          </MenuRight>
        )}
      </MenuItem>
    </Popover>
  )
}

const HeaderRight = () => {
  const dispatch = useDispatch()
  const { language } = useSelector(store => store.global)
  const { userInfo } = useSelector(store => store.user)
  const [isVisible, setIsVisible] = useState(false)
  const [isCreateVisible, setIsCreateVisible] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [isConfirmLogout, setIsConfirmLogout] = useState(false)

  const userList = [
    { name: t('language'), isRight: true, icon: 'earth', key: 0 },
    // { name: t('theme_switching'), isRight: true, icon: 'theme', key: 1 },
    { name: t('personal_data'), isRight: false, icon: 'user', key: 2 },
    { name: t('container.logout'), isRight: false, icon: 'login', key: 3 },
  ]

  const createList = [
    {
      name: '添加工作项',
      key: 'all',
      icon: 'demand',
      isPermission: true,
    },
    {
      name: t('common.createProject'),
      key: 'project',
      icon: 'folder-open-nor',
      isPermission: (
        userInfo.company_permissions?.map((i: any) => i.identity) || []
      ).includes('b/project/save'),
    },
  ]

  const createCalendarList = [
    {
      name: t('calendarManager.create_schedule'),
      key: 'schedule',
      icon: 'database',
      isPermission: true,
    },
    {
      name: t('calendarManager.create_calendar'),
      key: 'calendar',
      icon: 'calendar-days',
      isPermission: true,
    },

    {
      name: t('calendarManager.subscription_calendar'),
      key: 'subscribe',
      icon: 'carryout',
      isPermission: true,
    },
  ]

  const labelList = [
    {
      label: t('head_portrait'),
      key: 'avatar',
      value: userInfo.avatar,
    },
    {
      label: t('common.phone'),
      value: userInfo.account,
    },
    {
      label: t('common.email'),
      value: userInfo.email,
    },
    {
      label: t('common.nickname'),
      value: userInfo.nickname,
    },
    {
      label: t('common.name'),
      value: userInfo.name,
    },
    {
      label: t('common.sex'),
      value: userInfo.gender === 1 ? t('common.male') : t('common.female'),
    },
    {
      label: t('container.department'),
      value: userInfo.department_name,
    },
    {
      label: t('common.job'),
      value: userInfo?.position_name,
    },
    {
      label: t('team'),
      value: userInfo?.teams?.join(';'),
    },
    {
      label: t('permission_group'),
      value: userInfo.group_name,
    },
  ]

  // 点击下拉 key:2 个人资料，3：退出登录
  const onClickMenu = (key: number) => {
    if (key === 2) {
      setIsInfoVisible(true)
    } else {
      setIsConfirmLogout(true)
    }
    setIsVisible(false)
  }

  // 退出登录
  const toLoginOut = async () => {
    sessionStorage.removeItem('saveRouter')
    try {
      await loginOut()
      setTimeout(() => {
        localStorage.removeItem('agileToken')
        localStorage.removeItem('quickCreateData')
        getTicket()
      }, 100)
    } catch (error) {
      //
    }
  }

  // 创建需求
  const onCreate = (key: string) => {
    setIsCreateVisible(false)
    switch (key) {
      case 'project':
        dispatch({ type: 'createProject/changeCreateVisible', payload: true })
        return
      case 'all':
        dispatch(
          setAddWorkItemModal({
            visible: true,
            params: { overallCreate: true },
          }),
        )
        return
      case 'schedule':
        dispatch(setScheduleModal({ visible: true, params: { isAll: true } }))
        dispatch(setIsAddOrDelete(false))
        return
      case 'calendar':
        dispatch(setCalendarModal({ visible: true }))
        return
      case 'subscribe':
        dispatch(setSubscribeModal(true))
    }
  }

  const onHelp = () => {
    window.open(helpPdf)
  }

  const userContent = (
    <UserInfoWrap>
      <UserInfoTop>
        <div style={{ marginLeft: 10 }}>
          <CommonUserAvatar avatar={userInfo.avatar} size="large" />
        </div>

        <UserInfoBox>
          <NameWrap>{userInfo.name}</NameWrap>
          <PhoneWrap>{userInfo.phone}</PhoneWrap>
        </UserInfoBox>
      </UserInfoTop>
      <Provider />
      <MenuItems>
        {userList.map((i: any) => (
          <div key={i.icon}>
            {i.isRight && (
              <ChangeComponent item={i} onClose={() => setIsVisible(false)} />
            )}

            {!i.isRight && (
              <MenuItem key={i.key} onClick={() => onClickMenu(i.key)}>
                <MenuLeft className="menuLeft">
                  <CommonIconFont type={i.icon} />
                  <span>{i.name}</span>
                </MenuLeft>
                {i.isRight && (
                  <MenuRight>
                    {!i.key && (
                      <span>{language === 'zh' ? '简体中文' : 'English'}</span>
                    )}
                    <CommonIconFont type="right" />
                  </MenuRight>
                )}
              </MenuItem>
            )}
          </div>
        ))}
      </MenuItems>
    </UserInfoWrap>
  )

  const content = (list: any) => {
    return (
      <ChangeItems>
        {list.map((i: any) => (
          <ChangeItem
            key={i.key}
            height={40}
            onClick={() => onCreate(i.key)}
            hidden={!i.isPermission}
          >
            <Space size={8}>
              <CommonIconFont type={i.icon} color="var(--neutral-n3)" />
              {i.name}
            </Space>
          </ChangeItem>
        ))}
      </ChangeItems>
    )
  }
  const onFeedback = () => {
    dispatch(changeFreedVisibleVisible(true))
  }
  return (
    <>
      <SystemFeedback />
      {/* 退出登录 */}
      <DeleteConfirm
        title={t('confirmation_prompt') as string}
        text={t('are_you_sure_you_want_to_log_out') as string}
        isVisible={isConfirmLogout}
        onChangeVisible={() => setIsConfirmLogout(!isConfirmLogout)}
        onConfirm={toLoginOut}
      />
      {/* 个人资料 */}
      <CommonModal
        onClose={() => {
          setIsInfoVisible(false)
          setIsVisible(false)
        }}
        isVisible={isInfoVisible}
        title={t('personal_data') as string}
        isShowFooter
        width={420}
      >
        <div style={{ padding: '0 24px 32px' }}>
          <div>
            {labelList?.map((i: any) => (
              <LineBox key={i.label}>
                <Line key={i.label}>{i.label ? i.label : '-'}</Line>
                {i.key === 'avatar' && (
                  <PersonalHead>
                    <CommonUserAvatar size="large" avatar={userInfo.avatar} />
                  </PersonalHead>
                )}
                {i.key !== 'avatar' && (
                  <Tooltip title={i.value} placement="topRight">
                    <Line2 key={i.label}>{i.value || '--'}</Line2>
                  </Tooltip>
                )}
              </LineBox>
            ))}
          </div>
        </div>
      </CommonModal>

      <Space size={16}>
        {(String(location.pathname).includes('/ProjectManagement') ||
          String(location.pathname).includes('/SprintProjectManagement')) && (
          <Popover
            content={content(createList)}
            open={isCreateVisible}
            onOpenChange={setIsCreateVisible}
            placement="bottomRight"
          >
            <CreateWrap>
              <CommonIconFont type="plus" size={20} />
            </CreateWrap>
          </Popover>
        )}
        {String(location.pathname).includes('/CalendarManager') && (
          <Popover
            content={content(createCalendarList)}
            open={isCreateVisible}
            onOpenChange={setIsCreateVisible}
            placement="bottomRight"
          >
            <CreateIcon>
              <CommonIconFont type="plus" size={20} />
            </CreateIcon>
          </Popover>
        )}

        {String(location.pathname).includes('/Report') && (
          <CreateIcon
            onClick={() => dispatch(setWriteReportModal({ visible: true }))}
          >
            <CommonIconFont type="plus" size={20} />
          </CreateIcon>
        )}

        <Tooltip title={t('container.notice') as string}>
          <CloseWrap width={32} height={32}>
            <SiteNotifications />
          </CloseWrap>
        </Tooltip>
        <Tooltip title={t('container.help') as string}>
          <CloseWrap width={32} height={32} onClick={onHelp}>
            <CommonIconFont type="question" size={24} />
          </CloseWrap>
        </Tooltip>
        <Tooltip title="反馈">
          <CloseWrap width={32} height={32} onClick={onFeedback}>
            <CommonIconFont type="draft" size={24} />
          </CloseWrap>
        </Tooltip>

        <Popover
          content={userContent}
          open={isVisible}
          onOpenChange={setIsVisible}
          placement="bottomRight"
        >
          <div style={{ cursor: 'pointer' }}>
            <CommonUserAvatar avatar={userInfo.avatar} size="large" />
          </div>
        </Popover>
      </Space>
    </>
  )
}

export default HeaderRight

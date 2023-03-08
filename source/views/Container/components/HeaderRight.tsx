/* eslint-disable react/jsx-no-leaked-render */
import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { CloseWrap } from '@/components/StyleCommon'
import { getTicket, loginOut } from '@/services/user'
import { useDispatch, useSelector } from '@store/index'
import { changeLanguage, type LocaleKeys } from '@/locals'
import { message, Popover, Space } from 'antd'
import { useState } from 'react'
import {
  ChangeItem,
  ChangeItems,
  CreateWrap,
  Provider,
  imgCss,
  Line,
  MenuItem,
  MenuItems,
  MenuLeft,
  MenuRight,
  NameWrap,
  PersonalFooter,
  PersonalHead,
  PhoneWrap,
  UserAvatar,
  UserInfoBox,
  UserInfoTop,
  UserInfoWrap,
} from './../style'
import { useTranslation } from 'react-i18next'
import { setIsCreateIterationVisible } from '@store/iterate'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'

const ChangeComponent = (props: { item: any; onClose(): void }) => {
  const [t] = useTranslation()
  const { language, theme } = useSelector(store => store.global)
  const dispatch = useDispatch()
  const [isChangeVisible, setIsChangeVisible] = useState(false)

  const languageList = [
    { name: '简体中文', key: 'zh' },
    { name: 'English', key: 'en' },
  ]

  const themeList = [
    { name: '亮色主题', key: 'light', type: 0 },
    { name: '暗色主题', key: 'black', type: 1 },
  ]

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
      message.success(t('common.localsSwitching'))
      dispatch({
        type: 'global/setLanguage',
        payload: type,
      })
    }

    // 切换主题
    const onChangeTheme = (type: number) => {
      if (type === theme) return
      onClose()
      dispatch({
        type: 'global/setTheme',
        payload: type,
      })
    }

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
        {key !== 0 && (
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
        )}
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
    { name: '语言', isRight: true, icon: 'earth', key: 0 },
    { name: '主题切换', isRight: true, icon: 'theme', key: 1 },
    { name: '个人资料', isRight: false, icon: 'user', key: 2 },
    { name: '退出登录', isRight: false, icon: 'login', key: 3 },
  ]

  const createList = [
    { name: '创建需求', key: 'demand', icon: 'demand', isPermission: true },
    {
      name: '创建迭代',
      key: 'iteration',
      icon: 'interation',
      isPermission: true,
    },
    {
      name: '创建项目',
      key: 'project',
      icon: 'folder-open-nor',
      isPermission: (
        userInfo.company_permissions?.map((i: any) => i.identity) || []
      ).includes('b/project/save'),
    },
  ]

  const labelList = [
    {
      label: '手机号',
      value: userInfo.account,
    },
    {
      label: '登录邮箱',
      value: userInfo.email,
    },
    {
      label: '昵称',
      value: userInfo.nickname,
    },
    {
      label: '姓名',
      value: userInfo.name,
    },
    {
      label: 'sex',
      value: userInfo.gender === 1 ? '男' : '女',
    },
    {
      label: '所属部门',
      value: userInfo.department_name,
    },
    {
      label: '职位',
      value: userInfo.position_name,
    },
    {
      label: '所在团队',
      value: '啊啊婚纱和水果',
    },
    {
      label: '权限组',
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
      case 'iteration':
        dispatch(setIsCreateIterationVisible(true))
        return
      case 'demand':
        dispatch(setIsCreateDemandVisible(true))
        dispatch(setCreateDemandProps({ overallCreate: true }))
    }
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

  const content = (
    <ChangeItems>
      {createList.map((i: any) => (
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

  return (
    <>
      {/* 退出登录 */}
      <DeleteConfirm
        title="确认提示"
        text="确定要退出登录吗？"
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
        title="个人资料"
        isShowFooter
        width={420}
      >
        <div style={{ paddingBottom: 16 }}>
          <PersonalHead>
            {userInfo.avatar ? (
              <img className={imgCss} src={userInfo.avatar} />
            ) : (
              <UserAvatar />
            )}
          </PersonalHead>
          <PersonalFooter>
            <div>
              {labelList.map(item => (
                <Line key={item.label}>{item.label ? item.label : '-'}</Line>
              ))}
            </div>
            <div>
              {labelList.map(item => (
                <Line key={item.label}>{item.value ? item.value : '-'}</Line>
              ))}
            </div>
          </PersonalFooter>
        </div>
      </CommonModal>

      <Space size={16}>
        <Popover
          content={content}
          open={isCreateVisible}
          onOpenChange={setIsCreateVisible}
          placement="bottomRight"
        >
          <CreateWrap>
            <CommonIconFont type="plus" size={20} />
          </CreateWrap>
        </Popover>
        <CloseWrap width={32} height={32}>
          <CommonIconFont type="question" size={24} />
        </CloseWrap>
        <Popover
          content={userContent}
          open={isVisible}
          onOpenChange={setIsVisible}
          placement="bottomRight"
        >
          <div>
            <CommonUserAvatar avatar={userInfo.avatar} size="large" />
          </div>
        </Popover>
      </Space>
    </>
  )
}

export default HeaderRight

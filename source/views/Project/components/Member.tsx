// 项目右侧抽屉弹窗

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Input, message, Popover } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import AddMember from './AddMember'
import { useEffect, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import NoData from '@/components/NoData'
import { MoreWrap } from '../Detail/Demand/DemandMain/components/Operation'

interface Props {
  visible: boolean
  onChangeVisible(): void
  projectId: any
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    width: '100%',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
  '.ant-drawer-header': {
    borderBottom: 'none!important',
  },
  '.ant-drawer-header-title': {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const ButtonWrap = styled(Button)({
  width: '100%',
  height: 32,
  marginBottom: 16,
})

const ListWrap = styled.div`
  margin-top: 16;
  & .ant-popover-inner {
    position: relative !important;
    top: -3px !important;
  }
`

const ListItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 16px',
  '.avatarBox': {
    display: 'flex',
    alignItems: 'center',
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 8,
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      'span:first-child': {
        color: '#323233',
        fontSize: 14,
      },
      'span:last-child': {
        color: '#BBBDBF',
        fontSize: 12,
      },
    },
  },
  '.job': {
    color: 'black',
    fontSize: 12,
  },
  '&:nth-child(even)': {
    backgroundColor: '#f8f9fa',
  },
})
const MoreWrap2 = styled(MoreWrap)`
  background-color: transparent;
  &:hover {
    .job {
      color: #2877ff;
    }
    .job1 {
      transform: rotate(180deg);
    }
  }
`
const Item = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '116px',
  height: '32px',
  fontSize: '14px',
  paddingLeft: '16px',
  cursor: 'pointer',
  '&:hover': {
    color: '#2877FF',
  },
})
const NameWrap = styled.div({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: 8,
  textAlign: 'center',
  lineHeight: '32px',
  background: '#A4ACF5',
  color: 'white',
})

const HeaderWrap = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Member = (props: Props) => {
  const [t] = useTranslation()
  const { getProjectMember, isRefreshMember, setIsRefreshMember, projectInfo } =
    useModel('project')
  const { getRoleList } = useModel('staff')
  const { getProjectPermission, updateMember } = useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [memberList, setMemberList] = useState<any>([])
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const getList = async (val?: string) => {
    const result = await getProjectMember({
      projectId: props.projectId,
      all: true,
      searchValue: val,
    })
    setMemberList(result)
    setIsRefreshMember(false)
  }
  const init = async () => {
    const res = await getProjectPermission({ projectId: props.projectId })

    setRoleOptions(res.list)
  }

  useEffect(() => {
    init()
  }, [])
  const moreOperation = (values: any) => {
    // console.log(values)
    const arr = ['管理员', ' 编辑者', '参与者', '自定义权限组']
    const onChangeRule = async (i: any) => {
      const res = await updateMember({
        projectId: props.projectId,
        userGroupId: i,
        userIds: values.id,
      })
      if (res.code === 0) {
        message.success(res.message)
        getList()
      }
    }
    return (
      <div
        style={{ padding: '4px 0', display: 'flex', flexDirection: 'column' }}
      >
        {roleOptions.map((i: any) => (
          <Item onClick={() => onChangeRule(i.id)} key={i.id}>
            {i.label}
          </Item>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (props.visible) {
      getList()
    }
  }, [props.visible])

  useEffect(() => {
    if (isRefreshMember) {
      getList()
    }
  }, [isRefreshMember])

  const onChangeSearch = (e: any) => {
    getList(e.target.value)
  }

  return (
    <>
      <AddMember
        value={isVisible}
        onChangeValue={() => setIsVisible(!isVisible)}
        onChangeUpdate={() => getList()}
      />
      <DrawerWrap
        title={
          <HeaderWrap>
            <span>
              {t('project.projectMemberAll', { count: memberList?.length })}
            </span>
            <IconFont
              onClick={props.onChangeVisible}
              style={{ cursor: 'pointer' }}
              type="close"
            />
          </HeaderWrap>
        }
        headerStyle={{ width: '100%' }}
        closable={false}
        placement="right"
        visible={props.visible}
        bodyStyle={{ padding: 0 }}
        width={320}
      >
        <div
          style={{
            padding: '0 16px',
            background: 'white',
          }}
        >
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/project/member/save',
          ) ? null : (
            <ButtonWrap
              type="primary"
              onClick={() => setIsVisible(true)}
              icon={
                <IconFont
                  type="plus"
                  style={{ color: 'white', fontSize: 16 }}
                />
              }
            >
              {t('project.addMember1')}
            </ButtonWrap>
          )}

          <Input
            autoComplete="off"
            onPressEnter={onChangeSearch}
            onBlur={onChangeSearch}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 16 }}
              />
            }
            placeholder={t('project.searchMember')}
            allowClear
          />
        </div>
        {memberList?.length > 0 ? (
          <ListWrap>
            {memberList?.map((i: any) => (
              <ListItem key={i.id}>
                <div className="avatarBox">
                  {i.avatar ? (
                    <img src={i.avatar} alt="" />
                  ) : (
                    <NameWrap>
                      {String(i.name?.trim().slice(0, 1)).toLocaleUpperCase()}
                    </NameWrap>
                  )}
                  <div>
                    <span>
                      {i.name}
                      {i.nickname ? `(${i.nickname})` : ''}
                    </span>
                    <span>{i.roleName}</span>
                  </div>
                </div>
                <Popover
                  content={moreOperation(i)}
                  placement="bottomRight"
                  getPopupContainer={node => node}
                >
                  <MoreWrap2>
                    <div
                      style={{
                        marginRight: '8px',
                      }}
                      className="job"
                    >
                      {i.positionName}
                    </div>
                    <span className="job1">
                      <IconFont style={{ fontSize: 16 }} type="down" />
                    </span>
                  </MoreWrap2>
                </Popover>
              </ListItem>
            ))}
          </ListWrap>
        ) : (
          <div style={{ height: 'calc(100% - 134px)' }}>
            <NoData />
          </div>
        )}
      </DrawerWrap>
    </>
  )
}

export default Member

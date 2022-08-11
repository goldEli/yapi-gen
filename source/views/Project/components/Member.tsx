/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Input } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import AddMember from './AddMember'
import { useEffect, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'

interface Props {
  visible: boolean
  onChangeVisible(): void
  projectId: any
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    flex: 'initial',
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

const ButtonWrap = styled(Button)({ width: '100%', height: 32 })

const ListWrap = styled.div({
  marginTop: 16,
})

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

const Member = (props: Props) => {
  const [t] = useTranslation()
  const { getProjectMember, isRefreshMember, setIsRefreshMember, projectInfo }
    = useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [memberList, setMemberList] = useState<any>([])

  const getList = async (val?: string) => {
    const result = await getProjectMember({
      projectId: props.projectId,
      all: true,
      searchValue: val,
    })
    setMemberList(result)
    setIsRefreshMember(false)
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
        title={t('project.projectMemberAll', { count: memberList?.length })}
        placement="right"
        onClose={props.onChangeVisible}
        visible={props.visible}
        headerStyle={{ padding: 16, direction: 'rtl' }}
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
            style={{ marginTop: 16 }}
            onPressEnter={onChangeSearch}
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
        <ListWrap>
          {memberList?.map((i: any) => (
            <ListItem key={i.id}>
              <div className="avatarBox">
                {i.avatar
                  ? <img src={i.avatar} alt="" />
                  : (
                      <NameWrap>
                        {String(i.name.substring(0, 1)).toLocaleUpperCase()}
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
              <div className="job">{i.positionName}</div>
            </ListItem>
          ))}
        </ListWrap>
      </DrawerWrap>
    </>
  )
}

export default Member

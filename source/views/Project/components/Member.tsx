/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Input } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import posterImg from '@/assets/poster.png'
import AddMember from './AddMember'
import { useEffect, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'

interface Props {
  visible: boolean
  onChangeVisible(): void
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-header-title': {
    direction: 'rtl',
  },
  '.ant-drawer-title': {
    flex: 'initial',
  },
  '.ant-drawer-close': {
    margin: 0,
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

const Member = (props: Props) => {
  const { getProjectMember, projectInfo } = useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [memberList, setMemberList] = useState<any>([])

  const getList = async () => {
    const result = await getProjectMember({
      projectId: projectInfo?.id,
      searchValue: '',
    })
    setMemberList(result)
  }

  useEffect(() => {
    getList()
  }, [projectInfo])

  const onChangeSearch = async (value: string) => {
    const result = await getProjectMember({
      projectId: projectInfo?.id,
      searchValue: value,
    })
    setMemberList(result)
  }

  return (
    <>
      <AddMember
        value={isVisible}
        onChangeValue={() => setIsVisible(!isVisible)}
      />
      <DrawerWrap
        title={`项目成员（${memberList?.length}）`}
        placement="right"
        onClose={props.onChangeVisible}
        visible={props.visible}
        headerStyle={{ padding: 16 }}
        bodyStyle={{ padding: 0 }}
        width={320}
      >
        <div
          style={{
            padding: '0 16px',

            // position: 'sticky',
            // top: 0,
            background: 'white',
          }}
        >
          <ButtonWrap
            type="primary"
            onClick={() => setIsVisible(true)}
            icon={
              <IconFont type="plus" style={{ color: 'white', fontSize: 16 }} />
            }
          >
            添加成员
          </ButtonWrap>
          <Input
            style={{ marginTop: 16 }}
            onPressEnter={(e: any) => onChangeSearch(e.target.value)}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 16 }}
              />
            }
            placeholder="搜索成员"
            allowClear
          />
        </div>
        <ListWrap>
          {memberList?.map((i: any) => (
            <ListItem key={i.id}>
              <div className="avatarBox">
                <img src={i.avatar} alt="" />
                <div>
                  <span>{i.name}</span>
                  <span>{i.subname}</span>
                </div>
              </div>
              <div className="job">{i.job}</div>
            </ListItem>
          ))}
        </ListWrap>
      </DrawerWrap>
    </>
  )
}

export default Member

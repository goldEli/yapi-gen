/* eslint-disable camelcase */
// 项目右侧抽屉弹窗

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Dropdown, Form, Menu, Tooltip } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import NoData from '@/components/NoData'
import { getAddDepartMember } from '@/services/staff'
import { CloseWrap } from '@/components/StyleCommon'
import HandOverModal from '@/components/ProjectOverModal'
import {
  addMember,
  getProjectInfo,
  getProjectMember,
  getProjectPermission,
  updateMember,
} from '@/services/project'
import { useDispatch, useSelector } from '@store/index'
import {
  setProjectInfo,
  setProjectInfoValues,
  setIsUpdateMember,
} from '@store/project'
import { getMessage } from '@/components/Message'
import InputSearch from '@/components/InputSearch'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  DrawerWrap,
  HeaderWrap,
  ListItem,
  ListWrap,
  MoreWrap2,
  Myd,
  WaiWrap,
} from './style'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import CommonButton from '@/components/CommonButton'
interface Props {
  visible: boolean
  onChangeVisible(): void
  projectId: any
}

interface DropDownProps {
  row: any
  onClickMenu(item: any, row: any): void
  roleOptions: any
  name: any
  openRemoveModal(row: any): void
}
const RemoveBox = styled.div`
  height: 32px;
  /* background: var(--hover-d3); */
  color: var(--function-error);
  font-size: var(--font14);
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-family: SiYuanRegular;
  &:hover {
    background: var(--hover-d3);
  }
`
const MoreDropdown = (props: DropDownProps) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const onClickItem = (item: any) => {
    setIsVisible(false)
    props.onClickMenu(item, props.row)
  }
  const menu = () => {
    const menuItems: any = []
    props.roleOptions?.forEach((i: any, idx: any) => {
      menuItems.push({
        key: idx,
        label: (
          <Myd
            active={i.label === props.row.roleName}
            onClick={() => onClickItem(i)}
          >
            {i.label}
            {i.label === props.row.roleName && (
              <IconFont
                style={{ fontSize: 16, margin: '1px 0px 0px 15px' }}
                type="check"
              />
            )}
          </Myd>
        ),
      })
    })
    menuItems.push({
      key: menuItems.length,
      label: (
        <RemoveBox
          onClick={() => {
            props.openRemoveModal(props.row)
          }}
        >
          {t('calendarManager.remove_members')}
        </RemoveBox>
      ),
    })
    return <Menu items={menuItems} />
  }

  return (
    <Dropdown
      key={isVisible ? isVisible.toString() : null}
      visible={isVisible}
      overlay={menu}
      trigger={['click']}
      placement="bottomRight"
      getPopupContainer={node => node}
      onVisibleChange={setIsVisible}
    >
      <MoreWrap2>
        <div
          style={{
            marginRight: '4px',
          }}
          className="job"
        >
          {props.row.roleName}
        </div>
        <span className="job1">
          <IconFont style={{ fontSize: 14 }} type="down" />
        </span>
      </MoreWrap2>
    </Dropdown>
  )
}

const CommonMember = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const [isVisible, setIsVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])

  const [departments, setDepartments] = useState([])
  const [member, setMember] = useState<any>()
  const [search, setSearch] = useState<any>()
  const [handOvervisible, setHandOvervisible] = useState(false)
  const [editItem, setEditItem] = useState()
  const [memberList, setMemberList] = useState<any>([])
  const [projectPermission, setProjectPermission] = useState<any>([])
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const hasEdit = !getIsPermission(
    projectInfo?.projectPermissions,
    'b/project/member/update',
  )

  const getPermission = async () => {
    const res = await getProjectPermission({ projectId: props.projectId })
    setRoleOptions(res.list)
    setProjectPermission(
      res.list?.map((i: any) => ({
        label: i.name,
        value: i.id,
        tagLabel: i.label,
      })),
    )
  }

  // 获取项目成员列表 isUpdateProjectInfoValues：是否需要更新项目下拉数据
  const getList = async (isUpdateProjectInfoValues?: boolean) => {
    const result = await getProjectMember({
      projectId: props.projectId,
      all: true,
      searchValue: search,
    })

    // 更新项目成员下拉
    if (isUpdateProjectInfoValues) {
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      const recombinationMember = result?.map((k: any) => ({
        id: k.id,
        content: k.name,
        content_txt: k.name,
      }))
      const newValues = beforeValues?.map((i: any) =>
        ['user_name', 'users_name'].includes(i.key) ||
        (i.key.includes('custom_') && i.customTag[0] === 'projectMember')
          ? { ...i, children: [...[i.children[0]], ...recombinationMember] }
          : i,
      )
      dispatch(setProjectInfoValues(newValues))
    }

    setMemberList(result)
  }

  const init = async () => {
    const res2 = await getAddDepartMember(props.projectId)

    const arr = res2.companyList.map((i: any) => {
      return {
        id: i.id,
        code: '234234',
        name: i.name,
        avatar: i.avatar,
        phoneNumber: '123123213',
        departmentId: i.department_id,
        jobName: '',
        jobId: '1584818157136687105',
        cardType: '',
        cardNumber: '',
        hiredate: '2022-11-26',
        type: 1,
        gender: 0,
        companyId: '1504303190303051778',
      }
    })

    const obj = {
      list: arr,
    }
    setMember(obj)

    setDepartments(res2.departments)
  }

  useEffect(() => {
    if (isVisible) {
      init()
    }
  }, [isVisible])

  const onClickMenu = async (item: any, row: any) => {
    try {
      await updateMember({
        projectId: props.projectId,
        userGroupId: item.id,
        userIds: row.id,
      })
      getMessage({ msg: t('common.editS'), type: 'success' })
      // 可以考虑不走接口修改
      getList()
      dispatch(setIsUpdateMember(true))
    } catch (error) {
      //
    }
  }
  const setModalVisibleClick = (data: any) => {
    setEditItem(data)
    setHandOvervisible(true)
  }
  const onChangeSearch = (value: string) => {
    setSearch(value)
  }
  useEffect(() => {
    if (props.visible) {
      getList()
      getPermission()
    }
  }, [search, props.visible])
  const handleOk = async (list?: any, id?: any) => {
    let userGroupId = id
    if (list.length <= 0) {
      getMessage({ msg: t('project.memberNull'), type: 'warning' })
      return
    }
    if (!form.getFieldValue('userGroupId')) {
      userGroupId = projectPermission?.filter(
        (i: any) => i.tagLabel === '参与者',
      )[0]?.value
    }

    const params: any = {
      projectId: props.projectId,
      userGroupId,
      userIds: list?.map((i: any) => i.id),
    }
    await addMember(params)
    getMessage({ msg: t('common.addSuccess'), type: 'success' })
    getList(true)
    setIsVisible(false)
    const result = await getProjectInfo({ projectId: projectInfo.id })
    dispatch(setProjectInfo(result))
    dispatch(setIsUpdateMember(true))
  }
  return (
    <WaiWrap>
      {props.visible && (
        <NewAddUserModalForTandD
          title={t('project.addMember')}
          state={2}
          isPermisGroup
          isVisible={isVisible}
          onConfirm={handleOk}
          userGroupId={
            projectPermission?.filter((i: any) => i.tagLabel === '参与者')[0]
              ?.value
          }
          projectPermission={projectPermission}
          onClose={() => setIsVisible(false)}
        />
      )}

      <DrawerWrap
        title={
          <HeaderWrap>
            <span>
              {projectInfo.memberCount
                ? t('project.projectMemberAll', {
                    count: projectInfo.memberCount,
                  })
                : t('project.projectMember')}
            </span>
            <CloseWrap width={32} height={32} onClick={props.onChangeVisible}>
              <IconFont
                style={{
                  fontSize: '20px',
                }}
                type="close"
              />
            </CloseWrap>
          </HeaderWrap>
        }
        headerStyle={{ width: '100%' }}
        closable={false}
        placement="right"
        open={props.visible}
        onClose={props.onChangeVisible}
        bodyStyle={{ padding: 0 }}
        width={400}
      >
        <div
          style={{
            padding: '0 16px',
            background: 'white',
            display: 'flex',
            marginBottom: '12px',
          }}
        >
          <InputSearch
            autoFocus
            onChangeSearch={onChangeSearch}
            width="100%"
            placeholder={t('project.searchMember')}
            bgColor="var(--neutral-white-d2)"
          />
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/project/member/save',
          ) ? null : (
            <CommonButton
              type="primary"
              onClick={() => setIsVisible(true)}
              style={{ marginLeft: '16px' }}
            >
              {t('project.addMember1')}
            </CommonButton>
          )}
        </div>
        {memberList?.length > 0 ? (
          <ListWrap>
            {memberList?.map((i: any) => (
              <ListItem key={i.id}>
                <div className="avatarBox">
                  <CommonUserAvatar avatar={i.avatar} size="large" />
                  <div className="info">
                    <Tooltip
                      title={
                        i.name.length + (i.nickname?.length ?? 0) > 25
                          ? i.name + (i.nickname ?? '')
                          : ''
                      }
                    >
                      <span>
                        {i.name}
                        {i.nickname ? `(${i.nickname})` : ''}
                      </span>
                    </Tooltip>
                    <span>
                      {i.positionName || '--'}
                      {i.is_admin === 1 ? `  （${t('new_p1.a8')}）` : ''}
                    </span>
                  </div>
                </div>
                {hasEdit && i.is_admin !== 1 ? (
                  <MoreDropdown
                    onClickMenu={onClickMenu}
                    roleOptions={roleOptions}
                    openRemoveModal={setModalVisibleClick}
                    row={i}
                    name={i.positionName}
                  />
                ) : (
                  <span
                    style={{
                      color: 'var(--neutral-n3)',
                      fontSize: '12px',
                      marginRight: '4px',
                    }}
                  >
                    {i.roleName}
                  </span>
                )}
              </ListItem>
            ))}
          </ListWrap>
        ) : (
          <div style={{ height: 'calc(100% - 134px)' }}>
            <NoData />
          </div>
        )}
      </DrawerWrap>
      <HandOverModal
        title={t('project_handover')}
        visible={handOvervisible}
        close={() => {
          setHandOvervisible(false)
        }}
        confirm={() => {
          setHandOvervisible(false)
        }}
        id={editItem}
      ></HandOverModal>
    </WaiWrap>
  )
}

export default CommonMember

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-empty */
import styled from '@emotion/styled'
import HeaderSearch from './HeaderSearch'
import Table from './Table'
import Pagination from '@/components/TablePagination'
import CommonModal from '@/components/CommonModal'
import { useState, useEffect } from 'react'
import { Form, Select, message, Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useDispatch, useSelector } from '@store/index'
import { getMemberList } from '@store/teams/thunk'
import * as services from '@/services'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { GENDER_MAP } from '@/constants'
import TeamOverModal from '@/components/TeamOverModal'
import { t } from 'i18next'
import CustomSelect from '@/components/CustomSelect'
import { getMessage } from '@/components/Message'

const RightWrap = styled.div`
  flex: 1;
  padding: 0 24px;
  height: 100%;
  position: relative;
  background-color: var(--neutral-white-d1);
  overflow-x: auto;
`
const PaginationBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 24px;
`
const TableBox = styled.div`
  width: 100%;
  height: calc(100% - 160px);
  overflow-y: auto;
`
const FormStyle = styled(Form)`
  & .ant-form-item {
    min-height: 62px !important;
    display: flex;
    flex-direction: column;
  }
  & .ant-form-item-row {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  & .ant-form-item-label {
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n1-d1);
    margin-bottom: 8px;
  }
  & .ant-form-item-label > label,
  .ant-select-selection-item {
    color: var(--neutral-n1-d1);
  }
  & .ant-picker,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector,
  .ant-input,
  .ant-input-number {
    border: 1px solid var(--neutral-n6-d1) !important;
    background-color: var(--neutral-white-d4) !important;
  }
  & .ant-select-item-option-content,
  .ant-select-item,
  .ant-select-item-option,
  .rc-virtual-list-holder-inner,
  .ant-select-dropdown {
    background-color: var(--neutral-white-d4) !important;
  }
`
const TitleStyle = styled.div`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: var(--neutral-n2);
`
const SelectStyle = styled(CustomSelect)`
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid var(--neutral-n6-d1) !important;
    background-color: var(--neutral-white-d4) !important;
  }
`
const PersonStyle = styled.div`
  width: 100%;
  padding: 8px 32px 24px;
`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`
const LeftItem = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n2);
  width: 20%;
`
const RightItem = styled.span`
  font-size: 14px;
  font-weight: 400;
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neutral-n1-d1);
  text-align: right;
`

const RightTable = () => {
  const dispatch = useDispatch()
  const { membersList, activeTeamId } = useSelector(s => s.teams)
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [editForm, setEditForm] = useState<any>()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const [delIsVisible2, setDelIsVisible2] = useState(false)
  const [type, setType] = useState('')
  const [activeMember, setActiveMember] = useState<any>(null)
  const [searchVal, setSearchVal] = useState('')
  const [addMemberVisible, setAddMemberVisible] = useState(false)
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const options = [
    {
      value: 1,
      label: t('team_management'),
    },
    {
      value: 2,
      label: t('team_members'),
    },
  ]
  const onFetchMemberList = async (pageObjVal?: any, orderVal?: any) => {
    const param = {
      order: orderVal?.value,
      orderkey: orderVal?.key,
      pagesize: pageObjVal?.pageSize || 20,
      page: pageObjVal?.page || 1,
      search: {
        team_id: activeTeamId,
        keyword: searchVal || '',
      },
    }
    await dispatch(getMemberList(param))
  }
  const onUpdateOrderKey = (key: any, oder: any) => {
    onFetchMemberList({}, { key, value: oder })
  }
  useEffect(() => {
    if (activeTeamId) {
      onFetchMemberList()
    }
  }, [activeTeamId, searchVal])
  const onChangePage = (page: number, pageSize: number) => {
    onFetchMemberList({
      page,
      pageSize,
    })
  }
  const onEditConfirm = async () => {
    const value = await form.validateFields()
    try {
      await services.setting.changeMemberRole({
        id: activeTeamId,
        type: value?.team_is_admin,
        user_id: activeMember.user_id,
      })
      setIsVisible(false)
      onFetchMemberList()
      getMessage({ msg: t('edit_member_successfully'), type: 'success' })
    } catch (error) {}
  }

  const onDelConfirm = async () => {
    // if (activeMember?.team_is_admin === 1) {
    //   message.warning(t('team_administrators_cannot_be_removed') as string)
    //   setDelIsVisible(false)
    //   return
    // }
    try {
      await services.setting.deleteMemberList({
        id: activeMember?.team_id,
        user_id: activeMember?.user_id,
      })
      setDelIsVisible(false)
      onFetchMemberList()
      getMessage({ msg: t('removal_success'), type: 'success' })
    } catch (error) {}
  }

  const onAddConfirm = async (list: any[]) => {
    if (list?.length < 1) {
      return
    }
    try {
      await services.setting.teamsMember({
        id: activeTeamId,
        user_ids: list.map(i => i.id),
      })
      setAddMemberVisible(false)
      onFetchMemberList()
      getMessage({ msg: t('successfully_added'), type: 'success' })
    } catch (error) {}
  }

  const teamGetForm = (row?: any) => {
    form.setFieldsValue(row)
    return (
      <div style={{ margin: '0 24px' }}>
        <TitleStyle>
          {t('set')}【{row.name}】{t('your_role_in_the_team')}
        </TitleStyle>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <Form.Item
            label={t('team_role') as string}
            name="team_is_admin"
            rules={[{ required: true, message: '' }]}
          >
            <SelectStyle
              getPopupContainer={(node: any) => node}
              placeholder={t('please_enter_a_team_name') as string}
              style={{ width: '100%' }}
              options={options}
              suffixIcon={<IconFont type="down" style={{ fontSize: 16 }} />}
            />
          </Form.Item>
        </FormStyle>
      </div>
    )
  }

  const personalData = (row: any) => {
    return (
      <PersonStyle>
        <Row>
          <LeftItem>{t('head_portrait') as string}</LeftItem>
          <CommonUserAvatar avatar={row.avatar} size="large" />
        </Row>
        <Row>
          <LeftItem>{t('cell_phone_number') as string}</LeftItem>
          <RightItem>{row.phone}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('log_in_to_a_mailbox') as string}</LeftItem>
          <RightItem>{row.email}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('nickname') as string}</LeftItem>
          <RightItem>{row.nickname}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('name') as string}</LeftItem>
          <RightItem>{row.name}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('gender') as string}</LeftItem>
          <RightItem>{GENDER_MAP[row.gender]}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('department') as string}</LeftItem>
          <RightItem>{row.department_name}</RightItem>
        </Row>
        <Row>
          <LeftItem>{t('position') as string}</LeftItem>
          <RightItem>{row.position_name}</RightItem>
        </Row>
        <Row style={{ cursor: 'pointer' }}>
          <LeftItem>{t('team') as string}</LeftItem>
          <Tooltip title={row.teams?.map((i: any) => i.name)?.join()}>
            <RightItem>{row.teams?.map((i: any) => i.name)?.join()}</RightItem>
          </Tooltip>
        </Row>
        <Row className="row" style={{ marginBottom: 0 }}>
          <LeftItem>{t('permission_group') as string}</LeftItem>
          <RightItem>
            {row.team_is_admin === 1
              ? (t('team_management') as string)
              : (t('team_members') as string)}
          </RightItem>
        </Row>
      </PersonStyle>
    )
  }

  return (
    <RightWrap>
      <HeaderSearch
        onSetSearchVal={setSearchVal}
        onRefresh={onFetchMemberList}
        onShowAddMemberModal={() => setAddMemberVisible(true)}
      />
      <TableBox style={{ overflow: 'hidden', height: '80%' }}>
        <Table
          onUpdateOrderKey={onUpdateOrderKey}
          onEditRow={(row: any, state: string) => {
            setActiveMember(row)
            setIsVisible(true),
              setType(state),
              setEditForm(
                state === 'detail' ? personalData(row) : teamGetForm(row),
              )
          }}
          onDelRow={(row: any) => {
            setActiveMember(row)

            if (row.projects_count === 0) {
              setDelIsVisible(true)
            } else {
              setDelIsVisible2(true)
            }
          }}
          dataSource={membersList?.list}
        />
      </TableBox>
      <PaginationBox>
        <Pagination
          total={membersList?.pager?.total}
          pageSize={membersList?.pager?.pagesize}
          currentPage={membersList?.pager?.page}
          onChange={onChangePage}
        />
      </PaginationBox>
      <CommonModal
        title={type === 'detail' ? t('personal_data') : t('editor_member')}
        isVisible={isVisible}
        children={editForm}
        hasFooter={type === 'detail'}
        onClose={() => setIsVisible(false)}
        onConfirm={onEditConfirm}
        width={528}
      />

      <DeleteConfirm
        title={t('removal_confirmation')}
        text={t('are_you_sure_to_remove_this_member')}
        isVisible={delIsVisible}
        onConfirm={onDelConfirm}
        onChangeVisible={() => setDelIsVisible(false)}
      />

      <TeamOverModal
        confirm={() => onFetchMemberList()}
        id={activeMember}
        close={() => setDelIsVisible2(false)}
        visible={delIsVisible2}
      />
      <AddMemberCommonModal
        isPermisGroup={false}
        title={t('add_a_member')}
        isVisible={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        onConfirm={list => onAddConfirm(list)}
      />
    </RightWrap>
  )
}

export default RightTable

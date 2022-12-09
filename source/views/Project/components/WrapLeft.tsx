// 项目列表页左侧

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import AddButton from '@/components/AddButton'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import styled from '@emotion/styled'
import { Form, Input, Menu, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { CloseWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'

const WrapLeft = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  height: 100%;
  padding: 24px 0;
  box-shadow: 1px 0px 0px 0px #ecedef;
  z-index: 1;
`

const TitleBox = styled.div<{ idx?: boolean; isSpace?: any }>(
  {
    height: 44,
    lineHeight: '44px',
    color: '#323233',
    fontWeight: 400,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&:hover': {
      background: '#F4F5F5',
      color: '#2877ff',
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
  },
  ({ idx, isSpace }) => ({
    borderRight: idx ? '3px solid #2877FF' : '3px solid white',
    color: idx ? '#2877FF' : '#323233',
    background: idx ? '#F0F4FA' : 'white',
    justifyContent: isSpace ? 'space-between' : 'inherit',
    padding: isSpace ? '0 14px 0 24px' : '0 0 0 24px',
  }),
)

const GroupBox = styled.div`
  height: 40px;
  margin-top: 20px;
  padding: 0 20px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  div {
    font-size: 12;
    color: #969799;
  }
`

const GroupItems = styled.div<{ isPermission?: boolean }>(
  {
    width: '100%',
    overflow: 'auto',
  },
  ({ isPermission }) => ({
    height: `calc(100% - ${isPermission ? 172 : 228}px)`,
  }),
)

const NoDataCreateWrap = styled.div({
  marginTop: 8,
  minHeight: 68,
  borderRadius: 6,
  background: '#F9FAFA',
  padding: '8px 12px',
  '.top': {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 12,
    svg: {
      color: '#FA9746',
      fontSize: 16,
      marginTop: 2,
    },
    div: {
      color: '#646566',
      fontSize: 12,
      marginLeft: 8,
      flexWrap: 'wrap',
    },
  },
  '.bottom': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#2877ff',
    svg: {
      fontSize: 10,
    },
    div: {
      fontSize: 12,
      marginLeft: 6,
    },
  },
})

interface Props {
  onAddClick(): void
  onChangeType(val: number): void
  activeType: number
  isPermission?: boolean
  onChangeGroup(value: any): void
}

const WrapLeftBox = (props: Props) => {
  const [t] = useTranslation()
  const {
    getGroupList,
    addProjectGroup,
    updateProjectGroup,
    deleteProjectGroup,
    setSelectGroupList,
  } = useModel('project')
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [groupId, setGroupId] = useState<any>(null)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()
  const [groupList, setGroupList] = useState<any>({
    list: undefined,
  })
  const [countData, setCountData] = useState<any>({})

  const getGroupData = async (isChange?: boolean) => {
    const result = await getGroupList()
    setGroupList({ list: result?.list })
    setSelectGroupList(
      result?.list?.map((i: any) => ({ label: i.name, value: i.id })),
    )
    setCountData({
      publicCount: result.publicCount,
      selfCount: result.selfCount,
    })
    // 如果当前删除的是当前选择，则切换为分组第一条
    if (isChange) {
      props.onChangeGroup(result?.list[0]?.id)
      setGroupId(result?.list[0]?.id)
    }
  }

  useEffect(() => {
    getGroupData()
  }, [])

  // 点击下拉项
  const onClickMenu = (type: any, item: any, e: any) => {
    e.stopPropagation()
    setIsMoreVisible(false)
    setOperationObj(item)
    if (type === 'edit') {
      setIsVisible(true)
      form.setFieldsValue({ name: item.name })
    } else {
      setIsDeleteVisible(true)
    }
  }

  // 操作成功后，清除
  const onUpdateGroup = (isChange?: boolean) => {
    setIsDeleteVisible(false)
    setIsVisible(false)
    setOperationObj({})
    form.resetFields()
    getGroupData(isChange)
  }

  // 点击切换我参与的或企业所有
  const onChangeType = (value: number) => {
    setGroupId(null)
    props.onChangeType(value)
  }

  // 点击切分组
  const onChangeGroup = (item: any) => {
    props.onChangeGroup(item.id)
    setGroupId(item.id)
  }

  // 确认删除分组
  const onDeleteConfirm = async () => {
    try {
      await deleteProjectGroup({ id: operationObj?.id })
      message.success(t('common.deleteSuccess'))
      onUpdateGroup(groupId === operationObj?.id)
      // 如果分组只剩最后一个分组,默认切换到我参与的，反之切换到分组第一个
      if (groupList?.list?.length === 1) {
        onChangeType(0)
      }
    } catch (error) {
      //
    }
  }

  // 创建分组和编辑分组
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    if (operationObj?.id) {
      values.id = operationObj?.id
      try {
        await updateProjectGroup(values)
        message.success(t('common.editSuccess'))
        onUpdateGroup()
      } catch (error) {
        //
      }
    } else {
      try {
        await addProjectGroup(values)
        message.success(t('common.createSuccess'))
        onUpdateGroup()
      } catch (error) {
        //
      }
    }
  }

  // 更多操作
  const menu = (item: any) => {
    const menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMenu('edit', item, e)}>
            {t('version2.editGroup')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMenu('del', item, e)}>
            {t('version2.deleteGroup')}
          </div>
        ),
      },
    ]

    return <Menu items={menuItems} />
  }

  // 关闭弹窗
  const onClose = (type: string) => {
    if (type === 'del') {
      setIsDeleteVisible(!isDeleteVisible)
    } else {
      setIsVisible(!isVisible)
    }
    setOperationObj({})
  }

  return (
    <WrapLeft>
      {isDeleteVisible && (
        <DeleteConfirm
          isVisible={isDeleteVisible}
          text={t('version2.deleteGroupText')}
          onChangeVisible={() => onClose('del')}
          onConfirm={onDeleteConfirm}
        />
      )}

      {isVisible && (
        <CommonModal
          isVisible={isVisible}
          title={
            operationObj.id
              ? t('version2.editGroup')
              : t('version2.createGroup')
          }
          onClose={() => onClose('edit')}
          onConfirm={onConfirm}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ padding: '0 20px 0 2px' }}
          >
            <Form.Item
              label={t('version2.groupName')}
              name="name"
              rules={[{ required: true, message: '' }]}
            >
              <Input
                placeholder={t('version2.pleaseGroupName')}
                autoComplete="off"
                maxLength={10}
                autoFocus
                allowClear
              />
            </Form.Item>
          </Form>
        </CommonModal>
      )}

      {!props.isPermission && (
        <AddButton
          text={t('common.createProject')}
          onChangeClick={props.onAddClick}
        />
      )}
      <TitleBox
        onClick={() => onChangeType(0)}
        idx={!props.activeType}
        style={{ marginTop: 24 }}
      >
        <IconFont type="user-check" style={{ fontSize: 18, marginRight: 8 }} />
        {t('project.mineJoin')}
        {countData.publicCount ? `（${countData.publicCount}）` : ''}
      </TitleBox>
      <TitleBox onClick={() => onChangeType(1)} idx={props.activeType === 1}>
        <IconFont
          type="records-center"
          style={{ fontSize: 18, marginRight: 8 }}
        />
        {t('project.companyAll')}
        {countData.selfCount ? `（${countData.selfCount}）` : ''}
      </TitleBox>
      <GroupBox>
        <div>{t('version2.projectGroup')}</div>
        <CloseWrap width={24} height={24}>
          <IconFont
            onClick={() => setIsVisible(true)}
            type="plus"
            style={{ fontSize: 16, color: '#646566', cursor: 'pointer' }}
          />
        </CloseWrap>
      </GroupBox>
      <GroupItems isPermission={props.isPermission}>
        {!!groupList?.list &&
          (groupList?.list?.length > 0 ? (
            <>
              {groupList.list?.map((item: any) => (
                <TitleBox
                  isSpace
                  onClick={() => onChangeGroup(item)}
                  key={item.id}
                  idx={item.id === groupId}
                >
                  {item.name}
                  <MoreDropdown
                    onChangeVisible={setIsMoreVisible}
                    menu={menu(item)}
                    isMoreVisible={isMoreVisible}
                    color="#969799"
                  />
                </TitleBox>
              ))}
            </>
          ) : (
            <div style={{ padding: '0 16px' }}>
              <NoDataCreateWrap>
                <div className="top">
                  <IconFont type="Warning" />
                  <div>{t('version2.noDataCreateGroup')}</div>
                </div>
                <div className="bottom">
                  <div
                    className="bottom"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsVisible(true)}
                  >
                    <IconFont type="plus" />
                    <div>{t('version2.addGroup')}</div>
                  </div>
                </div>
              </NoDataCreateWrap>
            </div>
          ))}
      </GroupItems>
    </WrapLeft>
  )
}

export default WrapLeftBox

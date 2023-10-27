/* eslint-disable no-undefined */
/* eslint-disable no-constant-condition */
// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import {
  addProjectGroup,
  deleteProjectGroup,
  getGroupList,
  updateProjectGroup,
} from '@/services/project'
import {
  changeGroupId,
  changeGroupIdName,
  changeTypeId,
} from '@store/create-propject'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefreshGroup } from '@store/project'
import { Form, Input, Menu } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  WrapDetail,
  GroupBox,
  TitleBox,
  NoDataCreateWrap,
  GroupItems,
} from './style'
import { CloseWrap } from '@/components/StyleCommon'
import { getMessage } from '@/components/Message'

interface Props {
  onAddClick(): void
  onChangeType(val: number): void
  activeType: number
  isPermission?: boolean
  onChangeGroup(value: any): void
}

const MoreProjectSide = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const projectSide: any = useRef<HTMLInputElement>(null)
  const [groupId, setGroupId] = useState<any>(null)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [groupList, setGroupList] = useState<any>({
    list: undefined,
  })
  const { isRefreshGroup } = useSelector(store => store.project)
  const { groupId: storeGid, typeId } = useSelector(
    state => state.createProject,
  )
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [countData, setCountData] = useState<any>({})
  const dispatch = useDispatch()

  // 点击下拉项
  const onClickMenu = (type: any, item: any, e: any) => {
    e.stopPropagation()
    setIsMoreVisible(false)
    setOperationObj(item)
    if (type === 'edit') {
      setIsVisible(true)
      form.setFieldsValue({ name: item.name })
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    } else {
      setIsDeleteVisible(true)
    }
  }

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
  const getGroupData = async (isChange?: boolean) => {
    const result = await getGroupList()

    setGroupList({ list: result?.list })
    setCountData({
      publicCount: result.publicCount,
      selfCount: result.selfCount,
    })
    dispatch(setIsRefreshGroup(false))
    // 如果当前删除的是当前选择，则切换为分组第一条
    if (isChange) {
      props.onChangeGroup(result?.list[0]?.id)
      setGroupId(result?.list[0]?.id)
    }
  }

  // 关闭弹窗
  const onClose = (type: string) => {
    if (type === 'del') {
      setIsDeleteVisible(!isDeleteVisible)
    } else {
      setIsVisible(!isVisible)
      form.resetFields()
    }
    setOperationObj({})
  }
  // 点击切换我参与的或企业所有
  const onChangeType = (value: number) => {
    setGroupId(null)
    props.onChangeType(value)
  }

  // 操作成功后，清除
  const onUpdateGroup = (isChange?: boolean) => {
    setIsDeleteVisible(false)
    setIsVisible(false)
    setOperationObj({})
    form.resetFields()
    getGroupData(isChange)
  }
  // 确认删除分组
  const onDeleteConfirm = async () => {
    try {
      await deleteProjectGroup({ id: operationObj?.id })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      onUpdateGroup(groupId === operationObj?.id)
      // 如果分组只剩最后一个分组,默认切换到我参与的，反之切换到分组第一个

      if (groupList?.list?.length === 1) {
        dispatch(changeTypeId(0))
      } else {
        const myid = groupList?.list.filter(
          (i: any) => i.id !== operationObj?.id,
        )[0]

        dispatch(changeGroupId(myid.id))
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
        getMessage({ msg: t('common.editSuccess'), type: 'success' })
        onUpdateGroup()
      } catch (error) {
        //
      }
    } else {
      try {
        await addProjectGroup(values)
        getMessage({ msg: t('common.createSuccess'), type: 'success' })
        onUpdateGroup()
      } catch (error) {
        //
      }
    }
  }
  useEffect(() => {
    getGroupData()
    return () => {
      dispatch(changeTypeId(0))
      dispatch(changeGroupId(null))
    }
  }, [isRefreshGroup])
  return (
    <AllWrap>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        text={t('version2.deleteGroupText')}
        onChangeVisible={() => onClose('del')}
        onConfirm={onDeleteConfirm}
      />

      <CommonModal
        isVisible={isVisible}
        title={
          operationObj.id ? t('version2.editGroup') : t('version2.createGroup')
        }
        onClose={() => onClose('edit')}
        onConfirm={onConfirm}
      >
        <Form form={form} layout="vertical" style={{ padding: ' 0 24px' }}>
          <Form.Item
            label={t('version2.groupName')}
            name="name"
            rules={[{ required: true, message: '' }]}
            getValueFromEvent={event => {
              // eslint-disable-next-line require-unicode-regexp
              return event.target.value.replace(/(?<start>^\s*)/g, '')
            }}
          >
            <Input
              placeholder={t('version2.pleaseGroupName')}
              // autoComplete="off"
              maxLength={10}
              autoFocus
              allowClear
              ref={inputRefDom as any}
            />
          </Form.Item>
        </Form>
      </CommonModal>
      <WrapDetail ref={projectSide}>
        <MenuBox>
          <MenuItem
            idx={typeId === 0}
            onClick={() => {
              dispatch(changeTypeId(0))
              dispatch(changeGroupId(null))
            }}
          >
            <CommonIconFont
              type="user-check"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>
              {t('project.mineJoin')}
              {countData.selfCount ? `（${countData.selfCount}）` : ''}
            </div>
          </MenuItem>
          <MenuItem
            idx={typeId === 1}
            onClick={() => {
              dispatch(changeTypeId(1))
              dispatch(changeGroupId(null))
            }}
          >
            <CommonIconFont
              type="records-center"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>
              {t('project.companyAll')}
              {countData.publicCount ? `（${countData.publicCount}）` : ''}
            </div>
          </MenuItem>
        </MenuBox>

        <GroupBox>
          <div
            style={{
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            {t('version2.projectGroup')}
          </div>
          <CloseWrap
            width={24}
            height={24}
            onClick={() => {
              setIsVisible(true)
              setTimeout(() => {
                inputRefDom.current?.focus()
              }, 100)
            }}
          >
            <IconFont
              type="plus"
              style={{
                fontSize: 18,
              }}
            />
          </CloseWrap>
        </GroupBox>
        <GroupItems>
          {!!groupList?.list &&
            (groupList?.list?.length > 0 ? (
              <>
                {groupList.list?.map((item: any) => (
                  <TitleBox
                    isSpace
                    onClick={() => {
                      dispatch(changeGroupIdName(item.name))
                      dispatch(changeGroupId(item.id))
                      dispatch(changeTypeId(null))
                    }}
                    key={item.id}
                    idx={item.id === storeGid}
                  >
                    {item.name}
                    <MoreDropdown
                      onChangeVisible={setIsMoreVisible}
                      menu={menu(item)}
                      isMoreVisible={isMoreVisible}
                      color="var(--neutral-n3)"
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
                      onClick={() => {
                        setIsVisible(true)
                        setTimeout(() => {
                          inputRefDom.current?.focus()
                        }, 100)
                      }}
                    >
                      <IconFont type="plus" />
                      <div>{t('version2.addGroup')}</div>
                    </div>
                  </div>
                </NoDataCreateWrap>
              </div>
            ))}
        </GroupItems>
      </WrapDetail>
    </AllWrap>
  )
}

export default MoreProjectSide

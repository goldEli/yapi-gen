// 项目列表页左侧

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import AddButton from '@/components/AddButton'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import styled from '@emotion/styled'
import { Form, Input, Menu } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { CloseWrap } from '@/components/StyleCommon'

const WrapLeft = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  height: 100%;
  padding: 24px 0;
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

interface Props {
  onAddClick(): void
  onChangeType(val: number): void
  activeType: number
  isPermission?: boolean
}

const WrapLeftBox = (props: Props) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()

  // 点击下拉项
  const onClickMenu = (type: any, item: any) => {
    setIsMoreVisible(false)
    setOperationObj(item)
    if (type === 'edit') {
      setIsVisible(true)
    } else {
      setIsDeleteVisible(true)
    }
  }

  // 确认删除分组
  const onDeleteConfirm = async () => {
    //
  }

  // 创建分组和编辑分组
  const onConfirm = async () => {
    await form.validateFields()
  }

  // 更多操作
  const menu = (item: any) => {
    const menuItems = [
      {
        key: '1',
        label: (
          <div onClick={() => onClickMenu('edit', item)}>
            {t('version2.editGroup')}
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onClickMenu('del', item)}>
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
          text="确认删除该分组？"
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
        onClick={() => props.onChangeType(0)}
        idx={!props.activeType}
        style={{ marginTop: 24 }}
      >
        <IconFont type="user-check" style={{ fontSize: 18, marginRight: 8 }} />
        {t('project.mineJoin')}
      </TitleBox>
      <TitleBox
        onClick={() => props.onChangeType(1)}
        idx={props.activeType === 1}
      >
        <IconFont
          type="records-center"
          style={{ fontSize: 18, marginRight: 8 }}
        />
        {t('project.companyAll')}
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
        <TitleBox isSpace>
          XXXX
          <MoreDropdown
            onChangeVisible={setIsMoreVisible}
            menu={menu({ name: '121212', id: 1 })}
            isMoreVisible={isMoreVisible}
            color="#969799"
          />
        </TitleBox>
      </GroupItems>
    </WrapLeft>
  )
}

export default WrapLeftBox

/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { updateAffairsTableParams } from '@/services/affairs'
import { getIsPermission } from '@/tools'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal } from '@store/project'
import { setSprintRefresh } from '@store/sprint'
import { Menu, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

const MenuWrap = styled(Menu)`
  max-width: 240px;
  max-height: 300px;
  overflow-y: scroll;
  border-radius: 6px;
  padding: 4px;
  li {
    height: 32px !important;
    line-height: 32px !important;
    margin: 0 !important;
    color: var(--neutral-n2) !important;
    background: var(---neutral-white-d3) !important;
  }
  li:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3) !important;
  }
  .ant-dropdown-menu-item.ant-dropdown-menu-item-disabled:hover,
  .ant-dropdown-menu-item.ant-dropdown-menu-submenu-title-disabled:hover,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-item-disabled:hover,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-submenu-title-disabled:hover {
    background-color: transparent !important;
  }
  li:last-child {
    border-top: 1px solid var(--neutral-n6-d1);
  }
`
const RemoveItemWrap = styled.div`
  font-size: 12px;
  font-family: MiSans-Regular, MiSans;
  color: var(--neutral-n3);
`

const MenuItemBox = styled.div`
  display: flex;
  align-items: center;
  .edit {
    visibility: hidden;
  }
  &:hover .edit {
    visibility: visible;
  }
  &:hover .item {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const MenuItemWrap = styled.div`
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  color: var(--neutral-n2);
  &:hover {
    color: var(--neutral-n1-d1);
  }
  margin-right: 20px;
`
const NewItemWrap = styled(MenuItemWrap)`
  box-sizing: border-box;
`

interface Props {
  record: any
  longStoryList: any[]
  setIsVisible(v: any): any
  setPopoverVisible(val: boolean): void
}

export const LatelyLongStoryMenu = (props: Props) => {
  const [t] = useTranslation()
  const id = Number(props?.record?.id?.split('_')?.[1])
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(store => store.project)
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )
  const { setPopoverVisible } = props

  const editLongStory = async (parent_id: number) => {
    try {
      const result: any = await updateAffairsTableParams({
        otherParams: { parent_id },
        projectId: props?.record?.project_id,
        id,
      })

      if (result && result.code === 0) {
        getMessage({
          msg: '长故事修改成功',
          type: 'success',
        })
        dispatch(setSprintRefresh(1))
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const menuItems: any = [
    {
      key: '-1',
      disabled: true,
      label: <RemoveItemWrap>近期</RemoveItemWrap>,
    },
  ]
    .concat(
      props.longStoryList?.map((k: any) => ({
        key: k.id,
        disabled: false,
        label: (
          <MenuItemBox>
            <Tooltip title={k.name}>
              <MenuItemWrap
                className="item"
                onClick={() => {
                  setPopoverVisible(false)
                  editLongStory(k.id)
                }}
              >
                {k.name}
              </MenuItemWrap>
            </Tooltip>
            <div className="edit">
              <Tooltip title="编辑">
                <IconFont
                  onClick={() => {
                    setPopoverVisible(false)
                    // todo 编辑长故事
                    dispatch(
                      setAddWorkItemModal({
                        visible: true,
                        params: {
                          editId: k.id,
                          projectId: k.project_id,
                          type: 3,
                        },
                      }),
                    )
                  }}
                  style={{
                    fontSize: 16,
                    color: 'var(--neutral-n3)',
                    marginRight: 12,
                  }}
                  type="edit"
                />
              </Tooltip>
              {hasDel ? null : (
                <Tooltip title="删除">
                  <IconFont
                    onClick={() => {
                      setPopoverVisible(false)
                      props?.setIsVisible?.(k)
                    }}
                    style={{
                      fontSize: 16,
                      color: 'var(--neutral-n3)',
                    }}
                    type="delete"
                  />
                </Tooltip>
              )}
            </div>
          </MenuItemBox>
        ),
      })),
    )
    .concat([
      {
        key: '-3',
        disabled: false,
        label: (
          <NewItemWrap
            onClick={() => {
              // Todo 新建长故事
              setPopoverVisible(false)
              dispatch(
                setAddWorkItemModal({
                  visible: true,
                  params: {
                    type: 3,
                  },
                }),
              )
            }}
          >
            新建长故事
          </NewItemWrap>
        ),
      },
    ])

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

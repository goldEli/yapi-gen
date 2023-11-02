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
  li.ant-menu-item-disabled:hover {
    background: transparent !important;
    cursor: default;
  }

  .ant-menu-item-disabled,
  .ant-menu-submenu-disabled {
    background: transparent !important;
    cursor: default;
  }

  li:nth-last-child(2) {
    border-top: 1px solid var(--neutral-n6-d1);
  }
`
const RemoveItemWrap = styled.div`
  font-size: 12px;
  font-family: SiYuanRegular;
  color: var(--neutral-n3);
`

const MenuItemBox = styled.div`
  display: flex;
  align-items: center;
  .edit {
    visibility: hidden;
    .svg1 {
      &:hover svg {
        color: var(--primary-d1);
      }
    }
    .svg2 {
      &:hover svg {
        color: var(--primary-d1);
      }
    }
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
  font-family: SiYuanRegular;
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
  clearLongStory(val: number): void
  activeKey: number
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
  const { setPopoverVisible, clearLongStory } = props

  const editLongStory = async (parent_id: number) => {
    try {
      const result: any = await updateAffairsTableParams({
        otherParams: { parent_id },
        projectId: props?.record?.project_id,
        id,
      })

      if (result && result.code === 0) {
        getMessage({
          msg: t('sprint.longStoryUpdateSuccess'),
          type: 'success',
        })
        sessionStorage.setItem('noRefresh', 'true')
        dispatch(setSprintRefresh(1))
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      //
    }
  }

  let menuItems: any = [
    {
      key: '-1',
      disabled: true,
      label: <RemoveItemWrap>{t('sprint.recent')}</RemoveItemWrap>,
    },
  ]
    .concat(
      props.longStoryList?.map((k: any) => ({
        key: k.id,
        disabled: false,
        label: (
          <MenuItemBox>
            {k.name?.length >= 14 ? (
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
            ) : (
              <MenuItemWrap
                className="item"
                onClick={() => {
                  setPopoverVisible(false)
                  editLongStory(k.id)
                }}
              >
                {k.name}
              </MenuItemWrap>
            )}
            <div className="edit">
              <IconFont
                className="svg1"
                onClick={() => {
                  sessionStorage.setItem('noRefresh', 'true')
                  setPopoverVisible(false)
                  dispatch(
                    setAddWorkItemModal({
                      visible: true,
                      params: {
                        editId: k.id,
                        projectId: k.project_id,
                        type: 3,
                        title: t('sprint.editTransaction'),
                      },
                    }),
                  )
                }}
                style={{
                  fontSize: 16,
                  color: 'var(--neutral-n3)',
                  marginRight: 2,
                }}
                type="edit"
              />
              {hasDel ? null : (
                <IconFont
                  className="svg2"
                  onClick={() => {
                    sessionStorage.removeItem('noRefresh')
                    setPopoverVisible(false)
                    props?.setIsVisible?.(k)
                  }}
                  style={{
                    fontSize: 16,
                    color: 'var(--neutral-n3)',
                  }}
                  type="delete"
                />
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
              if (props?.activeKey === 1) {
                sessionStorage.removeItem('noRefresh')
              } else {
                sessionStorage.setItem('noRefresh', 'true')
              }
              setPopoverVisible(false)
              dispatch(
                setAddWorkItemModal({
                  visible: true,
                  params: {
                    type: 3,
                    noDataCreate: true,
                    title: t('sprint.createTransaction'),
                    projectId: props?.record?.project_id,
                  },
                }),
              )
            }}
          >
            {t('sprint.createStory')}
          </NewItemWrap>
        ),
      },
      {
        key: '-4',
        disabled: false,
        label: (
          <NewItemWrap
            onClick={() => {
              //  取消链接
              clearLongStory?.(id)
              setPopoverVisible(false)
            }}
          >
            {t('sprint.cancelLink')}
          </NewItemWrap>
        ),
      },
    ])

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

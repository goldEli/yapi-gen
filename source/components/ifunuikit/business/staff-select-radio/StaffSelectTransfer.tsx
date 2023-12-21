// 人员选择
/* eslint-disable max-lines */
/* eslint-disable arrow-body-style */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-literals */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { difference, flatMapDeep, uniq } from 'lodash'
import { useTranslation } from '../../'
import { Avatar, Checkbox, Input, Radio, Tree, type TreeDataNode } from 'antd'
import SingleLine from './SingleLine'
import boyImage from './assets/boy.png'
import girlImage from './assets/girl.png'
import { type DataNode } from 'antd/es/tree'
import styled from '@emotion/styled'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { IDepartment, IStaffListAll, IUser } from './type'
import Icon from '../../assets/icons'

const ChooseBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`
const ChooseContent = styled.div({
  display: 'flex',
  height: 400,
  justifyContent: 'space-around',
})
const ChooseContentLeft = styled.div({
  width: 216,
  display: 'flex',
  flexDirection: 'column',
})

const InputSearch = styled(Input)`
  width: 100%;
  height: 32px;
  border-radius: 4px;
  margin-bottom: 16px;
  background: #ffffff;
  border: 1px solid #d5d6d9;
  .ant-input {
    color: #bbbdbf;
    border-radius: 25px;
    border: 0;
    outline: none;
    padding: 5px 15px;
    background: inherit;
    border-radius: 4px 4px 4px 4px;
    &:focus,
    &:hover {
      box-shadow: none;
    }
  }
  .ant-input::placeholder {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #bbbdbf;
  }
`
const LeftSatff = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 400,
  overflow: 'auto',
})
const ChooseContentRight = styled.div({ width: 216 })
const ProviderWrap = styled.div({
  width: 1,
  height: '100%',
  background: '#F2F3F7',
  margin: '0 24px',
})
const RightHeader = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 32,
  padding: '0 12px',
  background: '#F7F8FA',
  borderRadius: 4,
  fontSize: 14,
  '> span': {
    fontSize: 14,
    fontWeight: 400,
    color: '#323233',
  },
})

const StyledCloseIcon = styled(Icon)({
  fontSize: 14,
  cursor: 'pointer',
  visibility: 'hidden',
})
const RightItem = styled.div({
  width: '100%',
  height: 32,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 4,
  marginTop: 8,
  padding: '0 12px',
  '&:hover': {
    background: '#F7F8FA',
    [StyledCloseIcon.toString()]: {
      visibility: 'visible',
      width: 14,
      height: 14,
      color: '#BBBDBF',
    },
  },
})
const RightBox = styled.div({ width: '100%', height: 368, overflow: 'auto' })

const StyledTree = styled(Tree)({
  '.ant-tree-treenode': {
    width: '100%',
    borderRadius: 4,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  '.ant-tree-switcher': {
    lineHeight: '32px',
  },
  '.ant-tree-treenode:hover': {
    background: '#F7F8FA',
  },
  '.ant-tree-treenode-selected': {
    background: '#F7F8FA',
  },
  '.ant-tree-node-selected': {
    backgroundColor: 'inherit!important',
  },
})

const SelectAll = styled(Checkbox)`
  /* .ant-checkbox-inner {
    background-color: inherit;
  } */
  /* .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #617ef2 !important;
  } */
  color: inherit;
`

const StaffNode = styled.div({
  marginLeft: -24,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '&>*': {
    position: 'relative',
    zIndex: 10,
  },
  '&:hover': {
    '&::before': {
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
})

const Box = styled.div`
  &.dark {
    ${InputSearch.toString()} {
      border: none;
      background-color: #383f4d !important;
      .ant-input {
        color: #616372;
        background: #383f4d;
      }
      .ant-input::placeholder {
        color: #585f6b;
      }
    }
    ${RightHeader.toString()} {
      background: #383f4d;
      > span {
        color: #b8c2d4;
      }
    }
    ${RightItem.toString()} {
      &:hover {
        background: #383f4d;
      }
      ${SingleLine.toString()} {
        color: #b8c2d4;
      }
      ${StyledCloseIcon.toString()} {
        color: #585f6b;
      }
    }
    ${StyledTree.toString()} {
      .ant-tree-treenode:hover {
        background: #383f4d;
      }
      .ant-tree-treenode-selected {
        background: #383f4d;
      }
      /* .ant-checkbox-inner {
        background-color: inherit;
      }
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #617ef2 !important;
      } */
    }
  }
`
const filterTreeNode = (
  treeList: (TreeDataNode & { name: string; staff?: boolean })[],
  filterWord: string,
) => {
  const newTreeList: typeof treeList = []
  treeList.forEach((i: any) => {
    if (Array.isArray(i.children) && i.children.length > 0) {
      const children = filterTreeNode(
        i.children as (TreeDataNode & { name: string })[],
        filterWord,
      )
      if (children.length > 0) {
        newTreeList.push({
          ...i,
          children,
        })
        return
      }
    }
    if (i.name.toLowerCase().includes(filterWord) && i.staff) {
      newTreeList.push({
        ...i,
      })
    }
  })
  return newTreeList
}

const getAllKeys = (treeList: TreeDataNode[]) => {
  const keys: string[] = []
  treeList.forEach((i: any) => {
    keys.push(i.key as string)
    if (Array.isArray(i.children)) {
      keys.push(...getAllKeys(i.children))
    }
  })
  return keys
}
const getGenderDefaultAvatar = (gender?: number) =>
  gender === 0 ? girlImage : boyImage

interface Props {
  isShowMe?: boolean
  value?: string[]
  onChange?(value: string[]): void
  className?: string
  disableUser?: any[]
  staffListAll: IStaffListAll
  user: IUser
  departments: IDepartment[]
}

const StaffSelectTransfer = (props: Props) => {
  // const { staffListAll, getStaffListAll } = useModel('staff')
  // const { getAllDepartments, departments } = useModel('organization')
  // const { user } = useModel('user')

  const { user, staffListAll, departments } = props
  const [t] = useTranslation()
  const [searchValue, setSearchValue] = useState<string>('')

  const disabledUser = (props.disableUser || []).concat(
    !props.isShowMe && user?.id ? [user?.id] : [],
  )

  const staffList = (staffListAll?.list || []).filter(o => {
    return !disabledUser.find(item => item === o.id)
  })

  // useEffect(() => {
  //   getStaffListAll()
  //   getAllDepartments()
  // }, [])

  const onBatchSelect = (isSelected: boolean, idList: string[]) => {
    if (isSelected) {
      props.onChange?.(uniq((props.value || []).concat(idList)))
    } else {
      props.onChange?.(difference(props.value, idList))
    }
  }

  const onSelect = (id: string) => {
    // if (props.value?.includes(id)) {
    props.onChange?.([id])
    // } else {
    //   props.onChange?.((props.value || []).concat(id))
    // }
  }

  const appendDepartmentStaffs = (
    subDepartments: IDepartment[],
  ): (DataNode & { name: string; staff?: boolean })[] =>
    subDepartments.map((i: any) => {
      const staffs = staffList || []
      const flatLocal = (item: any[]): string[] => {
        return flatMapDeep(item, (node: any) => {
          if (Array.isArray(node.children)) {
            return [node.id].concat(flatLocal(node.children))
          }
          return [node.id]
        })
      }
      const allSubDepartmentKeys = flatLocal([i])
        .map((key: string) =>
          staffs
            .filter((staff: any) => staff.departmentId === key)
            .map((staff: any) => staff.id),
        )
        .flat()

      const checkedAll =
        allSubDepartmentKeys.every((key: string) =>
          props.value?.includes(key),
        ) && allSubDepartmentKeys.length > 0
      const checkedSome = allSubDepartmentKeys.some((key: string) =>
        props.value?.includes(key),
      )
      return {
        title: (
          <div style={{ display: 'flex' }}>
            {/* <Checkbox
              indeterminate={!checkedAll && checkedSome}
              style={{ marginRight: '0.8em' }}
              checked={checkedAll}
              onChange={() => onBatchSelect(!checkedAll, allSubDepartmentKeys)}
            /> */}
            <SingleLine
              width={80}
              style={
                props.className === 'dark'
                  ? { color: '#b8c2d4' }
                  : { color: '#646566' }
              }
            >
              {i.name}
            </SingleLine>
          </div>
        ),
        name: i.name || '',
        key: i.id,
        children: (
          (staffList
            .filter(staff => staff.departmentId === i.id)
            .map(staff => ({
              title: (
                <StaffNode>
                  <Radio
                    checked={props.value?.includes(staff.id)}
                    onChange={() => onSelect(staff.id)}
                  />
                  <Avatar
                    size={24}
                    src={staff.avatar || getGenderDefaultAvatar(staff.gender)}
                  />
                  <SingleLine
                    width={80}
                    style={
                      props.className === 'dark'
                        ? { color: '#b8c2d4' }
                        : { color: '#646566' }
                    }
                  >
                    {staff.name}
                  </SingleLine>
                </StaffNode>
              ),
              name: staff.name || '',
              staff: true,
              key: staff.id,
            })) as (DataNode & { name: string })[] | undefined) || []
        ).concat(
          Array.isArray(i.children) ? appendDepartmentStaffs(i.children) : [],
        ),
      }
    })
  const treeList = useMemo(() => {
    if (!Array.isArray(departments) || !Array.isArray(staffList)) {
      return []
    }

    const treeNodeList = appendDepartmentStaffs(
      departments.filter(item => item.id !== user?.id),
    )
    if (searchValue) {
      return filterTreeNode(treeNodeList, searchValue)
    }
    return treeNodeList
  }, [props.value, departments, staffListAll, searchValue])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const isNeedTreeExpandRef = useRef(false)

  useEffect(() => {
    if (isNeedTreeExpandRef.current) {
      isNeedTreeExpandRef.current = false
      setExpandedKeys(getAllKeys(treeList))
    }
  }, [treeList, searchValue])

  const onDeleteClick = (id: string | number) => {
    const arr = props.value?.filter((i: any) => i !== id) || []
    props.onChange?.(arr)
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || ''
    setSearchValue(value)
    isNeedTreeExpandRef.current = true
  }

  const isSelectedAll =
    props.value!.length > 0 && props.value?.length === staffList.length
  const isAllIndeterminate = !isSelectedAll && !!props.value?.length

  const onTapSelectAll = (event: CheckboxChangeEvent) => {
    onBatchSelect(event.target.checked, staffList.map((i: any) => i.id) || [])
  }

  return (
    <Box className={props.className || ''}>
      <ChooseBox>
        <ChooseContent>
          <ChooseContentLeft>
            <InputSearch
              onChange={onChangeSearch}
              placeholder={t('staffSelect.searchContact')}
              suffix={<Icon style={{ color: '#BBBDBF' }} type="search" />}
            />
            {/* <SelectAll
              indeterminate={isAllIndeterminate}
              checked={isSelectedAll}
              onChange={onTapSelectAll}
            >
              {t('staffSelect.selectAll')}
            </SelectAll> */}
            <LeftSatff>
              <StyledTree
                treeData={treeList}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
              />
            </LeftSatff>
          </ChooseContentLeft>
          <ProviderWrap />
          <ChooseContentRight>
            <RightHeader>
              <span>
                {t('staffSelect.checked')} {props.value?.length || 0}/
                {staffList.length}
              </span>
              <span
                style={{ color: '#617EF2', cursor: 'pointer', fontSize: 14 }}
                onClick={() => props.onChange?.([])}
              >
                {t('staffSelect.clear')}
              </span>
            </RightHeader>
            <RightBox>
              {staffList
                .filter((i: any) => props.value?.includes(i.id as string))
                .map((i: any) => (
                  <RightItem key={i.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Avatar
                        size={24}
                        src={i.avatar || getGenderDefaultAvatar(i.gender)}
                        style={{ marginRight: 12 }}
                      />
                      <SingleLine width={140}>{i.name}</SingleLine>
                    </div>
                    <StyledCloseIcon
                      type="close01"
                      onClick={() => onDeleteClick(i.id)}
                    />
                  </RightItem>
                ))}
            </RightBox>
          </ChooseContentRight>
        </ChooseContent>
      </ChooseBox>
    </Box>
  )
}

export default StaffSelectTransfer

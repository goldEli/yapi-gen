import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreatDragging from './CreatDragging'
import { getProjectFieIds } from '@store/category/thunk'
import { useDispatch, useSelector } from '@store/index'
import ProjectDragging from './ProDragging'
import { setProjectFieIdsData } from '@store/category'
const CreateFieldWrap = styled.div`
  margin: 20px 0 0 20px;
  border-left: 1px solid var(--neutral-n6-d1);
  padding-left: 24px;
`
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 0 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const BottomTitleStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-n1-d1);
  margin: 0 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const BottomList = styled.div`
  margin-top: 24px;
`
const InputStyle = styled(Input)`
  border: none;
  width: 192px;
  height: 32px;
  background: var(--neutral-white-d4);
  border-radius: 6px;
  .ant-input {
    font-size: 14px;
  }
  .ant-input-prefix {
    margin-right: 10px;
  }
  padding: 0 12px;
  border-radius: 0;
  border-bottom: 1px solid var(--neutral-n6-d1);
  .ant-input-affix-wrapper {
    border: none;
  }
  .ant-input:focus {
    border: none;
  }
  &::placeholder {
    font-size: 14px;
  }
  input {
    background: 'var(--neutral-white-d4)';
  }
`

const CreateField = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchIcon, setSearchIcon] = useState(false)
  const [search, setSearch] = useState(false)
  const [createIcon, setCreateIcon] = useState(true)
  const {
    getCategoryConfigDataList,
    getCategoryConfigArray,
    getProjectFieIdsData,
  } = useSelector(store => store.category)
  const [dataList, setDataList] = useState<any>()
  const [searchDataList, setSearchDataList] = useState<any>()
  const { projectInfo } = useSelector(store => store.project)
  const [payloadDataList, setPayloadDataList] = useState<any>()
  const option = [
    {
      label: t('newlyAdd.lineText'),
      value: '1',
      type: 'text',
      icon: 'text-alone',
    },
    {
      label: t('newlyAdd.moreLineText'),
      value: '2',
      type: 'textarea',
      icon: 'text-more',
    },
    {
      label: t('newlyAdd.radioDropdown'),
      value: '3',
      type: 'select',
      icon: 'select-alone',
    },
    {
      label: t('newlyAdd.multiDropdown'),
      value: '4',
      type: 'select_checkbox',
      icon: 'select-more',
    },
    { label: t('newlyAdd.time'), value: '7', type: 'date', icon: 'calendar' },
    { label: t('newlyAdd.number'), value: '8', type: 'number', icon: 'number' },
    {
      label: t('version2.personRadio'),
      value: '9',
      type: 'user_select',
      icon: 'user-alone',
    },
    {
      label: t('version2.personCheckbox'),
      value: '10',
      type: 'user_select_checkbox',
      icon: 'user-more',
    },
    {
      label: '确认勾选',
      value: '11',
      type: 'single_checkbox',
      icon: 'check-circle',
    },
  ]

  // 两个数组的比较过滤
  const filterData = (confightList: any, payloadList: any) => {
    if (confightList?.length < 1 && payloadList?.length < 1) return
    const filterIds = confightList?.map((item: any) => item.storyId)
    setDataList(
      payloadList?.filter((item: any) => !filterIds?.includes(item.id)),
    )
    setSearchDataList(
      payloadList?.filter((item: any) => !filterIds?.includes(item.id)),
    )
  }
  // 请求api
  const getProjectFieIdsApi = async () => {
    if (!projectInfo.id) {
      return
    }
    const data = await dispatch(getProjectFieIds(projectInfo.id))
    const payloadList: any = data.payload
    dispatch(setProjectFieIdsData(payloadList))
    setPayloadDataList(payloadList)
    const confightList = getCategoryConfigDataList.configDataList
    filterData(confightList, payloadList)
  }
  useEffect(() => {
    getProjectFieIdsApi()
  }, [projectInfo.id])
  // 根据输入框过滤
  const onSearch = (value: string) => {
    setSearchDataList(dataList.filter((el: any) => el.title.includes(value)))
  }
  // 监听列表被删除时过滤
  useEffect(() => {
    filterData(getCategoryConfigArray, payloadDataList)
  }, [getCategoryConfigArray])
  return (
    <CreateFieldWrap>
      <TitleStyle onClick={() => setCreateIcon(!createIcon)}>
        <CommonIconFont
          type={createIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span style={{ marginLeft: '4px' }}>创建字段</span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--neutral-n3)',
            marginLeft: '8px',
          }}
        >
          将字段拖动左侧区域创建字段
        </span>
      </TitleStyle>
      {createIcon && <CreatDragging list={option} setList={[]} />}

      <BottomList>
        <BottomTitleStyle>
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setSearchIcon(!searchIcon)}
          >
            {searchDataList?.length >= 1 && (
              <CommonIconFont
                type={searchIcon ? 'down-icon' : 'right-icon'}
                size={14}
                color="var(--neutral-n3)"
              />
            )}
            <span style={{ marginLeft: '4px' }}>
              项目已有字段 ({payloadDataList?.length})
            </span>
          </div>
          {search ? (
            <InputStyle
              placeholder="请输入关键字"
              onInput={(e: any) => onSearch(e.target.value)}
              allowClear
              prefix={
                <CommonIconFont
                  type="search"
                  size={16}
                  color="var(--neutral-n2)"
                />
              }
            />
          ) : (
            <CommonIconFont
              type="search"
              size={16}
              color="var(--neutral-n2)"
              onClick={() => setSearch(true)}
            />
          )}
        </BottomTitleStyle>
        {searchIcon && (
          <ProjectDragging
            list={searchDataList}
            setList={setSearchDataList}
            onUpdate={() => getProjectFieIdsApi()}
          />
        )}
      </BottomList>
    </CreateFieldWrap>
  )
}
export default CreateField

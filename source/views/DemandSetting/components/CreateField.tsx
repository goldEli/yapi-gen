/* eslint-disable complexity */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreatDragging from './CreatDragging'
import * as services from '@/services'
import { useDispatch, useSelector } from '@store/index'
import ProjectDragging from './ProDragging'
import { setProjectFieIdsData } from '@store/category'

const CreateFieldWrap = styled.div`
  margin: 20px 0 0 0px;
  border-left: 1px solid var(--neutral-n6-d1);
  padding: 0 24px;
  overflow-y: auto;
  height: calc(100vh - 220px);
`
const TitleStyle = styled.div`
  width: 352px;
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
  width: 184px;
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
  const { getCategoryConfigArray } = useSelector(store => store.category)
  const [dataList, setDataList] = useState<any>()
  const [searchDataList, setSearchDataList] = useState<any>()
  const { projectInfo } = useSelector(store => store.project)
  const [payloadDataList, setPayloadDataList] = useState<any>()
  const [searchValue, setSearchValue] = useState('')
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
      label: t('confirm_that_it_is_checked'),
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
    const payloadList = await services.demand.getProjectFieIds(projectInfo.id)
    dispatch(setProjectFieIdsData(payloadList))
    setPayloadDataList(payloadList)
    getCategoryConfigArray.length >= 1 &&
      payloadList &&
      filterData(getCategoryConfigArray, payloadList)
  }
  // 根据输入框过滤
  const onSearch = (value: string) => {
    if (value) {
      setSearchDataList(dataList.filter((el: any) => el.title.includes(value)))
    } else {
      setSearchDataList(dataList)
      setSearch(false)
    }
    setSearchValue(value)
  }
  // 监听列表被删除时过滤
  useEffect(() => {
    projectInfo.id &&
      getCategoryConfigArray?.length >= 1 &&
      getProjectFieIdsApi()
  }, [getCategoryConfigArray])
  return (
    <CreateFieldWrap>
      <TitleStyle onClick={() => setCreateIcon(!createIcon)}>
        <CommonIconFont
          type={createIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span style={{ marginLeft: '4px' }}>{t('creating_fields')}</span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--neutral-n3)',
            marginLeft: '8px',
          }}
        >
          {t('drag_the_field_to_the_left_area_to_create_the_field')}
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
            <span
              style={{
                marginLeft: '4px',
                display: 'inline-block',
                width: search ? '111px' : '160px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {t('project_existing_fields')}
              {payloadDataList?.length >= 1 &&
                '(' + payloadDataList?.length + ')'}
            </span>
          </div>
          {search ? (
            <InputStyle
              width={184}
              placeholder={t('pleaseEnterASearchPhrase')}
              value={searchValue}
              onClick={() => setSearch(false)}
              onInput={(e: any) => onSearch(e.target.value)}
              prefix={
                <CommonIconFont
                  type="search"
                  size={16}
                  color="var(--neutral-n2)"
                />
              }
              suffix={
                <>
                  {searchValue && (
                    <CommonIconFont
                      type="close-circle-fill"
                      onClick={() => {
                        setSearchDataList(dataList)
                        setSearch(false)
                      }}
                      size={16}
                      color="var(--neutral-n4)"
                    />
                  )}
                </>
              }
            />
          ) : searchDataList?.length >= 1 ? (
            <CommonIconFont
              type="search"
              size={16}
              color="var(--neutral-n2)"
              onClick={() => {
                setSearch(true), setSearchValue('')
              }}
            />
          ) : (
            ''
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

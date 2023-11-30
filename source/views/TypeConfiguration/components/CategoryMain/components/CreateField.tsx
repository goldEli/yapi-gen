/* eslint-disable complexity */
/* eslint-disable no-constant-binary-expression */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Input, Select } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CreateDragging from './CreateDragging'
import * as services from '@/services'
import { useDispatch, useSelector } from '@store/index'
import ProjectDragging from './ProDragging'
import { setProjectFieIdsData } from '@store/category'
import { filterCategory } from '@/tools'
import { css } from '@emotion/css'
const SelectStyle = styled(Select)<{ isActive?: any }>({}, ({ isActive }) => ({
  '.ant-select-selection-placeholder,.ant-select-arrow': {
    color: isActive
      ? 'var(--primary-d2) !important'
      : 'var(--auxiliary-text-t2-d1)',
  },
  '&:hover': {
    '.ant-select-selection-placeholder,.ant-select-selection-item': {
      color: 'var(--primary-d2) !important',
    },
  },
  minWidth: '140px',
}))
const CreateFieldWrap = styled.div`
  margin: 20px 0 0 0px;
  border-left: 1px solid var(--neutral-n6-d1);
  padding: 0 24px;
  overflow-y: auto;
  height: calc(100vh - 240px);
  margin-bottom: 24px;
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
const FieldWrap = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  .ant-select-selection-placeholder {
    color: var(--auxiliary-text-t2-d1);
  }
  .ant-select-single.ant-select-open .ant-select-selection-item {
    color: var(--primary-d1);
  }
  .hoverStyle {
    &:hover {
      .ant-select-arrow {
        color: var(--primary-d1);
      }
    }
  }
  /* &:hover {
    .ant-select-arrow {
      color: var(--primary-d1);
    }
  } */
`
const DivideWrap = styled.div`
  width: 1px;
  height: 16px;
  background: var(--hover-d2);
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
const activity = css`
  color: var(--primary-d1) !important;
`
const DropdownRenderDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  div {
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 12px;
    width: 100%;
    cursor: pointer;
    justify-content: space-between;
    padding-right: 12px;
    box-sizing: border-box;
    color: var(--neutral-n2);
    &:hover {
      background: var(--hover-d3);
      color: var(--neutral-n1-d1);
    }
  }
`
const CreateField = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchIcon, setSearchIcon] = useState(true)
  const [search, setSearch] = useState(true)
  const [createIcon, setCreateIcon] = useState(true)
  const { getCategoryConfigArray, activeCategory, getProjectFieIdsData } =
    useSelector(store => store.category)
  const [dataList, setDataList] = useState<any>()
  const [searchDataList, setSearchDataList] = useState<any>()
  const { projectInfo } = useSelector(store => store.project)
  const [payloadDataList, setPayloadDataList] = useState<any>()
  const [searchValue, setSearchValue] = useState('')
  const [fieldType, setFieldType] = useState<any>(() => {
    return { is_customize: '', content: '' }
  })
  const [cacheSearchlist, setCacheSearchlist] = useState<any>()
  const [typeIsOpen, setTypeIsOpen] = useState(false)
  const [fieldIsOpen, setFieldIsOpen] = useState(false)
  const fieldRef = useRef<any>(null)
  const sysFieldRef = useRef<any>(null)
  const [fieldValue, setFieldValue] = useState('0')
  const [sysFieldValue, setSysFieldValue] = useState(0)
  const option = [
    {
      label: t('sprintProject.allTypes'),
      value: '0',
      type: '',
      icon: 'text-alone',
    },
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
    const data = payloadList?.filter(
      (item: any) => !filterIds?.includes(item.id),
    )
    setSearchDataList(filterCategory(activeCategory.work_type, data))
    setCacheSearchlist(
      payloadList?.filter((item: any) => !filterIds?.includes(item.id)),
    )
  }
  // 请求api
  const getProjectFieIdsApi = async () => {
    const payloadList = await services.demand.getProjectFieIds(projectInfo.id)
    dispatch(setProjectFieIdsData(payloadList))
    setPayloadDataList(payloadList)
    setDataList(payloadList)
  }
  // 根据输入框过滤
  const onSearch = (value: string) => {
    if (value) {
      setSearchDataList(dataList.filter((el: any) => el.title.includes(value)))
    } else {
      setSearchDataList(dataList)
    }
    setSearchValue(value)
  }
  // 监听列表被删除时过滤
  useEffect(() => {
    filterData(getCategoryConfigArray, getProjectFieIdsData)
  }, [getCategoryConfigArray, getProjectFieIdsData])
  useEffect(() => {
    getProjectFieIdsApi()
  }, [activeCategory])
  useEffect(() => {
    const ids = option.map(item => item.type)
    setSearchDataList(
      filterCategory(
        activeCategory?.work_type,
        cacheSearchlist,
        fieldType,
        ids,
      ),
    )
  }, [fieldType])
  return (
    <CreateFieldWrap draggable="false">
      <TitleStyle draggable="false" onClick={() => setCreateIcon(!createIcon)}>
        <CommonIconFont
          type={createIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span style={{ marginLeft: '4px', display: 'inline-block',minWidth:localStorage.getItem('language') === 'zh' ?'50px' :'90px', fontFamily: 'SiYuanMedium' }}>
          {t('creating_fields')}
        </span>
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
      {createIcon && <CreateDragging list={option} setList={[]} />}
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
                fontFamily: 'SiYuanMedium',
              }}
            >
              {t('project_existing_fields')}
              {payloadDataList?.length >= 1 &&
                '(' + payloadDataList?.length + ')'}
            </span>
          </div>
          {search && (
            <InputStyle
              width={184}
              placeholder={t('pleaseEnterASearchPhrase')}
              value={searchValue}
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
                        setSearchValue('')
                      }}
                      size={16}
                      color="var(--neutral-n4)"
                    />
                  )}
                </>
              }
            />
          )}
        </BottomTitleStyle>
        <FieldWrap>
          <SelectStyle
            style={{ width: 100 }}
            bordered={false}
            isActive={fieldIsOpen}
            onDropdownVisibleChange={e => setFieldIsOpen(e)}
            suffixIcon={
              <CommonIconFont type={fieldIsOpen ? 'up' : 'down'} size={16} />
            }
            className="hoverStyle"
            placeholder={t('sprintProject.allFields')}
            options={[
              {
                value: 0,
                label: t('sprintProject.allFields'),
              },
              {
                value: 2,
                label: t('sprintProject.systemField'),
              },
              {
                value: 1,
                label: t('sprintProject.customField'),
              },
            ]}
            onChange={e => {
              setFieldType((p: any) => {
                return { ...p, is_customize: e }
              })
            }}
            dropdownRender={() => (
              <DropdownRenderDiv>
                {[
                  {
                    value: 0,
                    label: t('sprintProject.allFields'),
                  },
                  {
                    value: 2,
                    label: t('sprintProject.systemField'),
                  },
                  {
                    value: 1,
                    label: t('sprintProject.customField'),
                  },
                ].map(item => (
                  <div
                    key={item.value}
                    onClick={() => {
                      setFieldType((p: any) => {
                        return { ...p, is_customize: item.value }
                      })
                      setSysFieldValue(item.value)
                      if (!sysFieldRef.current) {
                        return
                      }
                      sysFieldRef?.current?.blur()
                    }}
                  >
                    <span
                      className={sysFieldValue === item.value ? activity : ''}
                    >
                      {item.label}
                    </span>
                    {sysFieldValue === item.value && (
                      <CommonIconFont
                        type="check"
                        size={16}
                        color={
                          sysFieldValue === item.value
                            ? 'var(--primary-d1)'
                            : ''
                        }
                      />
                    )}
                  </div>
                ))}
              </DropdownRenderDiv>
            )}
            value={sysFieldValue}
            ref={sysFieldRef}
          />
          <DivideWrap></DivideWrap>
          <SelectStyle
            style={{ width: 100 }}
            bordered={false}
            className="hoverStyle"
            isActive={typeIsOpen}
            placeholder={t('sprintProject.allTypes')}
            onDropdownVisibleChange={e => setTypeIsOpen(e)}
            suffixIcon={
              <CommonIconFont type={typeIsOpen ? 'up' : 'down'} size={16} />
            }
            options={option}
            onChange={e => {
              setFieldType((p: any) => {
                return {
                  ...p,
                  content: option.find(item => item.value === e)?.type,
                }
              })
            }}
            ref={fieldRef}
            dropdownRender={() => (
              <DropdownRenderDiv>
                {option.map(item => (
                  <div
                    key={item.value}
                    onClick={() => {
                      setFieldType((p: any) => {
                        return {
                          ...p,
                          content: option.find(e => e.value === item.value)
                            ?.type,
                        }
                      })
                      setFieldValue(item.value)
                      if (!fieldRef.current) {
                        return
                      }
                      fieldRef?.current?.blur()
                    }}
                  >
                    <span className={fieldValue === item.value ? activity : ''}>
                      {item.label}
                    </span>
                    {fieldValue === item.value && (
                      <CommonIconFont
                        type="check"
                        size={16}
                        color={
                          fieldValue === item.value ? 'var(--primary-d1)' : ''
                        }
                      />
                    )}
                  </div>
                ))}
              </DropdownRenderDiv>
            )}
            value={fieldValue}
          />
        </FieldWrap>
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

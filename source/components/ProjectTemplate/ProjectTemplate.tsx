/* eslint-disable no-undefined */
/* eslint-disable react/jsx-handler-names */
import React, { useEffect, useRef, useState } from 'react'
import { Small, Title, Title2 } from './style'
import pt1 from '/pt1.png'
import pt2 from '/pt2.png'
import pt3 from '/pt3.png'
import { t } from 'i18next'
import CommonModal from '../CommonModal'
import MainTable from '../MainTable/MainTable'
import { getProjectList } from '@/services/project'
import MainTable2 from '../MainTable/MainTable2'
import { TabsItem } from '../StyleCommon'
import { useTranslation } from 'react-i18next'

const ProjectTemplate = (props: any) => {
  console.log(props.searchId)
  const [t] = useTranslation()
  const arr = [
    {
      id: 1,
      name: t('software_development'),
      img: pt3,
      text: '',
      tags: [
        {
          name: t('not_started'),
          color: 'var(--function-success)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: t('in_progress'),
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: t('completed'),
          color: 'var(--neutral-n7)',
          t_color: 'var(--neutral-n1-d1)',
        },
      ],
    },
    {
      id: 2,
      name: t('game_design'),
      img: pt2,
      text: '',
      tags: [
        {
          name: t('requirement_design'),
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: t('art'),
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: t('original_artwork'),
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: '...',
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
      ],
    },
    {
      id: 3,
      name: t('import_existing_project'),
      img: pt1,
      text: t('import_description'),
      tags: [],
    },
  ]
  const [projectList, setProjectList] = useState<any>({
    list: undefined,
  })
  const ids = useRef(null)
  const [activeTab, setActiveTab] = useState<any>(1)
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const [searchVal, setSearchVal] = useState('')
  const [activeType, setActiveType] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [visibleEdit, setVisibleEdit] = useState(false)
  const choose = (id: any) => {
    if (id === 3) {
      setVisibleEdit(true)
    } else {
      props.choose(id)
    }
  }
  const getList = async (
    active: number,
    isTable: boolean,
    isDisable: boolean,
    val: string,
    sortVal: any,
    pageVal: any,
  ) => {
    setIsSpinning(true)
    const params: any = {
      project_type: props.searchId,
      searchValue: val,
      orderKey: sortVal.key,
      order: sortVal.value,
      status: isDisable ? 1 : 0,
      is_my_created: activeTab,
      self: activeTab === 2,
    }
    if (isTable) {
      params.all = true
    }
    if (!isTable) {
      params.page = pageVal.page
      params.pageSize = pageVal.size
    }

    const result = await getProjectList(params)
    setProjectList(result)
    setIsSpinning(false)
  }
  const onClose = () => {
    setVisibleEdit(false)
  }
  const onsubmit = () => {
    props.getIdS(ids.current)
    setVisibleEdit(false)
    props.choose(3)
  }
  const onChangePageNavigation = (item: any) => {
    setPageObj({
      page: item.page,
      size: item.size,
    })
  }
  const onUpdateOrderKey = (item: any) => {
    setOrder(item)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }
  const onChangeTab = (t: any) => {
    setActiveTab(t)
  }

  const sendKey = (item: any) => {
    ids.current = item
  }

  useEffect(() => {
    getList(activeType, false, isHidden, searchVal, order, pageObj)
  }, [pageObj, order, props.searchId, activeTab])
  return (
    <div style={{ width: '1000px' }}>
      <Title
        style={{
          fontFamily: 'SiYuanMedium',
        }}
      >
        {t('select_project_template2')}
      </Title>
      <Title2>{t('template_description')}</Title2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '64px',
          marginTop: '40px',
        }}
      >
        {arr.map((i: any) => (
          <Small onClick={() => choose(i.id)} key={i.id}>
            <img
              style={{
                display: 'block',
                width: '100%',
              }}
              src={i.img}
              alt=""
            />
            <div
              style={{
                height: '22px',
                fontSize: '14px',
                color: 'var(--neutral-n1-d1)',
                lineHeight: ' 22px',
                margin: '16px 16px 8px 16px',
                fontFamily: 'SiYuanMedium',
              }}
            >
              {i.name}
            </div>
            <div
              style={{
                margin: '16px 16px 8px 16px',
              }}
            >
              <div
                style={{
                  height: i.text ? '40px' : '0px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'var(--neutral-n2)',
                  lineHeight: '20px',
                }}
              >
                {i.text}
              </div>
              {i.tags.map((j: any) => (
                <span
                  style={{
                    padding: '1px 8px',
                    marginRight: '16px',
                    borderRadius: '6px',
                    color: j.t_color,
                    backgroundColor: j.color,
                  }}
                  key={j.name}
                >
                  {j.name}
                </span>
              ))}
            </div>
          </Small>
        ))}
      </div>
      <CommonModal
        width={784}
        title={t('import_existing_project')}
        isVisible={visibleEdit}
        onClose={onClose}
        onConfirm={onsubmit}
        confirmText={t('common.confirm2')}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            padding: '0 24px',
          }}
        >
          <TabsItem isActive={activeTab === 1} onClick={() => onChangeTab(1)}>
            <div>{t('my_created_projects')}</div>
          </TabsItem>
          <TabsItem isActive={activeTab === 2} onClick={() => onChangeTab(2)}>
            <div>{t('my_joined_projects')}</div>
          </TabsItem>
        </div>
        <MainTable2
          sendKey={sendKey}
          onChangePageNavigation={onChangePageNavigation}
          order={order}
          onUpdateOrderKey={onUpdateOrderKey}
          hasFilter={searchVal.length > 0 || isHidden}
          projectList={projectList}
        />
      </CommonModal>
    </div>
  )
}

export default ProjectTemplate

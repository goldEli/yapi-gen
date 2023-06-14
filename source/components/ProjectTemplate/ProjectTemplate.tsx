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

const ProjectTemplate = (props: any) => {
  console.log(props.searchId)

  const arr = [
    {
      id: 1,
      name: '软件开发',
      img: pt3,
      text: '',
      tags: [
        {
          name: '未开始',
          color: 'var(--function-success)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: '进行中',
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: '已完成',
          color: 'var(--neutral-n7)',
          t_color: 'var(--neutral-n1-d1)',
        },
      ],
    },
    {
      id: 2,
      name: '游戏设计',
      img: pt2,
      text: '',
      tags: [
        {
          name: '需求设计',
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: '美术',
          color: 'var(--primary-d2)',
          t_color: 'var(--neutral-white-d1)',
        },
        {
          name: '原画',
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
      name: '已有项目导入',
      img: pt1,
      text: '可以从已有的项目里导入现有工作流和项目成员，在新的项目里也可以随时修改它。',
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
      <Title>选择项目模版</Title>
      <Title2>
        我们帮您预制了一些工作流程，希望能减少您的工作，当然今后也可以随时改变它
      </Title2>
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
        title={t('new_p1.a4')}
        isVisible={visibleEdit}
        onClose={onClose}
        onConfirm={onsubmit}
        confirmText={t('newlyAdd.submit')}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            padding: '0 24px',
          }}
        >
          <TabsItem isActive={activeTab === 1} onClick={() => onChangeTab(1)}>
            <div>我创建的项目</div>
          </TabsItem>
          <TabsItem isActive={activeTab === 2} onClick={() => onChangeTab(2)}>
            <div>我加入的项目</div>
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

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
// 切换公司弹窗

import { useEffect, useState } from 'react'
import { Space } from 'antd'
import CompanyCard from '@/views/Container/components/CompanyCard'
import { useTranslation } from 'react-i18next'
import CommonModal from './CommonModal'
import { useSelector } from '@store/index'
import { getCompanyList, updateCompany } from '@/services/user'
import { useNavigate } from 'react-router-dom'

interface Props {
  onChangeState(): void
  visible: boolean
}

const CompanyModal = (props: Props) => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const [companyList, setCompanyList] = useState<any[]>([])
  const [activeId, setActiveId] = useState('')
  const [companyParams, setCompanyParams] = useState({
    companyId: '',
    companyUserId: '',
  })

  const jump = () => {
    const jumpList = [
      {
        name: '概况',
        path: '/Situation',
      },
      {
        name: '项目',
        path: '/Project',
      },
      {
        name: '我的',
        path: '/mine',
      },
      {
        name: '员工',
        path: '/staff',
      },
      {
        name: '消息',
        path: '/Situation',
      },

      {
        name: '公司管理',
        path: '/Setting',
      },
      {
        name: '日志',
        path: '/Situation',
      },
    ]
    const { company_permissions } = userInfo
    const routerMap = Array.from(
      new Set(company_permissions?.map((i: any) => i.group_name)),
    )
    if (routerMap.length >= 1) {
      routerMap.concat('日志')

      for (let i = 0; i <= jumpList.length; i++) {
        if (routerMap?.includes(jumpList[i].name)) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate(jumpList[i].path)
          break
        }
      }
    }
  }

  // 初始化获取公司信息
  const init = async () => {
    const res2 = await getCompanyList()
    setActiveId(userInfo.company_id)
    setCompanyList(res2.data)
  }

  useEffect(() => {
    if (props.visible) {
      init()
    }
  }, [props.visible])

  // 切换公司
  const cutCompany = (value: any) => {
    setActiveId(value.id)
    setCompanyParams({
      companyId: value.id,
      companyUserId: value.companyUserId,
    })
  }

  // 确认按钮
  const confirm = async () => {
    if (activeId === userInfo.company_id) {
      return
    }
    try {
      await updateCompany(companyParams)
      sessionStorage.removeItem('saveRouter')
      props.onChangeState()
      jump()
      location.reload()
    } catch (error) {
      //
    }
  }

  return (
    <CommonModal
      isVisible={props.visible}
      title={t('components.changeCompany')}
      onClose={props.onChangeState}
      onConfirm={confirm}
      width={750}
    >
      <Space
        size={16}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          maxHeight: 600,
          overflow: 'auto',
        }}
      >
        {companyList.map(i => (
          <CompanyCard
            logo={i.logo}
            name={i.name}
            key={i.id}
            tap={() => cutCompany(i)}
            isShow={i.id === activeId}
          />
        ))}
      </Space>
    </CommonModal>
  )
}

export default CompanyModal

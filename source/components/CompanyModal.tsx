// 切换公司弹窗

import { useEffect, useState } from 'react'
import { Space } from 'antd'
import CompanyCard from '@/views/Container/components/CompanyCard'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import CommonModal from './CommonModal'

interface Props {
  onChangeState(): void
  visible: boolean
}

const CompanyModal = (props: Props) => {
  const [t] = useTranslation()
  const { getCompanyList, updateCompany, userInfo } = useModel('user')
  const [companyList, setCompanyList] = useState<any[]>([])
  const [activeId, setActiveId] = useState('')
  const [companyParams, setCompanyParams] = useState({
    companyId: '',
    companyUserId: '',
  })

  const init = async () => {
    const res2 = await getCompanyList()
    setActiveId(userInfo.company_id)
    setCompanyList(res2.data)
  }
  useEffect(() => {
    init()
  }, [userInfo])

  const cutCompany = (value: any) => {
    setActiveId(value.id)
    setCompanyParams({
      companyId: value.id,
      companyUserId: value.companyUserId,
    })
  }
  const confirm = async () => {
    if (activeId === userInfo.company_id) {
      return
    }
    try {
      await updateCompany(companyParams)
      sessionStorage.removeItem('saveRouter')
      props.onChangeState()
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
            show={i.id === activeId}
          />
        ))}
      </Space>
    </CommonModal>
  )
}

export default CompanyModal

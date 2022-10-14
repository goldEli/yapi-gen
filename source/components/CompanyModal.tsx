import { useEffect, useState } from 'react'
import { Modal, Space } from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CompanyCard from '@/views/Container/components/CompanyCard'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

interface Props {
  onChangeState(): void
  visible: boolean
}

const ContentWrap = styled.div({
  boxSizing: 'border-box',
  padding: '10px',
  maxHeight: 400,
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'start',
  gap: '16px',
})

const FooterWrap = styled(Space)({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: 16,
})

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  const cutCompany = (value: any) => {
    setActiveId(value.id)
    setCompanyParams({
      companyId: value.id,
      companyUserId: value.companyUserId,
    })
  }
  const confirm = async () => {
    sessionStorage.removeItem('saveRouter')
    props.onChangeState()
    if (activeId === userInfo.company_id) {
      return
    }
    const res = await updateCompany(companyParams)

    if (res.data.code === 0) {
      location.reload()
    }
  }
  return (
    <Modal
      visible={props.visible}
      width={750}
      title={t('components.changeCompany')}
      onCancel={props.onChangeState}
      footer={false}
      bodyStyle={{ padding: 16 }}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
    >
      <ContentWrap>
        {companyList.map(i => (
          <CompanyCard
            logo={i.logo}
            name={i.name}
            key={i.id}
            tap={() => cutCompany(i)}
            show={i.id === activeId}
          />
        ))}
      </ContentWrap>
      <FooterWrap size={16}>
        <Button onClick={props.onChangeState}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={confirm}>
          {t('common.confirm')}
        </Button>
      </FooterWrap>
    </Modal>
  )
}

export default CompanyModal

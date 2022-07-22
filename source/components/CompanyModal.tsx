import { useEffect, useState } from 'react'
import { Modal, Space } from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CompanyCard from '@/views/Container/components/CompanyCard'
import { useModel } from '@/models'

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
  const { getCompanyList } = useModel('user')
  const [companyList, setCompanyList] = useState<any[]>([])

  const init = async () => {
    const res = await getCompanyList()

    setCompanyList(res.data)
  }
  useEffect(() => {
    init()
  }, [])

  const [activeIdx, setActiveIdx] = useState(0)
  return (
    <Modal
      visible={props.visible}
      width={750}
      title="公司切换"
      onCancel={props.onChangeState}
      footer={false}
      bodyStyle={{ padding: 16 }}
    >
      <ContentWrap>
        {companyList.map((i, index) => (
          <CompanyCard
            logo={i.logo}
            name={i.name}
            key={i.id}
            tap={() => setActiveIdx(index)}
            show={index === activeIdx}
          />
        ))}
      </ContentWrap>
      <FooterWrap size={16}>
        <Button type="primary" onClick={props.onChangeState}>
          确定
        </Button>
        <Button onClick={props.onChangeState}>取消</Button>
      </FooterWrap>
    </Modal>
  )
}

export default CompanyModal

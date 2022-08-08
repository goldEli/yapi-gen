import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import Project from './components/Project'
import { Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import CompanyModal from '@/components/CompanyModal'
import Staff from './components/Staff'
import Need from './components/Need'
import Iteration from './components/Iteration'
import { useModel } from '@/models'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

const buttonCss = css``
const PanelHeaderSecond = styled.div`
  // width: 160px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  display: flex;
`
const Wrap = styled.div`
  box-sizing: border-box;
  padding: 16px;
  background-color: #f5f7fa;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 16px;
`
const Head = styled.div`
  height: 64px;
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`

const Situation = () => {
  const [t] = useTranslation()
  const { getGlobalGeneral, userInfo } = useModel('user')
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
  const [generalData, setGeneralData] = useState<any>()
  const init = async () => {
    const res = await getGlobalGeneral()

    setGeneralData(res)
  }
  useEffect(() => {
    init()
  }, [])

  if (generalData) {
    return (
      <div>
        <Head>
          <span>{t('situation.companySurvey')}</span>
          <PanelHeaderSecond>
            <div>{userInfo?.company_name}</div>
            <Tooltip placement="top" title={t('container.changeCompany')}>
              <div
                onClick={() => setCompanyModalVisible(true)}
                className={buttonCss}
              >
                <IconFont
                  type="swap"
                  style={{ cursor: 'pointer', fontSize: 14, marginLeft: 8 }}
                />
              </div>
            </Tooltip>
          </PanelHeaderSecond>
        </Head>
        <PermissionWrap
          auth="b/company/statistics"
          hasWidth
          permission={userInfo?.company_permissions}
        >
          <Wrap>
            <Project data={generalData?.project} />
            <Staff data={generalData?.user} />
            <Need data={generalData?.need} />
            <Iteration data={generalData?.iterate} />
          </Wrap>
        </PermissionWrap>

        <CompanyModal
          visible={companyModalVisible}
          onChangeState={() => setCompanyModalVisible(!companyModalVisible)}
        />
      </div>
    )
  }
  return <Loading />
}

export default Situation

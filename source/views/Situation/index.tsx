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
import { getIsPermission } from '@/tools'

const buttonCss = css``
const PanelHeaderSecond = styled.div`
  width: 160px;
  display: flex;
  justify-content: space-between;
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
  const { getGlobalGeneral, getUserDetail } = useModel('user')
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>({})
  const [generalData, setGeneralData] = useState<any>()
  const init = async () => {
    const res1 = await getUserDetail()

    setUserData(res1)
    const res = await getGlobalGeneral()

    setGeneralData(res)
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <Head>
        <span>公司概况</span>
        <PanelHeaderSecond>
          <div>{userData?.company_name}</div>
          <Tooltip placement="top" title="切换企业">
            <div
              onClick={() => setCompanyModalVisible(true)}
              className={buttonCss}
            >
              <IconFont
                type="swap"
                style={{ cursor: 'pointer', fontSize: 14 }}
              />
            </div>
          </Tooltip>
        </PanelHeaderSecond>
      </Head>
      <PermissionWrap
        auth={getIsPermission(
          userData?.company_permissions,
          'b/company/statistics',
        )}
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

export default Situation

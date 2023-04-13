/* eslint-disable-next-line @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import InputSearch from './SearchSelect'
import SupplementaryIntercourseModal from './SupplementaryIntercourse'
import HandleReport from '@/views/WorkReport/Review/components/HandleReport'
import styled from '@emotion/styled'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Bgc from './img/bgc.png'
import { writeReport, templateLatelyList } from '@/services/report'
import { message } from 'antd'
import moment from 'moment'

interface Props {
  isVisible: boolean
  onClose(): void
  onConfirm(): void
  title: string
}
const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
`
const BtnRow = styled.div`
  display: flex;
`
const MainWrap = styled.div`
  margin-top: 24px;
`
const TitleWrap = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  font-family: siyuanmedium;
  margin-bottom: 8px;
`
const WrapBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const CarWrap = styled.div<{ disabled?: boolean }>`
  position: relative;
  width: 156px;
  height: 206px;
  background: var(--neutral-white-d5);
  border: 1px solid var(--neutral-n6-d2);
  border-radius: 6px 6px 6px 6px;
  box-sizing: border-box;
  transition: all 0.3s;
  margin-left: 24px;
  margin-bottom: 8px;
  &:hover {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    box-shadow: 0px 0px 10px 0px rgba(9, 9, 9, 0.09);
  }
  img {
    width: 156px;
    height: 206px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
`
const CarItem = styled.div`
  padding: 24px 16px;
  width: 156px;
  height: 206px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
`
const ColWrap = styled.div`
  width: auto;
  height: auto;
`
const TimeText = styled.div`
  width: 156px;
  margin-left: 24px;
  margin: 0px 0 24px 24px;
  color: var(--neutral-n2);
  font-size: 12px;
`
const CarTitle = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  font-family: siyuanmedium;
`
const FormWrap = styled.div`
  margin-top: 24px;
  div:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: 12px;
    margin-bottom: 4px;
  }
  div:nth-child(2) {
    color: var(--neutral-n4);
    font-size: 12px;
  }
`

const WriteReport = (props: Props) => {
  const navigate = useNavigate()
  const [visibleMakeUp, setVisibleMakeUp] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [templateId, setTemplateId] = useState()
  const [dataList, setDataList] = useState<any>({})
  const [t] = useTranslation()

  const getTemplateLatelyList = async () => {
    const result = await templateLatelyList()
    if (result && result.data) {
      setDataList(result.data)
    }
  }

  useEffect(() => {
    getTemplateLatelyList()
  }, [])

  const getContentHtml = (name: string, type: number): React.ReactElement => {
    switch (type) {
      case 1:
        return (
          <>
            <div>{name}</div>
            <div>{t('report.list.select')}</div>
          </>
        )
      case 2:
        return (
          <>
            <div>{name}</div>
            <div>{t('report.list.upload')}</div>
          </>
        )
      case 3:
        return (
          <>
            <div>{name}</div>
            <div>{t('report.list.write')}</div>
          </>
        )
      case 4:
        return (
          <>
            <div>{name}</div>
            <div>{t('report.list.correlation')}</div>
          </>
        )
      default:
        return (
          <>
            <div>{name}</div>
            <div>{t('report.list.write')}</div>
          </>
        )
    }
  }
  return (
    <>
      <CommonModal
        width={784}
        title={props.title}
        isVisible={props.isVisible}
        onClose={props.onClose}
        hasFooter
      >
        <div
          style={{
            height: 'calc(90vh - 136px)',
            overflow: 'scroll',
            padding: ' 0 24px',
          }}
        >
          <HeaderWrap>
            <BtnRow>
              <CommonButton
                type="light"
                onClick={() => navigate('/Report/Formwork')}
              >
                {t('report.list.createTemplate')}
              </CommonButton>
              <CommonButton
                style={{ marginLeft: 16 }}
                type="light"
                onClick={() => {
                  props.onClose()
                  setVisibleMakeUp(true)
                }}
              >
                {t('report.list.fillReport')}
              </CommonButton>
            </BtnRow>
            <InputSearch
              leftIcon
              placeholder={t('report.list.searchReport')}
              width={184}
              onChange={(id: any) => {
                setTemplateId(id)
                setVisibleEdit(true)
              }}
              options={[]
                .concat(dataList?.usedTemplate || [])
                .concat(dataList?.otherTemplate || [])
                .filter(
                  (k: any) =>
                    !(k.submit_cycle === 1 && k.is_current_cycle_used),
                )
                .map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
            />
          </HeaderWrap>
          <MainWrap>
            <TitleWrap>{t('report.list.recent')}</TitleWrap>
            <WrapBox>
              {dataList?.usedTemplate?.map((item: any) => (
                <ColWrap key={item.id}>
                  <CarWrap
                    disabled={
                      !!(
                        item.is_current_cycle_used && item.is_cycle_limit === 1
                      )
                    }
                    onClick={() => {
                      if (
                        !(
                          item.is_current_cycle_used &&
                          item.is_cycle_limit === 1
                        )
                      ) {
                        setTemplateId(item.id)
                        setVisibleEdit(true)
                      }
                    }}
                  >
                    <img src={Bgc} />
                    <CarItem>
                      <CarTitle>工作{item.name}</CarTitle>
                      {item.template_content_configs
                        ?.filter((tcc: any, i: number) => i < 2)
                        .map((content: any) => (
                          <FormWrap key={content.id}>
                            {getContentHtml(content.name, content.type)}
                          </FormWrap>
                        ))}
                    </CarItem>
                  </CarWrap>
                  {item.used_created_at ? (
                    <TimeText>
                      {moment(item.used_created_at).format('M月D日')}
                      {t('report.list.haveSubmit')}
                    </TimeText>
                  ) : null}
                </ColWrap>
              ))}
            </WrapBox>
            {dataList?.otherTemplate?.length ? (
              <>
                <TitleWrap>{t('report.list.other')}</TitleWrap>
                <WrapBox>
                  {dataList.otherTemplate.map((item: any) => (
                    <ColWrap key={item.id}>
                      <CarWrap
                        disabled={
                          !!(
                            item.is_current_cycle_used &&
                            item.is_cycle_limit === 1
                          )
                        }
                        onClick={() => {
                          if (
                            !(
                              item.is_current_cycle_used &&
                              item.is_cycle_limit === 1
                            )
                          ) {
                            setTemplateId(item.id)
                            setVisibleEdit(true)
                          }
                        }}
                      >
                        <img src={Bgc} />
                        <CarItem>
                          <CarTitle>工作{item.name}</CarTitle>
                          {item.template_content_configs
                            ?.filter((tcc: any, i: number) => i < 2)
                            .map((content: any) => (
                              <FormWrap key={content.id}>
                                {getContentHtml(content.name, content.type)}
                              </FormWrap>
                            ))}
                        </CarItem>
                      </CarWrap>
                      {item.used_created_at ? (
                        <TimeText>{item.used_created_at}已提交</TimeText>
                      ) : null}
                    </ColWrap>
                  ))}
                </WrapBox>
              </>
            ) : null}
          </MainWrap>
        </div>
      </CommonModal>
      <SupplementaryIntercourseModal
        isVisible={visibleMakeUp}
        onClose={() => setVisibleMakeUp(false)}
        onConfirm={function (): void {
          throw new Error('Function not implemented.')
        }}
        title="补交汇报"
      />
      <HandleReport
        templateId={templateId}
        visibleEdit={visibleEdit}
        editClose={() => setVisibleEdit(false)}
        visibleEditText="写汇报"
      />
    </>
  )
}

export default WriteReport

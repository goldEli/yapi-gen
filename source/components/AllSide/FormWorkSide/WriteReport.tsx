/* eslint-disable-next-line @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import InputSearch from '@/components/InputSearch'
import SupplementaryIntercourseModal from './SupplementaryIntercourse'
import HandleReport from '@/views/WorkReport/Review/components/HandleReport'
import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bgc from './img/bgc.png'
import { writeReport } from '@/services/report'

interface Props {
  isVisible: boolean
  onClose(): void
  onConfirm(): void
  title: string
}
const HeaderWrap = styled.div`
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
`
const BtnRow = styled.div`
  display: flex;
`
const SelectStyle = styled(CustomSelect)``
const MainWrap = styled.div`
  padding: 0 24px;
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
    cursor: ${props => (props.disabled ? 'not-allowed' : 'inherit')};
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
  const [searchVal, setSearchVal] = useState('')
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [visibleMakeUp, setVisibleMakeUp] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editId, setEditId] = useState()
  const [dataList, setDataList] = useState<any>({})
  const getContentHtml = (name: string, type: number): React.ReactElement => {
    switch (type) {
      case 1:
        return (
          <>
            <div>{name}</div>
            <div>请选择</div>
          </>
        )
      case 2:
        return (
          <>
            <div>{name}</div>
            <div>请上传</div>
          </>
        )
      case 3:
        return (
          <>
            <div>{name}</div>
            <div>请填写</div>
          </>
        )
      case 4:
        return (
          <>
            <div>{name}</div>
            <div>请关联</div>
          </>
        )
      default:
        return (
          <>
            <div>{name}</div>
            <div>请填写</div>
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
        <HeaderWrap>
          <BtnRow>
            <CommonButton
              type="light"
              onClick={() => navigate('/Report/Formwork')}
            >
              创建模板
            </CommonButton>
            <CommonButton
              style={{ marginLeft: 16 }}
              type="light"
              onClick={() => setVisibleMakeUp(true)}
            >
              补交汇报
            </CommonButton>
          </BtnRow>
          <InputSearch
            leftIcon
            placeholder="搜索汇报标题或内容"
            width={184}
            autoFocus
            onChangeSearch={setSearchVal}
            ref={inputRefDom as any}
          />
        </HeaderWrap>
        <MainWrap>
          <TitleWrap>最近使用</TitleWrap>
          {dataList?.usedTemplate?.map((item: any) => (
            <WrapBox key={item.id}>
              <ColWrap>
                <CarWrap
                  disabled={!!(item.is_user_used && item.is_cycle_limit)}
                  onClick={() => {
                    if (!(item.is_user_used && item.is_cycle_limit)) {
                      setEditId(item.id)
                      setVisibleEdit(true)
                    }
                  }}
                >
                  <img src={Bgc} />
                  <CarItem>
                    <CarTitle>工作{item.name}</CarTitle>
                    {item.template_content_configs
                      ?.filter((t: any, i: number) => i < 2)
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
            </WrapBox>
          ))}
        </MainWrap>
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
        editId={editId}
        visibleEdit={visibleEdit}
        editClose={() => setVisibleEdit(false)}
        visibleEditText="写汇报"
        editConfirm={async (params: any) => {
          let users: any[] = []
          const data: any[] = []
          Object.keys(params).forEach((key: string) => {
            const tempArr = key.split('_')
            if (tempArr[0] === '1') {
              users = params[key]
            } else if (tempArr[0] === '3') {
              data.push({
                conf_id: Number(tempArr[1]),
                content: params[key],
              })
            } else {
              data.push({
                conf_id: Number(tempArr[1]),
                content: params[key] || [],
              })
            }
          })
          writeReport({
            report_template_id: editId,
            data,
            target_users: users,
          })
          console.log(params, editId)
        }}
      />
    </>
  )
}

export default WriteReport

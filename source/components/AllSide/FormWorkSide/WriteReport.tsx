import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import InputSearch from '@/components/InputSearch'
import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bgc from './img/bgc.png'
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
const CarWrap = styled.div`
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
    cursor: pointer;
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

  return (
    <CommonModal
      width={784}
      title={props.title}
      isVisible={props.isVisible}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
      confirmText=""
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
            onClick={() => 123}
          >
            补交汇报
          </CommonButton>
        </BtnRow>
        <InputSearch
          leftIcon={true}
          placeholder={'搜索汇报标题或内容'}
          width={184}
          autoFocus
          onChangeSearch={setSearchVal}
          ref={inputRefDom as any}
        />
      </HeaderWrap>
      <MainWrap>
        <TitleWrap>最近使用</TitleWrap>
        <WrapBox>
          <ColWrap>
            <CarWrap>
              <img src={Bgc} />
              <CarItem>
                <CarTitle>工作日报</CarTitle>
                {/* 只展示两个 */}
                <FormWrap>
                  <div>今日完成</div>
                  <div>请填写</div>
                </FormWrap>
                <FormWrap>
                  <div>明日完成</div>
                  <div>请填写</div>
                </FormWrap>
              </CarItem>
            </CarWrap>
            <TimeText>3月2日已提交</TimeText>
          </ColWrap>
        </WrapBox>
      </MainWrap>
    </CommonModal>
  )
}
export default WriteReport

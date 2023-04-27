import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { supplyList } from '@/services/report'
import NoData from '@/components/NoData'
import HandleReport from '@/views/WorkReport/Review/components/HandleReport'
import { useTranslation } from 'react-i18next'

interface Props {
  isVisible: boolean
  onClose(): void
  title: string
}
const ItemList = styled.div`
  margin: 0 auto;
  width: 592px;
  height: 64px;
  background-color: var(--neutral-white-d5);
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--neutral-n6-d2);
  padding: 0 12px;
  border-radius: 6px;
  align-items: center;
  margin-bottom: 16px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
const Btn = styled.div`
  min-width: 60px;
  height: 32px;
  border-radius: 6px;
  text-align: center;
  line-height: 32px;
  color: var(--neutral-n2);
  font-size: 14px;
  background-color: var(--hover-d2);
`
const Text = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`

const SupplementaryIntercourse = (props: Props) => {
  const [list, setList] = useState<any[]>([])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [templateObj, setTemplateObj] = useState<any>({})
  const [t] = useTranslation()

  const getSupplyList = async () => {
    setList([])
    const result = await supplyList()
    if (result && result.code === 0) {
      const temp: any = []
      Object.keys(result.data).forEach((key: any) => {
        const arr = result.data[key]?.supply_date?.map(
          (item: any, index: number) => {
            return {
              ...result.data[key],
              date: item,
              key: key + String(Date.now()) + index,
            }
          },
        )
        temp.push(...arr)
      })
      setList(temp)
    }
  }
  useEffect(() => {
    if (props?.isVisible) {
      getSupplyList()
    }
  }, [props?.isVisible])

  return (
    <CommonModal
      width={640}
      title={props.title}
      isVisible={props.isVisible}
      onClose={props.onClose}
      hasFooter
    >
      <div
        style={{
          height: 'calc(80vh - 136px)',
          overflow: 'scroll',
          padding: ' 0 24px',
        }}
      >
        {list?.length ? (
          list.map(item => (
            <ItemList key={item.key}>
              <Text>{`${
                item.submit_cycle === 4 ? '--' : item.date?.join('~')
              } ${item.name} ${t('report.list.noSubmitted')}`}</Text>
              <Btn
                onClick={() => {
                  setVisibleEdit(true)
                  setTemplateObj(item)
                }}
              >
                {t('report.list.makeup')}
              </Btn>
            </ItemList>
          ))
        ) : (
          <NoData />
        )}
      </div>
      <HandleReport
        isSupply
        date={templateObj.date}
        templateId={templateObj.id}
        visibleEdit={visibleEdit}
        editClose={() => {
          setVisibleEdit(false)
          props.onClose()
        }}
        visibleEditText={t('report.list.writeReport')}
      />
    </CommonModal>
  )
}

export default SupplementaryIntercourse

import CommonModal from '@/components/CommonModal'
import {
  finishIteration,
  finishStatistics,
  incompleteIterates,
} from '@/services/iterate'
import { getParamsData, getProjectIdByUrl } from '@/tools'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateList } from '@store/iterate'
import { getIterateInfo } from '@store/iterate/iterate.thunk'
import { Radio, RadioChangeEvent, Space } from 'antd'
import { defaults } from 'lodash'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CustomSelect from '../CustomSelect'
import { getMessage } from '../Message'
const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  padding-left: 24px;
`
const StatisticsWrap = styled.div`
  display: flex;
  padding: 8px 24px 24px 24px;
  justify-content: space-between;
`
const MainWrap = styled.div`
  width: 108px;
  height: 76px;
  background: var(--neutral-n10);
  border-radius: 6px;
  padding: 12px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const NumWrap = styled.div`
  font-size: 20px;
  font-family: SiYuanMedium;
`
const NameWrap = styled.div`
  font-size: 12px;
  color: var(--neutral-n2);
`

const Name = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`
interface Props {
  iterationId: number
  isVisible: boolean
  title: string
  onClose(): void
  refreshLeftList(): void
}
const Complete = (props: Props) => {
  const [value, setValue] = useState(1)
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<any>([])
  const [noCompleteData, setNoCompleteData] = useState<any>([])
  const [checkId, setCheckId] = useState<any>()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateInfo } = useSelector(store => store.iterate)
  const dispatch = useDispatch()
  const [num, setNum] = useState(0)
  const getItem = (key: string, item: any) => {
    switch (key) {
      case 'finished_story_count':
        return {
          name: '完成需求',
          value: item?.finished_story_count,
          key: 'finished_story_count',
        }
      case 'finished_bug_count':
        return {
          name: '完成缺陷',
          value: item?.finished_bug_count,
          key: 'finished_bug_count',
        }
      case 'incomplete_story_count':
        return {
          name: '剩余需求',
          value: item?.incomplete_story_count,
          key: 'incomplete_story_count',
        }
      case 'incomplete_bug_count':
        return {
          name: '剩余缺陷',
          value: item?.incomplete_bug_count,
          key: 'incomplete_bug_count',
        }
      default:
        return {}
    }
  }
  const getFinishStatistics = async (params: any) => {
    try {
      const result: any = await finishStatistics(params)

      if (result && result.code === 0 && result.data) {
        const temp: any = Object.keys(result.data).map((k: string) =>
          getItem(k, result.data),
        )
        const numB =
          temp.find((el: { key: string }) => el.key === 'incomplete_bug_count')
            ?.value +
          temp.find(
            (el: { key: string }) => el.key === 'incomplete_story_count',
          )?.value
        setNum(numB)
        setData(temp)
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const getIncompleteIterates = async (params: any) => {
    try {
      const result: any = await incompleteIterates(params)
      if (result && result.code === 0 && result.data) {
        setNoCompleteData(
          result.data.map((k: any) => ({
            label: k.name,
            value: k.id,
            key: k.id,
          })),
        )
      }
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    if (props?.iterationId && props?.isVisible) {
      getFinishStatistics({
        projectId,
        id: props?.iterationId,
      })
      getIncompleteIterates({
        projectId,
        id: props?.iterationId,
      })
    }
  }, [props?.iterationId, props?.isVisible])

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  const onConfirm = async () => {
    if (value === 1 && !checkId && num !== 0) {
      getMessage({
        msg: '请选择迭代',
        type: 'warning',
      })
      return
    }

    try {
      const result: any = await finishIteration({
        projectId,
        id: props?.iterationId,
        moveId: checkId,
        type: num === 0 ? '' : value === 1 ? 'move' : 'remove',
      })

      if (result && result.code === 0) {
        getMessage({
          msg: '已完成迭代',
          type: 'success',
        })
        if (props?.iterationId === iterateInfo.id) {
          dispatch(
            getIterateInfo({
              projectId: getProjectIdByUrl(),
              id: props?.iterationId,
            }),
          )
          dispatch(setIsUpdateList(true))
        }
        props?.refreshLeftList?.()
        props?.onClose?.()
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      // console.log(error)
    }
  }
  return (
    <CommonModal
      width={528}
      confirmText={'完成'}
      isVisible={props.isVisible}
      title={props.title}
      onClose={() => props.onClose()}
      onConfirm={onConfirm}
    >
      <Title>本次迭代概况统计</Title>
      <StatisticsWrap>
        {data.map((el: any) => (
          <MainWrap key={el.name}>
            <NumWrap>{el.value}</NumWrap>
            <NameWrap>{el.name}</NameWrap>
          </MainWrap>
        ))}
      </StatisticsWrap>
      <div style={{ width: '100%', paddingLeft: '24px', height: 'auto' }}>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => onChange(e)}
          value={value}
        >
          {num > 0 && (
            <Space direction="vertical" size={24}>
              <div>
                <Radio value={1}>
                  <Name>将剩余需求和缺陷移入其他迭代中</Name>
                </Radio>
                {value === 1 && (
                  <div style={{ width: 480, marginTop: 8 }}>
                    <CustomSelect
                      placeholder="请选择迭代"
                      onChange={(id: any) => {
                        setCheckId(id)
                      }}
                      options={noCompleteData}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>
              <Radio value={2}>
                <Name>移除剩余需求和缺陷</Name>
              </Radio>
            </Space>
          )}
        </Radio.Group>
      </div>
    </CommonModal>
  )
}
export default Complete

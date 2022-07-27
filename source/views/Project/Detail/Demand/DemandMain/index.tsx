/* eslint-disable react-hooks/exhaustive-deps */
import Operation from './components/Operation'
import DemandTable from './components/DemandTable'
import DemandGrid from './components/DemandGrid'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'

interface Props {
  onChangeVisible(e: any): void
}

const DemandMain = (props: Props) => {
  const [isGrid, setIsGrid] = useState(true)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { getDemandList } = useModel('demand')

  const getList = async (state: boolean) => {
    let params = {}
    if (state) {
      params = {
        projectId,
        all: true,
        panel: true,
      }
    } else {
      params = {
        projectId,
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderKey: 'id',
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
  }

  useEffect(() => {
    getList(isGrid)
  }, [])

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => props.onChangeVisible(e)}>编辑</div>,
        },
        {
          key: '2',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val)
  }

  return (
    <div>
      <Operation
        isGrid={isGrid}
        onChangeGrid={val => onChangeGrid(val)}
        onChangeVisible={(e: any) => props.onChangeVisible(e)}
      />
      {isGrid
        ? <DemandGrid menu={menu} list={dataList} />
        : <DemandTable menu={menu} data={dataList} />
      }
    </div>
  )
}

export default DemandMain

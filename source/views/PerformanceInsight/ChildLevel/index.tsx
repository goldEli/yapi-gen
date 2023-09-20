import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import ProgressComparison from '../components/ProgressComparison'
import Undistributed from '../components/Undistributed'
import { useState } from 'react'
const ChildLevel = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  console.log(paramsData, 'paramsDataparamsData')

  return (
    <>
      {paramsData?.homePage === 2 ? (
        <Undistributed
          title={paramsData.title}
          viewType={paramsData.viewType}
          type={paramsData.type}
          homeType={paramsData.homeType}
          projectId={paramsData.projectId}
          headerParmas={paramsData.headerParmas}
        />
      ) : (
        <ProgressComparison
          title={paramsData.title}
          viewType={paramsData.viewType}
          type={paramsData.type}
          homeType={paramsData.homeType}
          projectId={paramsData.projectId}
          headerParmas={paramsData.headerParmas}
          order={order}
          onUpdateOrderKey={(item: any) => {
            setOrder(item)
          }}
        />
      )}
    </>
  )
}
export default ChildLevel

import ProgressComparison from './components/ProgressComparison'
import Home from './components/Home'
const PerformanceInsight = () => {
  return (
    <>
      <Home />
      {/* 工作进展对比 和缺陷分析*/}
      <ProgressComparison title={'工作进展对比'} type={'Defect0'} />
    </>
  )
}
export default PerformanceInsight

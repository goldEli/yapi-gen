import Header from './Header/Iteration'
import ProgressComparison from './components/ProgressComparison'
const PerformanceInsight = () => {
  return (
    <>
      <Header />
      {/* 工作进展对比 和缺陷分析*/}
      <ProgressComparison title={'工作进展对比'} type={'Defect0'} />
    </>
  )
}
export default PerformanceInsight

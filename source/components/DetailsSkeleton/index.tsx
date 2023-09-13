import { Skeleton } from 'antd'
import { SkeletonGroup, SkeletonGroups } from './style'

const DetailsSkeleton = () => {
  return (
    <SkeletonGroups>
      <SkeletonGroup size={8}>
        <Skeleton.Input style={{ height: 22, width: 22 }} active />
        <Skeleton.Input style={{ height: 22, width: 95 }} active />
        <Skeleton.Input style={{ height: 22, width: 22 }} active />
        <Skeleton.Input style={{ height: 22, width: 95 }} active />
      </SkeletonGroup>
      <Skeleton.Input
        style={{ height: 48, width: '100%', marginTop: 16 }}
        active
      />
      <Skeleton.Input
        style={{ height: 28, width: '100%', marginTop: 16 }}
        active
      />
      <Skeleton.Input style={{ height: 22, width: 56, marginTop: 16 }} active />
      <Skeleton.Input
        style={{ height: 132, width: '100%', marginTop: 4 }}
        active
      />
      <Skeleton.Input
        style={{ height: 238, width: '100%', marginTop: 4 }}
        active
      />
      <Skeleton.Input style={{ height: 22, width: 28, marginTop: 32 }} active />
      <SkeletonGroup size={8} style={{ marginTop: 8 }}>
        <Skeleton.Input style={{ height: 22, width: 76 }} active />
        <Skeleton.Input style={{ height: 22, width: 52 }} active />
        <Skeleton.Input style={{ height: 22, width: 52 }} active />
        <Skeleton.Input style={{ height: 22, width: 88 }} active />
      </SkeletonGroup>
      <Skeleton.Input style={{ height: 22, width: 28, marginTop: 32 }} active />
      <Skeleton.Input style={{ height: 32, width: 112, marginTop: 8 }} active />
      <Skeleton.Input style={{ height: 60, width: 378, marginTop: 8 }} active />
      <Skeleton.Input
        style={{ height: 60, width: 378, marginTop: 16 }}
        active
      />
      <Skeleton.Input
        style={{ height: 28, width: '100%', marginTop: 16 }}
        active
      />
      <Skeleton.Input
        style={{ height: 28, width: '100%', marginTop: 16 }}
        active
      />
      <Skeleton.Input
        style={{ height: 28, width: '100%', marginTop: 16 }}
        active
      />
    </SkeletonGroups>
  )
}

export default DetailsSkeleton

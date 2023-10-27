import { Skeleton } from 'antd'
import { SkeletonGroup, SkeletonGroups } from './style'

const ReportDetailSkeleton = () => {
  return (
    <SkeletonGroups>
      <SkeletonGroup size={12}>
        <Skeleton.Avatar size="large" active />
        <SkeletonGroups>
          <Skeleton.Input style={{ height: 20, width: 290 }} active />
          <Skeleton.Input style={{ height: 20, width: 180 }} active />
        </SkeletonGroups>
      </SkeletonGroup>

      <Skeleton.Input style={{ height: 22, width: 84, marginTop: 24 }} active />
      <Skeleton.Input
        style={{ height: 20, width: '100%', marginTop: 8 }}
        active
      />
      <Skeleton.Input
        style={{ height: 20, width: '100%', marginTop: 2 }}
        active
      />
      <Skeleton.Input style={{ height: 20, width: 250, marginTop: 2 }} active />

      <Skeleton.Input style={{ height: 22, width: 84, marginTop: 24 }} active />
      <Skeleton.Input
        style={{ height: 20, width: '100%', marginTop: 8 }}
        active
      />
      <Skeleton.Input
        style={{ height: 20, width: '100%', marginTop: 2 }}
        active
      />
      <Skeleton.Input style={{ height: 20, width: 250, marginTop: 2 }} active />

      <Skeleton.Input style={{ height: 22, width: 84, marginTop: 24 }} active />
      <Skeleton.Input
        style={{ height: 60, width: '50%', marginTop: 8 }}
        active
      />
      <Skeleton.Input
        style={{ height: 60, width: '50%', marginTop: 12 }}
        active
      />

      <Skeleton.Input style={{ height: 22, width: 84, marginTop: 24 }} active />
      <Skeleton.Input
        style={{ height: 20, width: '25%', marginTop: 8 }}
        active
      />
      <Skeleton.Input
        style={{ height: 20, width: '25%', marginTop: 8 }}
        active
      />
      <SkeletonGroup size={8} style={{ marginTop: 24 }}>
        <Skeleton.Input style={{ height: 22, width: 28 }} active />
        <Skeleton.Input style={{ height: 22, width: 28 }} active />
      </SkeletonGroup>

      <SkeletonGroup size={8} style={{ marginTop: 24 }}>
        <Skeleton.Avatar size="small" active />
        <Skeleton.Input style={{ height: 20, width: 48 }} active />
        <Skeleton.Avatar size="small" active />
        <Skeleton.Input style={{ height: 20, width: 48 }} active />
        <Skeleton.Avatar size="small" active />
        <Skeleton.Input style={{ height: 20, width: 48 }} active />
      </SkeletonGroup>

      <Skeleton.Input style={{ height: 22, width: 28, marginTop: 24 }} active />

      <SkeletonGroup size={8} style={{ marginTop: 24 }}>
        <Skeleton.Avatar size="small" active />
        <SkeletonGroups>
          <SkeletonGroup>
            <Skeleton.Input style={{ height: 20, width: 24 }} active />
            <Skeleton.Input style={{ height: 20, width: 106 }} active />
          </SkeletonGroup>
          <SkeletonGroup>
            <Skeleton.Input style={{ height: 20, width: 560 }} active />
          </SkeletonGroup>
        </SkeletonGroups>
      </SkeletonGroup>
    </SkeletonGroups>
  )
}

export default ReportDetailSkeleton

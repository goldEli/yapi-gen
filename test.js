let list = [
  {
    id: 100008,
    project_id: 66,
    name: '大飞哥1',
    status: 358,
    expected_start_at: '2022-07-14 08:00:00',
    expected_end_at: '2022-07-20 08:00:00',
    children: [
      {
        created_at: 1658403600,
        end_at: 1658405276,
      },
      {
        created_at: 1658403600,
        end_at: 1658405276,
      },
    ],
    status_name: '规划中',
  },
  {
    id: 100008,
    project_id: 66,
    name: '暴龙兽',
    status: 358,
    expected_start_at: '2022-07-14 08:00:00',
    expected_end_at: '2022-07-20 08:00:00',
    children: [
      {
        created_at: 1658403600,
        end_at: 1658405276,
      },
      {
        created_at: 1658403600,
        end_at: 1658405276,
      },
      {
        created_at: 1658403600,
        end_at: 1658405276,
      },
    ],
    status_name: '规划中',
  },
]
const handleData = data => {
  return data.reduce((res, item, index) => {
    const { children, ...rest } = item
    children.forEach(child => {
      res.push({
        ...rest,
        ...child,
        y: index,
      })
    })
    return res
  }, [])
}
console.log(handleData(list))

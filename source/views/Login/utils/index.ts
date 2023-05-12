// 方法
export const getQueryParam = (key: string) => {
  const query = new URLSearchParams(location.search)

  return query.get(key)
}

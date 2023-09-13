export const generatorFilterParams = (config: any = {}) => {
  if (!config?.searchKey?.length) {
    return
  }
  const searchChoose = config['valueKey']
  // dispatch(setView(config))
  const params = config?.searchKey
    ?.map((item: any) => {
      const key = item.content
      return {
        [key]: searchChoose[key] ?? null,
      }
    })
    ?.reduce((res: any, item: any) => {
      const [k, v] = Object.entries(item)[0]
      res[k] = v
      return res
    }, {})

  return params
}

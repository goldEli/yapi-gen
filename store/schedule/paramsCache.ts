// 缓存请求参数用于刷新
type TKey = Model.Calendar.CalendarPanelType
export default class ParamsCache {
  private cache: Map<TKey, any>

  private static instance?: ParamsCache = void 0

  constructor() {
    this.cache = new Map()
  }

  public addCache(key: TKey, data: any) {
    this.cache.set(key, data)
  }

  public getCache(key: TKey) {
    return this.cache.get(key)
  }

  // The Singleton Pattern
  public static getInstance(): ParamsCache {
    if (this.instance === void 0) {
      this.instance = new ParamsCache()
    }
    return this.instance
  }
}

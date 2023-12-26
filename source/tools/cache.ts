interface ICache {
  setValue<T = any>(key: string, value: T): void
  getValue<T = any>(key: string): T
}

export class Cache implements ICache {

  private static instance?: Cache = void 0

  private cache: Map<string, any> = new Map()

//   constructor() {}

  // The Singleton Pattern
  public static getInstance(): Cache {
    if (this.instance === void 0) {
      this.instance = new Cache()
    }

    return this.instance
  }

  public setValue<T = any>(key: string, value: T): void {
    this.cache.set(key, value)
  }

  public getValue<T = any>(key: string): T {
    return this.cache.get(key)
  }
}

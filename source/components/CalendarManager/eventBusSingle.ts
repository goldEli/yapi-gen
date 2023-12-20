export interface Registry {
  unregister: () => void
}

export interface Callable {
  [key: string]: (...args: any[]) => void
}

export interface Subscriber {
  [key: string]: (...args: any[]) => void
}

export interface IEventBus {
  dispatch<T>(event: string, arg?: T): void
  register(event: string, callback: (...args: any[]) => void): Registry
}
export class EventBusSingle implements IEventBus {
  private subscribers: Subscriber

  private static nextId = 0

  private static instance?: EventBusSingle = void 0

  constructor() {
    this.subscribers = {}
  }

  // The Singleton Pattern
  public static getInstance(): EventBusSingle {
    if (this.instance === void 0) {
      this.instance = new EventBusSingle()
    }

    return this.instance
  }

  public dispatch<T>(event: string, arg?: T): any {
    const subscriber = this.subscribers[event]

    if (subscriber === void 0) {
      return
    }

    // Object.keys(subscriber).forEach(cb => cb(arg))
    return subscriber(arg)
  }

  public register(event: string, callback: (...args: any[]) => void): Registry {
    // const id = this.getNextId()
    // if (!this.subscribers[event]) {
    //   this.subscribers[event] = {}
    // }

    this.subscribers[event] = callback

    return {
      unregister: () => {
        delete this.subscribers[event]
        if (Object.keys(this.subscribers[event]).length === 0) {
          delete this.subscribers[event]
        }
      },
    }
  }

  // private getNextId(): number {
  //   return EventBusSingle.nextId++
  // }
}

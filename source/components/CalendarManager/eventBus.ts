export interface Registry {
  unregister: () => void
}

export interface Callable {
  [key: string]: (...args: any[]) => void
}

export interface Subscriber {
  [key: string]: Callable
}

export interface IEventBus {
  dispatch<T>(event: string, arg?: T): void
  register(event: string, callback: (...args: any[]) => void): Registry
}
export class EventBus implements IEventBus {
  private subscribers: Subscriber

  private static nextId = 0

  private static instance?: EventBus = void 0

  constructor() {
    this.subscribers = {}
  }

  // The Singleton Pattern
  public static getInstance(): EventBus {
    if (this.instance === void 0) {
      this.instance = new EventBus()
    }

    return this.instance
  }

  public dispatch<T>(event: string, arg?: T): void {
    const subscriber = this.subscribers[event]

    if (subscriber === void 0) {
      return
    }

    Object.keys(subscriber).forEach(key => subscriber[key](arg))
  }

  public register(event: string, callback: (...args: any[]) => void): Registry {
    const id = this.getNextId()
    if (!this.subscribers[event]) {
      this.subscribers[event] = {}
    }

    this.subscribers[event][id] = callback

    return {
      unregister: () => {
        delete this.subscribers[event][id]
        if (Object.keys(this.subscribers[event]).length === 0) {
          delete this.subscribers[event]
        }
      },
    }
  }

  private getNextId(): number {
    return EventBus.nextId++
  }
}

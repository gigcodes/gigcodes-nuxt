class Event {
  events: { [index: string]: Array<any> } = {}

  constructor () {
    this.events = {}
  }

  $on (eventName: string, fn: any): void {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  }

  $off (eventName: string, fn: any): void {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1)
          break
        }
      }
    }
  }

  $emit (eventName: string, data?: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data)
      })
    }
  }
}

export default new Event()

import Rx from 'rx'
import { assign, map, merge, filter } from 'lodash'

let subject = null

class ClickCount {

  constructor() {
    this.observable = null
  }

  init() {
    subject = new Rx.Subject()
    this.observable = subject.asObservable()
  }

  doClick(value) {
    !subject.isDisposed && subject.onNext(value)
  }

  getMultipleClickStream() {
    return this.observable
            .buffer( this.observable.debounce(250) )
            .map( data => data.length )
            .filter( total => total > 1 )
            .map( data => 1 )
            .scan( (prev, next) => prev + next )
  }

  getSingleClickStream() {
    return this.observable
            .map( data => 1 )
            .scan( (prev, next) => prev + next )
  }

  dispose() {
    subject.dispose()
  }

}

export default ClickCount

export class NotificationService {

  constructor() {
    this.newNotifications = null
    this.notifications = null
    this.updates = null
  }

  init() {

    this.updates = new Rx.Subject()
    this.newNotifications = new Rx.Subject()
    this.create = new Rx.Subject()
    this.remove = new Rx.Subject()

    this.notification = this.updates
      .scan((messages, operation) => operation(messages), {})
      .asObservable()

    this.create
      .timestamp()
      .map( (message) => (messages) => {
        return merge({}, messages, { [message.timestamp] : assign({}, message.value, { timestamp: message.timestamp }) })
      })
      .subscribe(this.updates)

    this.newNotifications
      .subscribe(this.create)

    this.remove
      .map( (id) => (messages) => {
        return filter(messages, (m, i) => i !== id)
      })
      .subscribe(this.updates)

  }

  addNotification(message) {
    this.newNotifications.onNext(message)
  }

  removeNotification(id) {
    this.remove.onNext(id)
  }

}

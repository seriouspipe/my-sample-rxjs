import Rx from 'rx'

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

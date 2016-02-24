import ClickCount, { NotificationService } from './myrx-clickcount'
import $ from 'jquery'

const us = new ClickCount();
us.init();

$('#click').bind('click', us.doClick )
$('#dispose').bind('click', us.dispose)

const multipleStream = us.getMultipleClickStream()
const singleStream = us.getSingleClickStream()

multipleStream.subscribe( data => $('#result-multiple').html(data) )
singleStream.subscribe( data => $('#result-single').html(data) )

const notiServ = new NotificationService()
notiServ.init()
notiServ.notification.subscribe( messages => console.log(messages) )

notiServ.addNotification({ message: "Hello", type: 1 })
notiServ.addNotification({ message: "Hello", type: 2 })
notiServ.addNotification({ message: "Hello", type: 3 })

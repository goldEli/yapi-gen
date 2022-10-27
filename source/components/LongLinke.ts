import Pusher from 'pusher-js'

export const pusher = new Pusher('4cfbe38ea068fa6ed0ef', {
  cluster: 'ap1',
})

const channel = pusher.subscribe('testmyabeyance')
channel.bind('my-event', (data: any) => {
  alert(data)
})

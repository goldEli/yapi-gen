import Pusher from 'pusher-js'

export const pusher = new Pusher('4cfbe38ea068fa6ed0ef', {
  cluster: 'ap1',
  userAuthentication: {
    endpoint: 'https://dev.staryuntech.com/dev-agile/b/pusher/user-auth',
    transport: 'ajax',
    params: {},
    headers: {},
  },
})

pusher.signin()

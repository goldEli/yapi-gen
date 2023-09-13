const WebSocketServer = require('ws')

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 5008 })

// Creating connection using websocket
wss.on('connection', ws => {
  // console.log("new client connected");

  // sending message to client
  setInterval(() => {
    ws.send(
      JSON.stringify({
        send: 'project',
        to: '31',
        msgType: 'M0000',
        customType: '1102',
        source: 'sys',
        msgBody: {
          title: '【张三】创建了迭代',
          content:
            '【张三】在【王娇项目348762384--xxll】创建了【迭代1.0】迭代，请前往查看',
        },
        customData: {
          linkWebUrl: 'http://www.baidu.com',
          projectId: '24',
          iterateId: '12',
          demanId: '1000058',
        },
        msgIds: [1213],
      }),
    )
  }, 10000)

  //on message from client
  ws.on('message', data => {
    // console.log(`Client has sent us: ${data}`)
  })

  // handling what to do when clients disconnects from server
  ws.on('close', () => {
    // console.log("the client has connected");
  })
  // handling client connection error
  ws.onerror = function () {
    // console.log("Some Error occurred")
  }
})
// console.log("The WebSocket server is running on port 8080");

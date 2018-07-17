var axios = require('axios')

var redis = require('redis')
var client = redis.createClient({ host: 'database' })
client.on('error', err => console.error(err))

var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)
var ws // variable to expose the socket in

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/spawn', (req, res) => spawn(res))

io.on('connection', (socket) => {
  console.log('Someone connected.')
  ws = socket
  socket.on('disconnect', () => console.log('Good bye'))
})

http.listen(80, () => console.log('Listening.'))

// Describe the callback that reads the progress.
client.on('message', (chan, msg) => {
  console.log(`chan ${chan}`)
  console.log(`Job ${chan} progress: ${msg}%`)
  ws.emit('progress', {jobId: chan, progress: msg})
  if (msg === '100') {
    console.log('Task completed. Unsubscribing and closing connection.')
    client.unsubscribe(chan)
  }
})

// Spanws a job on the backend and sets the monitoring so it can reach the
// frontend through websockets emitting everytime progress updates on redis.
function spawn (response) {
  axios
    .get('http://backend:5000/spawn')
    .then(res => {
      var jobId = res.data
      client.subscribe(jobId)
      response.send({ jobId: jobId })
    })
    .catch(err => console.error(err))
}

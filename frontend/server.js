const axios = require('axios')

const redis = require('redis')
const client = redis.createClient({ host: 'database' })
client.on('error', err => console.error(err))

const express = require('express')
const app = express()
const http = require('http').Server(app)

const io = require('socket.io')(http)
var websocket

// Describe the callback that reads the progress.
client.on('message', (chan, msg) => {
  console.log(`Job ${chan} progress: ${msg}% received from redis. Emitting.`)
  websocket.emit('progress', { jobId: chan, progress: msg })
  if (msg === '100') {
    console.log(`Task completed. Unsubscribing from ${chan}.`)
    client.unsubscribe(chan)
    websocket.disconnect(chan)
  }
})

app.use(express.static(__dirname))

// Serve the HTML with the client code.
app.get('/', (req, res) => {
  res.sendFile('index.html')
})

// Spawns a job on the backend and subscribes to its progress. Returns job id.
app.get('/spawn', (req, res) => {
  axios
    .get('http://backend:5000/spawn')
    .then(response => {
      let jobId = response.data
      client.subscribe(jobId)
      res.send({ jobId: jobId })
    })
})

io.on('connection', (socket) => {
  console.log('Someone connected.')
  websocket = socket
  socket.on('disconnect', () => console.log('Good bye.'))
})

http.listen(80, () => console.log('Listening.'))

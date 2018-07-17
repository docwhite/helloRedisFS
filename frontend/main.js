const button = document.getElementById('spawn')

const socket = io()
socket.on('progress', (message) => {
  const jobId = `j${message.jobId}`
  const progress = message.progress
  console.log(jobId, progress)

  var paragraph = document.getElementById(jobId)
  while (paragraph.firstChild) {
    paragraph.firstChild.remove()
  }

  var node = document.createTextNode(`${jobId}: ${message.progress}`)
  paragraph.appendChild(node)
})

button.onclick = () => {
  // Spawn a job.
  axios.get('/spawn')
    .then(res => {
      let jobId = `j${res.data.jobId}`
      let paragraph = document.createElement('p')
      paragraph.setAttribute('id', jobId)
      var element = document.getElementById('main')
      element.appendChild(paragraph)
    })
}

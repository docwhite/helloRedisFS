const button = document.getElementById('spawn')
const socket = io()

socket.on('progress', (message) => {
  const jobId = `j${message.jobId}`
  const progress = message.progress
  console.log(`${jobId} has progress ${progress}`)

  // Get the right progress p element and clear its text.
  const paragraph = document.getElementById(jobId)
  while (paragraph.firstChild) {
    paragraph.firstChild.remove()
  }

  // Dump the right text to the p element.
  const node = document.createTextNode(`${jobId}: ${message.progress}`)
  paragraph.appendChild(node)
})

socket.on('disconnect', () => console.log(`Socket closed`))

button.onclick = () => {
  // Spawn a job and create a p HTML element with job id as its id attribute.
  axios.get('/spawn')
    .then(res => {
      const jobId = `j${res.data.jobId}`

      const paragraph = document.createElement('p')
      paragraph.setAttribute('id', jobId)

      const element = document.getElementById('main')
      element.appendChild(paragraph)
    })
}

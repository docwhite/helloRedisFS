var axios = require('axios');

var redis = require('redis');
var client = redis.createClient({ host: 'database' });

client.on('error', (err) => console.error(err) );

// Spawn will generate a running task (thread) on the backend doing work and
// publishing its progress to redis. Response is the job id for that task.
axios.get('http://backend:5000/spawn')
  .then((res) => {
    var id = res.data;
    console.log(`Job ${id} dispatched.`);

    // Describe the callback that reads the progress.
    client.on("message", (chan, msg) => {
      console.log(`Job ${id} progress: ${msg}%`);
      if (msg === "100") {
        console.log("Task completed. Unsubscribing and closing connection.");
        client.unsubscribe();
        client.quit();
      }
    })

    console.log(`Subscribing to monitor progress for task ${id}`);
    client.subscribe(id);
  })
  .catch((err) => console.error(err));


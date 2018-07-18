# Hello Redis Full Stack
Simple example to show redis PubSub capabilities. Frontend asks backend to
spawn a job on a Python backend and monitors it's progress.

![Example Outputs](fs.png?raw=true "Example Outputs")

The way the progress is passed is through publishing to a channel on the redis
database. The channel name in this case is the job id. The frontend is
subscribed to this channel so everytime the backend publishes the frontend
pulls.

The mocked job is run on a separate thread in a non-blocking fashion.

This is just for me to come back to a minimal example using the same stack I
use on more complex projects:

* NodeJS on the frontend.
* Python backend.
* Redis database.
* Docker Compose to orchestrate.

To run it, have Docker installed and on a terminal:

	git clone https://github.com/docwhite/helloRedisFS
	cd helloRedisFS
	docker-compose up

Here is an example output log:

	backend_1   | 172.21.0.4 - - [08/Jul/2018 20:34:23] "GET /spawn HTTP/1.1" 200 -
	frontend_1  | Job 287 dispatched.
	frontend_1  | Subscribing to monitor progress for task 287
	backend_1   | Updated job 287 progress (2%) and published to redis.
	frontend_1  | Job 287 progress: 2%
	backend_1   | Updated job 287 progress (3%) and published to redis.
	frontend_1  | Job 287 progress: 3%
	backend_1   | Updated job 287 progress (4%) and published to redis.
	frontend_1  | Job 287 progress: 4%
	[...]
	backend_1   | Updated job 287 progress (100%) and published to redis.
	frontend_1  | Job 287 progress: 100%
	frontend_1  | Task completed. Unsubscribing from 287.

You can also access http://localhost and spawn various jobs by clicking the
button.

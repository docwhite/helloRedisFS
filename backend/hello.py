from flask import Flask
import random
import job

app = Flask(__name__)

@app.route('/spawn')
def spawn():
    """Spawns a mocked job representing a heavy task. Will run on a python
    thread and from there it will publish to a channel on reddis notifying
    about its progress."""
    j = job.Job()
    j.start()

    return str(j.id)

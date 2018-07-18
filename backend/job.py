import random
import threading
import time

import redis
r = redis.StrictRedis(host='database')

class Job(threading.Thread):
    """
    Mocks up a heavy task to be run. Its progress is published to a redis
    channel which name is the job id.

    Attributes:
        id (int): Job id, unique value identifying the task.
        progress (int): Percentage of completion.
    """

    def __init__(self):
        super(Job, self).__init__()
        self.id = random.randint(0, 1000)
        self.progress = 0

    def run(self):
        """
        Simulates heavy task that reports progress through Redis Pub/Sub.
        """
        while self.progress != 100:
            self.progress += 1
            r.publish(str(self.id), self.progress)
            print("Updated job %d progress (%d%%) and published to redis." % (
                self.id, self.progress
            ))

            # Simulate slow task by sleeping.
            time.sleep(0.1)

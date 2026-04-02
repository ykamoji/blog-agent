from api.database.repository import Repository
from api.daily_runner import (run_daily_pipeline, scrapper_runner,
                              anthropic_runner, youtube_runner, digest_runner, email_runner)


def get_blogs():
    repo = Repository()
    return repo.get_all_digests()


def run_blogs_pipeline(hours, email):

    if not hours:
        hours = 24
    else:
        hours = int(hours)

    if email:
        email=[email]

    return run_daily_pipeline(hours=hours, email=email)


class Pipeline:
    def __init__(self, hours, email, results=None):
        self.hours = hours
        self.email = email
        self.results = results if results else {
        "start_time": 0,
        "scraping": {},
        "processing": {},
        "digests": {},
        "email": {},
        "success": False
    }

    def scrapper(self):
        scrapper_runner(self.hours, self.results)

    def anthropic(self):
        anthropic_runner(self.results)

    def youtube(self):
        youtube_runner(self.results)

    def digest(self):
        digest_runner(self.results)

    def send_email(self):
        email_runner(email=self.email, hours=self.hours, results=self.results, top_n=10)
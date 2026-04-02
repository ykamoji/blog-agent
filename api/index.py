from flask import Flask, request
from .interface.blogs import get_blogs, Pipeline, run_blogs_pipeline
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)
app = Flask(__name__)

@app.route("/blogs", methods=['GET'])
def blogs():
    return get_blogs()


@app.route("/trigger", methods=['POST'])
def blogs_trigger():
    data = request.get_json()
    print(data, flush=True)

    hours = int(data.get('hours')) if data.get('hours') else 1000
    email = data.get('email') if data.get('email') else None

    run_blogs_pipeline(hours=hours, email=email)


def prepare():
    data = request.get_json()
    print(data, flush=True)
    hours = int(data.get('hours')) if data.get('hours') else 1000
    email = data.get('email') if data.get('email') else None
    if email:
        email = [email]
    pipe = Pipeline(hours=hours, email=email)
    return pipe


@app.route("/scrapper", methods=['POST'])
def blogs_scrapper():
    pipe = prepare()
    pipe.scrapper()
    return {}


@app.route("/anthropic", methods=['POST'])
def blogs_anthropic():
    pipe = prepare()
    pipe.anthropic()
    return {}


@app.route("/youtube", methods=['POST'])
def blogs_youtube():
    pipe = prepare()
    pipe.youtube()
    return {}


@app.route("/digest", methods=['POST'])
def blogs_digest():
    pipe = prepare()
    pipe.digest()
    return {}


@app.route("/email", methods=['POST'])
def blogs_email():
    pipe = prepare()
    pipe.send_email()
    return {}

if __name__ == "__main__":
    app.run(debug=False)
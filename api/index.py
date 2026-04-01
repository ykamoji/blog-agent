import json
from datetime import datetime
from flask import Flask, request, Response, stream_with_context
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
def blogs_scrapper():
    data = request.get_json()
    print(data, flush=True)

    hours = int(data.get('hours')) if data.get('hours') else 1000
    email = data.get('email') if data.get('email') else None

    run_blogs_pipeline(hours=hours, email=email)

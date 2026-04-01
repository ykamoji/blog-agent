from flask import Flask
from .interface.blogs import get_blogs

app = Flask(__name__)

@app.route("/blogs", methods=['GET'])
def blogs():
    return get_blogs()
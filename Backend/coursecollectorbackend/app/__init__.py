from flask import Flask
from app.routes import main

def create_app():
    app = Flask(__name__)
    app.register_blueprint(main)  # Register routes from `routes.py`
    return app

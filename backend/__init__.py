# Creates and configures the Flask app

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from backend.config import Config

# Create extensions
db= SQLAlchemy()
bcrypt= Bcrypt()

def create_app():
    app= Flask(__name__)
    app.config.from_object(Config)
    
    # Attach extensions to app
    db.init_app(app)
    bcrypt.init_app(app)
    
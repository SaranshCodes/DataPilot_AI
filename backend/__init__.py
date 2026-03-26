# Creates and configures the Flask app

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # allow frontend to call backend
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
    CORS(app) # allows React (port 3000) to call Flask (port 5000)
    
    # Register route blueprints
    # (we'll add more here as we build each route)
    from backend.routes.auth import auth_bp
    from backend.routes.upload import upload_bp
    from backend.routes.train import train_bp
    from backend.routes.predict import predict_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(train_bp)
    app.register_blueprint(predict_bp)
    
    # Create all database tables on first run
    with app.app_context():
        from backend.models.user import User
        from backend.models.job import TrainingJob
        db.create_all()
    
    return app
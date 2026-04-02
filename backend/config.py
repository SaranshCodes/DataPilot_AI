# All app configuration in one place

import os
from dotenv import load_dotenv

load_dotenv() # loads variables from .env file

class Config:
    # Secret key- used for JWT signing
    SECRET_KEY = os.getenv('SECRET_KEY', 'datapilot-dev-secret-key')
    
    # Database 
    SQLALCHEMY_DATABASE_URI =os.getenv(
        'DATABASE_URL',
        'sqlite:///datapilot.db')
        
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    # FILE UPLOAD SETTINGS
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 # 16 MB max file size
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'storage','uploads') # Upload folder path
    MODELS_FOLDER = os.path.join(os.getcwd(), 'storage','models') # Models folder path
    RESULTS_FOLDER = os.path.join(os.getcwd(), 'storage', 'results')
    
    # JWT token expiry
    JWT_EXPIRY_HOURS=24
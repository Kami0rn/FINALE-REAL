# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key
    username = db.Column(db.String(100), nullable=False)  # Username (required)
    password = db.Column(db.String(100), nullable=False)  # Password (required)
    email = db.Column(db.String(100), nullable=False)  # Email (required)
    firstname = db.Column(db.String(100), nullable=False)  # First name (required)
    lastname = db.Column(db.String(100), nullable=False)  # Last name (required)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time of account creation

    def __repr__(self):
        return f"Register(username={self.username},password={self.password},email={self.email},firstname={self.firstname},lastname={self.lastname})"

class UserAI(db.Model):
    user_ai_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    wgan_model_id = db.Column(db.Integer, db.ForeignKey('wgan_model.wgan_model_id'), nullable=True)  # Foreign key to WGAN_Models table
    overfitting_model_id = db.Column(db.Integer, db.ForeignKey('overfitting_model.overfitting_model_id'), nullable=True)  # Foreign key to Overfitting_Models table
    blockchain_id = db.Column(db.Integer, db.ForeignKey('blockchain_record.blockchain_id'), nullable=True)  # Foreign key to Blockchain_Records table
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the AI models were created

class WGANModel(db.Model):
    wgan_model_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    model_data = db.Column(db.Text, nullable=False)  # Serialized model information
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the model was created

class OverfittingModel(db.Model):
    overfitting_model_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    model_data = db.Column(db.Text, nullable=False)  # Serialized model information
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the model was created

class BlockchainRecord(db.Model):
    blockchain_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    hash = db.Column(db.String(256), nullable=False)  # Hash of the image stored on the blockchain
    blockchain_address = db.Column(db.String(256), nullable=False)  # The address of the block where the hash is stored
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the hash was stored

class Image(db.Model):
    image_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    image_hash = db.Column(db.String(256), nullable=False)  # The SHA256 or perceptual hash of the image
    blockchain_id = db.Column(db.Integer, db.ForeignKey('blockchain_record.blockchain_id'), nullable=True)  # Foreign key to Blockchain_Records table
    used_for_training = db.Column(db.Boolean, nullable=False, default=False)  # Boolean to indicate whether the image was used for training or not
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the image was uploaded

class LoginSession(db.Model):
    session_id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to Users table
    login_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Date and time the user logged in
    logout_time = db.Column(db.DateTime, nullable=True)  # Date and time the user logged out
    session_token = db.Column(db.String(256), nullable=False)  # Token for session management
# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class RegisterModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"Register(username={self.username},password={self.password},email={self.email},firstname={self.firstname},lastname={self.lastname})"
# main2.py
from flask import Flask, current_app
from flask_restful import Api, Resource, abort, reqparse, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from module.login import Login
from module.register import Register
from models.models import db, User, UserAI, WGANModel, OverfittingModel, BlockchainRecord, Image, LoginSession

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"

db.init_app(app)
api = Api(app)

class ProtectedResource(Resource):
    @token_required
    def get(self, current_user):
        return {"message": f"Hello, user {current_user}"}, 200


api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(ProtectedResource, "/protected")  # Add a protected route
api.add_resource(UserProfile, '/user/<int:user_id>')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)
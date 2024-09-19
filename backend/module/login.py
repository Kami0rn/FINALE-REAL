from flask import Flask, current_app
from flask_restful import Api, Resource, abort, reqparse, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from models.models import db, User, UserAI, WGANModel, OverfittingModel, BlockchainRecord, Image, LoginSession

class Login(Resource):

    @marshal_with(login_body)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", type=str, required=True)
        parser.add_argument("password", type=str, required=True)
        args = parser.parse_args()

        # Query the database to get the user by username
        user = User.query.filter_by(username=args['username']).first()

        # If no user is found or password does not match, return an error
        if not user or not check_password_hash(user.password, args['password']):
            abort(401, message="Invalid credentials")

        # Fetch user_id after successful login and generate a token
        user_id = user.id
        token = generate_token(user_id, current_app.config['SECRET_KEY'])

        # Return the login success message, token, and user_id
        return {
            "message": "Login successful",
            "token": token,
            "user_id": user_id  # Return the user_id in the response
        }, 200
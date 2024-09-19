from flask import Flask, current_app
from flask_restful import Api, Resource, abort, reqparse, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from models.models import db, User, UserAI, WGANModel, OverfittingModel, BlockchainRecord, Image, LoginSession


class Register(Resource):

    @marshal_with(register_body)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", type=str, required=True)
        parser.add_argument("password", type=str, required=True)
        parser.add_argument("email", type=str, required=True)
        parser.add_argument("firstname", type=str, required=True)
        parser.add_argument("lastname", type=str, required=True)
        args = parser.parse_args()

        # Check if email is already in use
        if User.query.filter_by(email=args['email']).first():
            abort(409, message="Email is already in use")

        hashed_password = generate_password_hash(args['password'], method='sha256')

        register = User(
            username=args['username'],
            password=hashed_password,
            email=args['email'],
            firstname=args['firstname'],
            lastname=args['lastname']
        )
        db.session.add(register)
        db.session.commit()
        return register, 201
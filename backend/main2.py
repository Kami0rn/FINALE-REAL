# main2.py
from flask import Flask, current_app
from flask_restful import Api, Resource, abort, reqparse, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from module.models import RegisterModel, db # Import RegisterModel from models.py

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"

db.init_app(app)
api = Api(app)

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
        if RegisterModel.query.filter_by(email=args['email']).first():
            abort(409, message="Email is already in use")

        hashed_password = generate_password_hash(args['password'], method='sha256')

        register = RegisterModel(
            username=args['username'],
            password=hashed_password,
            email=args['email'],
            firstname=args['firstname'],
            lastname=args['lastname']
        )
        db.session.add(register)
        db.session.commit()
        return register, 201


class Login(Resource):

    @marshal_with(login_body)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", type=str, required=True)
        parser.add_argument("password", type=str, required=True)
        args = parser.parse_args()

        # Query the database to get the user by username
        user = RegisterModel.query.filter_by(username=args['username']).first()

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
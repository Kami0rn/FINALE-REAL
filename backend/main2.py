import os
from flask import Flask, jsonify, request , send_file
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from module.login import Login
from module.register import Register
from module.logout import Logout  #
from module.wgan import WGAN  # Import the WGAN class
from module.wgan_resource import WGANResource , ProgressResource # Import the WGAN class
from models.models import db, User, UserAI, WGANModel, OverfittingModel, BlockchainRecord, Image, LoginSession
from flask_socketio import SocketIO
from PIL import Image as PILImage
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow requests from http://localhost:3000

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"

db = SQLAlchemy(app)
api = Api(app)


class ProtectedResource(Resource):
    @token_required
    def get(self, current_user):
        return {"message": f"Hello, user {current_user}"}, 200
    



class StopTrainingResource(Resource):
    def post(self):
        if WGANResource.wgan_instance:
            WGANResource.wgan_instance.stop()
            return {"message": "Training stopped"}, 200
        return {"message": "No training in progress"}, 400
    
class LatestImageResource(Resource):
    def get(self, username, user_custom_name):
        # Construct the directory path
        base_dir = "E:\\CPE\\1-2567\\Project\\FINALE REAL"
        image_dir = os.path.join(base_dir, f"{username}_{user_custom_name}_images")
        
        if not os.path.exists(image_dir):
            print(f"Directory {image_dir} does not exist")  # Add logging for debugging
            return {"message": "Image directory does not exist"}, 404

        # Get the list of files in the directory
        files = os.listdir(image_dir)
        if not files:
            print(f"No images found in {image_dir}")  # Add logging for debugging
            return {"message": "No images found"}, 404

        # Sort files by modification time and get the latest file
        files.sort(key=lambda x: os.path.getmtime(os.path.join(image_dir, x)), reverse=True)
        latest_image_path = os.path.join(image_dir, files[0])

        if not os.path.exists(latest_image_path):
            print(f"File {latest_image_path} does not exist")  # Add logging for debugging
            return {"message": "Latest image file does not exist"}, 404

        return send_file(latest_image_path, mimetype='image/png')

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(ProtectedResource, "/protected")  # Add a protected route
api.add_resource(UserProfile, '/user/<int:user_id>')
api.add_resource(WGANResource, '/wgan')  # Add the WGAN resource
api.add_resource(ProgressResource, '/progress')  # Add the progress resource
api.add_resource(LatestImageResource, '/latest_image/<string:username>/<string:user_custom_name>')
api.add_resource(StopTrainingResource, '/stop_training')
api.add_resource(UserProfile, '/user/<int:user_id>', endpoint='user_profile')  # Add a unique endpoint name
api.add_resource(Logout, '/logout')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True, host='0.0.0.0', port=5000)
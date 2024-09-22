from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from schemas.schemas_login import register_body, login_body
from json_webtoken import generate_token, token_required
from module.user_profile import UserProfile
from module.login import Login
from module.register import Register
from module.wgan import WGAN  # Import the WGAN class
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

progress_data = {
    'epoch': 0,
    'progress': 0,
    'd_loss': 0,
    'g_loss': 0
}

class ProtectedResource(Resource):
    @token_required
    def get(self, current_user):
        return {"message": f"Hello, user {current_user}"}, 200
    
class ProgressResource(Resource):
    def get(self):
        return jsonify(progress_data)

# Create a new resource for WGAN
class WGANResource(Resource):
    def __init__(self):
        self.wgan = None # Pass the progress_data dictionary

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('epochs', type=int, required=True, help='Number of epochs is required')
        parser.add_argument('username', type=str, required=True, help='Username is required')
        parser.add_argument('user_custom_name', type=str, required=True, help='Custom name is required')
        args = parser.parse_args()

        # Load and preprocess the uploaded images
        uploaded_files = request.files.getlist("images")
        if not uploaded_files:
            return {"message": "No images uploaded"}, 400

        images = [PILImage.open(file) for file in uploaded_files]

        # Initialize WGAN with the provided username and custom name
        self.wgan = WGAN(progress_data, args['username'], args['user_custom_name'])
        processed_images = self.wgan.load_and_preprocess_images(images, self.wgan.img_shape)

        # Update the training data
        self.wgan.X_train = np.concatenate((self.wgan.X_train, processed_images), axis=0)

        # Start training with the specified number of epochs
        self.wgan.train(epochs=args['epochs'], batch_size=32, save_interval=100)
        return {"message": "Training started"}, 200

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(ProtectedResource, "/protected")  # Add a protected route
api.add_resource(UserProfile, '/user/<int:user_id>')
api.add_resource(WGANResource, '/wgan')  # Add the WGAN resource
api.add_resource(ProgressResource, '/progress')  # Add the progress resource

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True, host='0.0.0.0', port=5000)
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
from threading import Thread
from module.wgan import WGAN  # Import the WGAN class
from models.models import db, User, UserAI, WGANModel, OverfittingModel, BlockchainRecord, Image, LoginSession
from flask_socketio import SocketIO
from PIL import Image as PILImage
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

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

class WGANResource(Resource):
    wgan_instance = None  # Class variable to hold the WGAN instance
    training_thread = None

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
        WGANResource.wgan_instance = WGAN(progress_data, args['username'], args['user_custom_name'])
        processed_images = WGANResource.wgan_instance.load_and_preprocess_images(images, WGANResource.wgan_instance.img_shape)

        # Update the training data
        WGANResource.wgan_instance.X_train = np.concatenate((WGANResource.wgan_instance.X_train, processed_images), axis=0)

        # Define the training function
        def run_training():
            try:
                WGANResource.wgan_instance.train(epochs=args['epochs'], batch_size=32, save_interval=100)
            except Exception as e:
                print(f"Error during training: {e}")

        # Start training in a separate thread
        WGANResource.training_thread = Thread(target=run_training)
        WGANResource.training_thread.start()

        return {"message": "Training started"}, 200

class StopTrainingResource(Resource):
    def post(self):
        if WGANResource.wgan_instance:
            WGANResource.wgan_instance.stop_training = True
            if WGANResource.training_thread is not None:
                WGANResource.training_thread.join()  # Wait for the training thread to finish
            return {"message": "Training stopped"}, 200
        return {"message": "No training in progress"}, 400

class LatestImageResource(Resource):
    def get(self, username, user_custom_name):
        base_dir = "E:\\CPE\\1-2567\\Project\\FINALE REAL"
        image_dir = os.path.join(base_dir, f"{username}_{user_custom_name}_images")
        
        if not os.path.exists(image_dir):
            return {"message": "Image directory does not exist"}, 404

        files = os.listdir(image_dir)
        if not files:
            return {"message": "No images found"}, 404

        files.sort(key=lambda x: os.path.getmtime(os.path.join(image_dir, x)), reverse=True)
        latest_image_path = os.path.join(image_dir, files[0])

        if not os.path.exists(latest_image_path):
            return {"message": "Latest image file does not exist"}, 404

        return send_file(latest_image_path, mimetype='image/png')

api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(ProtectedResource, "/protected")
api.add_resource(WGANResource, '/wgan')
api.add_resource(ProgressResource, '/progress')
api.add_resource(LatestImageResource, '/latest_image/<string:username>/<string:user_custom_name>')
api.add_resource(StopTrainingResource, '/stop_training')
api.add_resource(UserProfile, '/user/<int:user_id>')  # Add this line

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
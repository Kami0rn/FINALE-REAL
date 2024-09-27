from flask_restful import Api, Resource, abort, reqparse, marshal_with
from PIL import Image as PILImage
from flask import Flask, jsonify, request , send_file
from module.wgan import WGAN  # Import the WGAN class
import numpy as np

progress_data = {
    'epoch': 0,
    'progress': 0,
    'd_loss': 0,
    'g_loss': 0
}

class WGANResource(Resource):
    wgan_instance = None  # Class variable to hold the WGAN instance

    def __init__(self):
        if not WGANResource.wgan_instance:
            WGANResource.wgan_instance = None

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

        # Start training with the specified number of epochs
        WGANResource.wgan_instance.train(epochs=args['epochs'], batch_size=32, save_interval=100)
        return {"message": "Training started"}, 200
    
class ProgressResource(Resource):
    def get(self):
        return jsonify(progress_data)
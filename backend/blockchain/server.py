from flask import Flask, jsonify, request
from flask_cors import CORS
import hashlib
import os
from blockchain import Blockchain  # Assuming blockchain.py exists in the same folder

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

blockchain = Blockchain()

# Existing API: Mine a Block
@app.route('/mine_block', methods=['POST'])
def mine_block():
    if 'images' not in request.files:
        return jsonify({'message': 'No images provided'}), 400

    files = request.files.getlist('images')

    if not files:
        return jsonify({'message': 'No images provided'}), 400

    # Extract additional fields
    epochs = request.form.get('epochs')
    username = request.form.get('username')
    user_custom_name = request.form.get('user_custom_name')

    # Log or process the additional fields as needed
    print(f"Epochs: {epochs}, Username: {username}, User Custom Name: {user_custom_name}")

    block = blockchain.mine_block(files, username, user_custom_name)
    response = {
        'message': 'New Block Mined',
        'block': block,
        'epochs': epochs,
        'username': username,
        'user_custom_name': user_custom_name
    }
    return jsonify(response), 200

# Existing API: Trace an Image by its Hash
@app.route('/trace_image', methods=['GET'])
def trace_image():
    image_hash = request.args.get('image_hash')
    if not image_hash:
        return jsonify({'message': 'No image hash provided'}), 400

    block = blockchain.trace_image(image_hash)
    if block:
        response = {'block': block}
    else:
        response = {'message': 'Image not found in blockchain'}
    return jsonify(response), 200

# New API: Trace Image by Path
@app.route('/trace_image_by_path', methods=['POST'])
def trace_image_by_path():
    data = request.get_json()
    image_path = data.get('image_path')

    if not image_path or not os.path.exists(image_path):
        return jsonify({'message': 'Invalid or missing image path'}), 400

    # Hash the image file content
    try:
        with open(image_path, 'rb') as img_file:
            image_hash = hashlib.sha256(img_file.read()).hexdigest()
    except Exception as e:
        return jsonify({'message': f'Error reading image file: {str(e)}'}), 500

    # Trace the image by its hash
    block = blockchain.trace_image(image_hash)
    if block:
        response = {'block': block}
    else:
        response = {'message': 'Image not found in blockchain'}
    return jsonify(response), 200

# New API: Trace Image by Upload
@app.route('/trace_image_by_upload', methods=['POST'])
def trace_image_by_upload():
    if 'image' not in request.files:
        return jsonify({'message': 'No image provided'}), 400

    file = request.files['image']

    # Hash the image file content
    try:
        image_hash = hashlib.sha256(file.read()).hexdigest()
    except Exception as e:
        return jsonify({'message': f'Error processing image file: {str(e)}'}), 500

    # Trace the image by its hash
    block = blockchain.trace_image(image_hash)
    if block:
        response = {'block': block}
    else:
        response = {'message': 'Image not found in blockchain'}
    return jsonify(response), 200

# Existing API: View the Entire Blockchain
@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.view_chain(),
        'length': len(blockchain.chain)
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
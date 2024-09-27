from flask import Flask, jsonify, request
import hashlib
import os
from blockchain import Blockchain  # Assuming blockchain.py exists in the same folder

app = Flask(__name__)
blockchain = Blockchain()

# Existing API: Mine a Block
@app.route('/mine_block', methods=['POST'])
def mine_block():
    data = request.get_json()
    image_dir = data.get('image_dir')

    if not image_dir:
        return jsonify({'message': 'No image directory provided'}), 400

    block = blockchain.mine_block(image_dir)
    response = {
        'message': 'New Block Mined',
        'block': block
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

# Existing API: View the Entire Blockchain
@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.view_chain(),
        'length': len(blockchain.chain)
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

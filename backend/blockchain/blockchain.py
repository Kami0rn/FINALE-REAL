import hashlib
import os
import json
from time import time

class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_images = []
        self.create_block(prev_block_id='0', nonce=1, next_block_id=None)

    def create_block(self, prev_block_id, nonce, next_block_id):
        block = {
            'ID': len(self.chain) + 1,
            'PREV_block_id': prev_block_id,
            'NEXT_block_id': next_block_id,
            'nonce': nonce,
            'Num_img': len(self.current_images),
            'images': self.current_images,
            'timestamp': time(),
        }
        self.current_images = []
        self.chain.append(block)
        return block

    def add_image(self, image_hash):
        self.current_images.append(image_hash)

    def hash_block(self, block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, prev_block):
        nonce = 0
        while self.valid_proof(prev_block, nonce) is False:
            nonce += 1
        return nonce

    def valid_proof(self, block, nonce):
        block_copy = block.copy()
        block_copy['nonce'] = nonce
        block_hash = self.hash_block(block_copy)
        return block_hash[:4] == '0000'  # Difficulty level: 4 leading zeros

    def mine_block(self, image_dir):
        if os.path.exists(image_dir) and os.path.isdir(image_dir):
            for filename in os.listdir(image_dir):
                file_path = os.path.join(image_dir, filename)
                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as img_file:
                        image_hash = hashlib.sha256(img_file.read()).hexdigest()
                        self.add_image(image_hash)

        last_block = self.chain[-1]
        nonce = self.proof_of_work(last_block)
        block = self.create_block(prev_block_id=self.hash_block(last_block), nonce=nonce, next_block_id=None)

        if len(self.chain) > 1:
            self.chain[-2]['NEXT_block_id'] = self.hash_block(block)

        return block

    def trace_image(self, image_hash):
        for block in self.chain:
            if image_hash in block['images']:
                return block
        return None

    def view_chain(self):
        return self.chain

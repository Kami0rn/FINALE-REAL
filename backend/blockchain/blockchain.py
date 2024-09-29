import hashlib
import json
from time import time
import os

class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_images = []
        self.load_chain()

    def create_block(self, prev_block_id, nonce, next_block_id, username, user_custom_name):
        block = {
            'ID': len(self.chain) + 1,
            'PREV_block_id': prev_block_id,
            'NEXT_block_id': next_block_id,
            'nonce': nonce,
            'Num_img': len(self.current_images),
            'images': self.current_images,
            'timestamp': time(),
            'username': username,
            'user_custom_name': user_custom_name
        }
        self.current_images = []
        self.chain.append(block)
        self.save_chain()
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

    def mine_block(self, files, username, user_custom_name):
        for file in files:
            image_hash = hashlib.sha256(file.read()).hexdigest()
            self.add_image(image_hash)

        last_block = self.chain[-1]
        nonce = self.proof_of_work(last_block)
        block = self.create_block(prev_block_id=self.hash_block(last_block), nonce=nonce, next_block_id=None, username=username, user_custom_name=user_custom_name)

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

    def save_chain(self):
        chain_data = {
            'chain': self.chain,
            'hashes': [self.hash_block(block) for block in self.chain]
        }
        with open('blockchain_data.json', 'w') as file:
            json.dump(chain_data, file)

    def load_chain(self):
        if os.path.exists('blockchain_data.json'):
            try:
                with open('blockchain_data.json', 'r') as file:
                    chain_data = json.load(file)
                    print("Loaded chain data:", chain_data)  # Debugging line
                    if 'chain' in chain_data and 'hashes' in chain_data:
                        self.chain = chain_data['chain']
                        stored_hashes = chain_data['hashes']
                        if not self.verify_chain(stored_hashes):
                            raise ValueError("Blockchain data has been tampered with!")
                    else:
                        raise ValueError("Invalid blockchain data format!")
            except json.JSONDecodeError:
                raise ValueError("Error decoding blockchain data!")
        else:
            self.create_block(prev_block_id='0', nonce=1, next_block_id=None, username='', user_custom_name='')

    def verify_chain(self, stored_hashes):
        for i, block in enumerate(self.chain):
            if self.hash_block(block) != stored_hashes[i]:
                return False
        return True
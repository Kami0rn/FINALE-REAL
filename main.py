import numpy as np
from gan_model import create_gan_model
from blockchain import Blockchain, Block
from traceability import hash_image, load_images_from_directory

# Image processing
# target_image_path = "E:/CPE/1-2567/Project/TF/10_food_classes_10_percent/train/sushi/36741.jpg"
target_image_path = "E:/CPE/1-2567/Project/TF/10_food_classes_10_percent/test/sushi/5437.jpg"
target_image_hash = hash_image(target_image_path)
print(f"Target Image Hash (before training): {target_image_hash}")

# Load training images
dataset_path = "E:/CPE/1-2567/Project/TF/10_food_classes_10_percent/train/sushi"
images = load_images_from_directory(dataset_path)

# Ensure the target image is not part of the training images
for img in images:
    img_hash = hash_image(img)
    if img_hash == target_image_hash:
        print("Warning: Target image is part of the training dataset!")
        break

# Blockchain initialization
blockchain = Blockchain()

# GAN model creation
generator, discriminator = create_gan_model()

# Example training loop with target image involvement
for i in range(75):  # Simulate 75 epochs or training steps
    noise = np.random.normal(0, 1, (1, 100))
    generated_image = generator.predict(noise)

    # Randomly select an image from the dataset
    generated_image_hash = hash_image(images[i % len(images)])  # Hashing actual images from the dataset

    blockchain.add_block(Block(i + 1, f"Trained on image with hash: {generated_image_hash}", blockchain.get_latest_block().hash))

    # Simulate discriminator loss (dummy value)
    d_loss = np.random.rand()
    g_loss = np.random.rand() * 10
    print(f"{i}/1, D Loss: {d_loss}, G Loss: {g_loss}")

# Check if the target image hash is in the blockchain
if blockchain.is_image_in_blockchain(target_image_hash):
    print("Target image hash was found in processed images.")
else:
    print("Target image hash was NOT found in processed images.")

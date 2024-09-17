import hashlib
from PIL import Image
import numpy as np
import os

def hash_image(image):
    """Hash a PIL image or numpy array."""
    if isinstance(image, str):
        # If image is a file path, open it
        with Image.open(image) as img:
            image_array = np.array(img)
    elif isinstance(image, np.ndarray):
        # If image is already a numpy array, use it directly
        image_array = image
    else:
        raise ValueError("Unsupported image type. Provide a file path or a numpy array.")

    img_bytes = image_array.tobytes()
    hash_object = hashlib.sha256(img_bytes)
    return hash_object.hexdigest()

def load_images_from_directory(directory):
    """Load all images from a directory and return them as a list of numpy arrays."""
    images = []
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        with Image.open(file_path) as img:
            images.append(np.array(img))
    return images

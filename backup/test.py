from keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt

# Load the pre-trained conditional generator model from .h5
generator = load_model('./saved_portraits_max100k_animelo/generator_model_epoch_99900.h5')

# Function to generate images based on a specific class label
def generate_images(generator, num_images=5, label=0):
    # Generate random noise
    noise = np.random.normal(0, 1, (num_images, 100))
    
    # Create an array of the same class label (e.g., label = 7)
    labels = np.full((num_images,), label)  # All labels will be the same

    # Generate images from the generator using noise and labels
    generated_images = generator.predict([noise, labels])
    
    # Rescale pixel values from [-1, 1] to [0, 1]
    generated_images = 0.5 * generated_images + 0.5

    # Display the generated images
    for i in range(num_images):
        plt.imshow(generated_images[i, :, :, 0], cmap='gray')
        plt.axis('off')
        plt.show()

# Generate and display images for a specific digit (e.g., digit 7)
generate_images(generator, num_images=10, label=1)

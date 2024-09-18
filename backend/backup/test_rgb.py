from keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt

# Load the pre-trained generator model from .h5
generator = load_model('./saved_portraits_max100k_animelo/generator_model_epoch_99900.h5')

# Function to generate images without a label (for unconditional GANs)
def generate_images(generator, num_images=5):
    # Generate random noise
    noise = np.random.normal(0, 1, (num_images, 100))  # Latent space dimension is 100
    
    # Generate images from the generator using only noise
    generated_images = generator.predict(noise)
    
    # Rescale pixel values from [-1, 1] to [0, 1]
    generated_images = 0.5 * generated_images + 0.5

    # Display the generated images
    for i in range(num_images):
        plt.imshow(generated_images[i])  # RGB images, no need for cmap='gray'
        plt.axis('off')
        plt.show()

# Generate and display RGB images
generate_images(generator, num_images=10)

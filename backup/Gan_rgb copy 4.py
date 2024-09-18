import os
from PIL import Image
import numpy as np
from keras.layers import Input, Dense, Reshape, Flatten, Dropout, UpSampling2D, Conv2D, Activation
from keras.layers import LeakyReLU
from keras.models import Sequential, Model
from keras.optimizers import RMSprop
import matplotlib.pyplot as plt
import glob
import tensorflow as tf
import tensorflow_addons as tfa  # Use TensorFlow Addons for InstanceNormalization

# Set image dimensions for RGB images
img_rows = 128
img_cols = 128
channels = 3  # For RGB
img_shape = (img_rows, img_cols, channels)
latent_dim = 100

# Optimizer for WGAN
optimizer = RMSprop(learning_rate=0.00005)

##########################################################################
# Load and preprocess images from a directory
def load_and_preprocess_images(image_dir, img_shape):
    """
    Load and preprocess images from the specified directory.
    Preprocessing includes resizing to img_shape and normalizing pixel values.
    """
    image_files = glob.glob(os.path.join(image_dir, '*.*'))  # Load all image files from the directory
    processed_images = []

    for img_file in image_files:
        # Load the image
        img = Image.open(img_file)

        # Convert to RGB if not already (some images may be grayscale)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize the image to the target shape
        img = img.resize((img_shape[0], img_shape[1]))

        # Convert image to a NumPy array
        img_array = np.array(img)

        # Normalize the pixel values to the range [-1, 1]
        img_array = (img_array.astype(np.float32) - 127.5) / 127.5

        # Append the processed image to the list
        processed_images.append(img_array)

    # Convert list of processed images to a NumPy array
    processed_images = np.array(processed_images)

    return processed_images

##########################################################################
# Build the generator with Instance Normalization and improved architecture
def build_generator():
    model = Sequential()
    
    model.add(Dense(512 * 4 * 4, input_dim=latent_dim))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Reshape((4, 4, 512)))

    model.add(UpSampling2D())  # 8x8
    model.add(Conv2D(512, kernel_size=3, padding="same"))
    model.add(tfa.layers.InstanceNormalization())
    model.add(LeakyReLU(alpha=0.2))

    model.add(UpSampling2D())  # 16x16
    model.add(Conv2D(256, kernel_size=3, padding="same"))
    model.add(tfa.layers.InstanceNormalization())
    model.add(LeakyReLU(alpha=0.2))

    model.add(UpSampling2D())  # 32x32
    model.add(Conv2D(128, kernel_size=3, padding="same"))
    model.add(tfa.layers.InstanceNormalization())
    model.add(LeakyReLU(alpha=0.2))

    model.add(UpSampling2D())  # 64x64
    model.add(Conv2D(64, kernel_size=3, padding="same"))
    model.add(tfa.layers.InstanceNormalization())
    model.add(LeakyReLU(alpha=0.2))

    model.add(UpSampling2D())  # 128x128
    model.add(Conv2D(32, kernel_size=3, padding="same"))
    model.add(tfa.layers.InstanceNormalization())
    model.add(LeakyReLU(alpha=0.2))

    # Add final layer for image output
    model.add(Conv2D(channels, kernel_size=3, padding="same"))
    model.add(Activation("tanh"))

    return model

##########################################################################
# Build the discriminator with WGAN loss
def build_discriminator():
    img = Input(shape=img_shape)

    model = Sequential()
    model.add(Conv2D(64, kernel_size=3, strides=2, input_shape=img_shape, padding="same"))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Dropout(0.25))
    
    model.add(Conv2D(128, kernel_size=3, strides=2, padding="same"))  # 64x64
    model.add(LeakyReLU(alpha=0.2))
    model.add(Dropout(0.25))
    
    model.add(Conv2D(256, kernel_size=3, strides=2, padding="same"))  # 32x32
    model.add(LeakyReLU(alpha=0.2))
    model.add(Dropout(0.25))

    model.add(Conv2D(512, kernel_size=3, strides=2, padding="same"))  # 16x16
    model.add(LeakyReLU(alpha=0.2))
    model.add(Dropout(0.25))

    model.add(Conv2D(1024, kernel_size=3, strides=2, padding="same"))  # 8x8
    model.add(LeakyReLU(alpha=0.2))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(1))  # WGAN doesn't use sigmoid activation here
    
    validity = model(img)

    return Model(img, validity)

##########################################################################
# Define WGAN loss
def wasserstein_loss(y_true, y_pred):
    return tf.reduce_mean(y_true * y_pred)

##########################################################################
# Load and preprocess images from the directory
image_dir = r'E:\CPE\1-2567\Project\Finale\rem_preprocessed_512'  # Path to your image directory
X_train = load_and_preprocess_images(image_dir, img_shape)

# Check the shape of the loaded dataset
print(f"Loaded and preprocessed {X_train.shape[0]} images with shape {X_train.shape[1:]}")

##########################################################################
# Build and compile the discriminator
discriminator = build_discriminator()
discriminator.compile(loss=wasserstein_loss, optimizer=optimizer, metrics=['accuracy'])
print("Discriminator Summary:")
discriminator.summary()


# Build the generator
generator = build_generator()
print("Generator Summary:")
generator.summary()

# The generator takes noise as input and generates an image
noise = Input(shape=(latent_dim,))
img = generator(noise)

# For the combined model, we will only train the generator
discriminator.trainable = False

# The discriminator takes generated images as input and determines validity
validity = discriminator(img)

# Combined model (stacked generator and discriminator)
combined = Model(noise, validity)
combined.compile(loss=wasserstein_loss, optimizer=optimizer)

##########################################################################
# Train the WGAN
def train(epochs, batch_size=64, save_interval=100, n_critic=1, clip_value=0.01):
    half_batch = int(batch_size / 2)
    
    # Create directories for saving models and images
    save_dir = "saved_models_rem_preprocessed_512"
    image_dir = "images_rem_preprocessed_512"
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)

    for epoch in range(epochs):

        for _ in range(n_critic):

            # Train Discriminator
            idx = np.random.randint(0, X_train.shape[0], half_batch)
            imgs = X_train[idx]

            noise = np.random.normal(0, 1, (half_batch, latent_dim))
            gen_imgs = generator.predict(noise)

            d_loss_real = discriminator.train_on_batch(imgs, -np.ones((half_batch, 1)))
            d_loss_fake = discriminator.train_on_batch(gen_imgs, np.ones((half_batch, 1)))
            d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)

            # Clip discriminator weights
            for l in discriminator.layers:
                weights = l.get_weights()
                weights = [np.clip(w, -clip_value, clip_value) for w in weights]
                l.set_weights(weights)

        # Train Generator
        noise = np.random.normal(0, 1, (batch_size, latent_dim))
        g_loss = combined.train_on_batch(noise, -np.ones((batch_size, 1)))

        # Print progress
        print(f"{epoch} [D loss: {d_loss}] [G loss: {g_loss}]")

        # Save generated images and model at intervals
        if epoch % save_interval == 0:
            save_imgs(epoch)
            generator.save(os.path.join(save_dir, f'generator_model_epoch_{epoch}.h5'))
            print(f"Model saved at epoch {epoch}")

##########################################################################
# Save generated images
def save_imgs(epoch):
    r, c = 5, 5
    noise = np.random.normal(0, 1, (r * c, latent_dim))
    gen_imgs = generator.predict(noise)

    # Rescale images from [-1, 1] to [0, 1]
    gen_imgs = 0.5 * gen_imgs + 0.5

    fig, axs = plt.subplots(r, c)
    cnt = 0
    for i in range(r):
        for j in range(c):
            axs[i, j].imshow(gen_imgs[cnt, :, :, :])
            axs[i, j].axis('off')
            cnt += 1
    fig.savefig(f"images_rem_preprocessed_512/portrait_{epoch}.png")
    plt.close()

##########################################################################
# Train the WGAN model
train(epochs=100000, batch_size=32, save_interval=100)  # Reducing epochs and batch_size for faster training

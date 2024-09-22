import os
from PIL import Image
import numpy as np
from keras.layers import Input, Dense, Reshape, Flatten, Dropout, UpSampling2D, Conv2D, Activation
from keras.layers import LeakyReLU
from keras.models import Sequential, Model
from keras.optimizers import RMSprop
import matplotlib.pyplot as plt
import tensorflow as tf
import tensorflow_addons as tfa  # Use TensorFlow Addons for InstanceNormalization
from flask_restful import Resource, reqparse
from flask import request

class WGAN(Resource):
    def __init__(self):
        # Set image dimensions for RGB images
        self.img_rows = 128
        self.img_cols = 128
        self.channels = 3  # For RGB
        self.img_shape = (self.img_rows, self.img_cols, self.channels)
        self.latent_dim = 100

        # Optimizer for WGAN
        self.optimizer = RMSprop(learning_rate=0.00005)

        # Initialize empty training data
        self.X_train = np.empty((0, *self.img_shape))

        # Build and compile the discriminator
        self.discriminator = self.build_discriminator()
        self.discriminator.compile(loss=self.wasserstein_loss, optimizer=self.optimizer, metrics=['accuracy'])

        # Build the generator
        self.generator = self.build_generator()

        # The generator takes noise as input and generates an image
        noise = Input(shape=(self.latent_dim,))
        img = self.generator(noise)

        # For the combined model, we will only train the generator
        self.discriminator.trainable = False

        # The discriminator takes generated images as input and determines validity
        validity = self.discriminator(img)

        # Combined model (stacked generator and discriminator)
        self.combined = Model(noise, validity)
        self.combined.compile(loss=self.wasserstein_loss, optimizer=self.optimizer)

    def load_and_preprocess_images(self, images, img_shape):
        processed_images = []

        for img in images:
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

    def build_generator(self):
        model = Sequential()
        
        model.add(Dense(512 * 4 * 4, input_dim=self.latent_dim))
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
        model.add(Conv2D(self.channels, kernel_size=3, padding="same"))
        model.add(Activation("tanh"))

        return model

    def build_discriminator(self):
        img = Input(shape=self.img_shape)

        model = Sequential()
        model.add(Conv2D(64, kernel_size=3, strides=2, input_shape=self.img_shape, padding="same"))
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

    def wasserstein_loss(self, y_true, y_pred):
        return tf.reduce_mean(y_true * y_pred)

    def train(self, epochs, batch_size=64, save_interval=100, n_critic=1, clip_value=0.01):
        half_batch = int(batch_size / 2)
        
        # Create directories for saving models and images
        save_dir = "saved_models_20"
        image_dir = "images_rem_20"
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        for epoch in range(epochs):

            for _ in range(n_critic):

                # Train Discriminator
                idx = np.random.randint(0, self.X_train.shape[0], half_batch)
                imgs = self.X_train[idx]

                noise = np.random.normal(0, 1, (half_batch, self.latent_dim))
                gen_imgs = self.generator.predict(noise)

                d_loss_real = self.discriminator.train_on_batch(imgs, -np.ones((half_batch, 1)))
                d_loss_fake = self.discriminator.train_on_batch(gen_imgs, np.ones((half_batch, 1)))
                d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)

                # Clip discriminator weights
                for l in self.discriminator.layers:
                    weights = l.get_weights()
                    weights = [np.clip(w, -clip_value, clip_value) for w in weights]
                    l.set_weights(weights)

            # Train Generator
            noise = np.random.normal(0, 1, (batch_size, self.latent_dim))
            g_loss = self.combined.train_on_batch(noise, -np.ones((batch_size, 1)))

            # Print progress
            print(f"{epoch} [D loss: {d_loss}] [G loss: {g_loss}]")

            # Save generated images and model at intervals
            if epoch % save_interval == 0:
                self.save_imgs(epoch)
                self.generator.save(os.path.join(save_dir, f'generator_model_epoch_{epoch}.h5'))
                print(f"Model saved at epoch {epoch}")

    def save_imgs(self, epoch):
        r, c = 5, 5
        noise = np.random.normal(0, 1, (r * c, self.latent_dim))
        gen_imgs = self.generator.predict(noise)

        # Rescale images from [-1, 1] to [0, 1]
        gen_imgs = 0.5 * gen_imgs + 0.5

        fig, axs = plt.subplots(r, c)
        cnt = 0
        for i in range(r):
            for j in range(c):
                axs[i, j].imshow(gen_imgs[cnt, :, :, :])
                axs[i, j].axis('off')
                cnt += 1
        fig.savefig(f"images_rem_20/portrait_{epoch}.png")
        plt.close()
        
    def post(self ):
        # Parse the uploaded files
        parser = reqparse.RequestParser()
        parser.add_argument('images', type=str, location='files', action='append')
        args = parser.parse_args()

        # Load and preprocess the uploaded images
        uploaded_files = request.files.getlist("images")
        images = [Image.open(file) for file in uploaded_files]
        processed_images = self.load_and_preprocess_images(images, self.img_shape)

        # Update the training data
        self.X_train = np.concatenate((self.X_train, processed_images), axis=0)

        # Start training
        self.train(epochs=100000, batch_size=32, save_interval=100)  # Reducing epochs and batch_size for faster training
        return {"message": "Training started"}, 200

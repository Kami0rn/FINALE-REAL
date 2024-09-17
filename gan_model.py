import tensorflow as tf
from tensorflow.keras import layers

def create_gan_model():
    generator = tf.keras.Sequential([
        layers.Dense(128, activation='relu', input_dim=100),
        layers.Dense(28 * 28 * 3, activation='sigmoid'),
        layers.Reshape((28, 28, 3))
    ])

    discriminator = tf.keras.Sequential([
        layers.Flatten(input_shape=(28, 28, 3)),
        layers.Dense(128, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])

    discriminator.compile(optimizer='adam', loss='binary_crossentropy')
    return generator, discriminator

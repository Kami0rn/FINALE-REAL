from flask import Flask
from flask_restful import Api,Resource,abort,reqparse,marshal_with,fields
from flask_sqlalchemy import SQLAlchemy,Model
import numpy as np
from blockchain import Blockchain, Block
from traceability import hash_image, load_images_from_directory

app=Flask(__name__)




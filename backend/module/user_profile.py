# user_profile.py
from flask import jsonify
from flask_restful import Resource
from module.models import RegisterModel
from json_webtoken import token_required

class UserProfile(Resource):
    @token_required
    def get(self, current_user, user_id):
        user = RegisterModel.query.filter_by(id=user_id).first()
        if not user:
            return {'message': 'User not found'}, 404

        user_data = {
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname
        }
        return jsonify(user_data)
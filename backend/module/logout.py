from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource, abort
from models.models import db, LoginSession
from json_webtoken import token_required
from datetime import datetime
import pytz

class Logout(Resource):

    @token_required
    def post(self, current_user):
        try:
            token = request.headers.get('Authorization')

            if not token:
                abort(400, message="Authorization token is missing")

            # Extract the part from 'Bearer <token>'
            token = token.split(" ")[1]

            # Find the session by token
            session = LoginSession.query.filter_by(session_token=token).first()

            if not session:
                abort(401, message="Invalid session token")

            # Set the logout time using timezone-aware datetime for GMT+7
            ict = pytz.timezone('Asia/Bangkok')
            session.logout_time = datetime.now(ict)
            db.session.commit()

            response = make_response(jsonify({"message": "Logout successful"}), 200)
            return response
        except Exception as e:
            print(f"Error during logout: {e}")
            abort(500, message="Internal server error")

# Assuming you have an instance of Flask and Api
app = Flask(__name__)
api = Api(app)

# Add the Logout resource to your API
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(debug=True)
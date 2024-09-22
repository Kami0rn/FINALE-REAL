from flask_restful import fields

register_body = {
    'username': fields.String,
    'password': fields.String,
    'email': fields.String,
    'firstname': fields.String,
    'lastname': fields.String
}

login_body = {
    'message': fields.String,
    'token': fields.String,
    'user_id': fields.Integer,
    'username': fields.String,
}
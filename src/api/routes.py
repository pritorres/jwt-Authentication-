"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
api = Blueprint('api', __name__)



@api.route('/hello', methods=['POST', 'GET'])
@jwt_required()
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def handle_login():
    credentials = request.get_json()
    error = ""
    print(credentials)

    if credentials['user'] == '':
        error = "user is empty"
    
    if credentials['password'] == '':
        error = "password is empty"

    print(error)

    if error :
        return jsonify({ "success": False, "message": "Errors", errors: error }), 200

    user = User.query.filter_by(email=credentials['user'], password=credentials['password']).first()

    if user is None:
        # the user was not found on the database
        return jsonify({"success": False, "msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.id)
        
    return jsonify({ "success": True, "credentials": {"userId": user.id, "token": access_token }}), 200
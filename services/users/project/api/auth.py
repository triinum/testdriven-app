""" services/users/project/api/auth.py """

from flask import Blueprint, jsonify, request
from sqlalchemy import exc, or_

from project.api.models import User
from project import db, bcrypt

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/auth/register', methods=['POST'])
def register_user():
    post_data = request.get_json()
    response = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response), 400

    username = post_data.get('username')
    email = post_data.get('email')
    password = post_data.get('password')

    try:
        user = User.query.filter(
            or_(User.username == username, User.email == email)).first()
        if not user:
            # add user to the db
            new_user = User(
                username=username,
                email=email,
                password=password
            )
            db.session.add(new_user)
            db.session.commit()

            auth_token = new_user.encode_auth_token(new_user.id)
            response['status'] = 'success'
            response['message'] = 'Successfully registered.'
            response['auth_token'] = auth_token.decode()
            return jsonify(response), 201
        else:
            response['message'] = 'Sorry. That user already exists.'
            return jsonify(response), 400
    except (exc.IntegrityError, ValueError) as e:
        db.session.rollback()
        return jsonify(response), 400

@auth_blueprint.route('/auth/login', methods=['POST'])
def login_user():
    # get post data
    post_data = request.get_json()
    response = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response), 400
    email = post_data.get('email')
    password = post_data.get('password')
    try:
        # fetch the user data
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            auth_token = user.encode_auth_token(user.id)
            if auth_token:
                response['status'] = 'success'
                response['message'] = 'Successfully logged in.'
                response['auth_token'] = auth_token.decode()
                return jsonify(response), 200
        else:
            response['message'] = 'User does not exist.'
            return jsonify(response), 401
    except Exception as e:
        print(e)
        response['message'] = 'Try again.'
        return jsonify(response), 500

@auth_blueprint.route('/auth/logout', methods=['POST'])
def logout_user():
    # get auth token
    auth_header = request.headers.get('Authorization')
    response = {
        'status': 'fail',
        'message': 'Please provide a valid auth token.'
    }
    if auth_header:
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            response['status'] = 'success'
            response['message'] = 'Successfully logged out.'
            return jsonify(response), 200
        else:
            response['message'] = resp
            return jsonify(response), 401
    else:
        return jsonify(response), 403

@auth_blueprint.route('/auth/status', methods=['GET'])
def get_user_status():
    auth_header = request.headers.get('Authorization')
    response = {
        'status': 'fail',
        'message': 'Please provide a valid auth token.'
    }
    if auth_header:
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            user = User.query.filter_by(id=resp).first()
            response['status'] = 'success'
            response['message'] = 'Success.'
            response['data'] = user.to_json()
            return jsonify(response), 200
        response['message'] = resp
        return jsonify(response), 401
    else:
        return jsonify(response), 401

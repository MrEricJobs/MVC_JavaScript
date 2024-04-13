from flask import Blueprint, send_file, request, jsonify
from app.service.user_service import UserService

user_bp = Blueprint('UserController', __name__)
user_service = UserService()

@user_bp.route('/sign-up', methods=['POST'])
def sign_up():
    param = request.get_json()
    if param['id'] == '' or param['pw'] == '':
        return jsonify({'state': 'fail'})

    user_service.registration(param['id'], param['pw'])

    return jsonify({'state': 'success'})

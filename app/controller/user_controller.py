"""
회원 관련 요청 컨트롤러
"""
from flask import Blueprint, send_file, request, jsonify
from app.service.user_service import UserService

user_bp = Blueprint('UserControler', __name__)
user_service = UserService()


@user_bp.route('/sign-up', methods=['POST'])
def sign_up():
    param = request.get_json()  # 요청 Body

    has_id = False
    has_pw = False
    for key in param.keys():
        if key == 'id':
            has_id = True
        if key == 'pw':
            has_pw = True
    if not has_id or not has_pw:
        return jsonify({'state': 'fail'})

    user_service.registration(param['id'], param['pw'])

    return jsonify({'state': 'success'})


@user_bp.route('/sign-in', methods=['POST'])
def sign_in():
    param = request.get_json()  # 요청 Body

    has_id = False
    has_pw = False
    for key in param.keys():
        if key == 'id':
            has_id = True
        if key == 'pw':
            has_pw = True
    if not has_id or not has_pw:
        return jsonify({'state': 'fail'})

    result = user_service.login(param['id'], param['pw'])

    return jsonify(result)

@user_bp.route('/session-check', methods=['GET'])
def session_check():
    return jsonify(user_service.session_check())

@user_bp.route('/sign-out', methods=['DELETE'])
def sign_out():
    user_service.logout()
    return jsonify({'state': 'success'})



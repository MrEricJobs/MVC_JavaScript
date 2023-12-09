from flask import Blueprint, jsonify
from app.service.github_service import GithubService

github_bp = Blueprint('GithubController', __name__)
github_service = GithubService()

@github_bp.route('/user')
def user():
    user_info = github_service.get_user_info()
    return jsonify(user_info)

@github_bp.route('/repo')
def repo():
    repo_list = github_service.get_repo_list()
    return jsonify(repo_list)

@github_bp.route('/gist')
def gist():
    gist_list = github_service.get_gist_list()
    return jsonify(gist_list)

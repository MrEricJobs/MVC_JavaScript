"""
페이지 이동관련 요청 컨트롤러
"""
from flask import Blueprint, send_file

page_bp = Blueprint('PageController', __name__)

@page_bp.route('/')
def main():
    """
    메인 페이지
    :return: view/index.html
    """
    return send_file("view/index.html")

@page_bp.route('/dashboard')
def dashboard():
    """
    dashboard pagd
    :return: view/dashboard.html
    """
    return send_file('view/dashboard.html')

@page_bp.route('/practice')
def practice():

    return send_file('view/practice.html')
from flask import Blueprint, jsonify, request
from app.service.board_service import BoardService

board_service = BoardService()
board_bp = Blueprint("BoardController", __name__)

@board_bp.route('/category')
def category_list():
    categories = board_service.get_categories()
    return jsonify(categories)
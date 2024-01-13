from app.model.board_access import BoardAccess

class BoardService:
    def __init__(self):
        self.board_access = BoardAccess()

    def get_categories(self):
        return self.board_access.find_all_category()

    def add_post(self, category_id, title, content):
        self.board_access.create_post(category_id, title, content)

    def get_posts(self, category_id):
        return self.board_access.find_all_post(category_id)
